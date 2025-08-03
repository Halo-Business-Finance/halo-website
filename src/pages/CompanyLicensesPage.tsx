import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  FileCheck, 
  Award, 
  ExternalLink,
  CheckCircle,
  Building2,
  Landmark,
  Scale
} from "lucide-react";
import companyLicensesHeader from "@/assets/company-licenses-header.jpg";
import licensesProfessionals from "@/assets/licenses-professionals.jpg";
import complianceDocumentation from "@/assets/compliance-documentation.jpg";
import certificationProcess from "@/assets/certification-process.jpg";
import regulatoryOversight from "@/assets/regulatory-oversight.jpg";

const CompanyLicensesPage = () => {
  const licenses = [
    {
      name: "NMLS Company License",
      number: "2272778",
      issuer: "Nationwide Multistate Licensing System",
      status: "Active",
      description: "Federal registration for commercial mortgage lending activities",
      verificationLink: "https://www.nmlsconsumeraccess.org/EntityDetails.aspx/COMPANY/2272778",
      icon: <Landmark className="h-6 w-6 text-primary" />
    },
    {
      name: "California CFL License", 
      number: "60DBO-178064",
      issuer: "Department of Financial Protection and Innovation",
      status: "Active",
      description: "Lender & Broker License - California Commercial Financing Law license for commercial lending",
      verificationLink: "https://dfpi.ca.gov/search-result-detail/?id=9C8FC0F1-6FF5-ED11-815A-0050569B0F40",
      icon: <Scale className="h-6 w-6 text-primary" />
    },
    {
      name: "SBA Nationwide SBA & Commercial Loan Marketplace",
      number: "Verified",
      issuer: "Small Business Administration",
      status: "Active", 
      description: "Authorized participant in SBA loan programs nationwide",
      verificationLink: "https://www.sba.gov/",
      icon: <Building2 className="h-6 w-6 text-primary" />
    },
    {
      name: "Better Business Bureau",
      number: "Accredited",
      issuer: "Better Business Bureau",
      status: "A+ Rating",
      description: "BBB accredited business since 2019 with highest rating",
      verificationLink: "https://www.bbb.org/us/ca/irvine/profile/small-business-loans/halo-business-finance-corp-1126-1000144399/#sealclick",
      icon: <Award className="h-6 w-6 text-primary" />
    }
  ];

  const complianceStandards = [
    {
      name: "Fair Credit Reporting Act (FCRA)",
      description: "Compliance with federal credit reporting regulations"
    },
    {
      name: "Truth in Lending Act (TILA)",
      description: "Full disclosure of lending terms and conditions"
    },
    {
      name: "Equal Credit Opportunity Act (ECOA)",
      description: "Fair lending practices without discrimination"
    },
    {
      name: "Gramm-Leach-Bliley Act (GLBA)",
      description: "Financial privacy and data protection compliance"
    },
    {
      name: "Bank Secrecy Act (BSA)",
      description: "Anti-money laundering and reporting requirements"
    },
    {
      name: "California Consumer Privacy Act (CCPA)",
      description: "California consumer privacy protection compliance"
    }
  ];

  return (
    <>
      <SEO 
        title="Company Licenses & Regulatory Compliance | Halo Business Finance"
        description="View Halo Business Finance's licenses, certifications, and regulatory compliance. NMLS #2272778, California CFL License, SBA authorized lender."
        keywords="company licenses, NMLS license, California CFL, regulatory compliance, SBA authorized, business finance licenses, lending compliance"
        canonical="https://halobusinessfinance.com/company-licenses"
      />
      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <img 
            src={companyLicensesHeader} 
            alt="Professional business licensing and regulatory compliance documentation"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-financial-navy/80 to-primary/70"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <Badge className="bg-white text-primary mb-4">Fully Licensed & Compliant</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Company Licenses & Regulatory Compliance
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Transparency in our licensing and regulatory compliance
              </p>
              <p className="text-lg opacity-80">
                We maintain all required licenses and certifications to operate as a commercial lender nationwide
              </p>
            </div>
          </div>
        </section>

        {/* Licenses Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 mb-16 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Professional Licenses</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Halo Business Finance maintains all required state and federal licenses to operate 
                  as a commercial lender. Our licenses ensure we meet strict regulatory standards 
                  and provide our clients with the highest level of professional service.
                </p>
                <p className="text-muted-foreground">
                  We are committed to full transparency regarding our licensing and regulatory compliance. 
                  All licenses are kept current and are subject to regular regulatory oversight.
                </p>
              </div>
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={licensesProfessionals} 
                  alt="Professional team managing licenses and regulatory compliance"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-16">
              {licenses.map((license, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        {license.icon}
                        <Badge variant={license.status === "Active" || license.status === "A+ Rating" ? "default" : "secondary"}>
                          {license.status}
                        </Badge>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-xl">{license.name}</CardTitle>
                    <p className="text-sm text-primary font-medium">License #{license.number}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Issuing Authority:</strong> {license.issuer}
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      {license.description}
                    </p>
                    
                    {/* Add BBB Seal for Better Business Bureau card */}
                    {license.name === "Better Business Bureau" && (
                      <div className="mb-4 text-center">
                        <a 
                          href={license.verificationLink}
                          target="_blank" 
                          rel="nofollow"
                          className="inline-block"
                        >
                          <img 
                            src="https://seal-central-northern-western-arizona.bbb.org/seals/blue-seal-96-50-bbb-1000144399.png" 
                            style={{border: 0}} 
                            alt="Halo Business Finance Corp BBB Business Review" 
                            className="h-12 w-auto mx-auto"
                          />
                        </a>
                      </div>
                    )}
                    
                    <a 
                      href={license.verificationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm font-medium inline-flex items-center gap-1"
                    >
                      Verify License
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-12 mb-16 items-center">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={complianceDocumentation} 
                  alt="Professional team reviewing compliance documentation and regulatory requirements"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Comprehensive Documentation</h3>
                <p className="text-lg text-muted-foreground mb-4">
                  Our compliance team maintains detailed documentation of all licenses, certifications, 
                  and regulatory requirements. We ensure every aspect of our licensing is properly 
                  documented and readily available for review.
                </p>
                <p className="text-muted-foreground">
                  Regular audits and reviews ensure our documentation remains current and compliant 
                  with all applicable regulations and industry standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Certification Process Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 mb-16 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4">Rigorous Certification Process</h3>
                <p className="text-lg text-muted-foreground mb-4">
                  Each of our licenses undergoes a rigorous application and review process by 
                  regulatory authorities. We work closely with regulatory bodies to ensure 
                  full compliance with all requirements.
                </p>
                <p className="text-muted-foreground">
                  Our experienced compliance team manages the entire certification process, 
                  from initial applications to ongoing renewals and regulatory updates.
                </p>
              </div>
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={certificationProcess} 
                  alt="Professional certification and regulatory approval process in government office"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Standards */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 mb-16 items-center">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={regulatoryOversight} 
                  alt="Regulatory oversight and monitoring systems for business compliance"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Continuous Regulatory Oversight</h3>
                <p className="text-lg text-muted-foreground mb-4">
                  We maintain ongoing monitoring systems to ensure continuous compliance with 
                  all regulatory requirements. Our oversight systems track regulatory changes 
                  and ensure timely updates to our processes.
                </p>
                <p className="text-muted-foreground">
                  Real-time compliance monitoring helps us stay ahead of regulatory changes 
                  and maintain the highest standards of professional conduct.
                </p>
              </div>
            </div>

            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Regulatory Compliance</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We adhere to all applicable federal and state regulations governing commercial lending
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {complianceStandards.map((standard, index) => (
                <Card key={index} className="text-center p-6">
                  <CardContent className="p-0">
                    <CheckCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-bold mb-2">{standard.name}</h3>
                    <p className="text-sm text-muted-foreground">{standard.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Card className="bg-primary text-white max-w-4xl mx-auto">
                <CardContent className="py-12 px-8">
                  <Shield className="h-16 w-16 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-4">Your Protection is Our Priority</h3>
                  <p className="text-lg mb-6 opacity-90">
                    Our comprehensive licensing and regulatory compliance ensures that your business 
                    receives the highest standard of professional service and protection.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="bg-white text-primary hover:bg-gray-100" asChild>
                      <a href="https://preview--hbf-application.lovable.app/auth">Get Started Today</a>
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                      Contact Our Team
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default CompanyLicensesPage;