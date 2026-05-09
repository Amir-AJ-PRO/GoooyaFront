import { Metadata } from 'next';
import PropertyDetailClient from './PropertyDetailClient';

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  // در production می‌توانید از API برای fetch کردن title استفاده کنید
  return {
    title: `جزئیات ملک ${slug} - گویا`,
    description: 'مشاهده جزئیات کامل ملک',
  }
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  return  <PropertyDetailClient slug={slug} />;
}

