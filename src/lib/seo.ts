import type { Metadata } from 'next';
import type { Property, PropertyListItem } from '@/types/property';
import {
  APP_NAME,
  GOOOYA_CONTACT_EMAIL,
  GOOOYA_CONTACT_PHONE_TEL,
} from '@/lib/constants';
import { getMediaUrl } from '@/lib/utils';

export const SITE_NAME = APP_NAME;
export const SITE_NAME_EN = 'Goooya';
export const DEFAULT_OG_IMAGE = '/assets/hero-home.jpg';
export const DEFAULT_OG_ALT = 'گویا - پلتفرم تخصصی املاک شرق تهران، دماوند و پردیس';

export const DEFAULT_TITLE =
  'گویا | خرید، فروش و اجاره املاک در شرق تهران، دماوند و پردیس';

export const DEFAULT_DESCRIPTION =
  'گویا، پلتفرم تخصصی خرید، فروش و اجاره ملک در شرق استان تهران. آگهی آپارتمان، ویلا و زمین در دماوند، پردیس و حومه با مشاوران محلی.';

export const DEFAULT_KEYWORDS = [
  'املاک شرق تهران',
  'خرید خانه دماوند',
  'فروش ویلا پردیس',
  'اجاره آپارتمان شرق تهران',
  'مشاور املاک دماوند',
  'املاک پردیس',
  'آگهی ملک',
  'گویا',
];

export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const raw = fromEnv && fromEnv.length > 0 ? fromEnv : 'https://goooya.ir';
  return raw.replace(/\/$/, '');
}

export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${getSiteUrl()}${normalized}`;
}

/**
 * Append a version query so browsers and social crawlers fetch the new
 * preview after SEO content changes — no manual cache clear needed.
 */
export function withCacheBuster(
  url: string,
  version?: string | number | Date | null
): string {
  if (!url || version === undefined || version === null || version === '') {
    return url;
  }

  const stamp =
    version instanceof Date
      ? version.getTime()
      : typeof version === 'string' && !Number.isNaN(Date.parse(version))
        ? new Date(version).getTime()
        : version;

  try {
    const parsed = new URL(url, getSiteUrl());
    parsed.searchParams.set('v', String(stamp));
    return parsed.toString();
  } catch {
    return url;
  }
}

export function stripHtml(input?: string | null): string {
  if (!input) return '';
  return input.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function truncateText(input: string, maxLength = 160): string {
  const text = stripHtml(input);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

export function namedValue(
  value?: string | { name?: string; title?: string } | null
): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.name || value.title || '';
}

export function transactionLabel(type?: string | null): string {
  return type === 'rent' ? 'اجاره' : 'فروش';
}

export function propertyMainImage(
  images?: Array<{ image: string; is_main?: boolean }> | null,
  version?: string | number | Date | null
): string | undefined {
  if (!images?.length) return undefined;
  const main = images[0];
  if (!main?.image) return undefined;
  const url = getMediaUrl(main.image);
  const absolute = url.startsWith('http') ? url : absoluteUrl(url);
  return withCacheBuster(absolute, version);
}

type BuildMetadataInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
};

export function buildPageMetadata({
  title,
  description,
  path = '/',
  image,
  imageAlt,
  keywords,
  noIndex = false,
  type = 'website',
  publishedTime,
  modifiedTime,
}: BuildMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const rawImage = image
    ? image.startsWith('http')
      ? image
      : absoluteUrl(image)
    : absoluteUrl(DEFAULT_OG_IMAGE);
  const ogImage = withCacheBuster(rawImage, modifiedTime || publishedTime);
  const robots = noIndex
    ? { index: false, follow: false, googleBot: { index: false, follow: false } }
    : { index: true, follow: true };

  return {
    title,
    description,
    keywords: keywords?.length ? keywords : undefined,
    alternates: { canonical: url },
    robots,
    openGraph: {
      type,
      locale: 'fa_IR',
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: imageAlt || title,
        },
      ],
      ...(type === 'article' && publishedTime
        ? { publishedTime, modifiedTime: modifiedTime || publishedTime }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

export type PropertyFilterSeoInput = {
  transaction?: string | null;
  cityName?: string | null;
  locationName?: string | null;
  propertyTypeName?: string | null;
  query?: string | null;
  page?: number;
};

export function buildPropertiesSeo(input: PropertyFilterSeoInput = {}) {
  const transaction = input.transaction === 'rent' ? 'rent' : input.transaction === 'sale' ? 'sale' : undefined;
  const deal = transaction ? transactionLabel(transaction) : 'خرید، فروش و اجاره';
  const typeName = input.propertyTypeName?.trim() || 'ملک';
  const placeParts = [input.locationName, input.cityName].filter(Boolean) as string[];
  const place = placeParts.length > 0 ? placeParts.join('، ') : 'شرق تهران، دماوند و پردیس';
  const pageSuffix = input.page && input.page > 1 ? ` | صفحه ${input.page}` : '';

  let h1: string;
  if (input.query?.trim()) {
    h1 = `نتایج جستجو برای «${input.query.trim()}»`;
  } else if (transaction) {
    h1 = `${typeName === 'ملک' ? 'املاک' : typeName} ${deal} در ${place}`;
  } else {
    h1 = `آگهی‌های املاک در ${place}`;
  }

  const title = `${h1}${pageSuffix}`;
  const description = input.query?.trim()
    ? `جستجوی «${input.query.trim()}» در آگهی‌های خرید، فروش و اجاره گویا. مشاهده ملک در ${place}.`
    : `مشاهده آگهی‌های ${deal} ${typeName} در ${place}. قیمت، متراژ و مشخصات کامل ملک‌ها در پلتفرم گویا.`;

  return { title, description, h1 };
}

export function buildPropertySeo(property: Property | PropertyListItem) {
  const city = namedValue(property.city);
  const location = namedValue(property.location);
  const typeName = namedValue(property.property_type) || 'ملک';
  const deal = transactionLabel(property.transaction_type);
  const place = [location, city].filter(Boolean).join('، ') || 'شرق تهران';
  const measure = property.measure ? `${property.measure} متری` : '';
  const rooms = property.rooms ? `${property.rooms} خواب` : '';

  const title = property.title?.trim() || `${typeName} ${deal} در ${place}`;
  const rawDescription = 'description' in property ? property.description : undefined;
  const description =
    truncateText(rawDescription || '') ||
    `${deal} ${typeName} ${measure} ${rooms} در ${place}. مشاهده جزئیات، قیمت و تصاویر ملک در گویا.`.replace(/\s+/g, ' ').trim();

  return {
    title,
    description,
    keywords: [typeName, deal, city, location, 'املاک', 'گویا'].filter(Boolean),
  };
}

export function organizationJsonLd() {
  const url = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${url}/#organization`,
    name: SITE_NAME,
    alternateName: SITE_NAME_EN,
    url,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/logo.png'),
    },
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    description: DEFAULT_DESCRIPTION,
    email: GOOOYA_CONTACT_EMAIL,
    telephone: GOOOYA_CONTACT_PHONE_TEL,
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'شرق تهران' },
      { '@type': 'City', name: 'دماوند' },
      { '@type': 'City', name: 'پردیس' },
    ],
    sameAs: [],
  };
}

