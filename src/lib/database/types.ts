// Database abstraction types for multi-cloud support (Supabase → IBM Cloud)

export interface DatabaseConfig {
  provider: 'supabase' | 'ibm';
  connectionString?: string;
  credentials?: {
    apiKey?: string;
    instanceId?: string;
    region?: string;
  };
}

export interface QueryResult<T = unknown> {
  data: T | null;
  error: DatabaseError | null;
  count?: number;
}

export interface DatabaseError {
  message: string;
  code?: string;
  details?: string;
}

export interface DatabaseClient {
  // Core CRUD operations
  select<T>(table: string, options?: SelectOptions): Promise<QueryResult<T[]>>;
  insert<T>(table: string, data: Partial<T> | Partial<T>[]): Promise<QueryResult<T>>;
  update<T>(table: string, data: Partial<T>, filters: FilterCondition[]): Promise<QueryResult<T>>;
  delete(table: string, filters: FilterCondition[]): Promise<QueryResult<null>>;
  
  // Advanced queries
  rpc<T>(functionName: string, params?: Record<string, unknown>): Promise<QueryResult<T>>;
  
  // Auth operations (for IBM App ID integration)
  auth: AuthClient;
  
  // Storage operations (for IBM Cloud Object Storage)
  storage: StorageClient;
}

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

export interface AuthClient {
  signIn(email: string, password: string): Promise<QueryResult<AuthSession>>;
  signUp(email: string, password: string, options?: SignUpOptions): Promise<QueryResult<AuthSession>>;
  signOut(): Promise<QueryResult<null>>;
  getSession(): Promise<QueryResult<AuthSession>>;
  getUser(): Promise<QueryResult<AuthUser>>;
  onAuthStateChange(callback: (event: string, session: AuthSession | null) => void): { unsubscribe: () => void };
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  email?: string;
  role?: string;
  metadata?: Record<string, unknown>;
}

export interface SignUpOptions {
  emailRedirectTo?: string;
  data?: Record<string, unknown>;
}

export interface StorageClient {
  upload(bucket: string, path: string, file: File | Blob): Promise<QueryResult<{ path: string }>>;
  download(bucket: string, path: string): Promise<QueryResult<Blob>>;
  getPublicUrl(bucket: string, path: string): string;
  remove(bucket: string, paths: string[]): Promise<QueryResult<null>>;
  list(bucket: string, path?: string): Promise<QueryResult<StorageFile[]>>;
}

export interface StorageFile {
  name: string;
  id?: string;
  size?: number;
  createdAt?: string;
  metadata?: Record<string, unknown>;
}
