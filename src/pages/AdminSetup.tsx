import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AdminSetup = () => {
  const [email, setEmail] = useState('');
  const [confirmationToken, setConfirmationToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasAdmins, setHasAdmins] = useState<boolean | null>(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await supabase.functions.invoke('initialize-first-admin', {
        method: 'GET'
      });

      if (response.data) {
        setHasAdmins(response.data.hasAdmins);
        if (response.data.hasAdmins) {
          setError('Admin accounts already exist. Please use the regular admin login.');
        }
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setError('Unable to check admin status. Please try again.');
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await supabase.functions.invoke('initialize-first-admin', {
        body: { email, confirmationToken }
      });

      if (response.error) {
        throw response.error;
      }

      const data = response.data;

      if (data.success) {
        setSuccess(data.message);
        toast({
          title: "Admin Account Created",
          description: "Your admin account has been successfully created!",
          variant: "default"
        });
        
        // Redirect to admin login after 3 seconds
        setTimeout(() => {
          navigate('/admin');
        }, 3000);
      } else {
        setError(data.error || 'Failed to create admin account');
        if (data.requiresSignup) {
          toast({
            title: "Account Required",
            description: "Please create a user account first at /auth",
            variant: "destructive"
          });
        }
      }
    } catch (error: any) {
      console.error('Setup error:', error);
      setError(error.message || 'Network error. Please try again.');
      toast({
        title: "Setup Error",
        description: error.message || 'Unable to create admin account',
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Checking admin status...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasAdmins) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold">Admin System Active</CardTitle>
            <CardDescription>
              Admin accounts already exist in the system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                The admin system has already been initialized. Please use the regular admin login to access the dashboard.
              </AlertDescription>
            </Alert>
            
            <Button 
              onClick={() => navigate('/admin')} 
              className="w-full"
            >
              Go to Admin Login
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Shield className="h-12 w-12 text-primary" />
              <Lock className="h-6 w-6 text-primary absolute -bottom-1 -right-1 bg-white rounded-full p-1" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Initialize First Admin</CardTitle>
          <CardDescription>
            Set up your administrator account to manage Halo Business Finance
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {success}
                </AlertDescription>
              </Alert>
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Redirecting to admin login in 3 seconds...
                </p>
                <Button onClick={() => navigate('/admin')} className="w-full">
                  Go to Admin Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Your Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your-email@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Must be an existing user account with confirmed email
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="token">Confirmation Token</Label>
                <Input
                  id="token"
                  type="text"
                  placeholder="Enter security token"
                  value={confirmationToken}
                  onChange={(e) => setConfirmationToken(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Security token: HALO_ADMIN_INIT_2025
                </p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating Admin Account...
                  </div>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Initialize Admin Account
                  </>
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Prerequisites:</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• Must have a registered user account</li>
                <li>• Email must be confirmed</li>
                <li>• Valid security token required</li>
                <li>• Only works if no admins exist yet</li>
              </ul>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                Need a user account first? <br />
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={() => navigate('/auth')}
                  className="p-0 h-auto text-xs"
                >
                  Create account at /auth
                </Button>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;