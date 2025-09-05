import React from 'react';
import { useZeroTrust } from './ZeroTrustProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, RefreshCw, Lock, Activity } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const ZeroTrustDashboard: React.FC = () => {
  const {
    trustScore,
    isVerified,
    riskLevel,
    lastVerification,
    continuousVerify,
    deviceFingerprint,
    sessionValid
  } = useZeroTrust();

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-100';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-100';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-100';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-100';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-100';
    }
  };

  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 50) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Zero Trust Security Dashboard</h2>
          <p className="text-muted-foreground">Never trust, always verify - Continuous security monitoring</p>
        </div>
        <Button onClick={continuousVerify} size="sm" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Re-verify
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trust Score</CardTitle>
            <Shield className={`h-4 w-4 ${getTrustScoreColor(trustScore)}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <span className={getTrustScoreColor(trustScore)}>{trustScore}%</span>
            </div>
            <Progress value={trustScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verification Status</CardTitle>
            {isVerified ? (
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isVerified ? 'Verified' : 'Unverified'}
            </div>
            <p className="text-xs text-muted-foreground">
              {isVerified ? 'Identity confirmed' : 'Verification required'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge className={getRiskColor(riskLevel)} variant="outline">
                {riskLevel.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Continuous assessment
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session Status</CardTitle>
            <Lock className={`h-4 w-4 ${sessionValid ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessionValid ? 'Valid' : 'Invalid'}
            </div>
            <p className="text-xs text-muted-foreground">
              {sessionValid ? 'Session secured' : 'Session compromised'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Details</CardTitle>
            <CardDescription>Real-time security assessment information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Last Verification:</span>
              <span className="text-sm text-muted-foreground">
                {lastVerification ? lastVerification.toLocaleString() : 'Never'}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Device Fingerprint:</span>
              <span className="text-sm text-muted-foreground font-mono">
                {deviceFingerprint.substring(0, 8)}...
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Verification Method:</span>
              <span className="text-sm text-muted-foreground">
                Continuous Zero Trust
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">Security Level:</span>
              <Badge variant="outline">Enterprise Grade</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Recommendations</CardTitle>
            <CardDescription>Actions to improve your security posture</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trustScore < 70 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Trust score below threshold. Additional verification recommended.
                  </AlertDescription>
                </Alert>
              )}
              
              {riskLevel === 'critical' && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Critical risk detected. Immediate security review required.
                  </AlertDescription>
                </Alert>
              )}
              
              {riskLevel === 'high' && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    High risk level. Enhanced monitoring is active.
                  </AlertDescription>
                </Alert>
              )}
              
              {!sessionValid && (
                <Alert variant="destructive">
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    Session invalid. Please re-authenticate immediately.
                  </AlertDescription>
                </Alert>
              )}
              
              {trustScore >= 90 && riskLevel === 'low' && sessionValid && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Excellent security posture. All systems operating normally.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zero Trust Principles */}
      <Card>
        <CardHeader>
          <CardTitle>Zero Trust Principles</CardTitle>
          <CardDescription>Core security principles in effect</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-semibold">Never Trust</h4>
                <p className="text-sm text-muted-foreground">
                  No implicit trust granted to any user, device, or network location
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <h4 className="font-semibold">Always Verify</h4>
                <p className="text-sm text-muted-foreground">
                  Continuous verification of identity, device, and context
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Lock className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
              <div>
                <h4 className="font-semibold">Least Privilege</h4>
                <p className="text-sm text-muted-foreground">
                  Minimum required access granted for each request
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};