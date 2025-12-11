// IBM Cloud adapter - Placeholder for IBM Cloud Databases for PostgreSQL + IBM App ID
// This file provides the structure for IBM integration when ready to migrate

import type {
  DatabaseClient,
  QueryResult,
  SelectOptions,
  FilterCondition,
  AuthClient,
  AuthSession,
  AuthUser,
  SignUpOptions,
  StorageClient,
  StorageFile,
} from './types';

/**
 * IBM App ID Authentication Adapter
 * 
 * When you provision IBM App ID:
 * 1. Get your App ID credentials from IBM Cloud console
 * 2. Install: npm install ibmcloud-appid
 * 3. Configure with your tenant ID, client ID, and secret
 * 
 * Documentation: https://cloud.ibm.com/docs/appid
 */
class IBMAppIdAuthAdapter implements AuthClient {
  private clientId: string;
  private tenantId: string;
  private region: string;

  constructor(config: { clientId: string; tenantId: string; region: string }) {
    this.clientId = config.clientId;
    this.tenantId = config.tenantId;
    this.region = config.region;
  }

  async signIn(email: string, password: string): Promise<QueryResult<AuthSession>> {
    // IBM App ID Resource Owner Password flow
    // POST https://{region}.appid.cloud.ibm.com/oauth/v4/{tenantId}/token
    
    const tokenUrl = `https://${this.region}.appid.cloud.ibm.com/oauth/v4/${this.tenantId}/token`;
    
    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'password',
          username: email,
          password: password,
          client_id: this.clientId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { data: null, error: { message: error.error_description || 'Authentication failed' } };
      }

      const data = await response.json();
      
      // Store tokens securely
      sessionStorage.setItem('ibm_access_token', data.access_token);
      sessionStorage.setItem('ibm_id_token', data.id_token);
      if (data.refresh_token) {
        sessionStorage.setItem('ibm_refresh_token', data.refresh_token);
      }

      // Decode ID token to get user info
      const user = this.decodeIdToken(data.id_token);

      return {
        data: {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresAt: Date.now() + (data.expires_in * 1000),
          user,
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: { message: 'Network error during authentication' } };
    }
  }

  async signUp(email: string, password: string, options?: SignUpOptions): Promise<QueryResult<AuthSession>> {
    // IBM App ID Cloud Directory sign up
    // POST https://{region}.appid.cloud.ibm.com/management/v4/{tenantId}/cloud_directory/sign_up
    
    const signUpUrl = `https://${this.region}.appid.cloud.ibm.com/management/v4/${this.tenantId}/cloud_directory/sign_up`;
    
    try {
      const response = await fetch(signUpUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emails: [{ value: email, primary: true }],
          password,
          ...options?.data,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { data: null, error: { message: error.error || 'Sign up failed' } };
      }

      // Auto sign in after successful registration
      return this.signIn(email, password);
    } catch (error) {
      return { data: null, error: { message: 'Network error during sign up' } };
    }
  }

  async signOut(): Promise<QueryResult<null>> {
    sessionStorage.removeItem('ibm_access_token');
    sessionStorage.removeItem('ibm_id_token');
    sessionStorage.removeItem('ibm_refresh_token');
    return { data: null, error: null };
  }

  async getSession(): Promise<QueryResult<AuthSession>> {
    const accessToken = sessionStorage.getItem('ibm_access_token');
    const idToken = sessionStorage.getItem('ibm_id_token');
    const refreshToken = sessionStorage.getItem('ibm_refresh_token');

    if (!accessToken || !idToken) {
      return { data: null, error: null };
    }

    const user = this.decodeIdToken(idToken);

    return {
      data: {
        accessToken,
        refreshToken: refreshToken || undefined,
        user,
      },
      error: null,
    };
  }

  async getUser(): Promise<QueryResult<AuthUser>> {
    const session = await this.getSession();
    if (!session.data) {
      return { data: null, error: null };
    }
    return { data: session.data.user, error: null };
  }

  onAuthStateChange(callback: (event: string, session: AuthSession | null) => void) {
    // Poll for session changes or use IBM's SDK events
    const checkSession = async () => {
      const session = await this.getSession();
      callback(session.data ? 'SIGNED_IN' : 'SIGNED_OUT', session.data);
    };

    // Initial check
    checkSession();

    // Set up storage event listener for cross-tab sync
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'ibm_access_token') {
        checkSession();
      }
    };
    window.addEventListener('storage', handleStorage);

    return {
      unsubscribe: () => window.removeEventListener('storage', handleStorage),
    };
  }

  private decodeIdToken(idToken: string): AuthUser {
    try {
      const payload = JSON.parse(atob(idToken.split('.')[1]));
      return {
        id: payload.sub,
        email: payload.email,
        role: payload.role || 'user',
        metadata: payload,
      };
    } catch {
      return { id: '', email: undefined };
    }
  }
}

