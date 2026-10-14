import type { Metadata } from 'next';
import CitiesPageClient from './CitiesPageClient';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'شهرها و مناطق',
  description:
    'فهرست شهرها و محله‌های ایران در گویا. درباره هر شهر و منطقه بخوانید و املاک همان محل را ببینید.',
  path: '/cities',
  keywords: ['شهرها', 'مناطق', 'محله', 'املاک', 'گویا'],
});

export default function CitiesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'خانه', path: '/' },
          { name: 'شهرها و مناطق', path: '/cities' },
        ])}
      />
      <CitiesPageClient />
    </>
  );
}
