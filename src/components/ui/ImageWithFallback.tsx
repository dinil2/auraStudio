import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  wrapperClassName?: string;
}

const DEFAULT_FALLBACK =
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80';

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Streetwear Apparel',
  fallbackSrc = DEFAULT_FALLBACK,
  className,
  wrapperClassName,
  loading = 'lazy',
  decoding = 'async',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const finalSrc = hasError ? fallbackSrc : src || fallbackSrc;

  return (
    <div
      className={twMerge(
        clsx('relative overflow-hidden bg-brand-surface', wrapperClassName)
      )}
    >
      {/* Skeleton placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-brand-surface animate-pulse" />
      )}

      <img
        src={finalSrc}
        alt={alt}
        loading={loading}
        decoding={decoding}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!hasError) setHasError(true);
        }}
        className={twMerge(
          clsx(
            'w-full h-full object-cover transition-opacity duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0',
            className
          )
        )}
        {...props}
      />
    </div>
  );
};

