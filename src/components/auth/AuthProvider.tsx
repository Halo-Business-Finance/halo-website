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
    // Set up auth state listener with race condition prevention
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Log auth state changes only in development
        if (import.meta.env.DEV) {
          console.log('Auth state changed:', event, session?.user?.id);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Handle role fetching without race conditions
        if (session?.user) {
          // Use the new cached role function to prevent race conditions
          fetchUserRoleSecurely(session.user.id);
        } else {
          setUserRole(null);
        }
        
        setLoading(false);
      }
    );

    // Secure role fetching function
    const fetchUserRoleSecurely = async (userId: string) => {
      try {
        const { data: roleData, error } = await supabase
          .rpc('get_user_role_cached', { p_user_id: userId });
        
        if (error) {
          console.error('Error fetching user role:', error);
          setUserRole('user');
        } else {
          setUserRole(roleData || 'user');
        }
      } catch (error) {
        console.error('Critical error fetching user role:', error);
        setUserRole('user');
      }
    };

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