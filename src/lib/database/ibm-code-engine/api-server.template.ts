// @ts-nocheck
/**
 * IBM Code Engine Backend API Server
 * DEPLOYMENT TEMPLATE - Copy this to your Code Engine project
 * 
 * This code runs on IBM Code Engine and connects to IBM Cloud PostgreSQL.
 * Deploy this as a separate Code Engine application.
 * 
 * Environment Variables Required:
 * - IBM_POSTGRES_HOST
 * - IBM_POSTGRES_PORT
 * - IBM_POSTGRES_DATABASE
 * - IBM_POSTGRES_USER
 * - IBM_POSTGRES_PASSWORD
 * - IBM_POSTGRES_SSL_CERT (base64 encoded)
 * - IBM_APPID_CLIENT_ID
 * - IBM_APPID_SECRET
 * - IBM_APPID_TENANT_ID
 * - IBM_APPID_OAUTH_URL
 * - ALLOWED_ORIGINS (comma-separated list of allowed origins)
 * 
 * For Virtual Private Endpoint:
 * - IBM_POSTGRES_VPE_HOST (use this instead of public host when VPE is configured)
 */

// Type definitions for the API
interface SelectOptions {
  columns?: string;
  filters?: FilterCondition[];
  orderBy?: { column: string; ascending?: boolean }[];
  limit?: number;
  offset?: number;
  single?: boolean;
}

interface FilterCondition {
  column: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'in' | 'is';
  value: unknown;
}

interface ApiRequest {
  action: 'select' | 'insert' | 'update' | 'delete';
  options?: SelectOptions;
  data?: Record<string, unknown> | Record<string, unknown>[];
  filters?: FilterCondition[];
}

// PostgreSQL connection configuration
const getPostgresConfig = () => {
  const useVPE = !!process.env.IBM_POSTGRES_VPE_HOST;
  
  return {
    host: useVPE ? process.env.IBM_POSTGRES_VPE_HOST : process.env.IBM_POSTGRES_HOST,
    port: parseInt(process.env.IBM_POSTGRES_PORT || '30639'),
    database: process.env.IBM_POSTGRES_DATABASE || 'ibmclouddb',
    user: process.env.IBM_POSTGRES_USER,
    password: process.env.IBM_POSTGRES_PASSWORD,
    ssl: {
      rejectUnauthorized: true,
      ca: process.env.IBM_POSTGRES_SSL_CERT 
        ? Buffer.from(process.env.IBM_POSTGRES_SSL_CERT, 'base64').toString('utf-8')
        : undefined,
    },
  };
};

// CORS headers
const getCorsHeaders = (origin: string | null) => {
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim());
  const isAllowed = origin && (allowedOrigins.includes(origin) || allowedOrigins.includes('*'));
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0] || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
};

// JWT verification for IBM App ID tokens
const verifyAppIdToken = async (token: string): Promise<{ valid: boolean; payload?: Record<string, unknown> }> => {
  try {
    const [header, payload, signature] = token.split('.');
    if (!header || !payload || !signature) {
      return { valid: false };
    }

    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    
    // Verify issuer matches IBM App ID
    const expectedIssuer = process.env.IBM_APPID_OAUTH_URL;
    if (decodedPayload.iss !== expectedIssuer) {
      console.warn('Token issuer mismatch');
      return { valid: false };
    }

    // Verify token hasn't expired
    if (decodedPayload.exp && decodedPayload.exp < Date.now() / 1000) {
      console.warn('Token expired');
      return { valid: false };
    }

    // For production: Verify signature with IBM App ID public keys
    // Fetch JWKS from: {IBM_APPID_OAUTH_URL}/.well-known/jwks.json

    return { valid: true, payload: decodedPayload };
  } catch (error) {
    console.error('Token verification failed:', error);
    return { valid: false };
  }
};

// Build SQL query from filters
const buildWhereClause = (filters: FilterCondition[]): { clause: string; values: unknown[] } => {
  if (!filters || filters.length === 0) {
    return { clause: '', values: [] };
  }

  const conditions: string[] = [];
  const values: unknown[] = [];
  let paramIndex = 1;

  for (const filter of filters) {
    const column = filter.column.replace(/[^a-zA-Z0-9_]/g, ''); // Sanitize column name
    
    switch (filter.operator) {
      case 'eq':
        conditions.push(`"${column}" = $${paramIndex++}`);
        values.push(filter.value);
        break;
      case 'neq':
        conditions.push(`"${column}" != $${paramIndex++}`);
        values.push(filter.value);
        break;
      case 'gt':
        conditions.push(`"${column}" > $${paramIndex++}`);
        values.push(filter.value);
        break;
      case 'gte':
        conditions.push(`"${column}" >= $${paramIndex++}`);
        values.push(filter.value);
        break;
      case 'lt':
        conditions.push(`"${column}" < $${paramIndex++}`);
        values.push(filter.value);
        break;
      case 'lte':
        conditions.push(`"${column}" <= $${paramIndex++}`);
        values.push(filter.value);
        break;
      case 'like':
        conditions.push(`"${column}" LIKE $${paramIndex++}`);
        values.push(filter.value);
        break;
      case 'ilike':
        conditions.push(`"${column}" ILIKE $${paramIndex++}`);
        values.push(filter.value);
        break;
      case 'in':
        const inValues = Array.isArray(filter.value) ? filter.value : [filter.value];
        const placeholders = inValues.map(() => `$${paramIndex++}`).join(', ');
        conditions.push(`"${column}" IN (${placeholders})`);
        values.push(...inValues);
        break;
      case 'is':
        if (filter.value === null) {
          conditions.push(`"${column}" IS NULL`);
        } else {
          conditions.push(`"${column}" IS $${paramIndex++}`);
          values.push(filter.value);
        }
        break;
    }
  }

  return {
    clause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    values,
  };
};

