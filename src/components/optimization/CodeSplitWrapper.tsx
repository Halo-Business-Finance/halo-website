import React, { useRef, useEffect, useState } from 'react';

interface CodeSplitWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  delay?: number;
  preload?: boolean;
}

const CodeSplitWrapper: React.FC<CodeSplitWrapperProps> = ({
  children,
  fallback = <div>Loading...</div>,
  delay = 0,
  preload = false
}) => {
  const [shouldRender, setShouldRender] = useState(preload);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (preload) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [preload]);

  useEffect(() => {
    if (isVisible || preload) {
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [isVisible, preload, delay]);

  return (
    <div ref={ref} className="code-split-wrapper">
      {shouldRender ? children : fallback}
    </div>
  );
};

export default CodeSplitWrapper;