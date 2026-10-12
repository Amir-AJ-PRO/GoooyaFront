'use client';

import Link from 'next/link';
import { ChevronLeft, Clapperboard } from 'lucide-react';
import { isStoriesBannerVisible } from '@/services/storiesService';
import type { StoriesBanner as StoriesBannerData } from '@/types/story';
import { StoryCoverImage } from './StoryCoverImage';
import { cn } from '@/lib/utils';

type StoriesBannerProps = {
  banner: StoriesBannerData | null | undefined;
  variant?: 'home' | 'hero';
  linked?: boolean;
  className?: string;
};

/**
 * بنر ورود به انیمیشن‌های داستانی — فقط با is_active و image
 */
export function StoriesBanner({
  banner,
  variant = 'home',
  linked = true,
  className,
}: StoriesBannerProps) {
  if (!isStoriesBannerVisible(banner) || !banner?.image) {
    return null;
  }

  const title = banner.title?.trim() || 'قصه‌های دماوند';
  const isHero = variant === 'hero';
  const frameClass = cn(
    'group relative block overflow-hidden rounded-2xl bg-[#373A50] shadow-soft',
    'transition-[transform,box-shadow] duration-[400ms] ease-out',
    linked && 'hover:shadow-medium motion-safe:hover:scale-[1.008]',
    linked &&
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A86FE] focus-visible:ring-offset-2',
    isHero ? 'h-[180px] sm:h-[220px] lg:h-[240px]' : 'h-[160px] sm:h-[196px] lg:h-[220px]',
    className
  );

  const content = (
    <>
      <StoryCoverImage
        src={banner.image}
        alt={title}
        priority
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[500ms] ease-out motion-safe:group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/35 to-black/20" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-[#D4AF37]/80 via-[#2A86FE]/50 to-transparent" />

      <div className="relative flex h-full items-end justify-between gap-4 p-5 sm:p-7">
        <div className="max-w-[80%]">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-[11px] text-white/90 backdrop-blur-sm sm:text-xs">
            <Clapperboard className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
            قصه‌های دماوند
          </div>
          <h2 className="text-xl font-bold leading-snug text-white sm:text-2xl lg:text-[28px]">
            {title}
          </h2>
        </div>
        {linked ? (
          <span className="flex shrink-0 items-center gap-1 rounded-xl bg-white/95 px-3 py-2 text-sm font-medium text-[#373A50] shadow-sm transition-colors duration-300 group-hover:bg-[#2A86FE] group-hover:text-white">
            تماشا
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </span>
        ) : null}
      </div>
    </>
  );

  if (!linked) {
    return <div className={frameClass}>{content}</div>;
  }

  return (
    <Link href="/stories" className={frameClass} aria-label={`ورود به ${title}`}>
      {content}
    </Link>
  );
}
