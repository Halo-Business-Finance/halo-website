import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { secureLogger } from '@/utils/secureLogger';

interface SecurityHealth {
  status: 'healthy' | 'warning' | 'critical';
  score: number;
  issues: string[];
  lastChecked: Date;
}

interface SecurityMetrics {
  encryptionKeysActive: number;
  criticalEvents24h: number;
  failedLogins24h: number;
  rateLimitViolations24h: number;
  suspiciousActivity24h: number;
}

export const useSecurityMonitor = () => {
  const [health, setHealth] = useState<SecurityHealth>({
    status: 'healthy',
    score: 100,
    issues: [],
    lastChecked: new Date()
  });
  const [metrics, setMetrics] = useState<SecurityMetrics>({
    encryptionKeysActive: 0,
    criticalEvents24h: 0,
    failedLogins24h: 0,
    rateLimitViolations24h: 0,
    suspiciousActivity24h: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const checkSecurityHealth = useCallback(async () => {
    setIsLoading(true);
    try {
      // Run intelligent cleanup first to reduce noise and prevent log flooding
      const cleanupResult = await supabase.rpc('intelligent_security_event_cleanup');
      
      // Log cleanup results for monitoring
      if (cleanupResult && typeof cleanupResult === 'number' && cleanupResult > 0) {
        secureLogger.info(`Security log cleanup removed ${cleanupResult} flood events`);
      }
      
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      // Fetch security events from last 24 hours (after cleanup)
      const { data: events, error } = await supabase
        .from('security_events')
        .select('*')
        .gte('created_at', twentyFourHoursAgo);

      if (error) {
        secureLogger.error('Failed to fetch security events:', error);
        throw error;
      }

      // Filter out excessive client_log events from metrics
      const meaningfulEvents = events?.filter(e => 
        e.event_type !== 'client_log' || e.severity === 'critical'
      ) || [];

      // Calculate enhanced metrics with intelligent filtering
      const newMetrics: SecurityMetrics = {
        encryptionKeysActive: 1, // This would need service role access
        criticalEvents24h: meaningfulEvents.filter(e => e.severity === 'critical').length,
        failedLogins24h: meaningfulEvents.filter(e => 
          e.event_type.includes('login_failed') || 
          e.event_type.includes('auth_failed') ||
          e.event_type.includes('authentication_failed')
        ).length,
        rateLimitViolations24h: meaningfulEvents.filter(e => 
          e.event_type.includes('rate_limit') || 
          e.event_type.includes('blocked') ||
          e.event_type.includes('throttled')
        ).length,
        suspiciousActivity24h: meaningfulEvents.filter(e => 
          e.event_type.includes('suspicious') || 
          e.event_type.includes('anomaly') ||
          e.event_type.includes('threat') ||
          e.event_type.includes('intrusion')
        ).length
      };

      setMetrics(newMetrics);

      // Enhanced security health score calculation
      let score = 100;
      const issues: string[] = [];

      // Critical events impact (stricter thresholds)
      if (newMetrics.criticalEvents24h > 3) {
        score -= 40;
        issues.push(`CRITICAL: ${newMetrics.criticalEvents24h} critical security events require immediate attention`);
      } else if (newMetrics.criticalEvents24h > 1) {
        score -= 20;
        issues.push(`WARNING: ${newMetrics.criticalEvents24h} critical security events detected`);
      } else if (newMetrics.criticalEvents24h === 1) {
        score -= 10;
        issues.push(`NOTICE: 1 critical security event detected`);
      }

      // Failed logins impact (adjusted thresholds)
      if (newMetrics.failedLogins24h > 10) {
        score -= 25;
        issues.push(`High number of failed authentication attempts (${newMetrics.failedLogins24h})`);
      } else if (newMetrics.failedLogins24h > 5) {
        score -= 10;
        issues.push(`Elevated failed authentication attempts (${newMetrics.failedLogins24h})`);
      }

      // Rate limit violations impact (adjusted for better filtering)
      if (newMetrics.rateLimitViolations24h > 20) {
        score -= 15;
        issues.push(`High rate limit violations (${newMetrics.rateLimitViolations24h})`);
      } else if (newMetrics.rateLimitViolations24h > 10) {
        score -= 8;
        issues.push(`Elevated rate limit violations (${newMetrics.rateLimitViolations24h})`);
      }

      // Suspicious activity impact (more granular)
      if (newMetrics.suspiciousActivity24h > 5) {
        score -= 30;
        issues.push(`High suspicious activity detected (${newMetrics.suspiciousActivity24h})`);
      } else if (newMetrics.suspiciousActivity24h > 2) {
        score -= 15;
        issues.push(`Elevated suspicious activity (${newMetrics.suspiciousActivity24h})`);
      } else if (newMetrics.suspiciousActivity24h > 0) {
        score -= 5;
        issues.push(`${newMetrics.suspiciousActivity24h} suspicious activity incidents`);
      }

      // Bonus points for good security posture
      if (issues.length === 0) {
        issues.push('All security systems operating normally');
        score = Math.min(100, score + 5);
      }

      // Determine overall status with adjusted thresholds
      let status: 'healthy' | 'warning' | 'critical';
      if (score >= 85) {
        status = 'healthy';
      } else if (score >= 65) {
        status = 'warning';
      } else {
        status = 'critical';
      }

      setHealth({
        status,
        score: Math.max(0, score),
        issues,
        lastChecked: new Date()
      });

      // Log security health check with enhanced data
      secureLogger.info('Enhanced security health check completed', {
        status,
        score,
        issueCount: issues.length,
        metrics: newMetrics,
        totalEventsBeforeFilter: events?.length || 0,
        meaningfulEventsAfterFilter: meaningfulEvents.length
      });

    } catch (error) {
      secureLogger.error('Security health check failed:', error);
      setHealth(prev => ({
        ...prev,
        status: 'critical',
        issues: [...prev.issues, 'Security monitoring system error'],
        lastChecked: new Date()
      }));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const forceSecurityAudit = useCallback(async () => {
    secureLogger.securityEvent('manual_security_audit_initiated', {
      timestamp: new Date().toISOString(),
      triggerType: 'manual'
    });
    
    await checkSecurityHealth();
    
    // Trigger additional security checks
    try {
      await supabase.functions.invoke('enhanced-security-analysis', {
        body: {
          auditType: 'comprehensive',
          triggerSource: 'user_initiated',
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      secureLogger.error('Failed to trigger enhanced security analysis:', error);
    }
  }, [checkSecurityHealth]);

  // Automatic health checks every 10 minutes (optimized frequency)
  useEffect(() => {
    checkSecurityHealth();
    const interval = setInterval(checkSecurityHealth, 10 * 60 * 1000); // Optimized frequency
    return () => clearInterval(interval);
  }, [checkSecurityHealth]);

  return {
    health,
    metrics,
    isLoading,
    checkSecurityHealth,
    forceSecurityAudit
  };
};