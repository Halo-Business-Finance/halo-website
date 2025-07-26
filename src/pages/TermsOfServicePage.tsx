import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative bg-gradient-to-r from-financial-navy to-primary py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              These terms govern your use of our website and services. Please read them carefully before using our platform.
            </p>
            <p className="text-sm opacity-75">Last updated: December 2024</p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  By accessing and using the Halo Business Finance website and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                </p>
                <p>
                  These terms may be updated from time to time, and your continued use of our services constitutes acceptance of any changes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description of Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Halo Business Finance operates as a commercial loan marketplace that connects business borrowers with qualified lenders. Our services include:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Loan application processing and submission to lenders</li>
                  <li>Pre-qualification services for business financing</li>
                  <li>Educational resources and loan calculators</li>
                  <li>Customer support throughout the lending process</li>
                </ul>
                <p className="font-semibold text-foreground">
                  Important: We are not a direct lender and do not make lending decisions. All loan approvals and terms are determined by individual lenders in our network.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>As a user of our services, you agree to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Provide accurate and truthful information in all applications and communications</li>
                  <li>Maintain the confidentiality of any login credentials</li>
                  <li>Use our services only for lawful business purposes</li>
                  <li>Not attempt to circumvent our security measures or systems</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Application Process and Fees</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">No Cost to Borrowers</h4>
                  <p>Our marketplace service is provided at no cost to borrowers. We are compensated by lenders when loans are successfully funded.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Application Submission</h4>
                  <p>By submitting an application, you authorize us to:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Share your information with qualified lenders in our network</li>
                    <li>Obtain credit reports and verify the information provided</li>
                    <li>Contact you regarding your application and other financing opportunities</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Disclaimers and Limitations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">No Guarantee of Approval</h4>
                  <p>We do not guarantee loan approval, specific terms, or funding. All lending decisions are made solely by individual lenders based on their own criteria.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Information Accuracy</h4>
                  <p>While we strive to provide accurate information, we make no warranties about the completeness or accuracy of content on our website.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Third-Party Services</h4>
                  <p>Our website may contain links to third-party websites or services. We are not responsible for the content or practices of these third parties.</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy and Data Protection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our Privacy Policy, which is incorporated into these Terms of Service by reference.
                </p>
                <p>
                  By using our services, you consent to the collection and use of your information as described in our Privacy Policy.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Intellectual Property</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  All content on our website, including text, graphics, logos, and software, is the property of Halo Business Finance or our licensors and is protected by copyright and other intellectual property laws.
                </p>
                <p>
                  You may not reproduce, distribute, or create derivative works from our content without express written permission.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  To the maximum extent permitted by law, Halo Business Finance shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.
                </p>
                <p>
                  Our total liability for any claims related to our services shall not exceed the amount of fees, if any, that you have paid to us.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Governing Law and Disputes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  These Terms of Service are governed by the laws of the State of California, without regard to conflict of law principles.
                </p>
                <p>
                  Any disputes arising from these terms or our services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>If you have questions about these Terms of Service, please contact us:</p>
                <div className="mt-4 space-y-2">
                  <p><strong>Email:</strong> legal@halobusinessfinance.com</p>
                  <p><strong>Phone:</strong> (800) 730-8461</p>
                  <p><strong>Mail:</strong> Halo Business Finance<br />
                  Legal Department<br />
                  Irvine, CA</p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Severability</h3>
              <p className="text-muted-foreground">
                If any provision of these Terms of Service is found to be invalid or unenforceable, the remaining provisions shall continue to be valid and enforceable to the fullest extent permitted by law.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default TermsOfServicePage;