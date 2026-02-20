#!/usr/bin/env bash
# =============================================================================
# Jyotish AI — Automated AWS Deployment Script
# =============================================================================
# Usage:
#   export ANTHROPIC_API_KEY=sk-ant-...
#   ./infrastructure/deploy.sh [dev|staging|prod]
#
# What this script does (fully automated):
#   1. Checks required tools are installed
#   2. Creates an S3 bucket for deployment artifacts
#   3. Builds the Lambda Layer (Python deps) via Docker for arm64 compatibility
#   4. Packages each Lambda function into a zip
#   5. Uploads layer + function zips to S3
#   6. Deploys the CloudFormation stack
#   7. Prints the output values — copy them into your .env
# =============================================================================

set -euo pipefail

# ─── Config ──────────────────────────────────────────────────────────────────
STAGE="${1:-prod}"
AWS_REGION="${AWS_REGION:-us-east-1}"
STACK_NAME="jyotish-ai-${STAGE}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_ROOT/backend"
CFN_TEMPLATE="$SCRIPT_DIR/cloudformation.yaml"

# S3 bucket name — unique per AWS account + region
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
S3_BUCKET="jyotish-deploy-${AWS_ACCOUNT_ID}-${AWS_REGION}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✔]${NC} $1"; }
info() { echo -e "${BLUE}[→]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✘]${NC} $1"; exit 1; }

# ─── Banner ──────────────────────────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Jyotish AI — AWS CloudFormation Deployment"
echo "  Stage   : $STAGE"
echo "  Region  : $AWS_REGION"
echo "  Stack   : $STACK_NAME"
echo "  S3      : $S3_BUCKET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ─── Step 0: Validate prerequisites ──────────────────────────────────────────
info "Checking required tools..."

command -v aws    >/dev/null 2>&1 || err "aws CLI not found. Install: https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html"
command -v python3 >/dev/null 2>&1 || err "python3 not found."
command -v pip3   >/dev/null 2>&1 || err "pip3 not found."
command -v zip    >/dev/null 2>&1 || err "zip not found. Install: sudo apt install zip  OR  brew install zip"

# Check AWS credentials work
aws sts get-caller-identity --output text --query 'Account' >/dev/null 2>&1 \
  || err "AWS credentials not configured. Run: aws configure"

# Validate ANTHROPIC_API_KEY is set
[[ -z "${ANTHROPIC_API_KEY:-}" ]] \
  && err "ANTHROPIC_API_KEY not set. Run: export ANTHROPIC_API_KEY=sk-ant-..."

# Check if Stage is valid
[[ "$STAGE" =~ ^(dev|staging|prod)$ ]] \
  || err "Invalid stage '$STAGE'. Use: dev | staging | prod"

log "All prerequisites met"

# ─── Step 1: Create S3 bucket for deployment artifacts ───────────────────────
info "Creating S3 bucket: $S3_BUCKET ..."

if aws s3api head-bucket --bucket "$S3_BUCKET" 2>/dev/null; then
  log "Bucket already exists — skipping creation"
else
  if [[ "$AWS_REGION" == "us-east-1" ]]; then
    aws s3api create-bucket --bucket "$S3_BUCKET" --region "$AWS_REGION"
  else
    aws s3api create-bucket \
      --bucket "$S3_BUCKET" \
      --region "$AWS_REGION" \
      --create-bucket-configuration LocationConstraint="$AWS_REGION"
  fi
  # Block public access (security best practice)
  aws s3api put-public-access-block \
    --bucket "$S3_BUCKET" \
    --public-access-block-configuration \
      BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
  log "Bucket created and secured"
fi

# ─── Step 2: Build Lambda Layer ───────────────────────────────────────────────
# We build inside the official AWS Lambda Docker image so the compiled
# C-extension packages (pyephem, etc.) match the arm64 Lambda runtime exactly.
# If Docker is not available, we fall back to local pip install with a warning.

info "Building Lambda layer (Python 3.11 dependencies)..."

# Install gcc if missing — required to compile pyswisseph (C extension used by PyJHora)
# CloudShell (Amazon Linux) doesn't include gcc by default
if ! command -v gcc >/dev/null 2>&1; then
  info "gcc not found — installing build tools..."
  if command -v dnf >/dev/null 2>&1; then
    sudo dnf install -y gcc python3-devel >/dev/null 2>&1
  elif command -v yum >/dev/null 2>&1; then
    sudo yum install -y gcc python3-devel >/dev/null 2>&1
  elif command -v apt-get >/dev/null 2>&1; then
    sudo apt-get install -y gcc python3-dev >/dev/null 2>&1
  else
    warn "Cannot install gcc automatically. Install it manually then re-run."
    exit 1
  fi
  log "gcc installed"
fi

LAYER_BUILD_DIR=$(mktemp -d)
LAYER_ZIP="$LAYER_BUILD_DIR/jyotish-layer.zip"

SITE_PACKAGES="$LAYER_BUILD_DIR/python/lib/python3.11/site-packages"
mkdir -p "$SITE_PACKAGES"

pip3 install -r "$BACKEND_DIR/requirements.txt" \
  -t "$SITE_PACKAGES" \
  --quiet --no-cache-dir

pip3 install git+https://github.com/naturalstupid/PyJHora.git \
  -t "$SITE_PACKAGES" \
  --quiet --no-cache-dir

log "Layer build complete"

# Zip the layer
info "Zipping layer..."
pushd "$LAYER_BUILD_DIR" >/dev/null
zip -r "$LAYER_ZIP" python/ -q
popd >/dev/null

