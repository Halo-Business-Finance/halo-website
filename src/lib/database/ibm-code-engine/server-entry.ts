// @ts-nocheck
/**
 * IBM Code Engine Server Entry Point
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Create a new folder for your Code Engine project
 * 2. Copy api-server.ts and this file (server-entry.ts)
 * 3. Run: npm init -y
 * 4. Run: npm install express pg cors helmet
 * 5. Add to package.json:
 *    - "type": "module"
 *    - "scripts": { "start": "node --loader ts-node/esm server-entry.ts" }
 *    OR compile to JS first with tsc
 * 6. Set environment variables in Code Engine
 * 7. Deploy!
 * 
 * ENVIRONMENT VARIABLES (set in Code Engine):
 * - IBM_POSTGRES_HOST=f98291ee-16da-4c32-9fac-2136f5c9d209.c5km1ted03t0e8geevf0.databases.appdomain.cloud
 * - IBM_POSTGRES_VPE_HOST=(your VPE private hostname when available)
 * - IBM_POSTGRES_PORT=30639
 * - IBM_POSTGRES_DATABASE=ibmclouddb
 * - IBM_POSTGRES_USER=ibm_cloud_428448fb_6d4a_4a7a_858b_488c66cf57ff
 * - IBM_POSTGRES_PASSWORD=(your password from credentials)
 * - IBM_POSTGRES_SSL_CERT=(base64 encoded certificate from credentials)
 * - IBM_APPID_CLIENT_ID=c6f6bb37-307f-4470-a1a3-171c80003e91
 * - IBM_APPID_SECRET=(your App ID secret)
 * - IBM_APPID_TENANT_ID=5c040bb9-a961-4395-aaba-2b2f1bd0bc8e
 * - IBM_APPID_OAUTH_URL=https://us-south.appid.cloud.ibm.com/oauth/v4/5c040bb9-a961-4395-aaba-2b2f1bd0bc8e
 * - ALLOWED_ORIGINS=https://hbfcapital.com,https://www.hbfcapital.com
 * - PORT=8080
 */

import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import helmet from 'helmet';
import {
  getPostgresConfig,
  getCorsHeaders,
  verifyAppIdToken,
  handleDataRequest,
  handleRpcRequest,
  ApiRequest,
} from './api-server';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
        email?: string;
        name?: string;
        [key: string]: unknown;
      } | null;
    }
  }
}

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize PostgreSQL connection pool
let pool: Pool;

try {
  pool = new Pool(getPostgresConfig());
} catch (error) {
  console.error('Failed to create PostgreSQL pool:', error);
  process.exit(1);
}

// Test database connection on startup
pool.connect()
  .then(client => {
    console.log('✅ Connected to IBM Cloud PostgreSQL');
    console.log(`   Host: ${process.env.IBM_POSTGRES_VPE_HOST ? 'VPE (Private)' : process.env.IBM_POSTGRES_HOST}`);
    client.release();
  })
  .catch(err => {
    console.error('❌ Failed to connect to PostgreSQL:', err.message);
    console.error('   Check your environment variables and network configuration');
  });

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://*.hbfcapital.com"],
    },
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

app.use(express.json({ limit: '10mb' }));

// Dynamic CORS handling
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin || null;
  const corsHeaders = getCorsHeaders(origin);
  
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  
  next();
});

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Authentication middleware
const authenticate: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    // Allow unauthenticated access to public endpoints
    req.user = null;
    next();
    return;
  }
  
  const token = authHeader.substring(7);
  const { valid, payload } = await verifyAppIdToken(token);
  
  if (!valid) {
    res.status(401).json({ error: { message: 'Invalid or expired token' } });
    return;
  }
  
  req.user = payload as Request['user'];
  next();
};

// ============================================
// API ROUTES
// ============================================

// Health check endpoint
app.get('/health', async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    
    res.json({ 
      status: 'healthy',
      database: 'connected',
      vpe: !!process.env.IBM_POSTGRES_VPE_HOST,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    });
  } catch (error) {
    res.status(503).json({ 
      status: 'unhealthy',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// API info endpoint
app.get('/api', (req: Request, res: Response) => {
  res.json({
    name: 'HBF API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      data: 'POST /api/data/:table',
      rpc: 'POST /api/rpc/:functionName',
    },
  });
});

// Data API endpoint
app.post('/api/data/:table', authenticate, async (req: Request, res: Response) => {
  const { table } = req.params;
  const request: ApiRequest = req.body;
  
  // Add user context for RLS-like behavior
  if (req.user) {
    request.context = { user_id: req.user.sub };
  }
  
  const result = await handleDataRequest(table, request, pool);
  
  if (result.error) {
    res.status(400).json(result);
    return;
  }
  
  res.json(result);
});

// RPC endpoint for stored procedures
app.post('/api/rpc/:functionName', authenticate, async (req: Request, res: Response) => {
  const { functionName } = req.params;
  const params = req.body || {};
  
  // Add user context
  if (req.user) {
    params._user_id = req.user.sub;
  }
  
  const result = await handleRpcRequest(functionName, params, pool);
  
  if (result.error) {
    res.status(400).json(result);
    return;
  }
  
  res.json(result);
});

// Catch-all for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: { message: 'Not found', code: 'NOT_FOUND' } });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    error: { 
      message: 'Internal server error', 
      code: 'INTERNAL_ERROR' 
    } 
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down...');
  await pool.end();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 HBF API Server');
  console.log('========================');
  console.log(`   Port: ${PORT}`);
  console.log(`   PostgreSQL: ${process.env.IBM_POSTGRES_VPE_HOST ? 'VPE (Private)' : process.env.IBM_POSTGRES_HOST || 'Not configured'}`);
  console.log(`   App ID: ${process.env.IBM_APPID_CLIENT_ID ? 'Configured' : 'Not configured'}`);
  console.log('');
});

export default app;