/**
 * IBM Cloud Object Storage Adapter
 * 
 * When you provision IBM COS:
 * 1. Create a bucket in IBM Cloud Object Storage
 * 2. Get your API key and service instance ID
 * 3. Install: npm install ibm-cos-sdk
 * 
 * Documentation: https://cloud.ibm.com/docs/cloud-object-storage
 */
class IBMCloudStorageAdapter implements StorageClient {
  private endpoint: string;
  private apiKey: string;
  private serviceInstanceId: string;

  constructor(config: { endpoint: string; apiKey: string; serviceInstanceId: string }) {
    this.endpoint = config.endpoint;
    this.apiKey = config.apiKey;
    this.serviceInstanceId = config.serviceInstanceId;
  }

  async upload(bucket: string, path: string, file: File | Blob): Promise<QueryResult<{ path: string }>> {
    // Use IBM COS SDK or direct S3-compatible API
    // For production, use the ibm-cos-sdk package
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      
      const response = await fetch(`${this.endpoint}/${bucket}/${path}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${await this.getIAMToken()}`,
          'Content-Type': file.type || 'application/octet-stream',
          'ibm-service-instance-id': this.serviceInstanceId,
        },
        body: arrayBuffer,
      });

      if (!response.ok) {
        return { data: null, error: { message: 'Upload failed' } };
      }

      return { data: { path }, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Network error during upload' } };
    }
  }

  async download(bucket: string, path: string): Promise<QueryResult<Blob>> {
    try {
      const response = await fetch(`${this.endpoint}/${bucket}/${path}`, {
        headers: {
          'Authorization': `Bearer ${await this.getIAMToken()}`,
          'ibm-service-instance-id': this.serviceInstanceId,
        },
      });

      if (!response.ok) {
        return { data: null, error: { message: 'Download failed' } };
      }

      const blob = await response.blob();
      return { data: blob, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Network error during download' } };
    }
  }

  getPublicUrl(bucket: string, path: string): string {
    return `${this.endpoint}/${bucket}/${path}`;
  }

  async remove(bucket: string, paths: string[]): Promise<QueryResult<null>> {
    try {
      for (const path of paths) {
        await fetch(`${this.endpoint}/${bucket}/${path}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${await this.getIAMToken()}`,
            'ibm-service-instance-id': this.serviceInstanceId,
          },
        });
      }
      return { data: null, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Delete failed' } };
    }
  }

  async list(bucket: string, path?: string): Promise<QueryResult<StorageFile[]>> {
    try {
      const prefix = path ? `?prefix=${encodeURIComponent(path)}` : '';
      const response = await fetch(`${this.endpoint}/${bucket}${prefix}`, {
        headers: {
          'Authorization': `Bearer ${await this.getIAMToken()}`,
          'ibm-service-instance-id': this.serviceInstanceId,
        },
      });

      if (!response.ok) {
        return { data: null, error: { message: 'List failed' } };
      }

      // Parse XML response (IBM COS uses S3-compatible XML)
      const text = await response.text();
      const files = this.parseS3ListResponse(text);
      return { data: files, error: null };
    } catch (error) {
      return { data: null, error: { message: 'Network error during list' } };
    }
  }

  private async getIAMToken(): Promise<string> {
    // Exchange API key for IAM token
    const response = await fetch('https://iam.cloud.ibm.com/identity/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
        apikey: this.apiKey,
      }),
    });

    const data = await response.json();
    return data.access_token;
  }

  private parseS3ListResponse(xml: string): StorageFile[] {
    // Simple XML parsing for S3 ListBucketResult
    const files: StorageFile[] = [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(xml, 'text/xml');
    const contents = doc.querySelectorAll('Contents');
    
    contents.forEach((content) => {
      files.push({
        name: content.querySelector('Key')?.textContent || '',
        size: parseInt(content.querySelector('Size')?.textContent || '0'),
        createdAt: content.querySelector('LastModified')?.textContent || undefined,
      });
    });
    
    return files;
  }
}