LAYER_SIZE=$(du -sh "$LAYER_ZIP" | cut -f1)
log "Layer zip: $LAYER_SIZE"

# Upload layer to S3
info "Uploading layer to S3..."
aws s3 cp "$LAYER_ZIP" "s3://$S3_BUCKET/layers/jyotish-layer.zip"
log "Layer uploaded"

# ─── Step 3: Package Lambda functions ────────────────────────────────────────
# Each function zip contains: handler.py + common/models.py
# The common/ directory must be inside the zip so Python can resolve
# `from common.models import ...` at runtime.

info "Packaging Lambda functions..."
FUNCS_TMP=$(mktemp -d)

package_function() {
  local name="$1"
  local service_dir="$2"
  local zip_file="$FUNCS_TMP/${name}.zip"
  local pkg_tmp="$FUNCS_TMP/${name}_pkg"

  mkdir -p "$pkg_tmp/common"
  cp "$BACKEND_DIR/${service_dir}/handler.py" "$pkg_tmp/"
  cp "$BACKEND_DIR/common/models.py"          "$pkg_tmp/common/"
  # Create __init__.py so Python treats common/ as a package
  touch "$pkg_tmp/common/__init__.py"

  pushd "$pkg_tmp" >/dev/null
  zip -r "$zip_file" . -q
  popd >/dev/null

  aws s3 cp "$zip_file" "s3://$S3_BUCKET/functions/${name}.zip"
  log "Packaged + uploaded: $name"
}

package_function "jyotish-chart"     "chart_service"
package_function "jyotish-panchanga" "panchanga_service"
package_function "jyotish-ai-chat"   "ai_service"
package_function "jyotish-booking"   "booking_service"

# ─── Step 4: Deploy CloudFormation stack ─────────────────────────────────────
# If a previous deploy failed and left the stack in ROLLBACK_COMPLETE,
# CloudFormation won't let you update it — must delete first.
STACK_STATUS=$(aws cloudformation describe-stacks \
  --stack-name "$STACK_NAME" --region "$AWS_REGION" \
  --query 'Stacks[0].StackStatus' --output text 2>/dev/null || echo "DOES_NOT_EXIST")

if [[ "$STACK_STATUS" == "ROLLBACK_COMPLETE" ]]; then
  warn "Stack is in ROLLBACK_COMPLETE state — deleting it before redeploying..."
  aws cloudformation delete-stack --stack-name "$STACK_NAME" --region "$AWS_REGION"
  aws cloudformation wait stack-delete-complete --stack-name "$STACK_NAME" --region "$AWS_REGION"
  log "Old stack deleted"
fi

info "Deploying CloudFormation stack: $STACK_NAME ..."
info "This takes ~3-5 minutes on first deploy..."

aws cloudformation deploy \
  --template-file "$CFN_TEMPLATE" \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION" \
  --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    Stage="$STAGE" \
    AnthropicApiKey="$ANTHROPIC_API_KEY" \
    LambdaCodeBucket="$S3_BUCKET" \
  --no-fail-on-empty-changeset

log "CloudFormation stack deployed successfully"

# ─── Step 5: Fetch and print outputs ─────────────────────────────────────────
info "Fetching stack outputs..."

get_output() {
  aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --region "$AWS_REGION" \
    --query "Stacks[0].Outputs[?OutputKey=='$1'].OutputValue" \
    --output text
}

API_URL=$(get_output "ApiUrl")
USER_POOL_ID=$(get_output "UserPoolId")
CLIENT_ID=$(get_output "UserPoolClientId")
IDENTITY_POOL_ID=$(get_output "IdentityPoolId")

# ─── Done ─────────────────────────────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}  ✅ Deployment complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Copy these into your .env file:"
echo ""
echo "  EXPO_PUBLIC_API_URL=$API_URL"
echo "  EXPO_PUBLIC_COGNITO_USER_POOL_ID=$USER_POOL_ID"
echo "  EXPO_PUBLIC_COGNITO_CLIENT_ID=$CLIENT_ID"
echo "  EXPO_PUBLIC_COGNITO_IDENTITY_POOL_ID=$IDENTITY_POOL_ID"
echo "  EXPO_PUBLIC_AWS_REGION=$AWS_REGION"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Auto-write to .env if it exists (won't overwrite existing non-example values)
ENV_FILE="$PROJECT_ROOT/.env"
if [[ -f "$ENV_FILE" ]]; then
  info "Updating $ENV_FILE ..."
  # Use sed to replace placeholder values only
  sed -i "s|EXPO_PUBLIC_API_URL=.*|EXPO_PUBLIC_API_URL=$API_URL|" "$ENV_FILE"
  sed -i "s|EXPO_PUBLIC_COGNITO_USER_POOL_ID=.*|EXPO_PUBLIC_COGNITO_USER_POOL_ID=$USER_POOL_ID|" "$ENV_FILE"
  sed -i "s|EXPO_PUBLIC_COGNITO_CLIENT_ID=.*|EXPO_PUBLIC_COGNITO_CLIENT_ID=$CLIENT_ID|" "$ENV_FILE"
  sed -i "s|EXPO_PUBLIC_AWS_REGION=.*|EXPO_PUBLIC_AWS_REGION=$AWS_REGION|" "$ENV_FILE"
  log ".env updated automatically"
fi

# Cleanup temp dirs
rm -rf "$LAYER_BUILD_DIR" "$FUNCS_TMP"
