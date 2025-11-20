import { useEffect } from 'react';

const CriticalCSS = () => {
  useEffect(() => {
    // Inject critical above-the-fold CSS directly for faster initial render
    const criticalStyles = `
      /* CSS Variables for critical rendering */
      :root {
        --background: 0 0% 100%;
        --foreground: 222.2 84% 4.9%;
        --primary: 221.2 83.2% 53.3%;
        --primary-foreground: 210 40% 98%;
        --radius: 0.5rem;
      }
      
      /* Critical layout styles */
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body { 
        font-family: Inter, system-ui, sans-serif;
        line-height: 1.5;
        -webkit-font-smoothing: antialiased;
      }
      
      /* Critical header styles */
      header {
        background: hsl(var(--background));
        position: sticky;
        top: 0;
        z-index: 50;
        border-bottom: 1px solid hsl(var(--foreground) / 0.1);
      }
      
      /* Critical hero section */
      .hero-section {
        position: relative;
        min-height: 60vh;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
      
      /* Critical text styles */
      h1 { 
        font-size: 2.5rem;
        font-weight: 700;
        line-height: 1.2;
        color: hsl(var(--foreground));
      }
      
      /* Critical button styles */
      .btn-primary {
        background: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
        padding: 0.75rem 1.5rem;
        border-radius: var(--radius);
        border: none;
        cursor: pointer;
        font-weight: 500;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px hsl(var(--primary) / 0.3);
      }
      
      /* Hide content until fonts load to prevent FOUT */
      .font-loading { opacity: 0; }
      .fonts-loaded { opacity: 1; transition: opacity 0.3s ease; }
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