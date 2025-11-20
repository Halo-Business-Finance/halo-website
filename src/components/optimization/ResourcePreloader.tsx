import { useEffect } from 'react';

const ResourcePreloader = () => {
  useEffect(() => {
    // Preload critical images with priority
    const criticalResources = [
      { href: '/src/assets/new-hero-background.jpg', as: 'image', fetchpriority: 'high' },
      { href: '/src/assets/business-meeting.jpg', as: 'image', fetchpriority: 'low' }
    ];

    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = resource.as;
      link.href = resource.href;
      if (resource.fetchpriority) link.setAttribute('fetchpriority', resource.fetchpriority);
      document.head.appendChild(link);
    });

    // Prefetch next likely pages during idle time
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        const prefetchPages = ['/loan-calculator', '/sba-loans', '/commercial-loans'];
        prefetchPages.forEach(path => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = path;
          link.as = 'document';
          document.head.appendChild(link);
        });
      });
    }
  }, []);

  return null;
};

export default ResourcePreloader;