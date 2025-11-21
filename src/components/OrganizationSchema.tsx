import { Helmet } from 'react-helmet-async';

export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": "SBA & Commercial Loan Marketplace",
    "description": "Leading SBA and commercial loan marketplace connecting businesses with qualified lenders for financing solutions",
    "url": "https://sba-commercial-loan-marketplace.lovable.app",
    "logo": "https://sba-commercial-loan-marketplace.lovable.app/sba-logo.jpg",
    "image": "https://sba-commercial-loan-marketplace.lovable.app/hero-background.jpg",
    "priceRange": "$50,000 - $5,000,000+",
    "telephone": "+1-XXX-XXX-XXXX",
    "email": "info@example.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Business St",
      "addressLocality": "City",
      "addressRegion": "ST",
      "postalCode": "12345",
      "addressCountry": "US"
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States"
    },
    "openingHours": "Mo-Fr 09:00-18:00",
    "sameAs": [
      "https://www.linkedin.com/company/example",
      "https://www.facebook.com/example",
      "https://twitter.com/example"
    ],
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Business Financing Solutions",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "FinancialProduct",
            "name": "SBA 7(a) Loans",
            "description": "SBA 7(a) loans for business acquisition, expansion, and working capital"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "FinancialProduct",
            "name": "SBA 504 Loans",
            "description": "Long-term fixed-rate financing for major fixed assets"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "FinancialProduct",
            "name": "Commercial Real Estate Loans",
            "description": "Financing for commercial property purchases and refinancing"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "FinancialProduct",
            "name": "Equipment Financing",
            "description": "Loans and leasing for business equipment"
          }
        }
      ]
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1250"
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};
