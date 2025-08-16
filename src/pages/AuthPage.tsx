import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, UserPlus, LogIn, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useFormSecurity } from '@/components/security/FormSecurityProvider';
import { useAuth } from '@/components/auth/AuthProvider';
import { useSecureAuth } from '@/components/security/SecureAuthProvider';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { encryptSensitiveData, sanitizeInput, validateInput, csrfToken } = useFormSecurity();
  const { user, session } = useAuth();
  const { signUpSecure, resetPasswordSecure } = useSecureAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  const [signupForm, setSignupForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (user && session) {
      const returnTo = searchParams.get('returnTo') || '/';
      navigate(returnTo, { replace: true });
    }
  }, [user, session, navigate, searchParams]);

  const validatePassword = (password: string): string[] => {
    const errors = [];
    if (password.length < 8) errors.push('Password must be at least 8 characters');
    if (!/[A-Z]/.test(password)) errors.push('Password must contain an uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Password must contain a lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('Password must contain a number');
    if (!/[!@#$%^&*]/.test(password)) errors.push('Password must contain a special character');
    return errors;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate inputs
      if (!validateInput(loginForm.email, 'email')) {
        throw new Error('Please enter a valid email address');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizeInput(loginForm.email),
        password: loginForm.password
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before signing in.');
        } else {
          setError(error.message);
        }
        return;
      }

      if (data.user) {
        toast({
          title: 'Welcome back!',
          description: 'You have been successfully logged in.',
        });
        
        const returnTo = searchParams.get('returnTo') || '/';
        navigate(returnTo, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // Validate inputs
      if (!validateInput(signupForm.email, 'email')) {
        throw new Error('Please enter a valid email address');
      }

      if (signupForm.password !== signupForm.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      const passwordErrors = validatePassword(signupForm.password);
      if (passwordErrors.length > 0) {
        throw new Error(passwordErrors.join('. '));
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await signUpSecure(
        sanitizeInput(signupForm.email),
        signupForm.password,
        sanitizeInput(signupForm.displayName)
      );

      // Get the signup result data from the secure function
      const { data } = await supabase.auth.getSession();

      if (error) {
        if (error.message.includes('User already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else {
          setError(error.message);
        }
        return;
      }

      if (data?.session?.user && !data.session) {
        setMessage('Please check your email and click the confirmation link to complete your registration.');
      } else if (data?.session?.user && data.session) {
        toast({
          title: 'Account created!',
          description: 'Welcome to Halo Business Finance.',
        });
        
        const returnTo = searchParams.get('returnTo') || '/';
        navigate(returnTo, { replace: true });
      } else {
        setMessage('Please check your email and click the confirmation link to complete your registration.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!loginForm.email) {
      setError('Please enter your email address first');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await resetPasswordSecure(sanitizeInput(loginForm.email));

      if (error) {
        setError(error.message);
      } else {
        setMessage('Password reset instructions have been sent to your email.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Sign In | Halo Business Finance | Secure Business Financing Platform"
        description="Access your secure Halo Business Finance account. Sign in to manage your business loan applications, track approvals, and access exclusive financing solutions."
        keywords="business finance login, secure signin, loan application portal, business financing account"
        canonical="https://halobusinessfinance.com/auth"
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <div className="text-center mb-8">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Secure Access
                </h1>
                <p className="text-muted-foreground">
                  Sign in to your account or create a new one
                </p>
              </div>

              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                {error && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {message && (
                  <Alert className="mt-4">
                    <AlertDescription>{message}</AlertDescription>
                  </Alert>
                )}

                <TabsContent value="signin">
                  <Card>
                    <CardHeader>
                      <CardTitle>Welcome Back</CardTitle>
                      <CardDescription>
                        Enter your credentials to access your account
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleLogin} className="space-y-4">
                        <input type="hidden" name="csrf_token" value={csrfToken} />
                        
                        <div className="space-y-2">
                          <Label htmlFor="signin-email">Email</Label>
                          <Input
                            id="signin-email"
                            type="email"
                            value={loginForm.email}
                            onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter your email"
                            required
                            disabled={isLoading}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signin-password">Password</Label>
                          <div className="relative">
                            <Input
                              id="signin-password"
                              type={showPassword ? 'text' : 'password'}
                              value={loginForm.password}
                              onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                              placeholder="Enter your password"
                              required
                              disabled={isLoading}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isLoading}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isLoading}
                        >
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Sign In
                        </Button>

                        <Button
                          type="button"
                          variant="link"
                          className="w-full"
                          onClick={handleForgotPassword}
                          disabled={isLoading}
                        >
                          Forgot your password?
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="signup">
                  <Card>
                    <CardHeader>
                      <CardTitle>Create Account</CardTitle>
                      <CardDescription>
                        Join Halo Business Finance for secure business financing
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSignup} className="space-y-4">
                        <input type="hidden" name="csrf_token" value={csrfToken} />
                        
                        <div className="space-y-2">
                          <Label htmlFor="signup-name">Display Name</Label>
                          <Input
                            id="signup-name"
                            type="text"
                            value={signupForm.displayName}
                            onChange={(e) => setSignupForm(prev => ({ ...prev, displayName: e.target.value }))}
                            placeholder="Your full name"
                            required
                            disabled={isLoading}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-email">Email</Label>
                          <Input
                            id="signup-email"
                            type="email"
                            value={signupForm.email}
                            onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter your email"
                            required
                            disabled={isLoading}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-password">Password</Label>
                          <div className="relative">
                            <Input
                              id="signup-password"
                              type={showPassword ? 'text' : 'password'}
                              value={signupForm.password}
                              onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                              placeholder="Create a strong password"
                              required
                              disabled={isLoading}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isLoading}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                          <Input
                            id="signup-confirm-password"
                            type="password"
                            value={signupForm.confirmPassword}
                            onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            placeholder="Confirm your password"
                            required
                            disabled={isLoading}
                          />
                        </div>

                        <div className="text-sm text-muted-foreground">
                          <p>Password must contain:</p>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                            <li>At least 8 characters</li>
                            <li>One uppercase letter</li>
                            <li>One lowercase letter</li>
                            <li>One number</li>
                            <li>One special character (!@#$%^&*)</li>
                          </ul>
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isLoading}
                        >
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Create Account
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p>
                  By signing in, you agree to our{' '}
                  <a href="/terms-of-service" className="text-primary hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy-policy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default AuthPage;