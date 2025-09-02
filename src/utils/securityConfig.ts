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
    frequency: isProduction ? 3600000 : 900000, // 1 hour in prod, 15 min in dev (drastically reduced)
    behavioralCheckFrequency: isProduction ? 7200000 : 1800000, // 2 hours in prod, 30 min in dev (drastically reduced)
    devToolsCheckFrequency: isProduction ? 300000 : 60000, // 5 min in prod, 1 min in dev (drastically reduced)
    enableConsoleMonitoring: false, // Disabled to reduce noise
    enableDOMMonitoring: false, // Completely disabled - major noise source
    enableBehavioralAnalysis: false, // Completely disabled in all environments
  },
  logging: {
    maxEventRetention: isProduction ? 3600000 : 1800000, // 1h in prod, 30min in dev (drastically reduced)
    logSensitivity: 'minimal', // Always minimal to reduce event volume
    enableClientLogging: false, // Disabled to reduce noise
    blockNoiseEvents: true, // Block client_log and similar noise events
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