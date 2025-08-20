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
    // Get environment variables
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    const supabaseProjectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;

    // Validate required environment variables
    if (!supabaseUrl) {
      throw new Error('VITE_SUPABASE_URL is required');
    }
    if (!supabaseAnonKey) {
      throw new Error('VITE_SUPABASE_PUBLISHABLE_KEY is required');
    }
    if (!supabaseProjectId) {
      throw new Error('VITE_SUPABASE_PROJECT_ID is required');
    }

    // Validate URL format
    try {
      new URL(supabaseUrl);
    } catch {
      throw new Error('VITE_SUPABASE_URL must be a valid URL');
    }

    // Validate project ID format (basic check)
    if (!/^[a-zA-Z0-9]{20}$/.test(supabaseProjectId)) {
      console.warn('VITE_SUPABASE_PROJECT_ID format appears invalid');
    }

    // Validate anon key format (basic JWT structure check)
    if (!supabaseAnonKey.includes('.') || supabaseAnonKey.split('.').length !== 3) {
      throw new Error('VITE_SUPABASE_PUBLISHABLE_KEY appears to be invalid');
    }

    return {
      supabaseUrl,
      supabaseAnonKey,
      supabaseProjectId,
      isDevelopment: import.meta.env.DEV,
      isProduction: import.meta.env.PROD,
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