// Export the handler functions for use in Code Engine
export const handleDataRequest = async (
  table: string,
  request: ApiRequest,
  pool: unknown // pg.Pool instance
): Promise<{ data: unknown; error: { message: string; code?: string } | null }> => {
  const sanitizedTable = table.replace(/[^a-zA-Z0-9_]/g, '');
  
  try {
    // @ts-expect-error - pool is pg.Pool
    const client = await pool.connect();
    
    try {
      switch (request.action) {
        case 'select': {
          const columns = request.options?.columns || '*';
          const { clause, values } = buildWhereClause(request.options?.filters || []);
          
          let query = `SELECT ${columns} FROM "${sanitizedTable}" ${clause}`;
          
          if (request.options?.orderBy && request.options.orderBy.length > 0) {
            const orderClauses = request.options.orderBy.map(
              o => `"${o.column.replace(/[^a-zA-Z0-9_]/g, '')}" ${o.ascending !== false ? 'ASC' : 'DESC'}`
            );
            query += ` ORDER BY ${orderClauses.join(', ')}`;
          }
          
          if (request.options?.limit) {
            query += ` LIMIT ${parseInt(String(request.options.limit))}`;
          }
          
          if (request.options?.offset) {
            query += ` OFFSET ${parseInt(String(request.options.offset))}`;
          }
          
          const result = await client.query(query, values);
          
          if (request.options?.single) {
            return { data: result.rows[0] || null, error: null };
          }
          
          return { data: result.rows, error: null };
        }
        
        case 'insert': {
          const records = Array.isArray(request.data) ? request.data : [request.data];
          const results: unknown[] = [];
          
          for (const record of records) {
            if (!record) continue;
            
            const columns = Object.keys(record).map(c => `"${c.replace(/[^a-zA-Z0-9_]/g, '')}"`);
            const values = Object.values(record);
            const placeholders = values.map((_, i) => `$${i + 1}`);
            
            const query = `INSERT INTO "${sanitizedTable}" (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`;
            const result = await client.query(query, values);
            results.push(result.rows[0]);
          }
          
          return { data: results.length === 1 ? results[0] : results, error: null };
        }
        
        case 'update': {
          if (!request.data) {
            return { data: null, error: { message: 'No data provided for update' } };
          }
          
          const setClauses: string[] = [];
          const setValues: unknown[] = [];
          let paramIndex = 1;
          
          for (const [key, value] of Object.entries(request.data)) {
            const sanitizedKey = key.replace(/[^a-zA-Z0-9_]/g, '');
            setClauses.push(`"${sanitizedKey}" = $${paramIndex++}`);
            setValues.push(value);
          }
          
          const { clause, values: filterValues } = buildWhereClause(request.filters || []);
          const adjustedClause = clause.replace(/\$(\d+)/g, (_, num) => `$${parseInt(num) + setValues.length}`);
          
          const query = `UPDATE "${sanitizedTable}" SET ${setClauses.join(', ')} ${adjustedClause} RETURNING *`;
          const result = await client.query(query, [...setValues, ...filterValues]);
          
          return { data: result.rows[0] || null, error: null };
        }
        
        case 'delete': {
          const { clause, values } = buildWhereClause(request.filters || []);
          
          if (!clause) {
            return { data: null, error: { message: 'Delete requires at least one filter condition' } };
          }
          
          const query = `DELETE FROM "${sanitizedTable}" ${clause} RETURNING *`;
          const result = await client.query(query, values);
          
          return { data: null, error: null };
        }
        
        default:
          return { data: null, error: { message: 'Invalid action' } };
      }
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database error:', error);
    return { 
      data: null, 
      error: { 
        message: error instanceof Error ? error.message : 'Database error',
        code: (error as { code?: string })?.code,
      },
    };
  }
};

export const handleRpcRequest = async (
  functionName: string,
  params: Record<string, unknown>,
  pool: unknown // pg.Pool instance
): Promise<{ data: unknown; error: { message: string; code?: string } | null }> => {
  const sanitizedFunction = functionName.replace(/[^a-zA-Z0-9_]/g, '');
  
  try {
    // @ts-expect-error - pool is pg.Pool
    const client = await pool.connect();
    
    try {
      const paramNames = Object.keys(params);
      const paramValues = Object.values(params);
      const paramPlaceholders = paramNames.map((name, i) => `${name} := $${i + 1}`).join(', ');
      
      const query = `SELECT * FROM ${sanitizedFunction}(${paramPlaceholders})`;
      const result = await client.query(query, paramValues);
      
      return { data: result.rows, error: null };
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('RPC error:', error);
    return { 
      data: null, 
      error: { 
        message: error instanceof Error ? error.message : 'RPC error',
        code: (error as { code?: string })?.code,
      },
    };
  }
};

// Export configuration helper
export { getPostgresConfig, getCorsHeaders, verifyAppIdToken };
