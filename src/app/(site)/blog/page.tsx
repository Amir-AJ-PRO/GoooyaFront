import { Metadata } from 'next';
import BlogPageClient from './BlogPageClient';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'مقالات و راهنمای املاک',
  description: 'راهنمای خرید، فروش و اجاره ملک، تحلیل بازار و نکات سرمایه‌گذاری در شرق تهران، دماوند و پردیس.',
  path: '/blog',
  keywords: ['مقالات املاک', 'راهنمای خرید خانه', 'بازار املاک شرق تهران', 'نکات اجاره ملک'],
});

export default function BlogPage() {
  return <BlogPageClient />;
}
