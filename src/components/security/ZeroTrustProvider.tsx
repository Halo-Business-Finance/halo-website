import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { secureLogger } from '@/utils/secureLogger';

interface ZeroTrustContextType {
  trustScore: number;
  isVerified: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastVerification: Date | null;
  continuousVerify: () => Promise<boolean>;
  elevateAccess: (requiredLevel: 'normal' | 'elevated' | 'critical') => Promise<boolean>;
  deviceFingerprint: string;
  sessionValid: boolean;
}

const ZeroTrustContext = createContext<ZeroTrustContextType | undefined>(undefined);

interface ZeroTrustProviderProps {
  children: ReactNode;
}

export const ZeroTrustProvider: React.FC<ZeroTrustProviderProps> = ({ children }) => {
  const { user, session } = useAuth();
  const [trustScore, setTrustScore] = useState<number>(0);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [riskLevel, setRiskLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [lastVerification, setLastVerification] = useState<Date | null>(null);
  const [deviceFingerprint, setDeviceFingerprint] = useState<string>('');
  const [sessionValid, setSessionValid] = useState<boolean>(false);

  // Generate device fingerprint for zero-trust identification
  const generateDeviceFingerprint = (): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Zero Trust Security Check', 2, 2);
    }
    
    const fingerprint = btoa(JSON.stringify({
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: `${screen.width}x${screen.height}`,
      canvas: canvas.toDataURL(),
      timestamp: Date.now()
    }));
    
    return fingerprint.substring(0, 32);
  };

  // Continuous verification - core of zero trust
  const continuousVerify = async (): Promise<boolean> => {
    if (!user || !session) {
      setTrustScore(0);
      setIsVerified(false);
      setRiskLevel('critical');
      return false;
    }

    try {
      // Multi-factor verification check
      const verificationData = {
        userId: user.id,
        sessionToken: session.access_token,
        deviceFingerprint,
        timestamp: Date.now(),
        ipAddress: await getCurrentIP(),
        behavioralMetrics: await collectBehavioralMetrics()
      };

      const { data: verificationResult, error } = await supabase.functions.invoke(
        'zero-trust-verification',
        { body: verificationData }
      );

      if (error) throw error;

      const newTrustScore = verificationResult.trustScore || 0;
      const newRiskLevel = calculateRiskLevel(newTrustScore, verificationResult.anomalies);
      
      setTrustScore(newTrustScore);
      setIsVerified(newTrustScore >= 70);
      setRiskLevel(newRiskLevel);
      setLastVerification(new Date());
      setSessionValid(verificationResult.sessionValid);

      // Log verification result
      secureLogger.securityEvent('zero_trust_verification', {
        trustScore: newTrustScore,
        riskLevel: newRiskLevel,
        verified: newTrustScore >= 70,
        anomalies: verificationResult.anomalies || [],
        deviceFingerprint
      });

      return newTrustScore >= 70;
    } catch (error) {
      secureLogger.error('Zero trust verification failed:', error);
      setTrustScore(0);
      setIsVerified(false);
      setRiskLevel('critical');
      return false;
    }
  };

  // Risk-based access elevation
  const elevateAccess = async (requiredLevel: 'normal' | 'elevated' | 'critical'): Promise<boolean> => {
    const currentScore = trustScore;
    const minimumScores = {
      normal: 70,
      elevated: 85,
      critical: 95
    };

    if (currentScore >= minimumScores[requiredLevel]) {
      return true;
    }

    // Require additional verification for elevated access
    try {
      const { data: elevationResult, error } = await supabase.functions.invoke(
        'access-elevation',
        {
          body: {
            currentTrustScore: currentScore,
            requiredLevel,
            deviceFingerprint,
            timestamp: Date.now()
          }
        }
      );

      if (error) throw error;

      if (elevationResult.success) {
        setTrustScore(elevationResult.newTrustScore);
        setLastVerification(new Date());
        
        secureLogger.securityEvent('access_elevation_granted', {
          requiredLevel,
          newTrustScore: elevationResult.newTrustScore,
          method: elevationResult.method
        });
        
        return true;
      }

      return false;
    } catch (error) {
      secureLogger.error('Access elevation failed:', error);
      return false;
    }
  };

  // Get current IP for geolocation verification
  const getCurrentIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

  // Collect behavioral metrics for anomaly detection
  const collectBehavioralMetrics = async () => {
    const metrics = {
      mouseMovements: (window as any).mouseMovements || 0,
      keystrokes: (window as any).keystrokes || 0,
      scrollPatterns: (window as any).scrollPatterns || 0,
      sessionDuration: Date.now() - (session?.user?.created_at ? new Date(session.user.created_at).getTime() : Date.now()),
      pageViews: (window as any).pageViews || 1,
      clickPatterns: (window as any).clickPatterns || 0
    };

    // Store metrics globally for continuous monitoring
    (window as any).behavioralMetrics = metrics;
    
    return metrics;
  };

  // Calculate risk level based on trust score and anomalies
  const calculateRiskLevel = (score: number, anomalies: string[] = []): 'low' | 'medium' | 'high' | 'critical' => {
    if (score >= 90 && anomalies.length === 0) return 'low';
    if (score >= 75 && anomalies.length <= 1) return 'medium';
    if (score >= 50 && anomalies.length <= 3) return 'high';
    return 'critical';
  };

  // Initialize device fingerprint and start continuous verification
  useEffect(() => {
    const fingerprint = generateDeviceFingerprint();
    setDeviceFingerprint(fingerprint);
    
    // Set up behavioral tracking
    let mouseMovements = 0;
    let keystrokes = 0;
    let scrollPatterns = 0;
    let clickPatterns = 0;
    let pageViews = 1;

    const trackMouse = () => mouseMovements++;
    const trackKeys = () => keystrokes++;
    const trackScroll = () => scrollPatterns++;
    const trackClick = () => clickPatterns++;

    document.addEventListener('mousemove', trackMouse);
    document.addEventListener('keydown', trackKeys);
    document.addEventListener('scroll', trackScroll);
    document.addEventListener('click', trackClick);

    (window as any).mouseMovements = mouseMovements;
    (window as any).keystrokes = keystrokes;
    (window as any).scrollPatterns = scrollPatterns;
    (window as any).clickPatterns = clickPatterns;
    (window as any).pageViews = pageViews;

    return () => {
      document.removeEventListener('mousemove', trackMouse);
      document.removeEventListener('keydown', trackKeys);
      document.removeEventListener('scroll', trackScroll);
      document.removeEventListener('click', trackClick);
    };
  }, []);

  // Continuous verification every 30 seconds (only if user exists)
  useEffect(() => {
    if (!user || !session) {
      // Reset all values if no user/session
      setTrustScore(0);
      setIsVerified(false);
      setRiskLevel('critical');
      setSessionValid(false);
      return;
    }

    continuousVerify();
    const interval = setInterval(continuousVerify, 30000);
    return () => clearInterval(interval);
  }, [user, session, deviceFingerprint]);

  // Session validation every 5 minutes (only if user exists)
  useEffect(() => {
    if (!user || !session) {
      setSessionValid(false);
      return;
    }

    const validateSession = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('validate-session', {
          body: { deviceFingerprint, timestamp: Date.now() }
        });
        
        if (error || !data?.valid) {
          setSessionValid(false);
          setTrustScore(0);
          setIsVerified(false);
          setRiskLevel('critical');
        }
      } catch (error) {
        secureLogger.error('Session validation failed:', error);
        setSessionValid(false);
      }
    };

    const interval = setInterval(validateSession, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user, session, deviceFingerprint]);

  const contextValue: ZeroTrustContextType = {
    trustScore,
    isVerified,
    riskLevel,
    lastVerification,
    continuousVerify,
    elevateAccess,
    deviceFingerprint,
    sessionValid
  };

  return (
    <ZeroTrustContext.Provider value={contextValue}>
      {children}
    </ZeroTrustContext.Provider>
  );
};

export const useZeroTrust = (): ZeroTrustContextType => {
  const context = useContext(ZeroTrustContext);
  if (!context) {
    throw new Error('useZeroTrust must be used within a ZeroTrustProvider');
  }
  return context;
};