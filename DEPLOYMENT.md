# Jyotish AI — AWS Deployment Guide

Everything is automated via a single shell script.
No AWS Console clicks required.

---

## Architecture

```
Mobile App (Expo)           Web App (AWS Amplify)
       │                           │
       └──────────┬────────────────┘
                  │ HTTPS
           API Gateway (HTTP API)
                  │
      ┌───────────┼────────────────┬──────────────┐
      │           │                │              │
  Lambda       Lambda           Lambda         Lambda
  (Charts)   (Panchanga)       (AI Chat)     (Booking)
  1024 MB      512 MB           1024 MB        512 MB
  60 s timeout  30 s             60 s           30 s
      │                           │              │
  PyJHora                   Anthropic API    DynamoDB
  (Swiss Ephemeris)         Claude claude-opus-4-6     (3 tables)
      │
  Lambda Layer  ← shared Python deps (PyJHora, FastAPI, Anthropic, etc.)

  Cognito User Pool  ← login/signup, JWT tokens for API auth
```

---

## What Gets Created (13 Resources)

| Resource | Name | Why |
|----------|------|-----|
| S3 Bucket | `jyotish-deploy-<account>-<region>` | Holds layer + function zips before CloudFormation runs |
| Lambda Layer | `jyotish-dependencies-prod` | Python deps packaged once, shared across all 4 functions |
| Lambda | `jyotish-chart-prod` | Birth chart + divisional + Dasha via PyJHora |
| Lambda | `jyotish-panchanga-prod` | Tithi, Nakshatra, Rahu Kaal, Muhurta |
| Lambda | `jyotish-ai-chat-prod` | Claude AI chat with chart context |
| Lambda | `jyotish-booking-prod` | Astrologer CRUD + appointment booking |
| API Gateway | `jyotish-api-prod` | Single HTTPS entry point routing to the 4 Lambdas |
| DynamoDB | `jyotish-astrologers-prod` | Astrologer profiles |
| DynamoDB | `jyotish-bookings-prod` | Appointment records |
| DynamoDB | `jyotish-slots-prod` | Availability slots |
| Cognito User Pool | `jyotish-users-prod` | User accounts + JWT token issuer |
| Cognito App Client | `jyotish-app-prod` | Mobile app credential (no secret) |
| IAM Roles | `jyotish-lambda-role-prod` etc. | Least-privilege execution roles |

---

## Prerequisites

Install these once on your machine:

### 1. AWS CLI v2

```bash
# macOS
brew install awscli

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o awscliv2.zip
unzip awscliv2.zip && sudo ./aws/install
```

### 2. Configure AWS credentials

```bash
aws configure
# Enter:
#   AWS Access Key ID     → from IAM → Users → your user → Security credentials
#   AWS Secret Access Key → same place
#   Default region        → us-east-1  (or your preferred region)
#   Default output format → json
```

> Your IAM user needs these permissions:
> `AmazonS3FullAccess`, `AWSLambda_FullAccess`, `AmazonAPIGatewayAdministrator`,
> `AmazonCognitoPowerUser`, `AmazonDynamoDBFullAccess`, `IAMFullAccess`,
> `AWSCloudFormationFullAccess`
>
> Or attach `AdministratorAccess` for a dev/test account.

### 3. Docker (recommended for layer build)

```bash
# macOS
brew install --cask docker   # then open Docker Desktop

# Linux
sudo apt-get install docker.io
sudo usermod -aG docker $USER   # re-login after this
```

> Docker builds the Python layer inside the official Lambda arm64 container —
> ensures C-extension packages (like pyephem) compile for the right architecture.
> If Docker is absent, the script falls back to local pip (works for pure-Python only).

### 4. Python 3 + pip

```bash
python3 --version   # needs 3.8+
pip3 --version
```

### 5. zip utility

```bash
# Linux
sudo apt install zip

# macOS — already installed
```

---

## Deploy

### Step 1 — Set your Anthropic API key

```bash
export ANTHROPIC_API_KEY=sk-ant-api03-...
```

