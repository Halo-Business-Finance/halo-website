import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { UserCog, Shield, AlertTriangle, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  user_id: string;
  display_name: string;
  email: string;
  current_role?: string;
}

export const SecureRoleManager: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [newRole, setNewRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  // Load users and their current roles
  useEffect(() => {
    if (!isAdmin) return;

    const loadUsers = async () => {
      try {
        // Get all profiles with their current roles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select(`
            user_id,
            display_name
          `);

        if (profilesError) throw profilesError;

        // Get user roles
        const { data: userRoles, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role')
          .eq('is_active', true);

        if (rolesError) throw rolesError;

        // Combine data - Note: In production you'd need a way to get emails
        // For now, we'll show just the profiles with their roles
        const usersWithRoles = profiles?.map(profile => {
          const userRole = userRoles?.find(ur => ur.user_id === profile.user_id);
          return {
            user_id: profile.user_id,
            display_name: profile.display_name || 'No Name',
            email: 'user@example.com', // Placeholder - need admin function to get emails
            current_role: userRole?.role || 'user'
          };
        }) || [];

        setUsers(usersWithRoles);
      } catch (err: any) {
        console.error('Error loading users:', err);
        setError('Failed to load users');
      }
    };

    loadUsers();
  }, [isAdmin]);

  const handleRoleAssignment = async () => {
    if (!selectedUser || !newRole) {
      setError('Please select a user and role');
      return;
    }

    if (selectedUser === user?.id) {
      setError('You cannot modify your own role for security reasons');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.rpc('secure_assign_user_role_v2', {
        target_user_id: selectedUser,
        new_role: newRole as any,
        expiration_date: null
      });

      if (error) throw error;

      const result = data as any;
      if (result?.success) {
        toast({
          title: 'Role Assignment Successful',
          description: result.message || 'Role assigned successfully',
        });
        
        // Refresh users list
        window.location.reload();
      } else {
        setError(result?.error || 'Failed to assign role');
      }
    } catch (err: any) {
      console.error('Error assigning role:', err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-destructive" />
            Access Denied
          </CardTitle>
          <CardDescription>
            Administrator privileges required to manage user roles.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Secure Role Management
          </CardTitle>
          <CardDescription>
            Assign and manage user roles with enhanced security controls.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-primary bg-primary/5">
            <Shield className="h-4 w-4 text-primary" />
            <AlertDescription className="text-primary">
              <strong>Security Notice:</strong> All role changes are logged and monitored. 
              You cannot modify your own role. Role changes take effect immediately.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="user-select">Select User</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a user to manage" />
                </SelectTrigger>
                <SelectContent>
                  {users
                    .filter(u => u.user_id !== user?.id) // Exclude current user
                    .map((userProfile) => (
                    <SelectItem key={userProfile.user_id} value={userProfile.user_id}>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{userProfile.display_name} ({userProfile.email})</span>
                        <Badge variant="outline" className="ml-auto">
                          {userProfile.current_role}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role-select">New Role</Label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select new role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>User</span>
                      <span className="text-muted-foreground text-xs ml-2">Standard access</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="moderator">
                    <div className="flex items-center gap-2">
                      <UserCog className="h-4 w-4" />
                      <span>Moderator</span>
                      <span className="text-muted-foreground text-xs ml-2">Limited admin access</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Administrator</span>
                      <span className="text-muted-foreground text-xs ml-2">Full system access</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <Alert className="border-destructive bg-destructive/5">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleRoleAssignment}
            disabled={isLoading || !selectedUser || !newRole}
            className="w-full"
          >
            {isLoading ? 'Assigning Role...' : 'Assign Role'}
          </Button>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Role changes are immediate and logged for security</p>
            <p>• You cannot modify your own role</p>
            <p>• Admin role cannot be revoked if it would leave no administrators</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Current Users & Roles</CardTitle>
          <CardDescription>
            Overview of all users and their current role assignments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {users.map((userProfile) => (
              <div 
                key={userProfile.user_id} 
                className="flex items-center justify-between p-2 border rounded"
              >
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <div>
                    <p className="font-medium">{userProfile.display_name}</p>
                    <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                  </div>
                </div>
                <Badge 
                  variant={
                    userProfile.current_role === 'admin' ? 'destructive' :
                    userProfile.current_role === 'moderator' ? 'default' : 'secondary'
                  }
                >
                  {userProfile.current_role}
                </Badge>
              </div>
            ))}
            {users.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No users found or loading...
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};