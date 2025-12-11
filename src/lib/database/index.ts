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

// IBM Configuration (fill in when provisioned)
const IBM_CONFIG = {
  apiEndpoint: '', // Your IBM Code Engine API URL, e.g., 'https://your-app.us-south.codeengine.appdomain.cloud'
  appId: {
    clientId: '',    // From IBM App ID service credentials
    tenantId: '',    // From IBM App ID service credentials
    region: 'us-south', // Your IBM Cloud region
  },
  storage: {
    endpoint: '',           // e.g., 'https://s3.us-south.cloud-object-storage.appdomain.cloud'
    apiKey: '',             // IBM Cloud API key
    serviceInstanceId: '',  // IBM COS service instance ID
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
