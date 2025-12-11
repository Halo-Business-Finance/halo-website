# IBM Code Engine Backend Deployment

This directory contains the complete backend API for HBF Capital to deploy on IBM Code Engine.

## Files

| File | Description |
|------|-------------|
| `schema.sql` | PostgreSQL schema matching Supabase structure - **RUN THIS FIRST** |
| `api-server.ts` | Core API logic (data handlers, auth, SQL builder) |
| `server-entry.ts` | Express server entry point |
| `package.json` | Node.js dependencies |
| `tsconfig.json` | TypeScript configuration |
| `Dockerfile` | Container build configuration |
| `DEPLOYMENT.md` | Step-by-step deployment guide |

## Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────────┐
│   Frontend      │──────│  IBM Code Engine │──────│ IBM PostgreSQL      │
│   (Cloudflare)  │ HTTPS│  (Backend API)   │ SSL  │ (Database)          │
└─────────────────┘      └──────────────────┘      └─────────────────────┘
                                │
                                │ (with VPE)
                                ▼
                         ┌──────────────────┐
                         │ Virtual Private  │
                         │ Endpoint (VPE)   │
                         │ Private Network  │
                         └──────────────────┘
```

## Quick Start

### 1. Set Up PostgreSQL Schema

Connect to your IBM Cloud Databases for PostgreSQL and run `schema.sql`:

```bash
# Download the SSL certificate from IBM Cloud and save as cert.pem
psql "postgres://USER:PASSWORD@HOST:PORT/ibmclouddb?sslmode=verify-full&sslrootcert=cert.pem" -f schema.sql
```

### 2. Deploy to Code Engine

Copy all files to a new directory and follow `DEPLOYMENT.md` for detailed steps:

```bash
mkdir hbf-api && cd hbf-api
# Copy: api-server.ts, server-entry.ts, package.json, tsconfig.json, Dockerfile
npm install
npm run build
```

### 4. Create tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

### 5. Create Dockerfile

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 8080

CMD ["node", "dist/index.js"]
```

### 6. Deploy to IBM Code Engine

```bash
# Login to IBM Cloud
ibmcloud login

# Target your resource group
ibmcloud target -g Default

# Create Code Engine project (if not exists)
ibmcloud ce project create --name hbf-website-api

# Select the project
ibmcloud ce project select --name hbf-website-api

# Build and deploy
npm run build
ibmcloud ce app create --name hbf-api \
  --image icr.io/your-namespace/hbf-api:latest \
  --port 8080 \
  --min-scale 1 \
  --max-scale 10
```

### 7. Set Environment Variables

```bash
ibmcloud ce app update --name hbf-api \
  --env IBM_POSTGRES_HOST=f98291ee-16da-4c32-9fac-2136f5c9d209.c5km1ted03t0e8geevf0.databases.appdomain.cloud \
  --env IBM_POSTGRES_PORT=30639 \
  --env IBM_POSTGRES_DATABASE=ibmclouddb \
  --env IBM_POSTGRES_USER=ibm_cloud_428448fb_6d4a_4a7a_858b_488c66cf57ff \
  --env-from-secret IBM_POSTGRES_PASSWORD=db-secrets:password \
  --env-from-secret IBM_POSTGRES_SSL_CERT=db-secrets:ssl_cert \
  --env IBM_APPID_CLIENT_ID=c6f6bb37-307f-4470-a1a3-171c80003e91 \
  --env-from-secret IBM_APPID_SECRET=appid-secrets:secret \
  --env IBM_APPID_TENANT_ID=5c040bb9-a961-4395-aaba-2b2f1bd0bc8e \
  --env IBM_APPID_OAUTH_URL=https://us-south.appid.cloud.ibm.com/oauth/v4/5c040bb9-a961-4395-aaba-2b2f1bd0bc8e \
  --env ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## Virtual Private Endpoint (VPE) Setup

Setting up VPE allows private network communication between Code Engine and PostgreSQL.

### Step 1: Create a VPC

1. Go to IBM Cloud Console → VPC Infrastructure → VPCs
2. Click "Create"
3. Configure:
   - Name: `hbf-vpc`
   - Region: `us-south` (same as your PostgreSQL)
   - Resource group: Your resource group
4. Create default address prefixes and subnets

### Step 2: Create Virtual Private Endpoint Gateway

1. Go to VPC Infrastructure → Virtual private endpoint gateways
2. Click "Create"
3. Configure:
   - Name: `hbf-postgres-vpe`
   - VPC: `hbf-vpc`
   - Resource group: Your resource group

### Step 3: Add Endpoint Target

1. In the VPE gateway, click "Add endpoint"
2. Select "Cloud service"
3. Search for "Databases for PostgreSQL"
4. Select your PostgreSQL instance: `f98291ee-16da-4c32-9fac-2136f5c9d209`
5. Select a subnet for the reserved IP

### Step 4: Get Private Endpoint Hostname

After creation, the VPE will provide a private hostname like:
```
f98291ee-16da-4c32-9fac-2136f5c9d209.private.databases.appdomain.cloud
```

### Step 5: Configure Code Engine to use VPC

1. Go to your Code Engine project
2. Navigate to "Domain mappings" or networking settings
3. Enable VPC connectivity
4. Select `hbf-vpc`

### Step 6: Update Environment Variable

```bash
ibmcloud ce app update --name hbf-api \
  --env IBM_POSTGRES_VPE_HOST=f98291ee-16da-4c32-9fac-2136f5c9d209.private.databases.appdomain.cloud
```

---

## Security Best Practices

### 1. Use Secrets for Sensitive Data

```bash
# Create secrets
ibmcloud ce secret create --name db-secrets \
  --from-literal password=YOUR_PASSWORD \
  --from-literal ssl_cert=YOUR_BASE64_CERT

ibmcloud ce secret create --name appid-secrets \
  --from-literal secret=YOUR_APPID_SECRET
```

### 2. Enable IP Allowlisting

In your PostgreSQL instance:
1. Go to Settings → Allowlisting
2. Add your Code Engine's outbound IP ranges
3. Or use VPE for private-only access

### 3. Enable Audit Logging

```sql
-- In your PostgreSQL database
ALTER SYSTEM SET log_statement = 'all';
ALTER SYSTEM SET log_connections = on;
ALTER SYSTEM SET log_disconnections = on;
```

---

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check with DB status |
| `/api/data/:table` | POST | CRUD operations on tables |
| `/api/rpc/:function` | POST | Execute stored procedures |

### Example Requests

**Select data:**
```bash
curl -X POST https://your-api.us-south.codeengine.appdomain.cloud/api/data/consultations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"action": "select", "options": {"limit": 10}}'
```

**Insert data:**
```bash
curl -X POST https://your-api.us-south.codeengine.appdomain.cloud/api/data/lead_submissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"action": "insert", "data": {"form_type": "contact", "status": "new"}}'
```
