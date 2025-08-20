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
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      // Fetch security events from last 24 hours
      const { data: events, error } = await supabase
        .from('security_events')
        .select('*')
        .gte('created_at', twentyFourHoursAgo);

      if (error) {
        secureLogger.error('Failed to fetch security events:', error);
        throw error;
      }

      // Calculate metrics
      const newMetrics: SecurityMetrics = {
        encryptionKeysActive: 0, // This would need service role access
        criticalEvents24h: events?.filter(e => e.severity === 'critical').length || 0,
        failedLogins24h: events?.filter(e => 
          e.event_type.includes('login_failed') || 
          e.event_type.includes('auth_failed')
        ).length || 0,
        rateLimitViolations24h: events?.filter(e => 
          e.event_type.includes('rate_limit') || 
          e.event_type.includes('blocked')
        ).length || 0,
        suspiciousActivity24h: events?.filter(e => 
          e.event_type.includes('suspicious') || 
          e.event_type.includes('anomaly')
        ).length || 0
      };

      setMetrics(newMetrics);

      // Calculate security health score and issues
      let score = 100;
      const issues: string[] = [];

      // Critical events impact
      if (newMetrics.criticalEvents24h > 5) {
        score -= 30;
        issues.push(`High number of critical security events (${newMetrics.criticalEvents24h})`);
      } else if (newMetrics.criticalEvents24h > 2) {
        score -= 15;
        issues.push(`Elevated critical security events (${newMetrics.criticalEvents24h})`);
      }

      // Failed logins impact
      if (newMetrics.failedLogins24h > 20) {
        score -= 20;
        issues.push(`High number of failed login attempts (${newMetrics.failedLogins24h})`);
      } else if (newMetrics.failedLogins24h > 10) {
        score -= 10;
        issues.push(`Elevated failed login attempts (${newMetrics.failedLogins24h})`);
      }

      // Rate limit violations impact
      if (newMetrics.rateLimitViolations24h > 50) {
        score -= 15;
        issues.push(`High rate limit violations (${newMetrics.rateLimitViolations24h})`);
      } else if (newMetrics.rateLimitViolations24h > 25) {
        score -= 8;
        issues.push(`Elevated rate limit violations (${newMetrics.rateLimitViolations24h})`);
      }

      // Suspicious activity impact
      if (newMetrics.suspiciousActivity24h > 10) {
        score -= 25;
        issues.push(`High suspicious activity detected (${newMetrics.suspiciousActivity24h})`);
      } else if (newMetrics.suspiciousActivity24h > 5) {
        score -= 12;
        issues.push(`Elevated suspicious activity (${newMetrics.suspiciousActivity24h})`);
      }

      // Determine overall status
      let status: 'healthy' | 'warning' | 'critical';
      if (score >= 80) {
        status = 'healthy';
      } else if (score >= 60) {
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

      // Log security health check
      secureLogger.info('Security health check completed', {
        status,
        score,
        issueCount: issues.length,
        metrics: newMetrics
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

  // Automatic health checks every 5 minutes
  useEffect(() => {
    checkSecurityHealth();
    const interval = setInterval(checkSecurityHealth, 15 * 60 * 1000); // Reduced frequency
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