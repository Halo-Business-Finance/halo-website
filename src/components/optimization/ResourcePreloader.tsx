import { useEffect } from 'react';

const ResourcePreloader = () => {
  useEffect(() => {
    // Preload critical images and fonts
    const criticalResources = [
      '/assets/hero-background.jpg',
      '/assets/new-hero-background.jpg',
      '/assets/business-meeting.jpg',
      '/assets/loan-calculator-professional.jpg'
    ];

    // Preload images
    criticalResources.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });

    // Add resource hints for external domains
    const resourceHints = [
      { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: '//fonts.gstatic.com' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' }
    ];

    resourceHints.forEach(hint => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      if (hint.crossOrigin) link.crossOrigin = hint.crossOrigin;
      document.head.appendChild(link);
    });

    // Prefetch next likely pages
    const prefetchPages = ['/loan-calculator', '/sba-loans', '/commercial-loans'];
    prefetchPages.forEach(path => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = path;
      document.head.appendChild(link);
    });

  }, []);

  return null;
};

export default ResourcePreloader;