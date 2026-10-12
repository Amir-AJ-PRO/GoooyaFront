'use client';

import { Skeleton } from '@/components/ui/skeleton';

/**
 * اسکلتون نوار استوری و شبکه Explore
 */
export function StoriesExploreSkeleton() {
  return (
    <div className="space-y-8" aria-busy="true" aria-label="در حال بارگذاری داستان‌ها">
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 7 }).map((_, index) => (
          <div key={index} className="flex w-[76px] shrink-0 flex-col items-center gap-2">
            <Skeleton className="h-[72px] w-[72px] rounded-full bg-white/80" />
            <Skeleton className="h-3 w-14 rounded bg-white/80" />
            <Skeleton className="h-3 w-10 rounded bg-white/70" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton
            key={index}
            className="aspect-[3/4] rounded-2xl bg-white/80"
          />
        ))}
      </div>
    </div>
  );
}

export function StoriesBannerSkeleton({ className = '' }: { className?: string }) {
  return (
    <Skeleton className={`h-[168px] w-full rounded-2xl bg-white/80 sm:h-[200px] ${className}`} />
  );
}
