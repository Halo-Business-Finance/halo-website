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
    blockNoiseEvents: boolean;
    samplingRate: number; // Keep 1 in N events (10 = keep 10% of logs)
    enableLogAggregation: boolean;
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
    frequency: isProduction ? 7200000 : 3600000, // 2 hours in prod, 1 hour in dev (further reduced)
    behavioralCheckFrequency: isProduction ? 14400000 : 7200000, // 4 hours in prod, 2 hours in dev (further reduced)
    devToolsCheckFrequency: isProduction ? 1800000 : 300000, // 30 min in prod, 5 min in dev (reduced)
    enableConsoleMonitoring: false, // Disabled to reduce noise
    enableDOMMonitoring: false, // Completely disabled - major noise source
    enableBehavioralAnalysis: false, // Completely disabled in all environments
  },
  logging: {
    maxEventRetention: isProduction ? 7200000 : 3600000, // 2h in prod, 1h in dev (further reduced)
    logSensitivity: 'minimal', // Always minimal to reduce event volume
    enableClientLogging: false, // Disabled to reduce noise
    blockNoiseEvents: true, // Block client_log and similar noise events
    samplingRate: isProduction ? 10 : 5, // Keep 1 in 10 (prod) or 1 in 5 (dev) low-priority events
    enableLogAggregation: true, // Group similar events to reduce database writes
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