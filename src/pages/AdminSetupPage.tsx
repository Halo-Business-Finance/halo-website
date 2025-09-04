import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, UserCheck, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminSetupPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success?: boolean;
    error?: string;
    message?: string;
    required_action?: string;
    next_steps?: string;
    admin_count?: number;
    user_id?: string;
  } | null>(null);
  const { toast } = useToast();

  const handleCreateFirstAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      // Use the enhanced secure first admin function
      const { data, error } = await supabase.rpc('create_first_admin', {
        target_email: email
      });

      if (error) throw error;

      setResult(data as any);
      
      if ((data as any)?.success) {
        toast({
          title: "Admin Account Created",
          description: "First admin account has been successfully created with enhanced security.",
        });
        
        // Log successful admin creation for security monitoring
        try {
          await supabase.functions.invoke('log-security-event', {
            body: {
              event_type: 'admin_bootstrap_completed',
              severity: 'critical',
              event_data: {
                target_email: email,
                success: true,
                timestamp: new Date().toISOString()
              },
              source: 'admin_setup_page'
            }
          });
        } catch (logError) {
          console.warn('Failed to log admin creation event:', logError);
        }
      } else {
        toast({
          variant: "destructive",
          title: "Admin Creation Failed",
          description: (data as any)?.error || "Failed to create admin account",
        });
      }
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Setup</CardTitle>
          <CardDescription>
            Create the first administrator account with enhanced security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              This function only works if no admin accounts exist. The user must be registered and have a confirmed email.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleCreateFirstAdmin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@halobusinessfinance.com"
                required
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !email}
            >
              {isLoading ? "Creating Admin..." : "Create First Admin"}
            </Button>
          </form>

          {result && (
            <Alert className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <UserCheck className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium">
                    {result.success ? "Success!" : "Failed"}
                  </p>
                  <p>{result.message || result.error}</p>
                  {result.required_action && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Required Action:</strong> {result.required_action}
                    </p>
                  )}
                  {result.next_steps && (
                    <p className="text-sm text-muted-foreground">
                      <strong>Next Steps:</strong> {result.next_steps}
                    </p>
                  )}
                  {result.admin_count !== undefined && (
                    <p className="text-sm text-muted-foreground">
                      Current admin count: {result.admin_count}
                    </p>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Need help? Contact your system administrator
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetupPage;