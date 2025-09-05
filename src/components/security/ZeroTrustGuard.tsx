import React, { ReactNode, useEffect, useState } from 'react';
import { useZeroTrust } from './ZeroTrustProvider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ZeroTrustGuardProps {
  children: ReactNode;
  requiredTrustScore?: number;
  requiredAccessLevel?: 'normal' | 'elevated' | 'critical';
  fallback?: ReactNode;
  bypassForPublic?: boolean;
}

export const ZeroTrustGuard: React.FC<ZeroTrustGuardProps> = ({
  children,
  requiredTrustScore = 70,
  requiredAccessLevel = 'normal',
  fallback,
  bypassForPublic = true // Changed default to true for easier usage
}) => {
  const {
    trustScore,
    isVerified,
    riskLevel,
    lastVerification,
    continuousVerify,
    elevateAccess,
    sessionValid
  } = useZeroTrust();
  
  const [isElevating, setIsElevating] = useState(false);
  const [elevationAttempted, setElevationAttempted] = useState(false);

  // If bypassing for public content, allow access
  if (bypassForPublic) {
    return <>{children}</>;
  }

  // Check if session is valid
  if (!sessionValid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <AlertTriangle className="h-16 w-16 text-destructive" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Session Invalid</h1>
            <p className="text-muted-foreground">
              Your session has been invalidated for security reasons. Please log in again.
            </p>
          </div>
          <Button 
            onClick={() => window.location.href = '/auth'}
            className="w-full"
          >
            Return to Login
          </Button>
        </div>
      </div>
    );
  }

  // Handle access elevation
  const handleElevateAccess = async () => {
    setIsElevating(true);
    setElevationAttempted(true);
    
    try {
      const success = await elevateAccess(requiredAccessLevel);
      if (!success) {
        // Elevation failed, show appropriate message
      }
    } catch (error) {
      console.error('Access elevation failed:', error);
    } finally {
      setIsElevating(false);
    }
  };

  // Continuous verification for critical risk levels
  useEffect(() => {
    if (riskLevel === 'critical') {
      const interval = setInterval(continuousVerify, 10000); // Every 10 seconds for critical risk
      return () => clearInterval(interval);
    }
  }, [riskLevel, continuousVerify]);

  // Check if access should be granted
  const hasRequiredTrust = trustScore >= requiredTrustScore;
  const hasRequiredAccess = isVerified;

  if (!hasRequiredTrust || !hasRequiredAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-lg mx-auto space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Shield className={`h-16 w-16 ${
                riskLevel === 'critical' ? 'text-destructive' :
                riskLevel === 'high' ? 'text-orange-500' :
                riskLevel === 'medium' ? 'text-yellow-500' :
                'text-green-500'
              }`} />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Zero Trust Verification</h1>
              <p className="text-muted-foreground">
                Continuous security verification is required to access this resource.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Alert className={`border-l-4 ${
              riskLevel === 'critical' ? 'border-l-destructive bg-destructive/5' :
              riskLevel === 'high' ? 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/20' :
              riskLevel === 'medium' ? 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/20' :
              'border-l-green-500 bg-green-50 dark:bg-green-950/20'
            }`}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Trust Score:</span>
                    <span className={`px-2 py-1 rounded text-sm font-bold ${
                      trustScore >= 90 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                      trustScore >= 70 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                    }`}>
                      {trustScore}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Risk Level:</span>
                    <span className={`px-2 py-1 rounded text-sm font-bold uppercase ${
                      riskLevel === 'low' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' :
                      riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' :
                      riskLevel === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                    }`}>
                      {riskLevel}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Required:</span>
                    <span className="text-sm">{requiredTrustScore}% ({requiredAccessLevel})</span>
                  </div>
                  
                  {lastVerification && (
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Last Check:</span>
                      <span className="text-sm">{lastVerification.toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button 
                onClick={continuousVerify}
                className="w-full"
                disabled={isElevating}
              >
                {isElevating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Re-verify Identity
                  </>
                )}
              </Button>

              {!elevationAttempted && trustScore > 0 && trustScore < requiredTrustScore && (
                <Button 
                  onClick={handleElevateAccess}
                  variant="outline"
                  className="w-full"
                  disabled={isElevating}
                >
                  {isElevating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Elevating Access...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Request Access Elevation
                    </>
                  )}
                </Button>
              )}

              <Button 
                variant="ghost"
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Return to Home
              </Button>
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p>Zero Trust Security: Never trust, always verify</p>
            <p>Your access is continuously monitored and verified</p>
            {riskLevel === 'critical' && (
              <p className="text-destructive font-semibold">
                Critical risk detected - Enhanced monitoring active
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Access granted - render protected content
  return <>{children}</>;
};