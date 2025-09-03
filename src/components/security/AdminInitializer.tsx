import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, UserCheck, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const AdminInitializer: React.FC = () => {
  const [adminEmail, setAdminEmail] = useState('');
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasAdmins, setHasAdmins] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  // Check if admins already exist
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('id')
          .eq('role', 'admin')
          .eq('is_active', true)
          .limit(1);

        if (error) throw error;
        setHasAdmins(data && data.length > 0);
      } catch (err) {
        console.error('Error checking admin status:', err);
        setHasAdmins(null);
      }
    };

    checkAdminStatus();
  }, []);

  const handleInitializeAdmin = async () => {
    if (!adminEmail.trim()) {
      setError('Please enter an email address');
      return;
    }

    setIsInitializing(true);
    setError(null);

    try {
      const { data, error } = await supabase.rpc('create_initial_admin', {
        admin_email: adminEmail.trim()
      });

      if (error) throw error;

      const result = data as any;
      if (result?.success) {
        toast({
          title: 'Admin Initialized Successfully',
          description: 'The first administrator has been created. Please refresh the page.',
        });
        setHasAdmins(true);
        setAdminEmail('');
      } else {
        setError(result?.error || 'Failed to initialize admin');
      }
    } catch (err: any) {
      console.error('Error initializing admin:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsInitializing(false);
    }
  };

  // Show admin panel link if admin users exist and someone is logged in with admin role
  // Note: This would need the useAuth hook to check isAdmin status

  // If admins already exist, show info message
  if (hasAdmins) {
    return (
      <Card className="border-muted">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            System Already Initialized
          </CardTitle>
          <CardDescription>
            This system already has administrators configured.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              If you need administrator access, please contact an existing administrator.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Show admin initialization form
  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-destructive" />
          Initialize First Administrator
        </CardTitle>
        <CardDescription>
          This system requires an initial administrator to be configured for security.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="border-destructive bg-destructive/5">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            <strong>Security Notice:</strong> Only initialize an administrator if you are authorized to manage this system.
            This action will be logged and monitored.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="admin-email">Administrator Email</Label>
          <Input
            id="admin-email"
            type="email"
            placeholder="Enter email of user to make administrator"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            disabled={isInitializing}
          />
          <p className="text-sm text-muted-foreground">
            This email must belong to a user who has already signed up for the system.
          </p>
        </div>

        {error && (
          <Alert className="border-destructive bg-destructive/5">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleInitializeAdmin}
          disabled={isInitializing || !adminEmail.trim()}
          className="w-full"
          variant="destructive"
        >
          {isInitializing ? 'Initializing...' : 'Initialize Administrator'}
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p>• This action can only be performed once</p>
          <p>• The specified user must have already created an account</p>
          <p>• All administrative actions are logged for security</p>
        </div>
      </CardContent>
    </Card>
  );
};