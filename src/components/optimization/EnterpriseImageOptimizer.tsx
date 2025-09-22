import React, { useState, useEffect, useRef, useCallback } from 'react';

interface EnterpriseImageOptimizerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  onLoad?: () => void;
  onError?: () => void;
}

interface ImageFormat {
  src: string;
  type: string;
}

const EnterpriseImageOptimizer: React.FC<EnterpriseImageOptimizerProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  sizes,
  placeholder = 'blur',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [formats, setFormats] = useState<ImageFormat[]>([]);
  const [hasError, setHasError] = useState(false);
  
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Generate optimized image sources for different formats
  const generateOptimizedSources = useCallback(() => {
    const baseUrl = src.replace(/\.(jpg|jpeg|png|webp)$/i, '');
    const extension = src.match(/\.(jpg|jpeg|png|webp)$/i)?.[1] || 'jpg';
    
    const sources: ImageFormat[] = [];
    
    // Check browser support for modern formats
    const supportsWebP = () => {
      const canvas = document.createElement('canvas');
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    };
    
    const supportsAVIF = () => {
      const canvas = document.createElement('canvas');
      return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    };

    // Add AVIF source if supported
    if (supportsAVIF()) {
      sources.push({
        src: `${baseUrl}.avif`,
        type: 'image/avif'
      });
    }
    
    // Add WebP source if supported
    if (supportsWebP()) {
      sources.push({
        src: `${baseUrl}.webp`,
        type: 'image/webp'
      });
    }
    
    // Fallback to original
    sources.push({
      src: src,
      type: `image/${extension}`
    });
    
    setFormats(sources);
    setCurrentSrc(sources[0].src);
  }, [src]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return;

    const target = containerRef.current;
    if (!target) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px 0px' 
      }
    );

    observerRef.current.observe(target);
    
    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority]);

  // Generate sources when component mounts or src changes
  useEffect(() => {
    generateOptimizedSources();
  }, [generateOptimizedSources]);

  // Handle image load success
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  }, [onLoad]);

  // Handle image load error - fallback to next format
  const handleError = useCallback(() => {
    const currentIndex = formats.findIndex(format => format.src === currentSrc);
    const nextFormat = formats[currentIndex + 1];
    
    if (nextFormat) {
      setCurrentSrc(nextFormat.src);
    } else {
      setHasError(true);
      onError?.();
    }
  }, [currentSrc, formats, onError]);

  // Generate blur placeholder
  const generateBlurPlaceholder = () => {
    if (placeholder !== 'blur') return '';
    
    // Create a simple blur placeholder using CSS
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="${width || 400}" height="${height || 300}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:hsl(var(--muted));stop-opacity:1" />
            <stop offset="100%" style="stop-color:hsl(var(--muted-foreground));stop-opacity:0.3" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
      </svg>
    `)}`;
  };

  if (hasError) {
    return (
      <div 
        ref={containerRef}
        className={`flex items-center justify-center bg-muted text-muted-foreground ${className}`}
        style={{ width, height }}
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Blur placeholder */}
      {!isLoaded && placeholder === 'blur' && (
        <img
          src={generateBlurPlaceholder()}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm"
          style={{ width, height }}
        />
      )}
      
      {/* Loading skeleton */}
      {!isLoaded && placeholder === 'empty' && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse"
          style={{ width, height }}
        />
      )}
      
      {/* Optimized image */}
      {(isInView || priority) && (
        <picture>
          {formats.slice(0, -1).map((format, index) => (
            <source
              key={index}
              srcSet={format.src}
              type={format.type}
              sizes={sizes}
            />
          ))}
          <img
            ref={imgRef}
            src={currentSrc}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            onLoad={handleLoad}
            onError={handleError}
            sizes={sizes}
            className={`
              transition-all duration-500 ease-out
              ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
              ${className}
            `}
            style={{
              filter: isLoaded ? 'none' : 'blur(8px)',
            }}
          />
        </picture>
      )}
    </div>
  );
};

export default EnterpriseImageOptimizer;