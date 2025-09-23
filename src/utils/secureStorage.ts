/**
 * Secure Storage Utility
 * Replaces insecure localStorage with secure session management
 */

interface SessionData {
  token: string;
  user: any;
  expiresAt: number;
  lastActivity: number;
}

class SecureSessionManager {
  private static instance: SecureSessionManager;
  private sessionKey = 'halo_admin_session';
  private sessionTimeout = 30 * 60 * 1000; // 30 minutes
  private maxSessionDuration = 8 * 60 * 60 * 1000; // 8 hours max

  private constructor() {
    // Start session cleanup interval
    this.startSessionCleanup();
  }

  public static getInstance(): SecureSessionManager {
    if (!SecureSessionManager.instance) {
      SecureSessionManager.instance = new SecureSessionManager();
    }
    return SecureSessionManager.instance;
  }

  /**
   * Store session data securely
   */
  public setSession(token: string, user: any): void {
    const now = Date.now();
    const sessionData: SessionData = {
      token,
      user,
      expiresAt: now + this.maxSessionDuration,
      lastActivity: now
    };

    try {
      // Use sessionStorage instead of localStorage for better security
      // Session data will be cleared when the browser tab is closed
      sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
      
      // Log session creation for security monitoring
      this.logSecurityEvent('session_created', {
        userId: user.id,
        timestamp: now
      });
    } catch (error) {
      console.error('Failed to store session data:', error);
      throw new Error('Session storage failed');
    }
  }

  /**
   * Retrieve session data if valid
   */
  public getSession(): { token: string; user: any } | null {
    try {
      const sessionStr = sessionStorage.getItem(this.sessionKey);
      if (!sessionStr) return null;

      const sessionData: SessionData = JSON.parse(sessionStr);
      const now = Date.now();

      // Check if session has expired
      if (now > sessionData.expiresAt) {
        this.clearSession();
        this.logSecurityEvent('session_expired', {
          userId: sessionData.user?.id,
          timestamp: now
        });
        return null;
      }

      // Check if session has been inactive too long
      if (now - sessionData.lastActivity > this.sessionTimeout) {
        this.clearSession();
        this.logSecurityEvent('session_timeout', {
          userId: sessionData.user?.id,
          timestamp: now,
          inactiveTime: now - sessionData.lastActivity
        });
        return null;
      }

      // Update last activity
      sessionData.lastActivity = now;
      sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));

      return {
        token: sessionData.token,
        user: sessionData.user
      };
    } catch (error) {
      console.error('Failed to retrieve session data:', error);
      this.clearSession();
      return null;
    }
  }

  /**
   * Clear session data
   */
  public clearSession(): void {
    try {
      const sessionStr = sessionStorage.getItem(this.sessionKey);
      if (sessionStr) {
        const sessionData: SessionData = JSON.parse(sessionStr);
        this.logSecurityEvent('session_cleared', {
          userId: sessionData.user?.id,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.error('Error during session cleanup:', error);
    }

    sessionStorage.removeItem(this.sessionKey);
  }

  /**
   * Check if user is authenticated
   */
  public isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  /**
   * Get current user if authenticated
   */
  public getCurrentUser(): any | null {
    const session = this.getSession();
    return session?.user || null;
  }

  /**
   * Get current token if authenticated
   */
  public getToken(): string | null {
    const session = this.getSession();
    return session?.token || null;
  }

  /**
   * Start periodic session cleanup
   */
  private startSessionCleanup(): void {
    setInterval(() => {
      // This will automatically clean up expired sessions
      this.getSession();
    }, 60000); // Check every minute
  }

  /**
   * Log security events for monitoring
   */
  private logSecurityEvent(event: string, data: any): void {
    // In production, this should send to your security monitoring system
    console.log(`[SECURITY EVENT] ${event}:`, data);
    
    // Store in a separate security log that can be monitored
    const securityLog = {
      event,
      data,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    try {
      const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
      logs.push(securityLog);
      
      // Keep only last 100 security events
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem('security_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }
}

// Export singleton instance
export const secureStorage = SecureSessionManager.getInstance();

// Legacy compatibility functions (gradually replace these)
export const legacyCompat = {
  getItem: (key: string): string | null => {
    if (key === 'admin_token') {
      return secureStorage.getToken();
    }
    if (key === 'admin_user') {
      const user = secureStorage.getCurrentUser();
      return user ? JSON.stringify(user) : null;
    }
    return localStorage.getItem(key);
  },
  
  setItem: (key: string, value: string): void => {
    if (key === 'admin_token' || key === 'admin_user') {
      console.warn('Using deprecated localStorage for admin data. Use secureStorage instead.');
    }
    localStorage.setItem(key, value);
  },
  
  removeItem: (key: string): void => {
    if (key === 'admin_token' || key === 'admin_user') {
      secureStorage.clearSession();
    }
    localStorage.removeItem(key);
  }
};
