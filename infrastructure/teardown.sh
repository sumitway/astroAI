#!/usr/bin/env bash
# =============================================================================
# Jyotish AI — Teardown Script
# Deletes the CloudFormation stack and the S3 deployment bucket.
# WARNING: This is irreversible. DynamoDB data will be LOST.
# =============================================================================
# Usage:
#   ./infrastructure/teardown.sh [dev|staging|prod]
# =============================================================================

set -euo pipefail

STAGE="${1:-prod}"
AWS_REGION="${AWS_REGION:-us-east-1}"
STACK_NAME="jyotish-ai-${STAGE}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log()  { echo -e "${GREEN}[✔]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
err()  { echo -e "${RED}[✘]${NC} $1"; exit 1; }

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
S3_BUCKET="jyotish-deploy-${AWS_ACCOUNT_ID}-${AWS_REGION}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${RED}  ⚠️  TEARDOWN — This will DELETE all resources${NC}"
echo "  Stack  : $STACK_NAME"
echo "  Region : $AWS_REGION"
echo "  S3     : $S3_BUCKET"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -r -p "Are you sure? Type 'yes' to confirm: " CONFIRM
[[ "$CONFIRM" == "yes" ]] || { warn "Aborted."; exit 0; }

# Delete CloudFormation stack (removes Lambda, API GW, Cognito, DynamoDB, IAM roles)
warn "Deleting CloudFormation stack: $STACK_NAME ..."
aws cloudformation delete-stack \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION"

warn "Waiting for stack deletion to complete (may take 3-5 min)..."
aws cloudformation wait stack-delete-complete \
  --stack-name "$STACK_NAME" \
  --region "$AWS_REGION"
log "Stack deleted"

# Empty and delete the S3 deployment bucket
if aws s3api head-bucket --bucket "$S3_BUCKET" 2>/dev/null; then
  warn "Emptying S3 bucket: $S3_BUCKET ..."
  aws s3 rm "s3://$S3_BUCKET" --recursive
  aws s3api delete-bucket --bucket "$S3_BUCKET" --region "$AWS_REGION"
  log "S3 bucket deleted"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log "All resources deleted for stage: $STAGE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