/**
 * IBM Cloud Databases for PostgreSQL Adapter
 * 
 * When you provision IBM Cloud Databases for PostgreSQL:
 * 1. Get your connection string from IBM Cloud console
 * 2. For direct database access, use a backend API (Code Engine)
 * 3. Frontend should call your IBM Code Engine APIs
 * 
 * Documentation: https://cloud.ibm.com/docs/databases-for-postgresql
 */
export class IBMDatabaseClient implements DatabaseClient {
  auth: AuthClient;
  storage: StorageClient;
  private apiEndpoint: string;

  constructor(config: {
    apiEndpoint: string; // Your IBM Code Engine API URL
    appId: { clientId: string; tenantId: string; region: string };
    storage: { endpoint: string; apiKey: string; serviceInstanceId: string };
  }) {
    this.apiEndpoint = config.apiEndpoint;
    this.auth = new IBMAppIdAuthAdapter(config.appId);
    this.storage = new IBMCloudStorageAdapter(config.storage);
  }

  private async getAuthHeader(): Promise<Record<string, string>> {
    const token = sessionStorage.getItem('ibm_access_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  async select<T>(table: string, options?: SelectOptions): Promise<QueryResult<T[]>> {
    try {
      const response = await fetch(`${this.apiEndpoint}/api/data/${table}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(await this.getAuthHeader()),
        },
        body: JSON.stringify({ action: 'select', options }),
      });

      const data = await response.json();
      return { data: data.data, error: data.error };
    } catch (error) {
      return { data: null, error: { message: 'Network error' } };
    }
  }

  async insert<T>(table: string, data: Partial<T> | Partial<T>[]): Promise<QueryResult<T>> {
    try {
      const response = await fetch(`${this.apiEndpoint}/api/data/${table}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(await this.getAuthHeader()),
        },
        body: JSON.stringify({ action: 'insert', data }),
      });

      const result = await response.json();
      return { data: result.data, error: result.error };
    } catch (error) {
      return { data: null, error: { message: 'Network error' } };
    }
  }

  async update<T>(table: string, data: Partial<T>, filters: FilterCondition[]): Promise<QueryResult<T>> {
    try {
      const response = await fetch(`${this.apiEndpoint}/api/data/${table}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(await this.getAuthHeader()),
        },
        body: JSON.stringify({ action: 'update', data, filters }),
      });

      const result = await response.json();
      return { data: result.data, error: result.error };
    } catch (error) {
      return { data: null, error: { message: 'Network error' } };
    }
  }

  async delete(table: string, filters: FilterCondition[]): Promise<QueryResult<null>> {
    try {
      const response = await fetch(`${this.apiEndpoint}/api/data/${table}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(await this.getAuthHeader()),
        },
        body: JSON.stringify({ action: 'delete', filters }),
      });

      const result = await response.json();
      return { data: null, error: result.error };
    } catch (error) {
      return { data: null, error: { message: 'Network error' } };
    }
  }

  async rpc<T>(functionName: string, params?: Record<string, unknown>): Promise<QueryResult<T>> {
    try {
      const response = await fetch(`${this.apiEndpoint}/api/rpc/${functionName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(await this.getAuthHeader()),
        },
        body: JSON.stringify(params),
      });

      const result = await response.json();
      return { data: result.data, error: result.error };
    } catch (error) {
      return { data: null, error: { message: 'Network error' } };
    }
  }
}
