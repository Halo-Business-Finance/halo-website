import { useState, useEffect } from 'react';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
}

const ImageOptimizer = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 80
}: ImageOptimizerProps) => {
  const [optimizedSrc, setOptimizedSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Create optimized image URL with compression
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Set canvas dimensions based on desired size or original
      const targetWidth = width || img.naturalWidth;
      const targetHeight = height || img.naturalHeight;
      
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Draw and compress image
      ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      // Convert to compressed format
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality / 100);
      setOptimizedSrc(compressedDataUrl);
      setIsLoaded(true);
    };

    img.onerror = () => {
      setHasError(true);
      setOptimizedSrc(src); // Fallback to original
    };

    img.src = src;
  }, [src, width, height, quality]);

  if (hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Image failed to load</span>
      </div>
    );
  }

  return (
    <img
      src={optimizedSrc || src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-70'} ${className}`}
      onLoad={() => setIsLoaded(true)}
    />
  );
};

export default ImageOptimizer;