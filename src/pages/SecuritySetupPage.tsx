import React from 'react';
import SEO from '@/components/SEO';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AdminInitializer } from '@/components/security/AdminInitializer';

const SecuritySetupPage = () => {
  return (
    <>
      <SEO 
        title="Security Setup | Halo Business Finance"
        description="Initialize security features and admin access for Halo Business Finance platform"
        keywords="security setup, admin initialization, business finance security"
        canonical="https://halobusinessfinance.com/security-setup"
      />
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Security Setup
              </h1>
              <p className="text-xl text-muted-foreground">
                Initialize your security system and create your first admin user
              </p>
            </div>

            <div className="flex justify-center">
              <AdminInitializer />
            </div>

            <div className="mt-12 bg-muted rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">Security Features</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Authentication Security</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Secure redirect URL validation</li>
                    <li>• Enhanced password reset protection</li>
                    <li>• Advanced session management</li>
                    <li>• Role-based access control</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Data Protection</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• End-to-end encryption</li>
                    <li>• Sensitive data sanitization</li>
                    <li>• PII masking and protection</li>
                    <li>• Secure error handling</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Monitoring & Alerts</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Real-time security monitoring</li>
                    <li>• Automated threat detection</li>
                    <li>• Security event logging</li>
                    <li>• Admin notification system</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Compliance & Headers</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Content Security Policy (CSP)</li>
                    <li>• Security headers enforcement</li>
                    <li>• CORS protection</li>
                    <li>• Production hardening</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default SecuritySetupPage;