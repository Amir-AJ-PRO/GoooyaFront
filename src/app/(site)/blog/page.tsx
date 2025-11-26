import { Metadata } from 'next';
import BlogPageClient from './BlogPageClient';

export const metadata: Metadata = {
  title: 'مقالات - گویا',
  description: 'مطالعه آخرین مقالات و راهنماهای املاک، نکات خرید و فروش ملک',
  openGraph: {
    title: 'مقالات - گویا',
    description: 'مطالعه آخرین مقالات و راهنماهای املاک، نکات خرید و فروش ملک',
  }
};

export default function BlogPage() {
  return <BlogPageClient />;
}
