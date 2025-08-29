import React from 'react';
import { contentSanitizer } from '@/utils/contentSanitizer';

interface StructuredDataProps {
  type: 'Organization' | 'FinancialService' | 'BreadcrumbList' | 'FAQ' | 'Product' | 'Article';
  data: any;
}

export const StructuredData: React.FC<StructuredDataProps> = ({ type, data }) => {
  const generateSchema = () => {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': type
    };

    switch (type) {
      case 'Organization':
        return {
          ...baseSchema,
          name: 'Halo Business Finance',
          url: 'https://halobusinessfinance.com',
          logo: 'https://halobusinessfinance.com/assets/logo.png',
          description: 'Leading business financing marketplace connecting borrowers with lenders nationwide.',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Irvine',
            addressRegion: 'CA',
            addressCountry: 'US'
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+1-800-730-8461',
            contactType: 'customer service',
            availableLanguage: 'English'
          },
          sameAs: [
            'https://www.linkedin.com/company/halo-business-finance',
            'https://twitter.com/halobizfinance'
          ],
          ...data
        };

      case 'FinancialService':
        return {
          ...baseSchema,
          provider: {
            '@type': 'Organization',
            name: 'Halo Business Finance'
          },
          serviceType: 'Business Financing',
          areaServed: 'United States',
          ...data
        };

      case 'BreadcrumbList':
        return {
          ...baseSchema,
          itemListElement: data.items?.map((item: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url
          }))
        };

      case 'FAQ':
        return {
          ...baseSchema,
          mainEntity: data.questions?.map((q: any) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: q.answer
            }
          }))
        };

      case 'Product':
        return {
          ...baseSchema,
          name: data.name,
          description: data.description,
          category: 'Financial Services',
          provider: {
            '@type': 'Organization',
            name: 'Halo Business Finance'
          },
          ...data
        };

      case 'Article':
        return {
          ...baseSchema,
          headline: data.title,
          description: data.description,
          author: {
            '@type': 'Organization',
            name: 'Halo Business Finance'
          },
          publisher: {
            '@type': 'Organization',
            name: 'Halo Business Finance',
            logo: {
              '@type': 'ImageObject',
              url: 'https://halobusinessfinance.com/assets/logo.png'
            }
          },
          datePublished: data.datePublished || new Date().toISOString(),
          dateModified: data.dateModified || new Date().toISOString(),
          ...data
        };

      default:
        return { ...baseSchema, ...data };
    }
  };

  const schema = generateSchema();

  // Sanitize schema data to prevent XSS
  const sanitizedSchema = contentSanitizer.sanitizeJSONSchema(schema);

  // Generate a secure nonce for CSP compliance
  const nonce = contentSanitizer.generateSecureNonce();

  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(sanitizedSchema) }}
    />
  );
};