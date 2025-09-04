import React, { lazy, Suspense } from "react";
import SEO from "@/components/SEO";

// Simple header component for now
const SimpleHeader = () => (
  <header className="bg-background border-b">
    <div className="container mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold text-foreground">Halo Business Finance</h1>
    </div>
  </header>
);

// Simple hero component
const SimpleHero = () => (
  <section className="bg-primary text-primary-foreground py-20">
    <div className="container mx-auto px-4 text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
        Business Financing that Grows with You
      </h1>
      <p className="text-xl mb-8 max-w-2xl mx-auto">
        SBA Loans, Commercial Financing & Bridge Loans for your business success
      </p>
      <button className="bg-secondary text-secondary-foreground px-8 py-3 rounded-lg text-lg font-semibold hover:bg-secondary/90 transition-colors">
        Get Started Today
      </button>
    </div>
  </section>
);

const Index = () => {
  return (
    <>
      <SEO 
        title="Halo Business Finance | SBA Loans, Commercial Financing & Bridge Loans"
        description="Get SBA loans, conventional commercial financing, bridge loans, and equipment financing. Fast approval, competitive rates. Trusted by 2,500+ businesses nationwide."
        keywords="SBA loans, commercial loans, business financing, bridge loans, equipment financing"
        canonical="https://halobusinessfinance.com/"
      />
      <div className="min-h-screen bg-background">
        <SimpleHeader />
        <SimpleHero />
        <main className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold mb-4">SBA Loans</h3>
              <p className="text-muted-foreground">Government-backed loans with competitive rates and flexible terms for small businesses.</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold mb-4">Commercial Loans</h3>
              <p className="text-muted-foreground">Traditional commercial financing for established businesses looking to expand.</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold mb-4">Equipment Financing</h3>
              <p className="text-muted-foreground">Financing solutions for purchasing business equipment and machinery.</p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Index;
