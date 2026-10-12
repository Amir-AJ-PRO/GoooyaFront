'use client';

import { Skeleton } from '@/components/ui/skeleton';

/**
 * اسکلتون همان باکس سفید کاراکترها
 */
export function StoriesExploreSkeleton() {
  return (
    <div
      className="relative mx-auto mb-24 mt-4 w-full max-w-[720px] sm:mb-32 sm:mt-6"
      style={{ paddingTop: 56 }}
      aria-busy="true"
      aria-label="در حال بارگذاری داستان‌ها"
    >
      <div className="relative z-0 overflow-visible rounded-2xl bg-white px-5 py-8 text-center shadow-soft">
        <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-7 w-28 rounded-full bg-[#F7F4EA]" />
          ))}
        </div>
        <div className="flex gap-4 overflow-hidden" dir="rtl">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="w-[240px] shrink-0 rounded-xl border border-gray-100 bg-[#FBFBFA] p-2.5 sm:w-[255px]"
            >
              <Skeleton className="h-[140px] w-full rounded-lg bg-gray-200" />
              <Skeleton className="mt-2 h-5 w-16 rounded-full bg-gray-100" />
              <Skeleton className="mt-2 h-4 w-[85%] rounded bg-gray-100" />
              <Skeleton className="mt-1 h-3 w-[70%] rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StoriesBannerSkeleton({ className = '' }: { className?: string }) {
  return (
    <Skeleton className={`h-[168px] w-full rounded-2xl bg-white/80 sm:h-[200px] ${className}`} />
  );
}
