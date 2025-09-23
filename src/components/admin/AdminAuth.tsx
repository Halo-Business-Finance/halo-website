import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { secureStorage } from '@/utils/secureStorage';

interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
}

interface AdminAuthProps {
  onLogin: (user: AdminUser, token: string) => void;
}

const AdminAuth = ({ onLogin }: AdminAuthProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const { toast } = useToast();

  // Check for existing session on component mount
  useEffect(() => {
    const existingSession = secureStorage.getSession();
    if (existingSession) {
      onLogin(existingSession.user, existingSession.token);
    }
  }, [onLogin]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Rate limiting: max 3 attempts per 15 minutes
    if (attemptCount >= 3) {
      setError('Too many login attempts. Please wait 15 minutes before trying again.');
      toast({
        title: "Rate Limited",
        description: 'Too many failed attempts. Please wait before trying again.',
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Add timestamp and security headers
      const response = await fetch('https://zwqtewpycdbvjgkntejd.supabase.co/functions/v1/admin-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': crypto.randomUUID(),
          'X-Client-Version': '2.0',
        },
        body: JSON.stringify({ 
          email: email.toLowerCase().trim(), 
          password,
          timestamp: Date.now(),
          userAgent: navigator.userAgent.substring(0, 200) // Limit user agent length
        }),
      });

      const data = await response.json();

      if (data.success && data.token && data.user) {
        // Store session securely
        secureStorage.setSession(data.token, data.user);
        
        // Reset attempt count on successful login
        setAttemptCount(0);
        
        // Clear form data for security
        setEmail('');
        setPassword('');
        
        onLogin(data.user, data.token);
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.user.full_name}`,
          variant: "default"
        });
      } else {
        // Increment attempt count on failure
        setAttemptCount(prev => prev + 1);
        
        const errorMessage = data.error || 'Invalid credentials';
        setError(errorMessage);
        
        toast({
          title: "Login Failed",
          description: errorMessage,
          variant: "destructive"
        });
        
        // Clear password field on failed attempt
        setPassword('');
      }
    } catch (error) {
      console.error('Login error:', error);
      setAttemptCount(prev => prev + 1);
      
      const errorMessage = 'Network error. Please check your connection and try again.';
      setError(errorMessage);
      
      toast({
        title: "Connection Error",
        description: errorMessage,
        variant: "destructive"
      });
      
      // Clear password field on error
      setPassword('');
    } finally {
      setIsLoading(false);
    }
  };

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
          <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
          <CardDescription>
            Sign in to access the Halo Business Finance admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@halobusinessfinance.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
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
                  Signing in...
                </div>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <h4 className="text-sm font-medium text-amber-900 mb-2">Security Notice:</h4>
            <p className="text-xs text-amber-700">
              For security purposes, admin credentials are not displayed. Contact your system administrator for access.
            </p>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Secure admin access protected by enterprise-grade security
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAuth;