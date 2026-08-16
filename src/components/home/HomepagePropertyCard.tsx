'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bed, MapPin, Ruler } from 'lucide-react';
import { PropertyListItem } from '@/types/property';
import { API_BASE_URL } from '@/lib/constants';

interface HomepagePropertyCardProps {
  property: PropertyListItem;
}

function getImageUrl(property: PropertyListItem): string {
  const mainImage = property.images?.find((img) => img.is_main) || property.images?.[0];
  if (!mainImage?.image) return '/placeholder-property.jpg';

  if (mainImage.image.startsWith('http')) return mainImage.image;

  const path = mainImage.image.startsWith('/') ? mainImage.image : `/${mainImage.image}`;
  return `${API_BASE_URL}${path}`;
}

function getLocationText(property: PropertyListItem): string {
  if (property.address) return property.address;

  const cityName =
    typeof property.city === 'string'
      ? property.city
      : property.city?.name;

  const locationName =
    typeof property.location === 'string'
      ? property.location
      : property.location?.name;

  if (cityName && locationName) return `${cityName}، ${locationName}`;
  if (cityName) return cityName;
  if (locationName) return locationName;

  return 'موقعیت نامشخص';
}

function isGoooyaProperty(property: PropertyListItem): boolean {
  const propertyAny = property as PropertyListItem & {
    is_goooya_property?: boolean;
    is_goooya_adviser?: boolean;
    is_goooya?: boolean;
    agent?: string | { is_goooya_adviser?: boolean };
  };

  if (
    propertyAny.is_goooya_property ||
    propertyAny.is_goooya_adviser ||
    propertyAny.is_goooya
  ) {
    return true;
  }

  const agent = propertyAny.agent;
  if (agent && typeof agent === 'object') {
    return agent.is_goooya_adviser === true;
  }
  if (typeof agent === 'string') {
    const normalized = agent.toLowerCase();
    return normalized.includes('گویا') || normalized.includes('gooya') || normalized.includes('goooya');
  }

  return false;
}

function formatPrice(property: PropertyListItem): string {
  if (property.price) {
    return property.price.toLocaleString('fa-IR');
  }
  if (property.mortgage || property.rent) {
    const parts: string[] = [];
    if (property.mortgage) {
      parts.push(`رهن ${property.mortgage.toLocaleString('fa-IR')}`);
    }
    if (property.rent) {
      parts.push(`اجاره ${property.rent.toLocaleString('fa-IR')}`);
    }
    return parts.join(' / ');
  }
  return 'توافقی';
}

export default function HomepagePropertyCard({ property }: HomepagePropertyCardProps) {
  const imageUrl = getImageUrl(property);
  const showGooyaBadge = isGoooyaProperty(property);

  return (
    <Link href={`/properties/${property.slug}`} className="mx-auto block h-full w-full max-w-[380px] lg:max-w-[360px]">
      <article className="flex h-full flex-col rounded-2xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
        <div className="relative h-[200px] w-full shrink-0 overflow-hidden bg-gray-100 sm:h-[220px]">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover"
            sizes="(max-width: 1023px) 100vw, 33vw"
          />

          {showGooyaBadge && (
            <div className="absolute left-2 top-2 rounded-md bg-white/95 px-2 py-1 shadow-sm">
              <Image
                src="/logo.png"
                alt="گویا"
                width={48}
                height={16}
                className="h-4 w-auto object-contain"
              />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 px-1 pb-2 pt-4 text-right">
          <h3 className="line-clamp-1 text-lg font-bold text-black sm:text-xl">{property.title}</h3>

          <div className="flex items-center gap-2 text-sm text-[#374151]">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#374151]">
              <MapPin className="h-3 w-3 stroke-[1.5]" />
            </span>
            <span className="line-clamp-1">{getLocationText(property)}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-[#374151]">
            <div className="flex items-center gap-1.5">
              <Ruler className="h-4 w-4 shrink-0" />
              <span>{property.measure} متر مربع</span>
            </div>

            {property.rooms > 0 && (
              <div className="flex items-center gap-1.5">
                <Bed className="h-4 w-4 shrink-0" />
                <span>{property.rooms.toLocaleString('fa-IR')} خوابه</span>
              </div>
            )}
          </div>

          <div className="mt-auto flex items-baseline justify-end gap-1.5 pt-2">
            <span className="text-xl font-bold text-black sm:text-2xl">{formatPrice(property)}</span>
            {property.price && (
              <span className="text-sm font-normal text-black">تومان</span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
