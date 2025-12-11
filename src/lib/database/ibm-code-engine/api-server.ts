// @ts-nocheck
/**
 * IBM Code Engine API Server
 * 
 * Complete API server for HBF Capital - Deploy to IBM Code Engine
 * 
 * DEPLOYMENT INSTRUCTIONS:
 * 1. Create a new directory for your Code Engine project
 * 2. Copy this file and server-entry.ts to that directory
 * 3. Run: npm init -y
 * 4. Run: npm install express pg cors helmet jsonwebtoken jwks-rsa
 * 5. Add to package.json: "type": "module" and "start": "node server-entry.js"
 * 6. Deploy to Code Engine with the environment variables below
 * 
 * ENVIRONMENT VARIABLES:
 * - IBM_POSTGRES_HOST (or IBM_POSTGRES_VPE_HOST for private endpoint)
 * - IBM_POSTGRES_PORT=30639
 * - IBM_POSTGRES_DATABASE=ibmclouddb
 * - IBM_POSTGRES_USER=ibm_cloud_428448fb_6d4a_4a7a_858b_488c66cf57ff
 * - IBM_POSTGRES_PASSWORD=(your password)
 * - IBM_POSTGRES_SSL_CERT=(base64 encoded certificate)
 * - IBM_APPID_CLIENT_ID=c6f6bb37-307f-4470-a1a3-171c80003e91
 * - IBM_APPID_TENANT_ID=5c040bb9-a961-4395-aaba-2b2f1bd0bc8e
 * - ALLOWED_ORIGINS=https://hbfcapital.com,https://www.hbfcapital.com
 * - PORT=8080
 */

import type { Pool, PoolConfig, QueryResult as PgQueryResult } from 'pg';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface SelectOptions {
  columns?: string;
  filters?: FilterCondition[];
  orderBy?: { column: string; ascending?: boolean }[];
  limit?: number;
  offset?: number;
  single?: boolean;
}

export interface FilterCondition {
  column: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in' | 'is';
  value: unknown;
}

export interface ApiRequest {
  action: 'select' | 'insert' | 'update' | 'delete';
  data?: Record<string, unknown> | Record<string, unknown>[];
  options?: SelectOptions;
  filters?: FilterCondition[];
  context?: { user_id?: string };
}

export interface ApiResponse<T = unknown> {
  data: T | null;
  error: { message: string; code?: string } | null;
  count?: number;
}

// ============================================
// CONFIGURATION
// ============================================

/**
 * Get PostgreSQL connection configuration
 * Supports both public and VPE (private) endpoints
 */
export function getPostgresConfig(): PoolConfig {
  // Prefer VPE endpoint for production (more secure)
  const host = process.env.IBM_POSTGRES_VPE_HOST || process.env.IBM_POSTGRES_HOST;
  
  if (!host) {
    throw new Error('IBM_POSTGRES_HOST or IBM_POSTGRES_VPE_HOST environment variable is required');
  }

  const config: PoolConfig = {
    host,
    port: parseInt(process.env.IBM_POSTGRES_PORT || '30639', 10),
    database: process.env.IBM_POSTGRES_DATABASE || 'ibmclouddb',
    user: process.env.IBM_POSTGRES_USER,
    password: process.env.IBM_POSTGRES_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };

  // SSL configuration for IBM Cloud
  if (process.env.IBM_POSTGRES_SSL_CERT) {
    config.ssl = {
      rejectUnauthorized: true,
      ca: Buffer.from(process.env.IBM_POSTGRES_SSL_CERT, 'base64').toString('utf-8'),
    };
  }

  return config;
}

/**
 * Get CORS headers based on allowed origins
 */
export function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map(o => o.trim())
    .filter(Boolean);

  // Default allowed origins for development
  const defaultOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://hbfcapital.com',
    'https://www.hbfcapital.com',
  ];

  const allAllowed = [...new Set([...defaultOrigins, ...allowedOrigins])];
  const isAllowed = origin && allAllowed.includes(origin);

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allAllowed[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
}

// ============================================
// IBM APP ID AUTHENTICATION
// ============================================

interface TokenPayload {
  sub: string;
  email?: string;
  name?: string;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

/**
 * Verify IBM App ID JWT token
 * In production, use proper JWT verification with JWKS
 */
export async function verifyAppIdToken(token: string): Promise<{ valid: boolean; payload?: TokenPayload }> {
  try {
    // Decode JWT without verification for development
    // In production, implement proper JWKS verification
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false };
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8')) as TokenPayload;

    // Check expiration
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return { valid: false };
    }

    // In production, verify with IBM App ID JWKS endpoint:
    // const jwksUrl = `${process.env.IBM_APPID_OAUTH_URL}/.well-known/jwks.json`;
    // Use jwks-rsa library to verify signature

    return { valid: true, payload };
  } catch (error) {
    console.error('Token verification error:', error);
    return { valid: false };
  }
}

// ============================================
// SQL BUILDER HELPERS
// ============================================