export function websiteJsonLd() {
  const url = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}/#website`,
    name: SITE_NAME,
    url,
    inLanguage: 'fa-IR',
    publisher: { '@id': `${url}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/properties?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function propertiesCollectionJsonLd(input: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    isPartOf: { '@id': `${getSiteUrl()}/#website` },
    about: {
      '@type': 'RealEstateAgent',
      name: SITE_NAME,
    },
  };
}

export function propertyJsonLd(property: Property) {
  const url = absoluteUrl(`/properties/${property.slug}`);
  const images = (property.images || [])
    .map((img) => propertyMainImage([img], property.updated_at))
    .filter(Boolean) as string[];
  const city = namedValue(property.city);
  const location = namedValue(property.location);
  const typeName = namedValue(property.property_type) || 'Residence';
  const isRent = property.transaction_type === 'rent';
  const price = isRent ? property.rent : property.price;
  const seo = buildPropertySeo(property);

  const offers =
    price && price > 0
      ? {
          '@type': 'Offer',
          url,
          priceCurrency: 'IRR',
          price: String(price),
          availability: 'https://schema.org/InStock',
          businessFunction: isRent
            ? 'https://schema.org/LeaseOut'
            : 'https://schema.org/Sell',
        }
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    name: property.title,
    description: seo.description,
    url,
    datePosted: property.created_at,
    dateModified: property.updated_at,
    image: images.length ? images : [absoluteUrl(DEFAULT_OG_IMAGE)],
    numberOfRooms: property.rooms || undefined,
    floorSize: property.measure
      ? {
          '@type': 'QuantitativeValue',
          value: Number(property.measure) || property.measure,
          unitCode: 'MTK',
        }
      : undefined,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IR',
      addressLocality: city || undefined,
      addressRegion: location || city || undefined,
      streetAddress: property.address || undefined,
    },
    additionalType: typeName,
    offers,
  };
}
