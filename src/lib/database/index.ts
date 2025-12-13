// Database abstraction layer - easily swap between Supabase and IBM Cloud
import type { DatabaseClient, DatabaseConfig } from './types';
import { SupabaseDatabaseClient } from './supabase-adapter';
import { IBMDatabaseClient } from './ibm-adapter';

export * from './types';
export { SupabaseDatabaseClient } from './supabase-adapter';
export { IBMDatabaseClient } from './ibm-adapter';

// Current provider configuration
// Change this when ready to switch to IBM
const CURRENT_PROVIDER: 'supabase' | 'ibm' = 'supabase';

// IBM Configuration - Code Engine API URL
const IBM_CODE_ENGINE_URL = 'https://halo-api.23oqh4gja5d5.us-south.codeengine.appdomain.cloud';

const IBM_CONFIG = {
  // Your IBM Code Engine API URL - update this after deployment
  // Example: 'https://hbf-api.us-south.codeengine.appdomain.cloud'
  apiEndpoint: IBM_CODE_ENGINE_URL,
  appId: {
    clientId: 'c6f6bb37-307f-4470-a1a3-171c80003e91',
    tenantId: '5c040bb9-a961-4395-aaba-2b2f1bd0bc8e',
    region: 'us-south',
  },
  storage: {
    // IBM Cloud Object Storage (provision if needed)
    endpoint: 'https://s3.us-south.cloud-object-storage.appdomain.cloud',
    apiKey: '', // Add when COS is provisioned
    serviceInstanceId: '',
  },
};

/**
 * Get the database client based on current configuration
 * 
 * Usage:
 * ```typescript
 * import { db } from '@/lib/database';
 * 
 * // Select data
 * const { data, error } = await db.select('consultations', {
 *   filters: [{ column: 'status', operator: 'eq', value: 'pending' }],
 *   limit: 10,
 * });
 * 
 * // Insert data
 * const { data, error } = await db.insert('lead_submissions', { ... });
 * 
 * // Authentication
 * const { data, error } = await db.auth.signIn('email@example.com', 'password');
 * ```
 */
export function createDatabaseClient(config?: DatabaseConfig): DatabaseClient {
  const provider = config?.provider || CURRENT_PROVIDER;
  
  if (provider === 'ibm') {
    if (!IBM_CONFIG.apiEndpoint) {
      console.warn('IBM Cloud not configured. Falling back to Supabase.');
      return new SupabaseDatabaseClient();
    }
    return new IBMDatabaseClient(IBM_CONFIG);
  }
  
  return new SupabaseDatabaseClient();
}

// Default client instance
export const db = createDatabaseClient();

/**
 * Migration helper - Export data from Supabase for IBM import
 */
export async function exportTableForMigration(table: string): Promise<unknown[]> {
  const supabase = new SupabaseDatabaseClient();
  const { data, error } = await supabase.select(table, { limit: 10000 });
  
  if (error) {
    console.error(`Failed to export ${table}:`, error.message);
    return [];
  }
  
  return data || [];
}

/**
 * Health check for current database provider
 */
export async function checkDatabaseHealth(): Promise<{ provider: string; healthy: boolean; latency: number }> {
  const start = Date.now();
  
  try {
    const { error } = await db.select('profiles', { limit: 1 });
    return {
      provider: CURRENT_PROVIDER,
      healthy: !error,
      latency: Date.now() - start,
    };
  } catch {
    return {
      provider: CURRENT_PROVIDER,
      healthy: false,
      latency: Date.now() - start,
    };
  }
}
