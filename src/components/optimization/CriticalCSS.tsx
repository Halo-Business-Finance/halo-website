import { useEffect } from 'react';

const CriticalCSS = () => {
  useEffect(() => {
    // Inject critical above-the-fold CSS directly
    const criticalStyles = `
      /* Critical header and hero styles */
      .critical-header { 
        background: hsl(var(--background));
        position: sticky;
        top: 0;
        z-index: 50;
      }
      .critical-hero {
        background: var(--gradient-hero);
        min-height: 50vh;
        display: flex;
        align-items: center;
      }
      .critical-text {
        color: hsl(var(--foreground));
        font-weight: 600;
      }
      .critical-button {
        background: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
        padding: 0.75rem 1.5rem;
        border-radius: var(--radius);
        transition: all 0.2s ease;
      }
      .critical-button:hover {
        transform: translateY(-1px);
        box-shadow: var(--shadow-button);
      }
    `;

    const styleElement = document.createElement('style');
    styleElement.textContent = criticalStyles;
    styleElement.setAttribute('data-critical', 'true');
    document.head.appendChild(styleElement);

    return () => {
      const criticalStyle = document.querySelector('[data-critical="true"]');
      if (criticalStyle) {
        criticalStyle.remove();
      }
    };
  }, []);

  return null;
};

export default CriticalCSS;