import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SessionData {
  sessionId: string;
  userId: string;
  lastActivity: number;
  securityLevel: 'normal' | 'high' | 'compromised';
  clientFingerprint?: string;
}

interface SessionContextType {
  session: SessionData | null;
  createSession: (userId: string) => Promise<string>;
  validateSession: (sessionId: string) => Promise<boolean>;
  refreshSession: () => void;
  destroySession: () => void;
  signAPIRequest: (url: string, method: string, data?: any) => string;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionManagerProps {
  children: React.ReactNode;
  sessionTimeout?: number;
  activityTimeout?: number;
}

export const EnhancedSessionManager: React.FC<SessionManagerProps> = ({
  children,
  sessionTimeout = 24 * 60 * 60 * 1000, // 24 hours
  activityTimeout = 30 * 60 * 1000, // 30 minutes
}) => {
  const [session, setSession] = useState<SessionData | null>(null);
  const activityTimer = useRef<NodeJS.Timeout>();
  const validationInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Set up activity tracking
    const handleActivity = () => {
      if (session) {
        refreshSession();
      }
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Set up session validation interval
    validationInterval.current = setInterval(async () => {
      if (session) {
        const isValid = await validateSession(session.sessionId);
        if (!isValid) {
          destroySession();
        }
      }
    }, 60000); // Check every minute

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      if (activityTimer.current) clearTimeout(activityTimer.current);
      if (validationInterval.current) clearInterval(validationInterval.current);
    };
  }, [session]);

  const createSession = async (userId: string): Promise<string> => {
    try {
      const clientFingerprint = generateClientFingerprint();
      const clientIP = await getCurrentIP();
      
      // Use the secure database function with enhanced security
      const { data, error } = await supabase.rpc('create_secure_session', {
        p_user_id: userId,
        p_ip_address: clientIP,
        p_user_agent: navigator.userAgent,
        p_client_fingerprint: clientFingerprint,
        p_expires_hours: 24
      });

      if (error) throw error;
      
      // The function returns an array with session_id and session_token
      const sessionResult = Array.isArray(data) ? data[0] : data;

      const newSession: SessionData = {
        sessionId: sessionResult.session_token,
        userId,
        lastActivity: Date.now(),
        securityLevel: 'normal',
        clientFingerprint
      };

      setSession(newSession);
      
      // Store only essential session metadata for client use
      localStorage.setItem('secure_session', JSON.stringify({
        sessionId: sessionResult.session_token, // Plain token for client validation
        userId,
        created: Date.now(),
        sessionDbId: sessionResult.session_id,
        securityLevel: 'enhanced'
      }));

      // Log successful session creation on client
      console.log('[SECURITY] Enhanced secure session created successfully');

      return sessionResult.session_token;
    } catch (error) {
      console.error('[SECURITY] Failed to create secure session:', error);
      throw error;
    }
  };

  const validateSession = async (sessionId: string): Promise<boolean> => {
    try {
      const clientFingerprint = generateClientFingerprint();
      const clientIP = await getCurrentIP();

      // Use the secure database function instead of edge function
      const { data, error } = await supabase.rpc('validate_session_security', {
        session_token: sessionId,
        client_ip: clientIP,
        client_fingerprint: clientFingerprint
      });

      if (error) return false;
      
      // The function returns a boolean
      return data || false;
    } catch (error) {
      console.error('Session validation failed:', error);
      return false;
    }
  };

  const refreshSession = () => {
    if (session) {
      setSession(prev => prev ? { ...prev, lastActivity: Date.now() } : null);
      
      // Reset activity timeout
      if (activityTimer.current) clearTimeout(activityTimer.current);
      activityTimer.current = setTimeout(() => {
        destroySession();
      }, activityTimeout);
    }
  };

  const destroySession = () => {
    setSession(null);
    localStorage.removeItem('secure_session');
    if (activityTimer.current) clearTimeout(activityTimer.current);
  };

  const signAPIRequest = (url: string, method: string, data?: any): string => {
    if (!session) return '';
    
    const timestamp = Date.now();
    const payload = JSON.stringify({ url, method, data, timestamp });
    
    // Simple HMAC-like signature using session ID
    const signature = btoa(payload + session.sessionId).substring(0, 32);
    
    return `${timestamp}.${signature}`;
  };

  const generateClientFingerprint = (): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Security fingerprint', 2, 2);
    }
    
    return btoa(
      navigator.userAgent + 
      navigator.language + 
      screen.width + screen.height + 
      (canvas.toDataURL() || '')
    ).substring(0, 32);
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

  return (
    <SessionContext.Provider value={{
      session,
      createSession,
      validateSession,
      refreshSession,
      destroySession,
      signAPIRequest
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionManager');
  }
  return context;
};