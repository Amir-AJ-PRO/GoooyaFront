import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CityDetailPageClient from './CityDetailPageClient';
import { getCityById } from '@/services/cityService';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, buildPageMetadata, stripHtml, truncateText } from '@/lib/seo';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const cityId = Number(id);

  if (!cityId || Number.isNaN(cityId)) {
    return buildPageMetadata({
      title: 'شهر یافت نشد',
      description: 'اطلاعات این شهر در گویا در دسترس نیست.',
      path: `/cities/${id}`,
      noIndex: true,
    });
  }

  try {
    const city = await getCityById(cityId);
    const place = city.province ? `${city.name}، ${city.province}` : city.name;
    return buildPageMetadata({
      title: `درباره شهر ${city.name}`,
      description:
        truncateText(stripHtml(city.description)) ||
        `اطلاعات شهر ${place} و آگهی‌های خرید، فروش و اجاره ملک در گویا.`,
      path: `/cities/${city.id}`,
      keywords: ['املاک', city.name, city.province || '', 'خرید خانه', 'اجاره ملک'].filter(
        Boolean
      ),
    });
  } catch {
    return buildPageMetadata({
      title: 'درباره شهر',
      description: 'مشاهده اطلاعات شهر و آگهی‌های ملک در پلتفرم گویا.',
      path: `/cities/${cityId}`,
    });
  }
}

export default async function CityPage({ params }: PageProps) {
  const { id } = await params;
  const cityId = Number(id);

  if (!cityId || Number.isNaN(cityId)) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'خانه', path: '/' },
          { name: 'شهرها و مناطق', path: '/cities' },
          { name: 'جزئیات شهر', path: `/cities/${cityId}` },
        ])}
      />
      <CityDetailPageClient cityId={cityId} />
    </>
  );
}
