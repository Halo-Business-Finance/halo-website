import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield, TrendingUp } from 'lucide-react';

interface SecurityThreat {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  actionRequired?: string;
}

interface BehavioralMetrics {
  typingPattern: number[];
  mouseMovements: number;
  clickFrequency: number;
  sessionDuration: number;
}

export const EnhancedSecurityMonitor: React.FC = () => {
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [behavioralScore, setBehavioralScore] = useState(50);
  const [isMonitoring, setIsMonitoring] = useState(true);
  
  const behavioralMetrics = useRef<BehavioralMetrics>({
    typingPattern: [],
    mouseMovements: 0,
    clickFrequency: 0,
    sessionDuration: 0
  });
  
  const sessionStartTime = useRef(Date.now());
  const lastKeystrokes = useRef<number[]>([]);

  useEffect(() => {
    if (!isMonitoring) return;

    const monitoringInterval = setInterval(async () => {
      await performAdvancedSecurityCheck();
    }, 30000); // Check every 30 seconds

    // Enhanced behavioral tracking
    const trackBehavior = () => {
      // Track typing patterns
      const handleKeyDown = (e: KeyboardEvent) => {
        const now = Date.now();
        lastKeystrokes.current.push(now);
        
        // Keep only last 10 keystrokes
        if (lastKeystrokes.current.length > 10) {
          lastKeystrokes.current.shift();
        }
        
        // Calculate typing rhythm
        if (lastKeystrokes.current.length >= 3) {
          const intervals = [];
          for (let i = 1; i < lastKeystrokes.current.length; i++) {
            intervals.push(lastKeystrokes.current[i] - lastKeystrokes.current[i-1]);
          }
          behavioralMetrics.current.typingPattern = intervals;
        }
      };

      // Track mouse behavior
      const handleMouseMove = () => {
        behavioralMetrics.current.mouseMovements++;
      };

      const handleClick = () => {
        behavioralMetrics.current.clickFrequency++;
      };

      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('click', handleClick);

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('click', handleClick);
      };
    };

    const behavioralCleanup = trackBehavior();

    // Calculate behavioral score periodically
    const behavioralInterval = setInterval(() => {
      calculateBehavioralScore();
    }, 60000); // Update every minute

    return () => {
      clearInterval(monitoringInterval);
      clearInterval(behavioralInterval);
      behavioralCleanup();
    };
  }, [isMonitoring]);

  const calculateBehavioralScore = () => {
    const metrics = behavioralMetrics.current;
    const sessionDuration = Date.now() - sessionStartTime.current;
    
    let score = 50; // Base score
    
    // Typing pattern analysis
    if (metrics.typingPattern.length > 0) {
      const avgInterval = metrics.typingPattern.reduce((a, b) => a + b, 0) / metrics.typingPattern.length;
      const variance = metrics.typingPattern.reduce((acc, val) => acc + Math.pow(val - avgInterval, 2), 0) / metrics.typingPattern.length;
      
      // Consistent typing patterns indicate legitimate user
      if (variance < 10000) score += 15; // Very consistent
      else if (variance < 50000) score += 10; // Moderately consistent
      else score -= 10; // Erratic typing
    }
    
    // Mouse activity analysis
    const expectedMouseMovements = sessionDuration / 1000; // Rough estimate
    const mouseScore = Math.min(15, (metrics.mouseMovements / expectedMouseMovements) * 15);
    score += mouseScore;
    
    // Session duration bonus
    if (sessionDuration > 300000) score += 10; // 5+ minutes
    if (sessionDuration > 900000) score += 5;  // 15+ minutes
    
    // Normalize score
    score = Math.max(0, Math.min(100, score));
    setBehavioralScore(score);
  };

  const performAdvancedSecurityCheck = async () => {
    try {
      const clientFingerprint = await generateEnhancedFingerprint();
      const currentIP = await getCurrentIP();
      
      // Get current session info (placeholder - would need actual session management)
      const sessionData = localStorage.getItem('secure_session');
      if (!sessionData) return;
      
      const session = JSON.parse(sessionData);
      
      // Calculate typing pattern deviation
      const typingDeviation = calculateTypingDeviation();
      
      const behavioralData = {
        typing_pattern_deviation: typingDeviation,
        behavioral_score: behavioralScore,
        session_duration: Date.now() - sessionStartTime.current,
        mouse_activity: behavioralMetrics.current.mouseMovements
      };

      // Call enhanced anomaly detection
      const { data, error } = await supabase.rpc('detect_advanced_session_anomaly', {
        session_id: session.sessionId,
        new_ip: currentIP,
        new_user_agent: navigator.userAgent,
        new_fingerprint: clientFingerprint,
        behavioral_data: behavioralData
      });

      if (error) throw error;

      const anomalyData = data as any;
      if (anomalyData?.anomaly_detected) {
        const threat: SecurityThreat = {
          id: crypto.randomUUID(),
          type: 'session_anomaly',
          severity: anomalyData.risk_level,
          message: `Session anomaly detected (Score: ${anomalyData.score})`,
          timestamp: new Date(),
          actionRequired: anomalyData.action_required
        };

        setThreats(prev => [threat, ...prev.slice(0, 9)]); // Keep last 10 threats

        if (anomalyData.risk_level === 'critical') {
          toast.error('Critical security threat detected! Please re-authenticate.');
          handleCriticalThreat();
        } else if (anomalyData.risk_level === 'high') {
          toast.warning('High security alert detected. Session under review.');
        }
      }
    } catch (error) {
      // Fail silently in production, log in development
      if (import.meta.env.DEV) {
        console.error('Advanced security check failed:', error);
      }
    }
  };

  const calculateTypingDeviation = (): number => {
    const pattern = behavioralMetrics.current.typingPattern;
    if (pattern.length < 3) return 0;
    
    // Simple deviation calculation
    const avg = pattern.reduce((a, b) => a + b, 0) / pattern.length;
    const variance = pattern.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / pattern.length;
    
    // Normalize to 0-1 scale
    return Math.min(1, variance / 100000);
  };

  const generateEnhancedFingerprint = async (): Promise<string> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Enhanced security fingerprint', 2, 2);
    }
    
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvas: canvas.toDataURL(),
      webgl: getWebGLFingerprint(),
      audio: await getAudioFingerprint(),
      fonts: await getFontFingerprint()
    };
    
    return btoa(JSON.stringify(fingerprint)).substring(0, 32);
  };

  const getWebGLFingerprint = (): string => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
      if (!gl) return 'no-webgl';
      
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      return debugInfo ? 
        `${gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL)}-${gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)}` :
        'webgl-basic';
    } catch {
      return 'webgl-error';
    }
  };

  const getAudioFingerprint = async (): Promise<string> => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const analyser = audioContext.createAnalyser();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(analyser);
      analyser.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      gainNode.gain.value = 0; // Silent
      oscillator.start();
      
      const buffer = new Float32Array(analyser.frequencyBinCount);
      analyser.getFloatFrequencyData(buffer);
      
      oscillator.stop();
      audioContext.close();
      
      return Array.from(buffer.slice(0, 10)).join(',');
    } catch {
      return 'audio-unavailable';
    }
  };

  const getFontFingerprint = async (): Promise<string> => {
    const fonts = ['Arial', 'Times New Roman', 'Courier New', 'Helvetica', 'Georgia'];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    const measurements = fonts.map(font => {
      ctx.font = `16px ${font}`;
      return ctx.measureText('Security Test 123').width;
    });
    
    return measurements.join('-');
  };

  const getCurrentIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

  const handleCriticalThreat = () => {
    // Force re-authentication for critical threats
    localStorage.removeItem('secure_session');
    window.location.href = '/auth?critical=true';
  };

  const dismissThreat = (threatId: string) => {
    setThreats(prev => prev.filter(t => t.id !== threatId));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      {/* Behavioral Score Display */}
      <div className="flex items-center gap-2 p-3 bg-secondary/10 rounded-lg">
        <Shield className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium">Security Score:</span>
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                behavioralScore >= 70 ? 'bg-green-500' :
                behavioralScore >= 40 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${behavioralScore}%` }}
            />
          </div>
          <span className="text-sm font-mono">{behavioralScore}/100</span>
        </div>
        <TrendingUp className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Active Threats */}
      {threats.length > 0 && (
        <div className="space-y-2">
          {threats.map((threat) => (
            <Alert key={threat.id} variant={getSeverityColor(threat.severity) as any}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex justify-between items-center">
                <div>
                  <strong className="capitalize">{threat.severity}</strong>: {threat.message}
                  {threat.actionRequired && (
                    <div className="text-xs mt-1 opacity-80">
                      Action: {threat.actionRequired}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => dismissThreat(threat.id)}
                  className="text-xs underline ml-4"
                >
                  Dismiss
                </button>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Monitoring Status */}
      <div className="text-xs text-muted-foreground text-center">
        {isMonitoring ? 'Enhanced security monitoring active' : 'Security monitoring paused'}
      </div>
    </div>
  );
};