const OPERATOR_MAP: Record<FilterCondition['operator'], string> = {
  eq: '=',
  neq: '!=',
  gt: '>',
  gte: '>=',
  lt: '<',
  lte: '<=',
  like: 'LIKE',
  ilike: 'ILIKE',
  in: 'IN',
  is: 'IS',
};

// Whitelist of allowed tables for security
const ALLOWED_TABLES = new Set([
  'profiles',
  'user_roles',
  'user_sessions',
  'applications',
  'application_documents',
  'application_messages',
  'application_status_history',
  'consultations',
  'consultation_analytics',
  'lead_submissions',
  'cms_content',
  'seo_settings',
  'security_events',
  'security_alerts',
  'security_logs',
  'audit_logs',
  'compliance_metrics',
  'soc_controls',
  'soc_audit_evidence',
  'soc_reports',
  'admin_users',
  'admin_sessions',
  'admin_audit_log',
  'encryption_keys',
  'rate_limit_configs',
  'security_configs',
]);

/**
 * Validate table name to prevent SQL injection
 */
function validateTable(table: string): boolean {
  return ALLOWED_TABLES.has(table.toLowerCase());
}

/**
 * Sanitize column name
 */
function sanitizeColumn(column: string): string {
  // Only allow alphanumeric and underscore
  return column.replace(/[^a-zA-Z0-9_]/g, '');
}

/**
 * Build WHERE clause from filters
 */
function buildWhereClause(filters: FilterCondition[], startParam: number = 1): { sql: string; values: unknown[] } {
  if (!filters || filters.length === 0) {
    return { sql: '', values: [] };
  }

  const conditions: string[] = [];
  const values: unknown[] = [];
  let paramIndex = startParam;

  for (const filter of filters) {
    const column = sanitizeColumn(filter.column);
    const operator = OPERATOR_MAP[filter.operator];

    if (!operator) {
      throw new Error(`Invalid operator: ${filter.operator}`);
    }

    if (filter.operator === 'in') {
      const inValues = Array.isArray(filter.value) ? filter.value : [filter.value];
      const placeholders = inValues.map((_, i) => `$${paramIndex + i}`).join(', ');
      conditions.push(`"${column}" ${operator} (${placeholders})`);
      values.push(...inValues);
      paramIndex += inValues.length;
    } else if (filter.operator === 'is') {
      conditions.push(`"${column}" ${operator} ${filter.value === null ? 'NULL' : 'NOT NULL'}`);
    } else {
      conditions.push(`"${column}" ${operator} $${paramIndex}`);
      values.push(filter.value);
      paramIndex++;
    }
  }

  return {
    sql: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    values,
  };
}

// ============================================
// DATA REQUEST HANDLERS
// ============================================

/**
 * Handle SELECT requests
 */
async function handleSelect<T>(
  pool: Pool,
  table: string,
  options?: SelectOptions
): Promise<ApiResponse<T[]>> {
  try {
    const columns = options?.columns || '*';
    let sql = `SELECT ${columns} FROM "${table}"`;
    const values: unknown[] = [];
    let paramIndex = 1;

    // WHERE clause
    if (options?.filters && options.filters.length > 0) {
      const whereClause = buildWhereClause(options.filters, paramIndex);
      sql += ` ${whereClause.sql}`;
      values.push(...whereClause.values);
      paramIndex += whereClause.values.length;
    }

    // ORDER BY
    if (options?.orderBy && options.orderBy.length > 0) {
      const orderParts = options.orderBy.map(o => 
        `"${sanitizeColumn(o.column)}" ${o.ascending === false ? 'DESC' : 'ASC'}`
      );
      sql += ` ORDER BY ${orderParts.join(', ')}`;
    }

    // LIMIT & OFFSET
    if (options?.limit) {
      sql += ` LIMIT $${paramIndex}`;
      values.push(options.limit);
      paramIndex++;
    }

    if (options?.offset) {
      sql += ` OFFSET $${paramIndex}`;
      values.push(options.offset);
    }

    const result = await pool.query(sql, values);
    
    if (options?.single) {
      return {
        data: result.rows[0] || null,
        error: null,
        count: result.rowCount || 0,
      };
    }

    return {
      data: result.rows as T[],
      error: null,
      count: result.rowCount || 0,
    };
  } catch (error) {
    console.error('SELECT error:', error);
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Database error', code: 'SELECT_ERROR' },
    };
  }
}

/**
 * Handle INSERT requests
 */
async function handleInsert<T>(
  pool: Pool,
  table: string,
  data: Record<string, unknown> | Record<string, unknown>[]
): Promise<ApiResponse<T>> {
  try {
    const records = Array.isArray(data) ? data : [data];
    if (records.length === 0) {
      return { data: null, error: { message: 'No data to insert', code: 'NO_DATA' } };
    }

    const columns = Object.keys(records[0]).map(sanitizeColumn);
    const columnsList = columns.map(c => `"${c}"`).join(', ');
    
    const valuePlaceholders: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    for (const record of records) {
      const placeholders = columns.map(() => `$${paramIndex++}`);
      valuePlaceholders.push(`(${placeholders.join(', ')})`);
      columns.forEach(col => values.push(record[col]));
    }

    const sql = `INSERT INTO "${table}" (${columnsList}) VALUES ${valuePlaceholders.join(', ')} RETURNING *`;
    const result = await pool.query(sql, values);

    return {
      data: (Array.isArray(data) ? result.rows : result.rows[0]) as T,
      error: null,
      count: result.rowCount || 0,
    };
  } catch (error) {
    console.error('INSERT error:', error);
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Insert failed', code: 'INSERT_ERROR' },
    };
  }
}

