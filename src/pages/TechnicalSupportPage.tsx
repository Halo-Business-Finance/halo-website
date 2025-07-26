import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Lock, 
  User, 
  RefreshCw, 
  Mail, 
  Phone, 
  AlertCircle, 
  CheckCircle, 
  Shield,
  Key,
  Eye,
  HelpCircle
} from "lucide-react";

const TechnicalSupportPage = () => {
  return (
    <>
      <SEO 
        title="Technical Support | Login Help | Halo Business Finance"
        description="Get technical support for login issues with Halo Business Finance. Troubleshoot account access problems, password resets, and security questions."
        keywords="technical support, login help, account access, password reset, login troubleshooting, account recovery, login issues"
        canonical="https://halobusinessfinance.com/technical-support"
      />
      <div className="min-h-screen bg-background">
        <Header />
        
        <section className="relative bg-gradient-to-r from-financial-navy to-primary py-20">
          <div className="container mx-auto px-4">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Technical Support</h1>
              <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                Having trouble accessing your account? We're here to help you resolve login issues and get back to managing your business financing.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            {/* Quick Solutions */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-center mb-12">Common Login Solutions</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <Lock className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">Forgot Password</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      Reset your password using your registered email address.
                    </p>
                    <Button variant="outline" className="w-full">Reset Password</Button>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <User className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">Username Recovery</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      Recover your username using your email or phone number.
                    </p>
                    <Button variant="outline" className="w-full">Recover Username</Button>
                  </CardContent>
                </Card>

                <Card className="p-6">
                  <CardHeader className="p-0 mb-4">
                    <RefreshCw className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-lg">Account Locked</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-sm text-muted-foreground mb-4">
                      Unlock your account after multiple failed login attempts.
                    </p>
                    <Button variant="outline" className="w-full">Unlock Account</Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Troubleshooting Steps */}
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="text-3xl font-bold mb-8">Troubleshooting Steps</h2>
                
                <div className="space-y-6">
                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <h3 className="font-semibold mb-2">Check Your Credentials</h3>
                        <p className="text-sm text-muted-foreground">
                          Ensure you're using the correct username and password. Check for caps lock and special characters.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <h3 className="font-semibold mb-2">Clear Browser Cache</h3>
                        <p className="text-sm text-muted-foreground">
                          Clear your browser cache and cookies, then try logging in again.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <h3 className="font-semibold mb-2">Try Different Browser</h3>
                        <p className="text-sm text-muted-foreground">
                          Use a different browser or incognito/private mode to isolate the issue.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
                      <div>
                        <h3 className="font-semibold mb-2">Check Internet Connection</h3>
                        <p className="text-sm text-muted-foreground">
                          Ensure you have a stable internet connection and try refreshing the page.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-8">Security Features</h2>
                
                <div className="space-y-6">
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Account Security:</strong> Your account may be temporarily locked after 5 failed login attempts for security purposes.
                    </AlertDescription>
                  </Alert>

                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Key className="h-6 w-6 text-primary" />
                      <h3 className="font-semibold">Two-Factor Authentication</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      If you have 2FA enabled, make sure you have access to your authentication device or backup codes.
                    </p>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Eye className="h-6 w-6 text-primary" />
                      <h3 className="font-semibold">Password Requirements</h3>
                    </div>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• At least 8 characters long</li>
                      <li>• Contains uppercase and lowercase letters</li>
                      <li>• Includes at least one number</li>
                      <li>• Contains at least one special character</li>
                    </ul>
                  </Card>
                </div>
              </div>
            </div>

            {/* Contact Support */}
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-8">Still Need Help?</h2>
                <p className="text-muted-foreground mb-8">
                  If you're still experiencing issues after trying the solutions above, our technical support team is ready to assist you.
                </p>
                
                <div className="space-y-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-6 w-6 text-primary" />
                      <div>
                        <h4 className="font-semibold">Phone Support</h4>
                        <p className="text-2xl font-bold text-primary">(800) 730-8461</p>
                        <p className="text-sm text-muted-foreground">Available 24/7 for urgent login issues</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-6 w-6 text-primary" />
                      <div>
                        <h4 className="font-semibold">Email Support</h4>
                        <p className="text-lg font-semibold text-primary">tech@halobusinessfinance.com</p>
                        <p className="text-sm text-muted-foreground">Response within 2 hours</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
              
              <Card className="p-8">
                <h3 className="text-2xl font-bold mb-6">Submit Support Ticket</h3>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">First Name *</label>
                      <Input placeholder="Your first name" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Last Name *</label>
                      <Input placeholder="Your last name" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email *</label>
                    <Input type="email" placeholder="your.email@example.com" required />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Username (if known)</label>
                    <Input placeholder="Your account username" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Issue Type *</label>
                    <select className="w-full p-2 border rounded-md" required>
                      <option value="">Select issue type</option>
                      <option value="password-reset">Password Reset</option>
                      <option value="account-locked">Account Locked</option>
                      <option value="username-recovery">Username Recovery</option>
                      <option value="2fa-issues">Two-Factor Authentication</option>
                      <option value="browser-issues">Browser/Technical Issues</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Description *</label>
                    <Textarea 
                      placeholder="Please describe the issue you're experiencing in detail. Include any error messages you've seen."
                      rows={5} 
                      required 
                    />
                  </div>
                  <Button type="submit" className="w-full">Submit Support Ticket</Button>
                </form>
              </Card>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default TechnicalSupportPage;