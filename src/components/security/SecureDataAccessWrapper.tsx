import React, { ReactNode, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { useSecurityLogger } from './EnhancedSecurityLogger';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle } from 'lucide-react';

interface SecureDataAccessWrapperProps {
  children: ReactNode;
  requiredRole?: 'admin' | 'moderator' | 'user';
  resourceType: string;
  resourceId?: string;
  accessType?: string;
  requiresActiveSession?: boolean;
  sessionTimeoutMinutes?: number;
}

export const SecureDataAccessWrapper = ({
  children,
  requiredRole = 'user',
  resourceType,
  resourceId,
  accessType = 'read',
  requiresActiveSession = true,
  sessionTimeoutMinutes = 30
}: SecureDataAccessWrapperProps) => {
  const { user, userRole, isAdmin, isModerator } = useAuth();
  const { logSecurityEvent, logPIIAccess } = useSecurityLogger();

  // Log access attempt
  useEffect(() => {
    if (user && resourceType) {
      logPIIAccess(resourceType, resourceId || 'unknown', accessType);
    }
  }, [user, resourceType, resourceId, accessType, logPIIAccess]);

  // Check role permissions
  const hasPermission = () => {
    switch (requiredRole) {
      case 'admin':
        return isAdmin;
      case 'moderator':
        return isModerator;
      case 'user':
      default:
        return !!user;
    }
  };

  // Log unauthorized access attempts
  useEffect(() => {
    if (user && !hasPermission()) {
      logSecurityEvent(
        'unauthorized_secure_data_access_attempt',
        'high',
        {
          required_role: requiredRole,
          user_role: userRole,
          resource_type: resourceType,
          resource_id: resourceId,
          access_type: accessType
        },
        'secure_data_access_control'
      );
    }
  }, [user, hasPermission, requiredRole, userRole, resourceType, resourceId, accessType, logSecurityEvent]);

  if (!user) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Authentication required to access this secure resource.
        </AlertDescription>
      </Alert>
    );
  }

  if (!hasPermission()) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p className="font-medium">Access Denied</p>
            <p>You don't have the required permissions to access this resource.</p>
            <p className="text-sm">
              Required role: <span className="font-semibold capitalize">{requiredRole}</span>
              {userRole && <span> | Your role: <span className="font-semibold capitalize">{userRole}</span></span>}
            </p>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Log successful access
  useEffect(() => {
    if (user && hasPermission()) {
      logSecurityEvent(
        'secure_data_access_granted',
        'info',
        {
          user_role: userRole,
          resource_type: resourceType,
          resource_id: resourceId,
          access_type: accessType,
          permission_validated: true
        },
        'secure_data_access_control'
      );
    }
  }, [user, hasPermission, userRole, resourceType, resourceId, accessType, logSecurityEvent]);

  return <>{children}</>;
};