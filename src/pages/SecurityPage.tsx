import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Lock, 
  CheckCircle, 
  Globe, 
  Server, 
  Key, 
  FileCheck, 
  AlertTriangle,
  Award,
  Eye,
  Database,
  Zap
} from "lucide-react";
import SEO from "@/components/SEO";
import fintechBlockchainHeader from "@/assets/fintech-blockchain-header.jpg";
import dataEncryptionSecurity from "@/assets/data-encryption-security.jpg";
import complianceDashboard from "@/assets/compliance-dashboard.jpg";
import accessControlMfa from "@/assets/access-control-mfa.jpg";
import securityMonitoringCenter from "@/assets/security-monitoring-center.jpg";

const SecurityPage = () => {
  const securityFeatures = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "SSL/TLS Encryption",
      description: "All data transmission is protected with 256-bit SSL encryption",
      status: "A+"
    },
    {
      icon: <Lock className="h-8 w-8 text-primary" />,
      title: "Data Protection",
      description: "Advanced encryption for all stored personal and financial data",
      status: "Secured"
    },
    {
      icon: <Key className="h-8 w-8 text-primary" />,
      title: "Access Control",
      description: "Multi-factor authentication and role-based access controls",
      status: "Enabled"
    },
    {
      icon: <Server className="h-8 w-8 text-primary" />,
      title: "Secure Infrastructure",
      description: "Cloud-based infrastructure with 99.9% uptime guarantee",
      status: "Active"
    },
    {
      icon: <Eye className="h-8 w-8 text-primary" />,
      title: "Security Monitoring",
      description: "24/7 security monitoring and threat detection systems",
      status: "Monitored"
    },
    {
      icon: <Database className="h-8 w-8 text-primary" />,
      title: "Data Backup",
      description: "Automated daily backups with disaster recovery protocols",
      status: "Protected"
    }
  ];

  const complianceStandards = [
    {
      name: "SOC 2 Type II",
      description: "Service Organization Control 2 compliance for security controls",
      status: "Certified",
      icon: <Award className="h-6 w-6 text-primary" />
    },
    {
      name: "GLBA Compliance",
      description: "Gramm-Leach-Bliley Act compliance for financial privacy",
      status: "Compliant",
      icon: <FileCheck className="h-6 w-6 text-primary" />
    },
    {
      name: "PCI DSS",
      description: "Payment Card Industry Data Security Standard",
      status: "Level 1",
      icon: <CheckCircle className="h-6 w-6 text-primary" />
    },
    {
      name: "CCPA/GDPR",
      description: "California Consumer Privacy Act and GDPR compliance",
      status: "Compliant",
      icon: <Globe className="h-6 w-6 text-primary" />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Security & Data Protection | Halo Business Finance"
        description="Learn about Halo Business Finance's comprehensive security measures, data protection protocols, and compliance standards that protect your business information."
        keywords="security, data protection, SSL encryption, compliance, GLBA, SOC 2, business finance security"
      />
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <img 
          src={fintechBlockchainHeader} 
          alt="Digital fintech blockchain security with advanced cybersecurity measures"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-financial-navy/80 to-primary/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Security & Data Protection
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Your security is our top priority. Learn about our comprehensive measures to protect your data.
            </p>
            <div className="flex items-center justify-center gap-4 mb-6">
              <Badge className="bg-green-500 text-white px-4 py-2 text-lg">
                <Shield className="h-5 w-5 mr-2" />
                Security Grade: A+
              </Badge>
              <Badge className="bg-blue-500 text-white px-4 py-2 text-lg">
                <Zap className="h-5 w-5 mr-2" />
                99.9% Uptime
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Security Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enterprise-Grade Security
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Our HBF-Application platform employs military-grade encryption and industry-leading 
              security protocols to ensure your sensitive business and financial data remains protected at all times.
            </p>
            
            {/* Security Overview Image */}
            <div className="max-w-4xl mx-auto mb-12">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={securityMonitoringCenter} 
                  alt="Professional cybersecurity monitoring center with threat detection systems"
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-xl font-semibold mb-2">24/7 Security Monitoring</h3>
                  <p className="text-sm opacity-90">Advanced threat detection and real-time security analytics</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 mb-4">
                    {feature.icon}
                    <div>
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {feature.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Compliance Standards */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Compliance & Certifications
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              We maintain the highest standards of regulatory compliance and industry certifications 
              to ensure your data is handled according to federal and international requirements.
            </p>
            
            {/* Compliance Dashboard Image */}
            <div className="max-w-3xl mx-auto mb-12">
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <img 
                  src={complianceDashboard} 
                  alt="Fintech compliance and certification dashboard with security badges"
                  className="w-full h-48 md:h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {complianceStandards.map((standard, index) => (
              <Card key={index} className="p-6">
                <CardHeader className="p-0 mb-4">
                  <div className="flex items-center gap-3">
                    {standard.icon}
                    <div>
                      <CardTitle className="text-xl">{standard.name}</CardTitle>
                      <Badge className="bg-green-100 text-green-800 mt-1">
                        {standard.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <p className="text-muted-foreground">{standard.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Protection Measures */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How We Protect Your Data
              </h2>
              <p className="text-xl text-muted-foreground">
                Comprehensive data protection throughout your entire loan application process
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8">
                <CardContent className="p-0">
                  {/* Data Encryption Image */}
                  <div className="w-full h-40 rounded-lg overflow-hidden mb-6">
                    <img 
                      src={dataEncryptionSecurity} 
                      alt="Professional data encryption and security visualization"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Data Encryption</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">256-bit AES Encryption</p>
                        <p className="text-sm text-muted-foreground">All data encrypted at rest and in transit</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Secure Key Management</p>
                        <p className="text-sm text-muted-foreground">Advanced key rotation and management protocols</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">End-to-End Protection</p>
                        <p className="text-sm text-muted-foreground">Secure transmission from your device to our servers</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-8">
                <CardContent className="p-0">
                  {/* Access Control Image */}
                  <div className="w-full h-40 rounded-lg overflow-hidden mb-6">
                    <img 
                      src={accessControlMfa} 
                      alt="Multi-factor authentication and access control systems"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Access Controls</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Multi-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Required for all account access</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Role-Based Permissions</p>
                        <p className="text-sm text-muted-foreground">Least-privilege access principles</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Session Management</p>
                        <p className="text-sm text-muted-foreground">Automatic timeout and secure session handling</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Security Alerts */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-8 border-l-4 border-l-yellow-500">
            <CardContent className="p-0">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-8 w-8 text-yellow-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold mb-4">Security Best Practices</h3>
                  <p className="text-muted-foreground mb-6">
                    While we maintain the highest security standards, here are some recommendations to help protect your account:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-1" />
                        <span className="text-sm">Use a strong, unique password</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-1" />
                        <span className="text-sm">Enable two-factor authentication</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-1" />
                        <span className="text-sm">Keep your browser updated</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-1" />
                        <span className="text-sm">Log out when finished</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-1" />
                        <span className="text-sm">Avoid public Wi-Fi for sensitive data</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-primary mt-1" />
                        <span className="text-sm">Report suspicious activity immediately</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Questions About Our Security?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our security team is available to answer any questions about our data protection measures and compliance standards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
                onClick={() => window.open('/contact-us', '_blank')}
              >
                Contact Security Team
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3"
                onClick={() => window.open('/technical-support', '_blank')}
              >
                Technical Support
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SecurityPage;