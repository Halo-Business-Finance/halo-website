import React from 'react';
import SEO from "@/components/SEO";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AdminInitializer } from '@/components/security/AdminInitializer';
import DefaultPageHeader from '@/components/DefaultPageHeader';

const AdminInitializerPage: React.FC = () => {
  return (
    <>
      <SEO 
        title="Initialize System Administrator | Halo Business Finance"
        description="Initialize the first system administrator for secure access to the business financing platform."
        keywords="admin initialization, system security, administrator setup, business finance security"
        canonical="https://halobusinessfinance.com/admin-initializer"
      />
      <div className="min-h-screen bg-background">
        <Header />
        
        <DefaultPageHeader 
          title="System Administration Setup"
          subtitle="Initialize the first administrator to secure your business financing platform"
        />

        <section className="py-16">
          <div className="container mx-auto px-4 flex justify-center">
            <AdminInitializer />
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AdminInitializerPage;