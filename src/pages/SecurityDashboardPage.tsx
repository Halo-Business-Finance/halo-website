import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SecurityDashboard } from "@/components/security/SecurityDashboard";
import DefaultPageHeader from "@/components/DefaultPageHeader";

const SecurityDashboardPage = () => {
  return (
    <>
      <SEO 
        title="Security Dashboard | Halo Business Finance | Real-time Security Monitoring"
        description="Monitor your application's security with real-time threat detection, security event tracking, and comprehensive analytics dashboard."
        keywords="security dashboard, threat monitoring, security analytics, real-time protection, security events, application security"
        canonical="https://halobusinessfinance.com/security-dashboard"
      />
      <div className="min-h-screen bg-background">
        <Header />
        
        <DefaultPageHeader 
          title="Security Dashboard"
          subtitle="Real-time security monitoring and threat detection for your business financing platform"
        />

        <section className="py-16">
          <div className="container mx-auto px-4">
            <SecurityDashboard />
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default SecurityDashboardPage;