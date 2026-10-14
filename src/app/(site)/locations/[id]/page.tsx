import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LocationDetailPageClient from './LocationDetailPageClient';
import { getLocationById } from '@/services/locationService';
import JsonLd from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, buildPageMetadata, stripHtml, truncateText } from '@/lib/seo';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const locationId = Number(id);

  if (!locationId || Number.isNaN(locationId)) {
    return buildPageMetadata({
      title: 'محله یافت نشد',
      description: 'اطلاعات این محله در گویا در دسترس نیست.',
      path: `/locations/${id}`,
      noIndex: true,
    });
  }

  try {
    const location = await getLocationById(locationId);
    const place = [location.name, location.city_name].filter(Boolean).join('، ');
    return buildPageMetadata({
      title: `درباره منطقه ${location.name}`,
      description:
        truncateText(stripHtml(location.description)) ||
        `اطلاعات منطقه ${place} و آگهی‌های خرید، فروش و اجاره ملک در گویا.`,
      path: `/locations/${location.id}`,
      keywords: [
        'املاک',
        location.name,
        location.city_name,
        'خرید خانه',
        'اجاره ملک',
      ].filter(Boolean),
    });
  } catch {
    return buildPageMetadata({
      title: 'درباره منطقه',
      description: 'مشاهده اطلاعات محله و آگهی‌های ملک در پلتفرم گویا.',
      path: `/locations/${locationId}`,
    });
  }
}

export default async function LocationPage({ params }: PageProps) {
  const { id } = await params;
  const locationId = Number(id);

  if (!locationId || Number.isNaN(locationId)) {
    notFound();
  }

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'خانه', path: '/' },
          { name: 'شهرها و مناطق', path: '/cities' },
          { name: 'جزئیات منطقه', path: `/locations/${locationId}` },
        ])}
      />
      <LocationDetailPageClient locationId={locationId} />
    </>
  );
}
