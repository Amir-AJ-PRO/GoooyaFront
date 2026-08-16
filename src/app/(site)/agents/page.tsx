import { Suspense } from 'react';
import type { Metadata } from 'next';
import AgentsPageClient from './AgentsPageClient';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'مشاوران املاک شرق تهران',
  description: 'لیست مشاوران املاک گویا در دماوند، پردیس و شرق تهران. انتخاب مشاور محلی برای خرید، فروش و اجاره ملک.',
  path: '/agents',
  keywords: ['مشاور املاک دماوند', 'مشاور املاک پردیس', 'لیست مشاورین املاک', 'مشاور محلی شرق تهران'],
});

export default function AgentsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-16 min-h-[40vh]" />}>
      <AgentsPageClient />
    </Suspense>
  );
}


