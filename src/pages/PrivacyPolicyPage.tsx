import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import privacyPolicyHeader from "@/assets/privacy-policy-header.jpg";
import dataProtectionTeam from "@/assets/data-protection-team.jpg";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative py-20 overflow-hidden">
        <img 
          src={privacyPolicyHeader} 
          alt="Privacy policy and data protection in modern business environment"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-financial-navy/80 to-primary/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
            <p className="text-sm opacity-75">Last updated: December 2024</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 mb-16 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Commitment to Your Privacy</h2>
              <p className="text-lg text-muted-foreground mb-6">
                At Halo Business Finance, we understand that your personal and financial information is sensitive. 
                Our dedicated privacy and security team works around the clock to ensure your data is protected 
                with industry-leading security measures and compliance standards.
              </p>
              <p className="text-muted-foreground">
                We follow strict data protection protocols and are committed to transparency in how we collect, 
                use, and safeguard your information throughout the loan application process.
              </p>
            </div>
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <img 
                src={dataProtectionTeam} 
                alt="Professional team reviewing data security and privacy compliance"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
          </div>
          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Personal Information</h4>
                  <p>When you apply for financing or use our services, we may collect:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Name, address, phone number, and email address</li>
                    <li>Social Security Number and date of birth</li>
                    <li>Business information and financial statements</li>
                    <li>Credit history and banking information</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Automatically Collected Information</h4>
                  <p>We automatically collect certain information when you visit our website:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>IP address and browser information</li>
                    <li>Pages visited and time spent on our site</li>
                    <li>Referring website information</li>
                    <li>Device and operating system information</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>We use your information for the following purposes:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Processing your loan application and connecting you with lenders</li>
                  <li>Verifying your identity and conducting background checks</li>
                  <li>Communicating with you about your application and our services</li>
                  <li>Improving our website and services</li>
                  <li>Complying with legal and regulatory requirements</li>
                  <li>Preventing fraud and maintaining security</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Information Sharing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">With Lenders</h4>
                  <p>We share your information with qualified lenders in our network to facilitate loan applications and funding decisions.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">With Service Providers</h4>
                  <p>We may share information with trusted third-party service providers who assist us in operating our business and providing services to you.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Legal Requirements</h4>
                  <p>We may disclose information when required by law, regulation, or legal process, or to protect our rights and interests.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>We implement appropriate security measures to protect your personal information:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Encryption of sensitive data in transit and at rest</li>
                  <li>Secure servers and network infrastructure</li>
                  <li>Access controls and authentication measures</li>
                  <li>Regular security assessments and updates</li>
                  <li>Employee training on data protection practices</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>You have certain rights regarding your personal information:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Access to your personal information we have collected</li>
                  <li>Correction of inaccurate or incomplete information</li>
                  <li>Deletion of your personal information in certain circumstances</li>
                  <li>Opt-out of certain communications</li>
                  <li>Data portability in machine-readable format</li>
                </ul>
                <p className="mt-4">To exercise these rights, please contact us at privacy@halobusinessfinance.com.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze website traffic and usage patterns</li>
                  <li>Provide personalized content and advertisements</li>
                  <li>Improve our website functionality</li>
                </ul>
                <p className="mt-4">You can control cookie settings through your browser preferences.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>If you have questions about this Privacy Policy or our data practices, please contact us:</p>
                <div className="mt-4 space-y-2">
                  <p><strong>Email:</strong> privacy@halobusinessfinance.com</p>
                  <p><strong>Phone:</strong> (800) 730-8461</p>
                  <p><strong>Mail:</strong> Halo Business Finance<br />
                  Privacy Officer<br />
                  Irvine, CA</p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Policy Updates</h3>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on our website and updating the "Last updated" date above. Your continued use of our services after any changes indicates your acceptance of the updated policy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;