import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, FileText, CheckCircle, ExternalLink, Users, Eye, FileCheck } from "lucide-react";
import nmlsComplianceHeader from "@/assets/nmls-compliance-header.jpg";
import nmlsRegistration from "@/assets/nmls-registration.jpg";
import consumerProtection from "@/assets/consumer-protection.jpg";
import complianceMonitoring from "@/assets/compliance-monitoring.jpg";

const NMLSCompliancePage = () => {
  return (
    <>
      <SEO 
        title="NMLS Compliance | NMLS ID: 2272778 | Halo Business Finance"
        description="View Halo Business Finance's NMLS compliance information. NMLS ID: 2272778. Full regulatory compliance with federal and state lending requirements."
        keywords="NMLS compliance, NMLS ID 2272778, mortgage licensing, regulatory compliance, S.A.F.E. act, commercial lending compliance"
        canonical="https://halobusinessfinance.com/nmls-compliance"
      />
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <img 
            src={nmlsComplianceHeader} 
            alt="Professional NMLS compliance and regulatory oversight in modern business environment"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-financial-navy/80 to-primary/70"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <Badge className="bg-white text-primary mb-4">NMLS ID: 2272778</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">NMLS Compliance</h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Committed to the highest standards of regulatory compliance
              </p>
              <p className="text-lg opacity-80">
                We maintain full compliance with all applicable regulations and licensing requirements
              </p>
            </div>
          </div>
        </section>

        {/* Overview Cards */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-3 gap-8 mb-16">
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">NMLS Licensed</h3>
                  <p className="text-muted-foreground">Registered with NMLS ID: 2272778</p>
                </CardContent>
              </Card>
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Fully Compliant</h3>
                  <p className="text-muted-foreground">Meeting all regulatory requirements</p>
                </CardContent>
              </Card>
              <Card className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Transparent</h3>
                  <p className="text-muted-foreground">Clear disclosure of all terms</p>
                </CardContent>
              </Card>
            </div>

            {/* NMLS Registration Section */}
            <div className="grid lg:grid-cols-2 gap-12 mb-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our NMLS Registration</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Halo Business Finance is registered with the Nationwide Multistate Licensing System (NMLS) 
                  under ID 2272778. This registration demonstrates our commitment to regulatory compliance 
                  and consumer protection in commercial lending.
                </p>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Company Information</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div><strong>Company Name:</strong> Halo Business Finance</div>
                        <div><strong>NMLS ID:</strong> 2272778</div>
                        <div><strong>Business Type:</strong> Commercial Loan Marketplace</div>
                        <div><strong>Headquarters:</strong> Irvine, California</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Licensing Status</h4>
                      <div className="space-y-1 text-sm">
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
                </div>
              </div>
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={nmlsRegistration} 
                  alt="Professional NMLS registration and licensing process"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Consumer Protection Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 mb-16 items-center">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={consumerProtection} 
                  alt="Professional team ensuring consumer protection and fair lending practices"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-6">Consumer Protection</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  We prioritize consumer protection through transparent lending practices, fair treatment, 
                  and clear disclosure of all loan terms. Our commitment extends beyond regulatory 
                  requirements to ensure the best experience for our clients.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Clear and transparent loan terms disclosure</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Fair lending practices and non-discrimination policies</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Secure handling of personal and financial information</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Comprehensive complaint resolution procedures</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Monitoring Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 mb-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Continuous Compliance Monitoring</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Our dedicated compliance team continuously monitors regulatory changes and ensures 
                  ongoing adherence to all NMLS requirements. We maintain robust systems to track 
                  compliance metrics and implement updates as needed.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FileCheck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Adherence to the S.A.F.E. Mortgage Licensing Act requirements</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileCheck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Compliance with state and federal lending regulations</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileCheck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Regular compliance monitoring and reporting</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileCheck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">Ongoing education and training requirements</span>
                  </div>
                </div>
              </div>
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={complianceMonitoring} 
                  alt="Professional compliance monitoring center with regulatory oversight systems"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>
            </div>

            {/* Important Disclosures */}
            <div className="max-w-4xl mx-auto space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Important Disclosures</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <p>
                      <strong>Direct Lender:</strong> Halo Business Finance is a direct CRE & equipment lender 
                      providing commercial financing solutions to businesses nationwide.
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

              <div className="text-center">
                <Card className="bg-primary text-white">
                  <CardContent className="py-12 px-8">
                    <Shield className="h-16 w-16 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-4">Verify Our NMLS License</h3>
                    <p className="text-lg mb-6 opacity-90">
                      You can verify our NMLS license and view additional information through the 
                      official NMLS Consumer Access website.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild>
                        <a href="https://www.nmlsconsumeraccess.org/" target="_blank" rel="noopener noreferrer">
                          Visit NMLS Consumer Access
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                        Contact Compliance Team
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default NMLSCompliancePage;