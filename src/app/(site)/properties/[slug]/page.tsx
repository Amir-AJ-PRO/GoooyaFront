import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PropertyDetailClient from './PropertyDetailClient';
import JsonLd from '@/components/seo/JsonLd';
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  buildPropertySeo,
  namedValue,
  propertyJsonLd,
  propertyMainImage,
  transactionLabel,
} from '@/lib/seo';
import { fetchPropertyForSeo } from '@/lib/server/seo-data';
import { decodePathSlug } from '@/lib/utils';

export const revalidate = 60;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodePathSlug(rawSlug);
  const { property } = await fetchPropertyForSeo(slug);

  if (!property) {
    return buildPageMetadata({
      title: 'ملک یافت نشد',
      description: 'این آگهی در گویا در دسترس نیست یا حذف شده است.',
      path: `/properties/${slug}`,
      noIndex: true,
    });
  }

  const seo = buildPropertySeo(property);
  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    path: `/properties/${property.slug}`,
    image: propertyMainImage(property.images, property.updated_at),
    imageAlt: property.title,
    keywords: seo.keywords,
    modifiedTime: property.updated_at,
    publishedTime: property.created_at,
  });
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug: rawSlug } = await params;
  const slug = decodePathSlug(rawSlug);
  const { property, notFound: isMissing } = await fetchPropertyForSeo(slug);

  if (isMissing) {
    notFound();
  }

  return (
    <>
      {property && (
        <JsonLd
          data={[
            propertyJsonLd(property),
            breadcrumbJsonLd([
              { name: 'خانه', path: '/' },
              { name: 'املاک', path: '/properties' },
              {
                name: `${transactionLabel(property.transaction_type)} ${namedValue(property.property_type) || 'ملک'}${namedValue(property.city) ? ` در ${namedValue(property.city)}` : ''}`,
                path: `/properties/${property.slug}`,
              },
            ]),
          ]}
        />
      )}
      <PropertyDetailClient slug={slug} />
    </>
  );
}
