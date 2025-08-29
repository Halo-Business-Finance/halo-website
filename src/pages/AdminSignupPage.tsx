import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AdminInitializer } from '@/components/security/AdminInitializer';
import { SecureRoleManager } from '@/components/security/SecureRoleManager';
import { useAuth } from '@/components/auth/AuthProvider';
import { useSecureAuth } from '@/components/security/SecureAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, UserPlus, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminSignupPage = () => {
  console.log('AdminSignupPage component rendering...');
  const { isAdmin, user } = useAuth();
  const { signUpSecure } = useSecureAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const handleAdminSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      // Direct signup without secure auth provider to avoid edge function dependencies
      const { data, error: signupError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            display_name: formData.displayName
          }
        }
      });

      if (signupError) {
        setError('Failed to create account: ' + signupError.message);
        return;
      }

      if (!data.user) {
        setError('Failed to create user account');
        return;
      }

      // Wait a moment for the user to be fully created
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Try to assign admin role using the secure function
      const { error: adminError } = await supabase.rpc('create_initial_admin', {
        admin_email: formData.email
      });

      if (adminError) {
        // If admin role assignment fails, still show success for user creation
        toast({
          title: 'Account created',
          description: `Account created successfully for ${formData.email}. Admin role assignment may require manual intervention. Please check your email to verify your account.`,
        });
      } else {
        toast({
          title: 'Admin account created successfully',
          description: 'Your admin account has been created and admin privileges assigned. Please check your email to verify your account.',
        });
      }
      
      // Clear the form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        displayName: ''
      });

    } catch (err: any) {
      setError('An unexpected error occurred: ' + (err.message || 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Admin Signup & Security Setup | Halo Business Finance"
        description="Create your admin account and initialize security features for Halo Business Finance platform"
        keywords="admin signup, security setup, admin initialization, business finance security"
        canonical="https://halobusinessfinance.com/admin-signup"
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-4">
                <Shield className="h-12 w-12 text-primary mr-3" />
                <h1 className="text-4xl font-bold text-foreground">
                  Admin Account & Security Setup
                </h1>
              </div>
              <p className="text-xl text-muted-foreground">
                Create your admin account and initialize your security system
              </p>
            </div>

            <Tabs defaultValue={user ? "security" : "signup"} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signup" disabled={!!user}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Admin Signup
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Settings className="w-4 h-4 mr-2" />
                  Security Setup
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signup" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Admin Account</CardTitle>
                    <CardDescription>
                      Create the first admin account for your Halo Business Finance platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {user ? (
                      <Alert>
                        <AlertDescription>
                          You are already signed in as {user.email}. Proceed to Security Setup to configure admin access.
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <form onSubmit={handleAdminSignup} className="space-y-4">
                        {error && (
                          <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}
                        
                        <div className="space-y-2">
                          <label htmlFor="displayName" className="text-sm font-medium">
                            Display Name
                          </label>
                          <Input
                            id="displayName"
                            name="displayName"
                            type="text"
                            placeholder="Admin Display Name"
                            value={formData.displayName}
                            onChange={handleInputChange}
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Email Address
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="admin@halobusinessfinance.com"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="password" className="text-sm font-medium">
                            Password
                          </label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="confirmPassword" className="text-sm font-medium">
                            Confirm Password
                          </label>
                          <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                          />
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating Admin Account...
                            </>
                          ) : (
                            <>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Create Admin Account
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <div className="space-y-8">
                  <AdminInitializer />
                  
                  {isAdmin && (
                    <SecureRoleManager />
                  )}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Security Features Overview</CardTitle>
                    <CardDescription>
                      Your platform includes these military-grade security features
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-primary" />
                          Authentication Security
                        </h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Secure redirect URL validation</li>
                          <li>• Enhanced password reset protection</li>
                          <li>• Advanced session management</li>
                          <li>• Role-based access control</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-primary" />
                          Data Protection
                        </h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• End-to-end encryption</li>
                          <li>• Sensitive data sanitization</li>
                          <li>• PII masking and protection</li>
                          <li>• Secure error handling</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-primary" />
                          Monitoring & Alerts
                        </h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Real-time security monitoring</li>
                          <li>• Automated threat detection</li>
                          <li>• Security event logging</li>
                          <li>• Admin notification system</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2 flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-primary" />
                          Compliance & Headers
                        </h3>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Content Security Policy (CSP)</li>
                          <li>• Security headers enforcement</li>
                          <li>• CORS protection</li>
                          <li>• Production hardening</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AdminSignupPage;