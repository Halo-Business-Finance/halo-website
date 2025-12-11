// Supabase adapter implementing the database abstraction layer
import { supabase } from '@/integrations/supabase/client';
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

class SupabaseAuthAdapter implements AuthClient {
  async signIn(email: string, password: string): Promise<QueryResult<AuthSession>> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      return { data: null, error: { message: error.message, code: error.name } };
    }
    
    return {
      data: {
        accessToken: data.session?.access_token || '',
        refreshToken: data.session?.refresh_token,
        expiresAt: data.session?.expires_at,
        user: {
          id: data.user?.id || '',
          email: data.user?.email,
          role: data.user?.role,
          metadata: data.user?.user_metadata,
        },
      },
      error: null,
    };
  }

  async signUp(email: string, password: string, options?: SignUpOptions): Promise<QueryResult<AuthSession>> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: options?.emailRedirectTo,
        data: options?.data,
      },
    });
    
    if (error) {
      return { data: null, error: { message: error.message, code: error.name } };
    }
    
    return {
      data: data.session ? {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at,
        user: {
          id: data.user?.id || '',
          email: data.user?.email,
          role: data.user?.role,
          metadata: data.user?.user_metadata,
        },
      } : null,
      error: null,
    };
  }

  async signOut(): Promise<QueryResult<null>> {
    const { error } = await supabase.auth.signOut();
    return { data: null, error: error ? { message: error.message } : null };
  }

  async getSession(): Promise<QueryResult<AuthSession>> {
    const { data, error } = await supabase.auth.getSession();
    
    if (error || !data.session) {
      return { data: null, error: error ? { message: error.message } : null };
    }
    
    return {
      data: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at,
        user: {
          id: data.session.user.id,
          email: data.session.user.email,
          role: data.session.user.role,
          metadata: data.session.user.user_metadata,
        },
      },
      error: null,
    };
  }

  async getUser(): Promise<QueryResult<AuthUser>> {
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) {
      return { data: null, error: error ? { message: error.message } : null };
    }
    
    return {
      data: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        metadata: data.user.user_metadata,
      },
      error: null,
    };
  }

  onAuthStateChange(callback: (event: string, session: AuthSession | null) => void) {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      callback(
        event,
        session ? {
          accessToken: session.access_token,
          refreshToken: session.refresh_token,
          expiresAt: session.expires_at,
          user: {
            id: session.user.id,
            email: session.user.email,
            role: session.user.role,
            metadata: session.user.user_metadata,
          },
        } : null
      );
    });
    
    return { unsubscribe: () => data.subscription.unsubscribe() };
  }
}

class SupabaseStorageAdapter implements StorageClient {
  async upload(bucket: string, path: string, file: File | Blob): Promise<QueryResult<{ path: string }>> {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file);
    
    if (error) {
      return { data: null, error: { message: error.message } };
    }
    
    return { data: { path: data.path }, error: null };
  }

  async download(bucket: string, path: string): Promise<QueryResult<Blob>> {
    const { data, error } = await supabase.storage.from(bucket).download(path);
    
    if (error) {
      return { data: null, error: { message: error.message } };
    }
    
    return { data, error: null };
  }

  getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  async remove(bucket: string, paths: string[]): Promise<QueryResult<null>> {
    const { error } = await supabase.storage.from(bucket).remove(paths);
    return { data: null, error: error ? { message: error.message } : null };
  }

  async list(bucket: string, path?: string): Promise<QueryResult<StorageFile[]>> {
    const { data, error } = await supabase.storage.from(bucket).list(path);
    
    if (error) {
      return { data: null, error: { message: error.message } };
    }
    
    return {
      data: data.map((f) => ({
        name: f.name,
        id: f.id,
        size: f.metadata?.size,
        createdAt: f.created_at,
        metadata: f.metadata,
      })),
      error: null,
    };
  }
}

// Apply filters to Supabase query builder
function applyFilters(query: any, filters: FilterCondition[]) {
  let q = query;
  
  for (const filter of filters) {
    switch (filter.operator) {
      case 'eq':
        q = q.eq(filter.column, filter.value);
        break;
      case 'neq':
        q = q.neq(filter.column, filter.value);
        break;
      case 'gt':
        q = q.gt(filter.column, filter.value);
        break;
      case 'gte':
        q = q.gte(filter.column, filter.value);
        break;
      case 'lt':
        q = q.lt(filter.column, filter.value);
        break;
      case 'lte':
        q = q.lte(filter.column, filter.value);
        break;
      case 'like':
        q = q.like(filter.column, filter.value as string);
        break;
      case 'ilike':
        q = q.ilike(filter.column, filter.value as string);
        break;
      case 'in':
        q = q.in(filter.column, filter.value as unknown[]);
        break;
      case 'is':
        q = q.is(filter.column, filter.value);
        break;
    }
  }
  
  return q;
}

export class SupabaseDatabaseClient implements DatabaseClient {
  auth: AuthClient;
  storage: StorageClient;

  constructor() {
    this.auth = new SupabaseAuthAdapter();
    this.storage = new SupabaseStorageAdapter();
  }

  async select<T>(table: string, options?: SelectOptions): Promise<QueryResult<T[]>> {
    // Use type assertion to allow dynamic table names in the abstraction layer
    let query = (supabase.from as any)(table).select(options?.columns || '*');
    
    if (options?.filters) {
      query = applyFilters(query, options.filters);
    }
    
    if (options?.orderBy) {
      for (const order of options.orderBy) {
        query = query.order(order.column, { ascending: order.ascending ?? true });
      }
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }
    
    if (options?.single) {
      const { data, error } = await query.single();
      return {
        data: data ? [data as T] : null,
        error: error ? { message: error.message, code: error.code } : null,
      };
    }
    
    const { data, error, count } = await query;
    
    return {
      data: data as T[] | null,
      error: error ? { message: error.message, code: error.code } : null,
      count: count ?? undefined,
    };
  }

  async insert<T>(table: string, data: Partial<T> | Partial<T>[]): Promise<QueryResult<T>> {
    const { data: result, error } = await (supabase.from as any)(table)
      .insert(data as any)
      .select()
      .single();
    
    return {
      data: result as T | null,
      error: error ? { message: error.message, code: error.code } : null,
    };
  }

  async update<T>(table: string, data: Partial<T>, filters: FilterCondition[]): Promise<QueryResult<T>> {
    let query = (supabase.from as any)(table).update(data as any);
    query = applyFilters(query, filters);
    
    const { data: result, error } = await query.select().single();
    
    return {
      data: result as T | null,
      error: error ? { message: error.message, code: error.code } : null,
    };
  }

  async delete(table: string, filters: FilterCondition[]): Promise<QueryResult<null>> {
    let query = (supabase.from as any)(table).delete();
    query = applyFilters(query, filters);
    
    const { error } = await query;
    
    return {
      data: null,
      error: error ? { message: error.message, code: error.code } : null,
    };
  }

  async rpc<T>(functionName: string, params?: Record<string, unknown>): Promise<QueryResult<T>> {
    const { data, error } = await supabase.rpc(functionName as any, params as any);
    
    return {
      data: data as T | null,
      error: error ? { message: error.message, code: error.code } : null,
    };
  }
}

export const supabaseClient = new SupabaseDatabaseClient();
