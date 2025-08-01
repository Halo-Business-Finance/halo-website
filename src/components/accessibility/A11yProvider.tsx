import React, { useEffect, useRef } from 'react';

interface A11yMonitorProps {
  children: React.ReactNode;
}

// Custom hook for accessibility monitoring
export const useA11yMonitor = () => {
  useEffect(() => {
    // Focus management
    const handleFocusLoss = () => {
      const activeElement = document.activeElement;
      if (!activeElement || activeElement === document.body) {
        const firstFocusable = document.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }
    };

    // Keyboard navigation enhancement
    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip to main content with "S" key
      if (event.altKey && event.key.toLowerCase() === 's') {
        event.preventDefault();
        const main = document.querySelector('main');
        main?.focus();
      }

      // Skip to navigation with "N" key
      if (event.altKey && event.key.toLowerCase() === 'n') {
        event.preventDefault();
        const nav = document.querySelector('nav');
        nav?.focus();
      }

      // Escape key to close modals/overlays
      if (event.key === 'Escape') {
        const modal = document.querySelector('[role="dialog"]');
        if (modal) {
          const closeButton = modal.querySelector<HTMLElement>('[aria-label*="close"], [aria-label*="Close"]');
          closeButton?.click();
        }
      }
    };

    // Color contrast monitoring
    const checkColorContrast = () => {
      const elements = document.querySelectorAll('*');
      elements.forEach((element) => {
        const style = window.getComputedStyle(element);
        const color = style.color;
        const backgroundColor = style.backgroundColor;
        
        // Basic contrast checking (simplified)
        if (color && backgroundColor && color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
          // This is a simplified check - in production, you'd use a proper contrast ratio calculation
          const isLowContrast = color === backgroundColor;
          if (isLowContrast) {
            console.warn('Low contrast detected:', element, { color, backgroundColor });
          }
        }
      });
    };

    // ARIA attribute validation
    const validateARIA = () => {
      // Check for missing alt text on images
      const images = document.querySelectorAll('img:not([alt])');
      if (images.length > 0) {
        console.warn('Images without alt text found:', images);
      }

      // Check for missing labels on form controls
      const formControls = document.querySelectorAll('input, select, textarea');
      formControls.forEach((control) => {
        const hasLabel = control.id && document.querySelector(`label[for="${control.id}"]`);
        const hasAriaLabel = control.getAttribute('aria-label');
        const hasAriaLabelledBy = control.getAttribute('aria-labelledby');
        
        if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
          console.warn('Form control without label:', control);
        }
      });

      // Check for proper heading hierarchy
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let lastLevel = 0;
      headings.forEach((heading) => {
        const level = parseInt(heading.tagName.charAt(1));
        if (level > lastLevel + 1) {
          console.warn('Heading hierarchy skip detected:', heading, `Expected h${lastLevel + 1} or lower, found h${level}`);
        }
        lastLevel = level;
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusout', handleFocusLoss);

    // Run checks periodically
    const checkInterval = setInterval(() => {
      if (process.env.NODE_ENV === 'development') {
        checkColorContrast();
        validateARIA();
      }
    }, 5000);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusout', handleFocusLoss);
      clearInterval(checkInterval);
    };
  }, []);
};

// Focus trap component for modals and dialogs
export const FocusTrap: React.FC<A11yMonitorProps> = ({ children }) => {
  const trapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trap = trapRef.current;
    if (!trap) return;

    const focusableElements = trap.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus first element when trap is mounted
    firstElement?.focus();

    trap.addEventListener('keydown', handleKeyDown);
    return () => trap.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div ref={trapRef} className="focus-trap">
      {children}
    </div>
  );
};

// Skip link component
export const SkipLink: React.FC = () => {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:transition-all"
    >
      Skip to main content
    </a>
  );
};

// Accessible heading component with automatic hierarchy
let headingLevel = 1;

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  resetLevel?: boolean;
}

export const AccessibleHeading: React.FC<HeadingProps> = ({ 
  children, 
  className = '', 
  id,
  level,
  resetLevel = false
}) => {
  if (resetLevel) headingLevel = 1;
  
  const currentLevel = level || Math.min(headingLevel++, 6);
  const Tag = `h${currentLevel}` as keyof JSX.IntrinsicElements;

  return (
    <Tag className={className} id={id}>
      {children}
    </Tag>
  );
};

// Screen reader announcements
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.setAttribute('aria-relevant', 'additions text');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Main A11y wrapper component
export const A11yProvider: React.FC<A11yMonitorProps> = ({ children }) => {
  useA11yMonitor();

  return (
    <div className="a11y-provider">
      <SkipLink />
      {children}
    </div>
  );
};