/**
 * Handle UPDATE requests
 */
async function handleUpdate<T>(
  pool: Pool,
  table: string,
  data: Record<string, unknown>,
  filters: FilterCondition[]
): Promise<ApiResponse<T>> {
  try {
    if (!filters || filters.length === 0) {
      return { data: null, error: { message: 'UPDATE requires filters', code: 'NO_FILTERS' } };
    }

    const columns = Object.keys(data).map(sanitizeColumn);
    const setClauses = columns.map((col, i) => `"${col}" = $${i + 1}`);
    const values: unknown[] = columns.map(col => data[col]);

    const whereClause = buildWhereClause(filters, columns.length + 1);
    values.push(...whereClause.values);

    const sql = `UPDATE "${table}" SET ${setClauses.join(', ')} ${whereClause.sql} RETURNING *`;
    const result = await pool.query(sql, values);

    return {
      data: result.rows[0] as T,
      error: null,
      count: result.rowCount || 0,
    };
  } catch (error) {
    console.error('UPDATE error:', error);
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Update failed', code: 'UPDATE_ERROR' },
    };
  }
}

/**
 * Handle DELETE requests
 */
async function handleDelete(
  pool: Pool,
  table: string,
  filters: FilterCondition[]
): Promise<ApiResponse<null>> {
  try {
    if (!filters || filters.length === 0) {
      return { data: null, error: { message: 'DELETE requires filters', code: 'NO_FILTERS' } };
    }

    const whereClause = buildWhereClause(filters);
    const sql = `DELETE FROM "${table}" ${whereClause.sql} RETURNING id`;
    const result = await pool.query(sql, whereClause.values);

    return {
      data: null,
      error: null,
      count: result.rowCount || 0,
    };
  } catch (error) {
    console.error('DELETE error:', error);
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'Delete failed', code: 'DELETE_ERROR' },
    };
  }
}

/**
 * Main data request handler
 */
export async function handleDataRequest<T>(
  table: string,
  request: ApiRequest,
  pool: Pool
): Promise<ApiResponse<T>> {
  // Validate table name
  if (!validateTable(table)) {
    return { data: null, error: { message: `Invalid table: ${table}`, code: 'INVALID_TABLE' } };
  }

  switch (request.action) {
    case 'select':
      return handleSelect<T>(pool, table, request.options) as Promise<ApiResponse<T>>;
    case 'insert':
      if (!request.data) {
        return { data: null, error: { message: 'No data provided', code: 'NO_DATA' } };
      }
      return handleInsert<T>(pool, table, request.data);
    case 'update':
      if (!request.data || Array.isArray(request.data)) {
        return { data: null, error: { message: 'Invalid update data', code: 'INVALID_DATA' } };
      }
      return handleUpdate<T>(pool, table, request.data, request.filters || []);
    case 'delete':
      return handleDelete(pool, table, request.filters || []) as Promise<ApiResponse<T>>;
    default:
      return { data: null, error: { message: 'Invalid action', code: 'INVALID_ACTION' } };
  }
}

/**
 * Handle RPC (stored procedure) requests
 */
export async function handleRpcRequest<T>(
  functionName: string,
  params: Record<string, unknown>,
  pool: Pool
): Promise<ApiResponse<T>> {
  try {
    // Whitelist of allowed functions
    const allowedFunctions = [
      'has_role',
      'log_security_event',
      'update_updated_at_column',
    ];

    const sanitizedName = functionName.replace(/[^a-zA-Z0-9_]/g, '');
    
    if (!allowedFunctions.includes(sanitizedName)) {
      return { data: null, error: { message: `Function not allowed: ${sanitizedName}`, code: 'INVALID_FUNCTION' } };
    }

    const paramKeys = Object.keys(params).filter(k => !k.startsWith('_'));
    const paramValues = paramKeys.map(k => params[k]);
    const placeholders = paramKeys.map((_, i) => `$${i + 1}`).join(', ');

    const sql = `SELECT ${sanitizedName}(${placeholders}) as result`;
    const result = await pool.query(sql, paramValues);

    return {
      data: result.rows[0]?.result as T,
      error: null,
    };
  } catch (error) {
    console.error('RPC error:', error);
    return {
      data: null,
      error: { message: error instanceof Error ? error.message : 'RPC failed', code: 'RPC_ERROR' },
    };
  }
}

export default {
  getPostgresConfig,
  getCorsHeaders,
  verifyAppIdToken,
  handleDataRequest,
  handleRpcRequest,
};
