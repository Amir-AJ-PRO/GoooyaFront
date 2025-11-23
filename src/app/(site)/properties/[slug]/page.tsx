import { Metadata } from 'next';
import PropertyDetailClient from './PropertyDetailClient';

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // در production می‌توانید از API برای fetch کردن title استفاده کنید
  return {
    title: `جزئیات ملک - گویا`,
    description: 'مشاهده جزئیات کامل ملک',
  }
}

export default function PropertyDetailPage({ params }: Props) {
  return <PropertyDetailClient slug={params.slug} />;
}

