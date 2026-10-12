import { Suspense } from 'react';
import type { Metadata } from 'next';
import { StoriesPageClient } from '@/features/stories/StoriesPageClient';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';
import { fetchStoriesBannerForSeo } from '@/lib/server/seo-data';

export const revalidate = 120;

export async function generateMetadata(): Promise<Metadata> {
  const banner = await fetchStoriesBannerForSeo();
  const title = banner?.title?.trim() || 'انیمیشن‌های داستانی گویا';

  return buildPageMetadata({
    title,
    description:
      'قصه‌های کوتاه دماوند با آقای توتک، خانم حلوا لوز و عسلک؛ انیمیشن‌های داستانی گویا.',
    path: '/stories',
    image: banner?.is_active && banner.image ? banner.image : undefined,
    imageAlt: title,
    keywords: [
      'قصه‌های دماوند',
      'آقای توتک',
      'خانم حلوا لوز',
      'عسلک',
      'انیمیشن گویا',
    ],
    modifiedTime: banner?.updated_at ?? undefined,
  });
}

export default function StoriesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'خانه', path: '/' },
          { name: 'قصه‌های دماوند', path: '/stories' },
        ])}
      />
      <Suspense fallback={null}>
        <StoriesPageClient />
      </Suspense>
    </>
  );
}
