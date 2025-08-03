import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'user' | 'moderator' | 'admin';
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole = 'user',
  redirectTo = '/auth'
}) => {
  const { user, loading, userRole, isAdmin, isModerator } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`${redirectTo}?returnTo=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Check role permissions
  const hasPermission = () => {
    switch (requiredRole) {
      case 'admin':
        return isAdmin;
      case 'moderator':
        return isModerator;
      case 'user':
      default:
        return true; // All authenticated users have user permissions
    }
  };

  if (!hasPermission()) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have the required permissions to access this page.
            {requiredRole !== 'user' && (
              <span className="block mt-2">
                Required role: <span className="font-semibold capitalize">{requiredRole}</span>
              </span>
            )}
          </p>
          <button
            onClick={() => window.history.back()}
            className="text-primary hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};