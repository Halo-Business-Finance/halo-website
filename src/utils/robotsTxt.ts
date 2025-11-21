/**
 * Robots.txt Configuration
 * Optimized for search engine crawling
 */

export const generateRobotsTxt = (): string => {
  const baseUrl = window.location.origin;
  
  return `# SBA & Commercial Loan Marketplace - Robots.txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /auth
Disallow: /auth/*
Disallow: /*.json$
Disallow: /api/

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay for respectful crawling
Crawl-delay: 1

# Specific bot configurations
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /
`;
};
