/**
 * Centralized Security Environment Configuration
 * Provides secure access to environment variables with validation
 */

interface SecurityEnvironmentConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseProjectId: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

class SecurityEnvironment {
  private static instance: SecurityEnvironment;
  private config: SecurityEnvironmentConfig;

  private constructor() {
    this.config = this.validateAndLoadConfig();
  }

  public static getInstance(): SecurityEnvironment {
    if (!SecurityEnvironment.instance) {
      SecurityEnvironment.instance = new SecurityEnvironment();
    }
    return SecurityEnvironment.instance;
  }

  private validateAndLoadConfig(): SecurityEnvironmentConfig {
    // Prefer env vars if available, otherwise fall back to known project config
    const env = (import.meta as any)?.env || {};
    const supabaseUrl = env.VITE_SUPABASE_URL || 'https://zwqtewpycdbvjgkntejd.supabase.co';
    const supabaseAnonKey = env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3cXRld3B5Y2Ridmpna250ZWpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1MjIxNjgsImV4cCI6MjA2OTA5ODE2OH0.vb1LXUj3SVKEMMU5f6vV98381h-2wmsDOyMa6wqqWMs';
    const supabaseProjectId = env.VITE_SUPABASE_PROJECT_ID || 'zwqtewpycdbvjgkntejd';

    // Validate URL format (fallback-safe)
    try {
      new URL(supabaseUrl);
    } catch {
      throw new Error('Supabase URL must be a valid URL');
    }

    // Basic anon key structure check (JWT-like, but don't hard fail in preview)
    if (!(typeof supabaseAnonKey === 'string') || supabaseAnonKey.split('.').length < 2) {
      console.warn('Supabase anon key format appears unusual; proceeding with provided value.');
    }

    return {
      supabaseUrl,
      supabaseAnonKey,
      supabaseProjectId,
      isDevelopment: !!env.DEV,
      isProduction: !!env.PROD,
    };
  }

  // Secure getters
  public getSupabaseUrl(): string {
    return this.config.supabaseUrl;
  }

  public getSupabaseAnonKey(): string {
    return this.config.supabaseAnonKey;
  }

  public getSupabaseProjectId(): string {
    return this.config.supabaseProjectId;
  }

  public isDevelopment(): boolean {
    return this.config.isDevelopment;
  }

  public isProduction(): boolean {
    return this.config.isProduction;
  }

  // Security validation methods
  public validateSecurityRequirements(): boolean {
    // In production, ensure HTTPS
    if (this.isProduction() && !this.config.supabaseUrl.startsWith('https://')) {
      throw new Error('HTTPS is required in production');
    }

    // Validate that we're not using development keys in production
    if (this.isProduction() && this.config.supabaseUrl.includes('localhost')) {
      throw new Error('Cannot use localhost URLs in production');
    }

    return true;
  }

  // Get full edge function URL with proper validation
  public getEdgeFunctionUrl(functionName: string): string {
    this.validateSecurityRequirements();
    return `${this.config.supabaseUrl}/functions/v1/${functionName}`;
  }
}

// Export singleton instance
export const securityEnvironment = SecurityEnvironment.getInstance();

// Validate on module load
securityEnvironment.validateSecurityRequirements();