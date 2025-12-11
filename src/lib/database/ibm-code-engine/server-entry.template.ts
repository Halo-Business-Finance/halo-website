// @ts-nocheck
/**
 * IBM Code Engine Server Entry Point
 * 
 * DEPLOYMENT TEMPLATE - Copy this to your Code Engine project
 * Deploy this to IBM Code Engine as your backend API.
 * 
 * Installation (in your Code Engine project):
 * npm install express pg cors helmet
 * 
 * Environment Variables to set in Code Engine:
 * - IBM_POSTGRES_HOST=f98291ee-16da-4c32-9fac-2136f5c9d209.c5km1ted03t0e8geevf0.databases.appdomain.cloud
 * - IBM_POSTGRES_PORT=30639
 * - IBM_POSTGRES_DATABASE=ibmclouddb
 * - IBM_POSTGRES_USER=ibm_cloud_428448fb_6d4a_4a7a_858b_488c66cf57ff
 * - IBM_POSTGRES_PASSWORD=(your password)
 * - IBM_POSTGRES_SSL_CERT=(base64 encoded certificate)
 * - IBM_APPID_CLIENT_ID=c6f6bb37-307f-4470-a1a3-171c80003e91
 * - IBM_APPID_SECRET=(your secret)
 * - IBM_APPID_TENANT_ID=5c040bb9-a961-4395-aaba-2b2f1bd0bc8e
 * - IBM_APPID_OAUTH_URL=https://us-south.appid.cloud.ibm.com/oauth/v4/5c040bb9-a961-4395-aaba-2b2f1bd0bc8e
 * - ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
 * - PORT=8080 (default for Code Engine)
 * 
 * For Virtual Private Endpoint (after setup):
 * - IBM_POSTGRES_VPE_HOST=(your VPE private hostname)
 */

import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import helmet from 'helmet';
// When deploying to Code Engine, rename api-server.template.ts to api-server.ts
// and update this import accordingly
import {
  getPostgresConfig,
  getCorsHeaders,
  verifyAppIdToken,
  handleDataRequest,
  handleRpcRequest,
} from './api-server'; // Rename template file when deploying

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize PostgreSQL connection pool
const pool = new Pool(getPostgresConfig());

// Test database connection on startup
pool.connect()
  .then(client => {
    console.log('✅ Connected to IBM Cloud PostgreSQL');
    client.release();
  })
  .catch(err => {
    console.error('❌ Failed to connect to PostgreSQL:', err.message);
    // Don't exit - allow retries
  });

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(express.json({ limit: '10mb' }));

// Dynamic CORS handling
app.use((req, res, next) => {
  const origin = req.headers.origin || null;
  const corsHeaders = getCorsHeaders(origin);
  
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  next();
});

// Authentication middleware
const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    // Allow unauthenticated access to public endpoints
    req.user = null;
    return next();
  }
  
  const token = authHeader.substring(7);
  const { valid, payload } = await verifyAppIdToken(token);
  
  if (!valid) {
    return res.status(401).json({ error: { message: 'Invalid or expired token' } });
  }
  
  req.user = payload;
  next();
};

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: Record<string, unknown> | null;
    }
  }
}

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    
    res.json({ 
      status: 'healthy',
      database: 'connected',
      vpe: !!process.env.IBM_POSTGRES_VPE_HOST ? 'enabled' : 'disabled',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Data API endpoint
app.post('/api/data/:table', authenticate, async (req, res) => {
  const { table } = req.params;
  const request = req.body;
  
  // Add user context for RLS-like behavior
  if (req.user) {
    request.context = { user_id: req.user.sub };
  }
  
  const result = await handleDataRequest(table, request, pool);
  
  if (result.error) {
    return res.status(400).json(result);
  }
  
  res.json(result);
});

// RPC endpoint for stored procedures
app.post('/api/rpc/:functionName', authenticate, async (req, res) => {
  const { functionName } = req.params;
  const params = req.body || {};
  
  // Add user context
  if (req.user) {
    params._user_id = req.user.sub;
  }
  
  const result = await handleRpcRequest(functionName, params, pool);
  
  if (result.error) {
    return res.status(400).json(result);
  }
  
  res.json(result);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 IBM Code Engine API server running on port ${PORT}`);
  console.log(`📊 PostgreSQL Host: ${process.env.IBM_POSTGRES_HOST}`);
  console.log(`🔒 VPE Enabled: ${!!process.env.IBM_POSTGRES_VPE_HOST}`);
});

export default app;
