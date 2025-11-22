import { useEffect } from 'react';

interface CriticalResource {
  type: 'preconnect' | 'dns-prefetch';
  href: string;
  crossOrigin?: string;
}

const CriticalResourceOptimizer = () => {
  useEffect(() => {
    optimizeCriticalResources();
  }, []);

  const optimizeCriticalResources = () => {
    // Simplified - only add essential DNS prefetch hints
    const criticalResources: CriticalResource[] = [
      // DNS Prefetch for external domains
      { type: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
      { type: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
      { type: 'dns-prefetch', href: 'https://zwqtewpycdbvjgkntejd.supabase.co' },
    ];

    // Only add resources that don't already exist
    criticalResources.forEach(resource => {
      const selector = resource.type === 'dns-prefetch' 
        ? `link[rel="dns-prefetch"][href="${resource.href}"]`
        : `link[rel="${resource.type}"][href="${resource.href}"]`;
      
      if (!document.querySelector(selector)) {
        const link = document.createElement('link');
        link.rel = resource.type;
        link.href = resource.href;
        if (resource.crossOrigin) link.crossOrigin = resource.crossOrigin;
        document.head.appendChild(link);
      }
    });
  };

  return null;
};

export default CriticalResourceOptimizer;
