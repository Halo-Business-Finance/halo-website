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
    frequency: isProduction ? 900000 : 300000, // 15 min in prod, 5 min in dev (reduced from 2 min/30s)
    behavioralCheckFrequency: isProduction ? 1800000 : 300000, // 30 min in prod, 5 min in dev (reduced from 5 min/1 min)
    devToolsCheckFrequency: isProduction ? 60000 : 10000, // 1 min in prod, 10s in dev (reduced frequency)
    enableConsoleMonitoring: false, // Disabled to reduce noise
    enableDOMMonitoring: isProduction ? false : true, // Only in development
    enableBehavioralAnalysis: isProduction ? false : true, // Reduced in production
  },
  logging: {
    maxEventRetention: isProduction ? 86400000 : 3600000, // 24h in prod, 1h in dev
    logSensitivity: 'minimal', // Always minimal to reduce event volume
    enableClientLogging: false, // Disabled to reduce noise
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