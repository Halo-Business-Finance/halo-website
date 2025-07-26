import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, FileText, CheckCircle } from "lucide-react";

const NMLSCompliancePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="relative bg-gradient-to-r from-financial-navy to-primary py-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-white">
            <Badge className="bg-white text-primary mb-4">NMLS ID: 2272778</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">NMLS Compliance</h1>
            <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
              We are committed to maintaining the highest standards of compliance with all applicable regulations and licensing requirements.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">NMLS Licensed</h3>
                <p className="text-muted-foreground">Registered with NMLS ID: 2272778</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Fully Compliant</h3>
                <p className="text-muted-foreground">Meeting all regulatory requirements</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6">
              <CardContent className="p-0">
                <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">Transparent</h3>
                <p className="text-muted-foreground">Clear disclosure of all terms</p>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            <Card>
              <CardHeader>
                <CardTitle>Our NMLS Registration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Company Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Company Name:</strong> Halo Business Finance</div>
                      <div><strong>NMLS ID:</strong> 2272778</div>
                      <div><strong>Business Type:</strong> Commercial Loan Marketplace</div>
                      <div><strong>Headquarters:</strong> Irvine, California</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Licensing Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>NMLS Licensed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>State Compliant</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Federal Compliant</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Standards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Regulatory Compliance</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>Adherence to the S.A.F.E. Mortgage Licensing Act requirements</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>Compliance with state and federal lending regulations</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>Regular compliance monitoring and reporting</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>Ongoing education and training requirements</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Consumer Protection</h4>
                    <ul className="space-y-2 text-muted-foreground">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>Clear and transparent loan terms disclosure</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>Fair lending practices and non-discrimination policies</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>Secure handling of personal and financial information</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span>Complaint resolution procedures</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Important Disclosures</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm text-muted-foreground">
                  <p>
                    <strong>Marketplace Role:</strong> Halo Business Finance operates as a commercial loan marketplace 
                    connecting borrowers with qualified lenders. We are not a direct lender and do not make lending decisions.
                  </p>
                  <p>
                    <strong>Loan Approval:</strong> All loan programs are subject to credit approval and terms may vary by lender. 
                    We do not guarantee loan approval or specific terms.
                  </p>
                  <p>
                    <strong>Licensing:</strong> Licensed in multiple states. Licensing information available upon request 
                    and through the NMLS Consumer Access website.
                  </p>
                  <p>
                    <strong>Contact Information:</strong> For questions about our licensing or compliance, 
                    please contact us at (800) 730-8461 or info@halobusinessfinance.com.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Verify Our License</h3>
              <p className="text-muted-foreground mb-4">
                You can verify our NMLS license and view additional information through the official NMLS Consumer Access website.
              </p>
              <a 
                href="https://www.nmlsconsumeraccess.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                Visit NMLS Consumer Access
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NMLSCompliancePage;