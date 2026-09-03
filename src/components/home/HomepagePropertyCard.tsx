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
  const roomsLabel =
    property.rooms > 0
      ? `${property.rooms.toLocaleString('fa-IR')} خوابه`
      : '—';

  return (
    <Link href={`/properties/${property.slug}`} className="group block h-full w-full">
      <article className="flex h-[340px] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
        <div className="relative h-[180px] w-full shrink-0 overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 33vw, 25vw"
          />

          {showGooyaBadge && (
            <div className="absolute left-2.5 top-2.5 rounded-md bg-white/95 px-2 py-1 shadow-sm">
              <Image
                src="/logo.png"
                alt="گویا"
                width={44}
                height={15}
                className="h-3.5 w-auto object-contain"
              />
            </div>
          )}
        </div>

        <div className="flex h-[160px] flex-col px-3.5 pb-3.5 pt-3 text-right">
          <h3 className="mb-1.5 line-clamp-1 h-5 text-[15px] font-bold leading-5 text-black">
            {property.title}
          </h3>

          <div className="mb-1.5 flex h-5 items-center gap-1.5 text-xs text-[#4B5563]">
            <MapPin className="h-3.5 w-3.5 shrink-0 stroke-[1.75]" />
            <span className="line-clamp-1">{getLocationText(property)}</span>
          </div>

          <div className="mb-auto flex h-5 items-center justify-between text-xs text-[#4B5563]">
            <div className="flex min-w-0 items-center gap-1">
              <Ruler className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{property.measure} متر</span>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <Bed className="h-3.5 w-3.5 shrink-0" />
              <span>{roomsLabel}</span>
            </div>
          </div>

          <div className="flex h-8 items-baseline justify-end gap-1 border-t border-black/5 pt-2">
            <span className="truncate text-base font-bold tracking-tight text-black">
              {formatPrice(property)}
            </span>
            {property.price ? (
              <span className="shrink-0 text-[11px] font-medium text-[#6B7280]">تومان</span>
            ) : null}
          </div>
        </div>
      </article>
    </Link>
  );
}
