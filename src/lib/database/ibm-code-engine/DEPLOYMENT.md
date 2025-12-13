# IBM Code Engine Deployment Guide

## Prerequisites

1. IBM Cloud CLI installed
2. Code Engine plugin: `ibmcloud plugin install code-engine`
3. Container Registry plugin: `ibmcloud plugin install container-registry`

## Step 1: Build and Push Docker Image

```bash
# Login to IBM Cloud
ibmcloud login

# Target your resource group
ibmcloud target -g Default

# Login to Container Registry
ibmcloud cr login

# Create namespace (if not exists)
ibmcloud cr namespace-add halo-website

# Build and push image
docker build -t us.icr.io/halo-website/halo-api:latest .
docker push us.icr.io/halo-website/halo-api:latest
```

## Step 2: Create Code Engine Project

```bash
# Create project
ibmcloud ce project create --name halo-api

# Select project
ibmcloud ce project select --name halo-api
```

## Step 3: Create Secrets for Environment Variables

```bash
# Create secret for database credentials
ibmcloud ce secret create --name halo-db-credentials \
  --from-literal IBM_POSTGRES_HOST=f98291ee-16da-4c32-9fac-2136f5c9d209.c5km1ted03t0e8geevf0.databases.appdomain.cloud \
  --from-literal IBM_POSTGRES_PORT=30639 \
  --from-literal IBM_POSTGRES_DATABASE=ibmclouddb \
  --from-literal IBM_POSTGRES_USER=ibm_cloud_428448fb_6d4a_4a7a_858b_488c66cf57ff \
  --from-literal IBM_POSTGRES_PASSWORD=YOUR_PASSWORD_HERE \
  --from-literal IBM_POSTGRES_SSL_CERT=YOUR_BASE64_CERT_HERE

# Create secret for App ID
ibmcloud ce secret create --name halo-appid-credentials \
  --from-literal IBM_APPID_CLIENT_ID=c6f6bb37-307f-4470-a1a3-171c80003e91 \
  --from-literal IBM_APPID_SECRET=YOUR_SECRET_HERE \
  --from-literal IBM_APPID_TENANT_ID=5c040bb9-a961-4395-aaba-2b2f1bd0bc8e \
  --from-literal IBM_APPID_OAUTH_URL=https://us-south.appid.cloud.ibm.com/oauth/v4/5c040bb9-a961-4395-aaba-2b2f1bd0bc8e
```

## Step 4: Deploy Application

```bash
# Create application
ibmcloud ce app create --name halo-api \
  --image us.icr.io/halo-website/halo-api:latest \
  --port 8080 \
  --min-scale 1 \
  --max-scale 10 \
  --cpu 0.5 \
  --memory 1G \
  --env-from-secret halo-db-credentials \
  --env-from-secret halo-appid-credentials \
  --env ALLOWED_ORIGINS=https://halobusinessfinance.com,https://www.halobusinessfinance.com
```

## Step 5: Get Application URL

```bash
ibmcloud ce app get --name halo-api --output url
```

## Step 6: Test the API

```bash
# Health check
curl https://YOUR_APP_URL/health

# API info
curl https://YOUR_APP_URL/api
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `IBM_POSTGRES_HOST` | PostgreSQL public hostname | `xxx.databases.appdomain.cloud` |
| `IBM_POSTGRES_VPE_HOST` | PostgreSQL VPE hostname (optional) | `xxx.private.databases.appdomain.cloud` |
| `IBM_POSTGRES_PORT` | PostgreSQL port | `30639` |
| `IBM_POSTGRES_DATABASE` | Database name | `ibmclouddb` |
| `IBM_POSTGRES_USER` | Database username | `ibm_cloud_xxx` |
| `IBM_POSTGRES_PASSWORD` | Database password | (from credentials) |
| `IBM_POSTGRES_SSL_CERT` | Base64 SSL certificate | (from credentials) |
| `IBM_APPID_CLIENT_ID` | App ID client ID | `c6f6bb37-xxx` |
| `IBM_APPID_SECRET` | App ID client secret | (from App ID) |
| `IBM_APPID_TENANT_ID` | App ID tenant ID | `5c040bb9-xxx` |
| `IBM_APPID_OAUTH_URL` | App ID OAuth URL | `https://us-south.appid.cloud.ibm.com/oauth/v4/xxx` |
| `ALLOWED_ORIGINS` | Comma-separated allowed origins | `https://halobusinessfinance.com` |
| `PORT` | Server port (auto-set by Code Engine) | `8080` |

## Updating the Application

```bash
# Rebuild and push new image
docker build -t us.icr.io/halo-website/halo-api:latest .
docker push us.icr.io/halo-website/halo-api:latest

# Update application
ibmcloud ce app update --name halo-api --image us.icr.io/halo-website/halo-api:latest
```

## Viewing Logs

```bash
ibmcloud ce app logs --name halo-api --follow
```

## Using VPE (Private Endpoint)

Once your VPE gateway is active:

1. Update the secret with VPE hostname:
```bash
ibmcloud ce secret update --name halo-db-credentials \
  --from-literal IBM_POSTGRES_VPE_HOST=YOUR_VPE_HOSTNAME
```

2. The API will automatically use VPE when `IBM_POSTGRES_VPE_HOST` is set.

## Connecting from Frontend

Update your frontend configuration with the IBM Code Engine URL:

```
VITE_IBM_CODE_ENGINE_URL=https://halo-api.xxx.us-south.codeengine.appdomain.cloud
```

The database abstraction layer will automatically use IBM when configured.
