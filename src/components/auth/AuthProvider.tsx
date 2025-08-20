import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isModerator: boolean;
  userRole: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user role when user signs in with enhanced security
        if (session?.user) {
          setTimeout(async () => {
            try {
              const { data: roleData, error } = await supabase
                .rpc('get_user_role', { _user_id: session.user.id });
              
              if (error) {
                console.error('Error fetching user role:', error);
                // Enhanced error handling with security logging
                try {
                  await supabase.from('security_events').insert({
                    event_type: 'role_fetch_failed',
                    severity: 'medium',
                    user_id: session.user.id,
                    event_data: { 
                      error: error.message,
                      timestamp: new Date().toISOString()
                    },
                    source: 'auth_provider'
                  });
                } catch (logError) {
                  console.warn('Failed to log security event:', logError);
                }
                setUserRole('user');
              } else {
                setUserRole(roleData || 'user');
              }
            } catch (error) {
              console.error('Critical error fetching user role:', error);
              setUserRole('user');
            }
          }, 0);
        } else {
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      // Log security event for logout with enhanced security
      try {
        await supabase.from('security_events').insert({
          event_type: 'user_logout',
          severity: 'info',
          user_id: user?.id,
          event_data: {
            logout_method: 'manual',
            timestamp: new Date().toISOString()
          },
          source: 'auth_provider'
        });
      } catch (logError) {
        console.warn('Failed to log security event:', logError);
      }

      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: 'Error signing out',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Signed out successfully',
          description: 'You have been logged out of your account.',
        });
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isAdmin = userRole === 'admin';
  const isModerator = userRole === 'moderator' || isAdmin;

  const contextValue: AuthContextType = {
    user,
    session,
    loading,
    signOut,
    isAdmin,
    isModerator,
    userRole
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};