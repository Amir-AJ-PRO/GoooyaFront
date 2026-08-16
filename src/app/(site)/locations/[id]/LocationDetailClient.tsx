'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchProperties } from '@/hooks/useSearch';
import type { LocationDetail } from '@/types/location';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import PropertyCard from '@/components/cards/PropertyCard';
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

const DESCRIPTION_PREVIEW_LENGTH = 160;
const EXPAND_MIN_DELTA = 40;

function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat('fa-IR').format(value);
}

export default function LocationDetailClient({ location }: LocationDetailClientProps) {
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
    return plainDescription.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd() + '...';
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

  const properties = (data?.results || []) as any[];

  const iframeHtml = location.iframe?.trim() || '';
  const canRenderIframe = iframeHtml.startsWith('<iframe');

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
          <ArrowRight className="h-4 w-4" />
          بازگشت به صفحه اصلی
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <h1 className="text-2xl md:text-3xl font-semibold leading-none tracking-tight flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            املاک {location.name}
            <span className="text-muted-foreground text-base font-normal">
              ({location.city_name})
            </span>
          </h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {location.city_province && (
              <Badge variant="secondary">
                استان: {location.city_province}
              </Badge>
            )}
            <Badge variant="secondary" className="gap-2">
              <Building2 className="h-4 w-4" />
              {location.properties_count} ملک
            </Badge>
            {location.land_use && (
              <Badge variant="secondary" className="gap-2">
                <LandPlot className="h-4 w-4" />
                کاربری: {location.land_use}
              </Badge>
            )}
            {typeof location.average_price === 'number' && (
              <Badge variant="secondary" className="gap-2">
                <Coins className="h-4 w-4" />
                میانگین قیمت: {formatPrice(location.average_price)} تومان
              </Badge>
            )}
          </div>

          <Separator />

          {plainDescription ? (
            <div className="leading-8 text-sm md:text-base text-foreground">
              {expanded || !canToggleDescription ? (
                isHtmlDescription ? (
                  <div
                    className="prose prose-sm md:prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: rawDescription }}
                  />
                ) : (
                  plainDescription
                )
              ) : (
                previewText
              )}

              {canToggleDescription && (
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setExpanded((v) => !v)}
                    className="gap-2"
                  >
                    {expanded ? 'نمایش کمتر' : 'ادامه مطلب'}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">
              توضیحی برای این منطقه ثبت نشده است.
            </p>
          )}

          {canRenderIframe && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-3 text-sm font-medium">
                  <MapPinned className="h-4 w-4 text-primary" />
                  نقشه منطقه
                </div>
                <div
                  className="w-full overflow-hidden rounded-lg border bg-white [&_iframe]:w-full [&_iframe]:h-[320px]"
                  dangerouslySetInnerHTML={{ __html: iframeHtml }}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl md:text-2xl font-bold">
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
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : error ? (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700 text-sm">
              خطا در دریافت املاک این منطقه: {error.message}
            </p>
          </CardContent>
        </Card>
      ) : properties.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Building2 className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              در حال حاضر ملکی برای این منطقه موجود نیست.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p: any) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}