Get your key from [console.anthropic.com](https://console.anthropic.com).

### Step 2 — Run the deploy script

```bash
# From the project root:
./infrastructure/deploy.sh prod
```

Replace `prod` with `dev` or `staging` for other environments.

That's it. The script will:

```
[→] Checking required tools...
[✔] All prerequisites met
[→] Creating S3 bucket: jyotish-deploy-123456789012-us-east-1 ...
[✔] Bucket created and secured
[→] Building Lambda layer (Python 3.11 dependencies)...
[→] Docker found — building layer inside Lambda container (arm64-compatible)...
[✔] Docker build complete
[→] Zipping layer...
[✔] Layer zip: 45M
[→] Uploading layer to S3...
[✔] Layer uploaded
[→] Packaging Lambda functions...
[✔] Packaged + uploaded: jyotish-chart
[✔] Packaged + uploaded: jyotish-panchanga
[✔] Packaged + uploaded: jyotish-ai-chat
[✔] Packaged + uploaded: jyotish-booking
[→] Deploying CloudFormation stack: jyotish-ai-prod ...
[→] This takes ~3-5 minutes on first deploy...
[✔] CloudFormation stack deployed successfully

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ Deployment complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  EXPO_PUBLIC_API_URL=https://abc123.execute-api.us-east-1.amazonaws.com/prod
  EXPO_PUBLIC_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
  EXPO_PUBLIC_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
  EXPO_PUBLIC_COGNITO_IDENTITY_POOL_ID=us-east-1:xxxxxxxx-...
  EXPO_PUBLIC_AWS_REGION=us-east-1
```

> The script also auto-updates `.env` if the file already exists.

### Step 3 — Start the app locally

```bash
cp .env.example .env   # only needed first time
# values are auto-filled by deploy.sh if .env already exists
npm install
npm start
```

---

## Re-deploy (after code changes)

Re-running the script uploads fresh function zips and updates the stack via
change-set — only changed resources are touched, safe for production:

```bash
./infrastructure/deploy.sh prod
```

A code-only update (no infra changes) completes in under 60 seconds.

---

## Deploy to a different environment

```bash
./infrastructure/deploy.sh dev      # isolated -dev resources
./infrastructure/deploy.sh staging  # isolated -staging resources
```

Each stage gets its own completely separate stack — nothing shared.

---

## Teardown (delete everything)

```bash
./infrastructure/teardown.sh prod
```

Prompts for confirmation, then deletes the CloudFormation stack (all Lambda,
API Gateway, Cognito, DynamoDB, IAM) and empties/deletes the S3 bucket.

> **Warning:** DynamoDB data is permanently deleted. Export it first if needed.

---

## Infrastructure Files

```
infrastructure/
├── cloudformation.yaml   ← All AWS resource definitions (pure CloudFormation, no SAM)
├── deploy.sh             ← Automated build + upload + deploy script
└── teardown.sh           ← Delete all resources for a stage
```

The `backend/template.yaml` is the original SAM version (kept for reference).
The `infrastructure/` files are the recommended approach — no SAM CLI needed.

---

## AWS Amplify (Web Hosting + CI/CD)

For the web version, AWS Amplify auto-deploys from GitHub on every push.

1. Go to **AWS Amplify → Create new app → Host web app**
2. Connect your GitHub repository, select `main` branch
3. Amplify detects `amplify.yml` automatically
4. Set these environment variables in Amplify Console → App settings → Environment variables:

| Key | Value |
|-----|-------|
| `EXPO_PUBLIC_API_URL` | From deploy.sh output |
| `EXPO_PUBLIC_COGNITO_USER_POOL_ID` | From deploy.sh output |
| `EXPO_PUBLIC_COGNITO_CLIENT_ID` | From deploy.sh output |
| `EXPO_PUBLIC_AWS_REGION` | `us-east-1` |
| `ANTHROPIC_API_KEY` | Your Anthropic key |

5. Click **Save and deploy** — every `git push` to `main` triggers a full rebuild.

---

## API Routes Summary

| Method | Path | Auth | Lambda |
|--------|------|------|--------|
| POST | `/chart/calculate` | Public | Chart |
| POST | `/chart/divisional/{division}` | Login required | Chart |
| POST | `/dasha/calculate` | Login required | Chart |
| GET  | `/panchanga` | Public | Panchanga |
| POST | `/ai/chat` | Login required | AI Chat |
| GET  | `/astrologers` | Public | Booking |
| GET  | `/astrologers/{id}` | Public | Booking |
| GET  | `/astrologers/{id}/slots` | Login required | Booking |
| POST | `/bookings` | Login required | Booking |
| GET  | `/bookings/my` | Login required | Booking |
| DELETE | `/bookings/{id}` | Login required | Booking |

---

## Cost Estimate (~1,000 active users/month)

| Service | Free Tier | Expected Cost |
|---------|-----------|---------------|
| Lambda (4 functions) | 1M requests/mo | ~$0 |
| API Gateway HTTP API | 1M calls/mo | ~$0 |
| DynamoDB (3 tables) | 25 GB + 25 WCU free | ~$0 |
| Cognito | 50,000 MAU free | ~$0 |
| S3 (deploy bucket) | 5 GB free | ~$0 |
| Amplify Hosting | 1000 build mins free | ~$0–$2 |
| Anthropic Claude API | Pay per token | ~$5–$20 |
| **Total** | | **~$5–$22/mo** |

---

## Troubleshooting

**`docker: permission denied`**
```bash
sudo usermod -aG docker $USER
# Log out and back in, then retry
```

**`ANTHROPIC_API_KEY not set`**
```bash
export ANTHROPIC_API_KEY=sk-ant-...
./infrastructure/deploy.sh prod
```

**Lambda `Module not found` error**
- Verify the layer is attached: AWS Console → Lambda → function → Layers tab
- Layer zip must have `python/lib/python3.11/site-packages/` at root level

**API returns 401 Unauthorized**
- Route requires login — pass `Authorization: Bearer <cognito-jwt>` header
- Use a "Public" route for quick testing without auth

**CloudFormation stuck in `ROLLBACK_IN_PROGRESS`**
- Check CloudFormation → stack → Events tab for the first error
- Fix it, delete the failed stack, re-run `deploy.sh`

**`aws: command not found`**
```bash
aws --version   # verify install
# If missing, reinstall AWS CLI v2 (see Prerequisites above)
```
