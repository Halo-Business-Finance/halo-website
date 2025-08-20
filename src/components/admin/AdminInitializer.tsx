import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Shield, UserCheck } from 'lucide-react';

export const AdminInitializer: React.FC = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasAdmins, setHasAdmins] = useState<boolean | null>(null);

  useEffect(() => {
    checkForExistingAdmins();
  }, []);

  const checkForExistingAdmins = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('id')
        .eq('role', 'admin')
        .limit(1);
      
      if (error) throw error;
      setHasAdmins(data && data.length > 0);
    } catch (error) {
      console.error('Error checking for admins:', error);
      setHasAdmins(false);
    }
  };

  const makeCurrentUserAdmin = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: 'admin'
        });

      if (error) throw error;

      toast.success('You are now an admin! Refresh the page to access admin features.');
      setHasAdmins(true);
    } catch (error: any) {
      toast.error('Failed to assign admin role: ' + error.message);
    }
    setIsLoading(false);
  };

  const createAdminUser = async () => {
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      // Sign up the new admin user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      if (data.user) {
        // Assign admin role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: 'admin'
          });

        if (roleError) throw roleError;

        toast.success('Admin user created successfully!');
        setHasAdmins(true);
        setEmail('');
        setPassword('');
      }
    } catch (error: any) {
      toast.error('Failed to create admin user: ' + error.message);
    }
    setIsLoading(false);
  };

  if (hasAdmins === null) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Checking admin status...</p>
        </div>
      </div>
    );
  }

  if (hasAdmins) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <UserCheck className="h-12 w-12 text-green-500 mx-auto mb-2" />
          <CardTitle>Admin System Ready</CardTitle>
          <CardDescription>
            Admin users already exist. You can access the admin dashboard at /admin if you have admin privileges.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <Shield className="h-12 w-12 text-primary mx-auto mb-2" />
          <CardTitle>Initialize Admin System</CardTitle>
          <CardDescription>
            No admin users found. Create the first admin user to access the backend system.
          </CardDescription>
        </CardHeader>
      </Card>

      {user ? (
        <Card>
          <CardHeader>
            <CardTitle>Make Current User Admin</CardTitle>
            <CardDescription>
              You're logged in as {user.email}. Make yourself an admin?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={makeCurrentUserAdmin} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Assigning Admin Role...' : 'Make Me Admin'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Create Admin User</CardTitle>
            <CardDescription>
              Create a new admin account to manage the system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Admin Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Strong password"
              />
            </div>
            <Button 
              onClick={createAdminUser} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Creating Admin...' : 'Create Admin User'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};