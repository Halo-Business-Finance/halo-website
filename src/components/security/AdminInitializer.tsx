import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const AdminInitializer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error: dbError } = await supabase.rpc('create_initial_admin', {
        admin_email: email
      });

      if (dbError) {
        if (dbError.message.includes('Admin users already exist')) {
          setError('Admin users already exist. Initial setup is complete.');
        } else if (dbError.message.includes('not found')) {
          setError('User not found. Please ensure the user has signed up first, then try again.');
        } else {
          setError(dbError.message);
        }
        return;
      }

      if (data) {
        setSuccess(true);
        toast({
          title: 'Admin Created Successfully',
          description: 'The initial admin user has been created and security features are now active.',
        });
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <CardTitle className="text-green-700">Admin Setup Complete</CardTitle>
          <CardDescription>
            Your security system is now fully activated with admin privileges.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            You can now access all security management features and dashboards.
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Continue to Application
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <Shield className="h-12 w-12 text-orange-500 mx-auto mb-4" />
        <CardTitle className="text-orange-700">Security Setup Required</CardTitle>
        <CardDescription>
          Initialize your first admin user to activate security features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> The user must have already signed up before they can be made an admin. 
            Please ensure the email address belongs to an existing user account.
          </AlertDescription>
        </Alert>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleCreateAdmin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-email">Admin Email Address</Label>
            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter the email of the first admin user"
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !email}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Initial Admin
          </Button>
        </form>

        <div className="mt-4 text-xs text-muted-foreground">
          <p><strong>Next steps after admin creation:</strong></p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>Access security dashboards and monitoring</li>
            <li>Manage user roles and permissions</li>
            <li>Configure additional security settings</li>
            <li>Review and manage security events</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};