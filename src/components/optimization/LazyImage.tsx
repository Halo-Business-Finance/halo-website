import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  webpSrc?: string;
  avifSrc?: string;
  sizes?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  webpSrc,
  avifSrc,
  sizes = '100vw',
  priority = false,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    const currentImg = imgRef.current;
    if (currentImg) {
      observer.observe(currentImg);
    }

    return () => {
      if (currentImg) {
        observer.unobserve(currentImg);
      }
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // Generate responsive srcSet
  const generateSrcSet = (baseSrc: string) => {
    const ext = baseSrc.split('.').pop();
    const baseName = baseSrc.replace(`.${ext}`, '');
    
    return [
      `${baseName}-320w.${ext} 320w`,
      `${baseName}-640w.${ext} 640w`,
      `${baseName}-1024w.${ext} 1024w`,
      `${baseName}-1366w.${ext} 1366w`,
      `${baseName}-1920w.${ext} 1920w`
    ].join(', ');
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading placeholder */}
      {!isLoaded && !hasError && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse"
          style={{ width, height }}
        />
      )}

      {/* Error fallback */}
      {hasError && (
        <div 
          className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400"
          style={{ width, height }}
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Actual image */}
      {isInView && (
        <picture>
          {/* Modern formats */}
          {avifSrc && (
            <source 
              srcSet={generateSrcSet(avifSrc)} 
              type="image/avif" 
              sizes={sizes}
            />
          )}
          {webpSrc && (
            <source 
              srcSet={generateSrcSet(webpSrc)} 
              type="image/webp" 
              sizes={sizes}
            />
          )}
          
          {/* Fallback */}
          <img
            ref={imgRef}
            src={src}
            srcSet={generateSrcSet(src)}
            alt={alt}
            width={width}
            height={height}
            sizes={sizes}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            onLoad={handleLoad}
            onError={handleError}
            className={`transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
          />
        </picture>
      )}
    </div>
  );
};