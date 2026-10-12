'use client';

import { useState } from 'react';
import { getMediaUrl } from '@/lib/utils';
import { cn } from '@/lib/utils';

type StoryCoverImageProps = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  priority?: boolean;
};

/**
 * تصویر کاور داستان با lazy-load و جایگزینی آرام در خطا
 */
export function StoryCoverImage({
  src,
  alt,
  className,
  priority = false,
}: StoryCoverImageProps) {
  const [failed, setFailed] = useState(false);
  const url = src ? getMediaUrl(src) : '';
  const showFallback = failed || !url || url === '/placeholder.svg';

  if (showFallback) {
    return (
      <div
        className={cn(
          'bg-gradient-to-br from-[#2A86FE]/25 via-[#373A50]/40 to-[#D4AF37]/20',
          className
        )}
        aria-hidden="true"
      />
    );
  }

  return (
    // URL از API است و دامنه می‌تواند CDN باشد
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
