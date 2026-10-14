'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchProperties } from '@/hooks/useSearch';
import type { LocationDetail } from '@/types/location';
import type { PropertyListItem } from '@/types/property';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/cards/PropertyCard';
import { CkHtmlContent } from '@/components/content/CkHtmlContent';
import {
  Building2,
  MapPin,
  ArrowRight,
  Loader2,
  Coins,
  LandPlot,
  MapPinned,
} from 'lucide-react';

interface LocationDetailClientProps {
  location: LocationDetail;
}

const DESCRIPTION_PREVIEW_LENGTH = 220;
const EXPAND_MIN_DELTA = 40;

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('fa-IR').format(value);
}

export default function LocationDetailClient({
  location,
}: LocationDetailClientProps) {
  const [expanded, setExpanded] = useState(false);

  const rawDescription = location.description?.trim() || '';
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

  const { data, isLoading, error } = useSearchProperties(
    {
      location: location.id,
      page: 1,
      page_size: 12,
      sort_by: '-created_at',
    },
    { enabled: true }
  );

  const properties = (data?.results || []) as PropertyListItem[];

  const iframeHtml = location.iframe?.trim() || '';
  const canRenderIframe = iframeHtml.startsWith('<iframe');

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#717171]">
        <Link href="/cities" className="transition hover:text-[#2A86FE]">
          شهرها و مناطق
        </Link>
        <span>/</span>
        <Link
          href={`/cities/${location.city}`}
          className="transition hover:text-[#2A86FE]"
        >
          {location.city_name}
        </Link>
        <span>/</span>
        <span className="text-[#373A50]">{location.name}</span>
      </div>

      <article className="mb-8 overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b border-black/5 px-5 py-5 sm:px-7 sm:py-6">
          <h1 className="flex flex-wrap items-center gap-2 text-2xl font-bold text-[#373A50] md:text-3xl">
            <MapPin className="h-6 w-6 shrink-0 text-[#2A86FE]" />
            درباره منطقه {location.name}
          </h1>
          <p className="mt-2 text-sm text-[#717171]">
            شهر{' '}
            <Link
              href={`/cities/${location.city}`}
              className="font-medium text-[#2A86FE] hover:underline"
            >
              {location.city_name}
            </Link>
          </p>

          <div className="mt-4 flex flex-wrap gap-2 text-xs sm:text-sm">
            {location.city_province ? (
              <span className="rounded-lg bg-[#F3F4F6] px-2.5 py-1 text-[#4B5563]">
                استان {location.city_province}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F3F4F6] px-2.5 py-1 text-[#4B5563]">
              <Building2 className="h-3.5 w-3.5" />
              {location.properties_count.toLocaleString('fa-IR')} ملک
            </span>
            {location.land_use ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F3F4F6] px-2.5 py-1 text-[#4B5563]">
                <LandPlot className="h-3.5 w-3.5" />
                کاربری {location.land_use}
              </span>
            ) : null}
            {typeof location.average_price === 'number' ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#F3F4F6] px-2.5 py-1 text-[#4B5563]">
                <Coins className="h-3.5 w-3.5" />
                میانگین {formatPrice(location.average_price)} تومان
              </span>
            ) : null}
          </div>
        </div>

        <div className="space-y-6 px-5 py-5 sm:px-7 sm:py-6">
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
              توضیحی برای این منطقه ثبت نشده است.
            </p>
          )}

          {canRenderIframe ? (
            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[#373A50]">
                <MapPinned className="h-4 w-4 text-[#2A86FE]" />
                نقشه منطقه
              </div>
              <div
                className="w-full overflow-hidden rounded-xl border border-[#E5E7EB] bg-white [&_iframe]:h-[320px] [&_iframe]:w-full"
                dangerouslySetInnerHTML={{ __html: iframeHtml }}
              />
            </div>
          ) : null}
        </div>
      </article>

      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-[#373A50] md:text-2xl">
          املاک منطقه {location.name}
        </h2>
        <Link href={`/properties?location=${location.id}`}>
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
          خطا در دریافت املاک این منطقه: {error.message}
        </div>
      ) : properties.length === 0 ? (
        <div className="rounded-2xl bg-white px-4 py-12 text-center shadow-sm">
          <Building2 className="mx-auto mb-3 h-10 w-10 text-[#9CA3AF]" />
          <p className="text-sm text-[#717171]">
            در حال حاضر ملکی برای این منطقه موجود نیست.
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


