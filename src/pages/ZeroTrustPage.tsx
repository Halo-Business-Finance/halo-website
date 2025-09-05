import React from 'react';
import { ZeroTrustGuard } from '@/components/security/ZeroTrustGuard';
import { ZeroTrustDashboard } from '@/components/security/ZeroTrustDashboard';
import SEO from '@/components/SEO';

const ZeroTrustPage: React.FC = () => {
  return (
    <>
      <SEO 
        title="Zero Trust Security Dashboard"
        description="Enterprise-grade zero trust security monitoring and verification dashboard"
        keywords="zero trust, security, continuous verification, threat monitoring"
      />
      
      <ZeroTrustGuard 
        requiredTrustScore={70}
        requiredAccessLevel="elevated"
      >
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <ZeroTrustDashboard />
          </div>
        </div>
      </ZeroTrustGuard>
    </>
  );
};

export default ZeroTrustPage;