'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchProperties } from '@/hooks/useSearch';
import { useLocations } from '@/hooks/useLocations';
import type { CityDetail } from '@/types/city';
import type { PropertyListItem } from '@/types/property';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/cards/PropertyCard';
import { CkHtmlContent } from '@/components/content/CkHtmlContent';
import { Building2, MapPin, Users, ArrowRight, Loader2 } from 'lucide-react';

interface CityDetailClientProps {
  city: CityDetail;
}

const DESCRIPTION_PREVIEW_LENGTH = 220;
const EXPAND_MIN_DELTA = 40;

function formatPopulation(population: number): string {
  return new Intl.NumberFormat('fa-IR').format(population);
}

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

export default function CityDetailClient({ city }: CityDetailClientProps) {
  const [expanded, setExpanded] = useState(false);

  const rawDescription = city.description?.trim() || '';
  const isHtmlDescription = /<\/?[a-z][\s\S]*>/i.test(rawDescription);
  const plainDescription = useMemo(
    () => (rawDescription ? stripHtml(rawDescription) : ''),
    [rawDescription]
  );

  const canToggleDescription =
    plainDescription.length > DESCRIPTION_PREVIEW_LENGTH + EXPAND_MIN_DELTA;

  const previewText = useMemo(() => {
    if (!plainDescription) return '';
    if (!canToggleDescription) return plainDescription;
    return `${plainDescription.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd()}...`;
  }, [plainDescription, canToggleDescription]);

  const { data: locations = [], isLoading: locationsLoading } = useLocations(
    city.id,
    { enabled: true }
  );

  const { data, isLoading, error } = useSearchProperties(
    {
      city: city.id,
      page: 1,
      page_size: 12,
      sort_by: '-created_at',
    },
    { enabled: true }
  );

  const properties = (data?.results || []) as PropertyListItem[];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
        <Link
          href="/cities"
          className="inline-flex items-center gap-2 text-[#717171] transition hover:text-[#2A86FE]"
        >
          <ArrowRight className="h-4 w-4" />
          شهرها و مناطق
        </Link>
      </div>

      <article className="mb-8 overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b border-black/5 px-5 py-5 sm:px-7 sm:py-6">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-[#373A50] md:text-3xl">
            <MapPin className="h-6 w-6 shrink-0 text-[#2A86FE]" />
            درباره شهر {city.name}
          </h1>

          <div className="mt-4 flex flex-wrap gap-2 text-xs sm:text-sm">
            {city.province ? (
              <span className="rounded-lg bg-[#F3F4F6] px-2.5 py-1 text-[#4B5563]">
                استان {city.province}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F3F4F6] px-2.5 py-1 text-[#4B5563]">
              <Building2 className="h-3.5 w-3.5" />
              {city.locations_count.toLocaleString('fa-IR')} منطقه
            </span>
            {typeof city.population === 'number' ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F3F4F6] px-2.5 py-1 text-[#4B5563]">
                <Users className="h-3.5 w-3.5" />
                جمعیت {formatPopulation(city.population)}
              </span>
            ) : null}
          </div>
        </div>

        <div className="px-5 py-5 sm:px-7 sm:py-6">
          {plainDescription ? (
            <div>
              {expanded || !canToggleDescription ? (
                isHtmlDescription ? (
                  <CkHtmlContent html={rawDescription} />
                ) : (
                  <p className="text-sm leading-8 text-[#373A50] md:text-base">
                    {plainDescription}
                  </p>
                )
              ) : (
                <p className="text-sm leading-8 text-[#373A50] md:text-base">
                  {previewText}
                </p>
              )}

              {canToggleDescription ? (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpanded((v) => !v)}
                  >
                    {expanded ? 'نمایش کمتر' : 'ادامه مطلب'}
                  </Button>
                </div>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-[#717171]">
              توضیحی برای این شهر ثبت نشده است.
            </p>
          )}
        </div>
      </article>

      <section className="mb-10">
        <h2 className="mb-4 text-xl font-bold text-[#373A50] md:text-2xl">
          مناطق {city.name}
        </h2>
        {locationsLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-[#2A86FE]" />
          </div>
        ) : locations.length === 0 ? (
          <p className="rounded-2xl bg-white px-4 py-8 text-center text-sm text-[#717171] shadow-sm">
            منطقه‌ای برای این شهر ثبت نشده است.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((loc) => (
              <li key={loc.id}>
                <Link
                  href={`/locations/${loc.id}`}
                  className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3.5 text-sm font-medium text-[#373A50] shadow-sm transition hover:text-[#2A86FE] hover:shadow-md"
                >
                  <Building2 className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
                  <span className="truncate">درباره منطقه {loc.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-[#373A50] md:text-2xl">
          املاک شهر {city.name}
        </h2>
        <Link href={`/properties?city=${city.id}`}>
          <Button variant="outline" className="gap-2">
            مشاهده همه
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-[#2A86FE]" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
          خطا در دریافت املاک این شهر: {error.message}
        </div>
      ) : properties.length === 0 ? (
        <div className="rounded-2xl bg-white px-4 py-12 text-center shadow-sm">
          <Building2 className="mx-auto mb-3 h-10 w-10 text-[#9CA3AF]" />
          <p className="text-sm text-[#717171]">
            در حال حاضر ملکی برای این شهر موجود نیست.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}

