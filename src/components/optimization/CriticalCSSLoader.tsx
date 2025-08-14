import { useEffect } from 'react';

export const CriticalCSSLoader = () => {
  useEffect(() => {
    // Load non-critical CSS after initial render
    const loadStyles = () => {
      const links = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
      ];

      links.forEach(href => {
        if (!document.querySelector(`link[href="${href}"]`)) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = href;
          link.media = 'print';
          link.onload = () => {
            link.media = 'all';
          };
          document.head.appendChild(link);
        }
      });
    };

    // Load after a short delay to prioritize critical rendering
    const timer = setTimeout(loadStyles, 100);
    return () => clearTimeout(timer);
  }, []);

  return null;
};