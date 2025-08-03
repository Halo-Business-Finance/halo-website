import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import CryptoJS from 'crypto-js';

interface SessionData {
  sessionId: string;
  userId?: string;
  timestamp: number;
  lastActivity: number;
  ipAddress: string;
  userAgent: string;
  isValid: boolean;
}

interface APIRequest {
  url: string;
  method: string;
  data?: any;
  timestamp: number;
  signature: string;
}

interface SessionContextType {
  session: SessionData | null;
  createSession: (userId?: string) => string;
  validateSession: (sessionId: string) => boolean;
  refreshSession: () => void;
  destroySession: () => void;
  signAPIRequest: (url: string, method: string, data?: any) => string;
  validateAPIRequest: (request: APIRequest) => boolean;
  isSessionExpired: () => boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionManagerProps {
  children: ReactNode;
  sessionTimeout?: number; // in milliseconds
  activityTimeout?: number; // in milliseconds
}

export const SessionManager: React.FC<SessionManagerProps> = ({ 
  children, 
  sessionTimeout = 24 * 60 * 60 * 1000, // 24 hours
  activityTimeout = 30 * 60 * 1000 // 30 minutes
}) => {
  const [session, setSession] = useState<SessionData | null>(null);
  const [sessionKey, setSessionKey] = useState<string>('');

  useEffect(() => {
    // Fetch session encryption key from secure endpoint
    const fetchSessionKey = async () => {
      try {
        const response = await fetch('/functions/v1/get-encryption-keys', {
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
        });
        
        if (response.ok) {
          const { sessionEncryptionKey } = await response.json();
          setSessionKey(sessionEncryptionKey);
          
          // Load existing session after key is available
          setTimeout(() => loadSession(), 100);
        }
      } catch (error) {
        console.error('Failed to fetch session key:', error);
        // Fallback for development
        setSessionKey('dev-fallback-session-key-32chars!');
        setTimeout(() => loadSession(), 100);
      }
    };

    fetchSessionKey();
    
    // Set up activity monitoring
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    const handleActivity = () => updateLastActivity();
    
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Set up session validation interval
    const validationInterval = setInterval(() => {
      validateCurrentSession();
    }, 60000); // Check every minute

    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      clearInterval(validationInterval);
    };
  }, []);

  const generateSessionId = (): string => {
    return CryptoJS.lib.WordArray.random(32).toString();
  };

  const getClientFingerprint = (): string => {
    // Simple client fingerprinting
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx!.textBaseline = 'top';
    ctx!.font = '14px Arial';
    ctx!.fillText('Security fingerprint', 2, 2);
    
    return CryptoJS.SHA256(
      navigator.userAgent + 
      navigator.language + 
      screen.width + screen.height + 
      canvas.toDataURL()
    ).toString();
  };

  const createSession = (userId?: string): string => {
    const sessionId = generateSessionId();
    const timestamp = Date.now();
    
    const newSession: SessionData = {
      sessionId,
      userId,
      timestamp,
      lastActivity: timestamp,
      ipAddress: 'client', // In real app, get from server
      userAgent: navigator.userAgent,
      isValid: true
    };

    if (!sessionKey) {
      console.warn('Session key not available, session not encrypted');
      return sessionId;
    }

    const encryptedSession = CryptoJS.AES.encrypt(
      JSON.stringify(newSession), 
      sessionKey
    ).toString();

    localStorage.setItem('secure_session', encryptedSession);
    setSession(newSession);

    // Log session creation
    logSecurityEvent('session_created', sessionId);

    return sessionId;
  };

  const loadSession = (): void => {
    try {
      if (!sessionKey) {
        console.warn('Session key not available, cannot load session');
        return;
      }

      const encryptedSession = localStorage.getItem('secure_session');
      if (!encryptedSession) return;

      const decryptedBytes = CryptoJS.AES.decrypt(encryptedSession, sessionKey);
      const decryptedSession = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));

