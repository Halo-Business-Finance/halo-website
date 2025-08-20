/**
 * Security Configuration - Environment-based security settings
 */

export interface SecurityConfig {
  monitoring: {
    frequency: number;
    behavioralCheckFrequency: number;
    devToolsCheckFrequency: number;
    enableConsoleMonitoring: boolean;
    enableDOMMonitoring: boolean;
    enableBehavioralAnalysis: boolean;
  };
  logging: {
    maxEventRetention: number; // milliseconds
    logSensitivity: 'minimal' | 'standard' | 'verbose';
    enableClientLogging: boolean;
  };
  rateLimit: {
    maxAttempts: number;
    windowMs: number;
    blockDuration: number;
  };
  threatResponse: {
    autoBlock: boolean;
    requireReauth: boolean;
    notifyAdmin: boolean;
  };
}

export const getSecurityConfig = (): SecurityConfig => {
  const isProduction = import.meta.env.PROD;
  
  return {
    monitoring: {
      frequency: isProduction ? 120000 : 30000, // 2 min in prod, 30s in dev
      behavioralCheckFrequency: isProduction ? 300000 : 60000, // 5 min in prod, 1 min in dev
      devToolsCheckFrequency: isProduction ? 10000 : 2000, // 10s in prod, 2s in dev
      enableConsoleMonitoring: !isProduction, // Only in development
      enableDOMMonitoring: true,
      enableBehavioralAnalysis: true,
    },
    logging: {
      maxEventRetention: isProduction ? 86400000 : 3600000, // 24h in prod, 1h in dev
      logSensitivity: isProduction ? 'minimal' : 'verbose',
      enableClientLogging: !isProduction,
    },
    rateLimit: {
      maxAttempts: isProduction ? 3 : 10,
      windowMs: isProduction ? 900000 : 300000, // 15 min in prod, 5 min in dev
      blockDuration: isProduction ? 3600000 : 300000, // 1h in prod, 5 min in dev
    },
    threatResponse: {
      autoBlock: isProduction,
      requireReauth: isProduction,
      notifyAdmin: isProduction,
    },
  };
};

export const securityConfig = getSecurityConfig();