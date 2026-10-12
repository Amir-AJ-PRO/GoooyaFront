'use client';

import { useStoriesBanner } from '@/hooks/useStories';
import { isStoriesBannerVisible } from '@/services/storiesService';
import { StoriesBanner } from './StoriesBanner';

/**
 * بنر صفحه اصلی — اگر بنر فعال نباشد چیزی رندر نمی‌شود
 */
export function StoriesHomeBanner() {
  const { data, isLoading } = useStoriesBanner();

  if (isLoading || !isStoriesBannerVisible(data)) {
    return null;
  }

  return (
    <section className="relative z-0 bg-[#E0E0E0] py-4">
      <div className="container mx-auto px-4">
        <StoriesBanner banner={data} variant="home" />
      </div>
    </section>
  );
}
