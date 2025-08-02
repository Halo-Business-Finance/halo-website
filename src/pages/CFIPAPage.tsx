import { Helmet } from "react-helmet-async";
import DefaultPageHeader from "@/components/DefaultPageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, UserCheck, FileText, Bell, Scale } from "lucide-react";

const CFIPAPage = () => {
  return (
    <>
      <Helmet>
        <title>California Financial Information Privacy Act (CFIPA) | Halo Business Finance</title>
        <meta 
          name="description" 
          content="Learn about your privacy rights under the California Financial Information Privacy Act (CFIPA) and how Halo Business Finance protects and handles your nonpublic personal information." 
        />
        <meta name="keywords" content="CFIPA, California Financial Information Privacy Act, financial privacy, data protection, consumer rights, Halo Business Finance" />
      </Helmet>

      <DefaultPageHeader
        title="California Financial Information Privacy Act (CFIPA)"
        subtitle="Your privacy rights and how we protect your nonpublic personal information"
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introduction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                Your Privacy Rights Under CFIPA
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The California Financial Information Privacy Act (CFIPA) provides California consumers with important rights 
                regarding how their nonpublic personal information is collected, shared, and sold by financial institutions. 
                As a California-licensed commercial finance company, Halo Business Finance is committed to protecting your 
                privacy and providing you with meaningful choices about your personal information.
              </p>
              <p className="text-muted-foreground">
                This notice explains your rights under CFIPA and describes how we collect, use, share, and protect your 
                nonpublic personal information.
              </p>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We collect nonpublic personal information about you from the following sources:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Information you provide on applications and other forms</li>
                <li>Information about your transactions with us or others</li>
                <li>Information we receive from consumer reporting agencies</li>
                <li>Information obtained from public records</li>
                <li>Information collected through our website and digital interactions</li>
              </ul>
              <p className="text-muted-foreground">
                This may include your name, address, Social Security number, income, credit history, 
                business financial information, and other details necessary to evaluate your loan application.
              </p>
            </CardContent>
          </Card>

          {/* How We Use Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-primary" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We use your nonpublic personal information to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Process your loan applications and provide financial services</li>
                <li>Verify your identity and prevent fraud</li>
                <li>Comply with federal and state regulations</li>
                <li>Communicate with you about your account and services</li>
                <li>Improve our products and services</li>
                <li>Market financial products that may be of interest to you</li>
              </ul>
            </CardContent>
          </Card>

          {/* Information Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-6 w-6 text-primary" />
                Information Sharing and Your Choices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We may share your nonpublic personal information with:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Our lending partners and financial institutions in our marketplace</li>
                <li>Service providers who assist us in providing our services</li>
                <li>Third parties as required by law or regulation</li>
                <li>Companies that perform marketing services on our behalf</li>
              </ul>
              
              <div className="bg-primary/10 p-4 rounded-lg">
                <h4 className="font-semibold text-primary mb-2">Your Right to Opt-Out</h4>
                <p className="text-muted-foreground">
                  Under CFIPA, you have the right to direct us not to share your nonpublic personal information 
                  with certain third parties. You may opt-out of information sharing for marketing purposes by:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-muted-foreground">
                  <li>Calling us at (888) 970-4256</li>
                  <li>Emailing us at privacy@halobusinessfinance.com</li>
                  <li>Writing to us at: Halo Business Finance, 3 Park Plaza, Suite 1100, Irvine, CA 92614</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-6 w-6 text-primary" />
                Your CFIPA Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Under the California Financial Information Privacy Act, you have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><strong>Know:</strong> What nonpublic personal information we collect about you</li>
                <li><strong>Opt-Out:</strong> Direct us not to share your information with certain third parties</li>
                <li><strong>Access:</strong> Request access to the personal information we have about you</li>
                <li><strong>Correct:</strong> Request correction of inaccurate personal information</li>
                <li><strong>Delete:</strong> Request deletion of your personal information (subject to legal limitations)</li>
                <li><strong>Non-Discrimination:</strong> Not be discriminated against for exercising your privacy rights</li>
              </ul>
            </CardContent>
          </Card>

          {/* Security Measures */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                How We Protect Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                We maintain physical, electronic, and procedural safeguards to protect your nonpublic personal information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure access controls and authentication systems</li>
                <li>Regular security assessments and monitoring</li>
                <li>Employee training on privacy and security practices</li>
                <li>Compliance with industry security standards</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-6 w-6 text-primary" />
                Contact Us About Your Privacy Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                If you have questions about this CFIPA notice or wish to exercise your privacy rights, please contact us:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Privacy Officer</h4>
                  <p className="text-muted-foreground">
                    Email: privacy@halobusinessfinance.com<br />
                    Phone: (888) 970-4256<br />
                    Hours: Monday - Friday, 8:00 AM - 6:00 PM PST
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Mailing Address</h4>
                  <p className="text-muted-foreground">
                    Halo Business Finance<br />
                    Attn: Privacy Officer<br />
                    3 Park Plaza, Suite 1100<br />
                    Irvine, CA 92614
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Updates to This Notice</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We may update this CFIPA notice from time to time. When we do, we will post the updated notice on our website 
                and update the effective date. We encourage you to review this notice periodically to stay informed about how 
                we protect your privacy.
              </p>
              <p className="text-muted-foreground mt-4">
                <strong>Last Updated:</strong> January 2025
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default CFIPAPage;