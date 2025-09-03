import React from 'react';
import SEO from '@/components/SEO';
import { SecurityDashboard } from '@/components/security/SecurityDashboard';

const SecurityDashboardPage: React.FC = () => {
  return (
    <>
      <SEO 
        title="Security Dashboard - System Security Management"
        description="Comprehensive security monitoring and management dashboard for system administrators"
        keywords="security, dashboard, monitoring, administration, threat detection"
      />
      <SecurityDashboard />
    </>
  );
};

export default SecurityDashboardPage;