      // Validate session
      if (validateSessionData(decryptedSession)) {
        setSession(decryptedSession);
      } else {
        destroySession();
      }
    } catch (error) {
      console.error('Failed to load session:', error);
      destroySession();
    }
  };

  const validateSession = (sessionId: string): boolean => {
    if (!session || session.sessionId !== sessionId) {
      return false;
    }

    return validateSessionData(session);
  };

  const validateSessionData = (sessionData: SessionData): boolean => {
    const now = Date.now();
    
    // Check if session is expired
    if (now - sessionData.timestamp > sessionTimeout) {
      logSecurityEvent('session_expired', sessionData.sessionId);
      return false;
    }

    // Check if inactive for too long
    if (now - sessionData.lastActivity > activityTimeout) {
      logSecurityEvent('session_inactive', sessionData.sessionId);
      return false;
    }

    // Validate client fingerprint
    const currentFingerprint = getClientFingerprint();
    // In a real app, you'd store and compare the fingerprint

    return sessionData.isValid;
  };

  const validateCurrentSession = (): void => {
    if (session && !validateSessionData(session)) {
      destroySession();
    }
  };

  const refreshSession = (): void => {
    if (session && sessionKey) {
      const updatedSession = {
        ...session,
        lastActivity: Date.now()
      };

      const encryptedSession = CryptoJS.AES.encrypt(
        JSON.stringify(updatedSession), 
        sessionKey
      ).toString();

      localStorage.setItem('secure_session', encryptedSession);
      setSession(updatedSession);
    }
  };

  const updateLastActivity = (): void => {
    if (session) {
      const now = Date.now();
      // Only update if more than 1 minute has passed to avoid excessive updates
      if (now - session.lastActivity > 60000) {
        refreshSession();
      }
    }
  };

  const destroySession = (): void => {
    if (session) {
      logSecurityEvent('session_destroyed', session.sessionId);
    }
    
    localStorage.removeItem('secure_session');
    setSession(null);
  };

  const isSessionExpired = (): boolean => {
    if (!session) return true;
    return !validateSessionData(session);
  };

  const signAPIRequest = (url: string, method: string, data?: any): string => {
    const timestamp = Date.now();
    const nonce = CryptoJS.lib.WordArray.random(16).toString();
    const sessionId = session?.sessionId || '';
    
    const payload = {
      url,
      method: method.toUpperCase(),
      data: data ? JSON.stringify(data) : '',
      timestamp,
      nonce,
      sessionId
    };

    if (!sessionKey) {
      console.warn('Session key not available, cannot sign request');
      return '';
    }

    const signature = CryptoJS.HmacSHA256(
      JSON.stringify(payload),
      sessionKey
    ).toString();

    return `${signature}.${timestamp}.${nonce}`;
  };

  const validateAPIRequest = (request: APIRequest): boolean => {
    try {
      const [signature, timestamp, nonce] = request.signature.split('.');
      const now = Date.now();
      
      // Check timestamp (request should be recent)
      if (now - parseInt(timestamp) > 300000) { // 5 minutes
        logSecurityEvent('api_request_expired', request.url);
        return false;
      }

      // Recreate signature
      const payload = {
        url: request.url,
        method: request.method.toUpperCase(),
        data: request.data ? JSON.stringify(request.data) : '',
        timestamp: parseInt(timestamp),
        nonce,
        sessionId: session?.sessionId || ''
      };

      if (!sessionKey) {
        logSecurityEvent('api_validation_no_key', request.url);
        return false;
      }

      const expectedSignature = CryptoJS.HmacSHA256(
        JSON.stringify(payload),
        sessionKey
      ).toString();

      const isValid = signature === expectedSignature;
      
      if (!isValid) {
        logSecurityEvent('api_signature_invalid', request.url);
      }

      return isValid;
    } catch (error) {
      logSecurityEvent('api_validation_error', request.url);
      return false;
    }
  };

  const logSecurityEvent = (event: string, details: string): void => {
    // Use global security event logger if available
    if ((window as any).logSecurityEvent) {
      (window as any).logSecurityEvent({
        type: 'session_management',
        ip: 'client',
        userAgent: navigator.userAgent,
        endpoint: window.location.pathname,
        severity: 'medium',
        details: `${event}: ${details}`,
        blocked: false
      });
    }
  };

  const contextValue: SessionContextType = {
    session,
    createSession,
    validateSession,
    refreshSession,
    destroySession,
    signAPIRequest,
    validateAPIRequest,
    isSessionExpired
  };

  return (
    <SessionContext.Provider value={contextValue}>
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