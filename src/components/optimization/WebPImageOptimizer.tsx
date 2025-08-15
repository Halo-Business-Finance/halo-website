import { useState, useEffect, useRef } from 'react';

interface WebPImageOptimizerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
}

const WebPImageOptimizer = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  sizes = '100vw'
}: WebPImageOptimizerProps) => {
  const [optimizedSrc, setOptimizedSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [supportsWebP, setSupportsWebP] = useState<boolean | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Check WebP support
  useEffect(() => {
    const checkWebPSupport = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const dataURI = canvas.toDataURL('image/webp');
      setSupportsWebP(dataURI.indexOf('data:image/webp') === 0);
    };

    checkWebPSupport();
  }, []);

  // Generate responsive image sources
  useEffect(() => {
    if (supportsWebP === null) return;

    const generateOptimizedImage = async () => {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = src;
        });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) throw new Error('Canvas context not available');

        // Calculate optimal dimensions
        const targetWidth = width || Math.min(img.naturalWidth, 1920);
        const targetHeight = height || Math.min(img.naturalHeight, 1080);
        
        canvas.width = targetWidth;
        canvas.height = targetHeight;

        // Draw with optimal quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Convert to optimal format
        const format = supportsWebP ? 'image/webp' : 'image/jpeg';
        const compressedDataUrl = canvas.toDataURL(format, quality / 100);
        
        setOptimizedSrc(compressedDataUrl);
        setIsLoaded(true);

      } catch (error) {
        console.warn('Image optimization failed:', error);
        setOptimizedSrc(src);
        setHasError(true);
      }
    };

    generateOptimizedImage();
  }, [src, width, height, quality, supportsWebP]);

  // Progressive loading effect
  useEffect(() => {
    if (optimizedSrc && imgRef.current) {
      const img = imgRef.current;
      
      // Add blur-to-sharp effect for better perceived performance
      img.style.filter = 'blur(5px)';
      img.style.transition = 'filter 0.3s ease';
      
      const handleLoad = () => {
        img.style.filter = 'none';
      };
      
      img.addEventListener('load', handleLoad);
      return () => img.removeEventListener('load', handleLoad);
    }
  }, [optimizedSrc]);

  if (hasError) {
    return (
      <div className={`bg-muted flex items-center justify-center ${className}`}>
        <span className="text-muted-foreground text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <picture>
      {/* WebP source for modern browsers */}
      {supportsWebP && (
        <source
          srcSet={optimizedSrc}
          type="image/webp"
          sizes={sizes}
        />
      )}
      
      {/* Fallback for older browsers */}
      <img
        ref={imgRef}
        src={optimizedSrc || src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className={`
          transition-all duration-300 
          ${isLoaded ? 'opacity-100' : 'opacity-70'} 
          ${className}
        `}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        sizes={sizes}
      />
    </picture>
  );
};

export default WebPImageOptimizer;