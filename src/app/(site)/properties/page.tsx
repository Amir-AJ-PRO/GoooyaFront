import type { Metadata } from 'next';
import PropertiesPageClient from './PropertiesPageClient';
import JsonLd from '@/components/seo/JsonLd';
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  buildPropertiesSeo,
  propertiesCollectionJsonLd,
} from '@/lib/seo';
import { resolvePropertyFilterLabels } from '@/lib/server/seo-data';

export const revalidate = 60;

type SearchParams = Record<string, string | string[] | undefined>;

type Props = {
  searchParams: Promise<SearchParams>;
};

function first(value?: string | string[]): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

function propertiesCanonicalPath(params: SearchParams): string {
  const query = new URLSearchParams();
  const transaction = first(params.transaction_type);
  const city = first(params.city);
  const location = first(params.location);
  const propertyType = first(params.property_type);
  const q = first(params.q);
  const page = Number(first(params.page) || '1');

  if (transaction === 'sale' || transaction === 'rent') {
    query.set('transaction_type', transaction);
  }
  if (city) query.set('city', city);
  if (location) query.set('location', location);
  if (propertyType) query.set('property_type', propertyType);
  if (q) query.set('q', q);
  if (page > 1) query.set('page', String(page));

  const qs = query.toString();
  return qs ? `/properties?${qs}` : '/properties';
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const transaction = first(params.transaction_type);
  const labels = await resolvePropertyFilterLabels({
    city: first(params.city),
    location: first(params.location),
    propertyType: first(params.property_type),
  });

  const seo = buildPropertiesSeo({
    transaction,
    cityName: labels.cityName,
    locationName: labels.locationName,
    propertyTypeName: labels.propertyTypeName,
    query: first(params.q),
    page: Number(first(params.page) || '1'),
  });

  return buildPageMetadata({
    title: seo.title,
    description: seo.description,
    path: propertiesCanonicalPath(params),
    keywords: [
      'آگهی املاک',
      'خرید ملک',
      'فروش خانه',
      'اجاره آپارتمان',
      labels.cityName,
      labels.locationName,
      labels.propertyTypeName,
      'شرق تهران',
      'دماوند',
      'پردیس',
    ].filter(Boolean) as string[],
  });
}

export default async function PropertiesPage({ searchParams }: Props) {
  const params = await searchParams;
  const transaction = first(params.transaction_type);
  const labels = await resolvePropertyFilterLabels({
    city: first(params.city),
    location: first(params.location),
    propertyType: first(params.property_type),
  });
  const seo = buildPropertiesSeo({
    transaction,
    cityName: labels.cityName,
    locationName: labels.locationName,
    propertyTypeName: labels.propertyTypeName,
    query: first(params.q),
    page: Number(first(params.page) || '1'),
  });
  const path = propertiesCanonicalPath(params);

  return (
    <>
      <JsonLd
        data={[
          propertiesCollectionJsonLd({
            name: seo.h1,
            description: seo.description,
            path,
          }),
          breadcrumbJsonLd([
            { name: 'خانه', path: '/' },
            { name: 'املاک', path: '/properties' },
          ]),
        ]}
      />
      <PropertiesPageClient />
    </>
  );
}
