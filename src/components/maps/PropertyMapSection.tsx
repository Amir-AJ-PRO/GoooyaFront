'use client';

import { Component, type ReactNode } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { MapPinned } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocationDetail } from '@/hooks/useLocationDetail';
import { useLocations } from '@/hooks/useLocations';
import { useGeocode } from '@/hooks/useGeocode';
import {
  findCityCoordinates,
  mapAreaRadiusMeters,
  normalizeIranCoordinates,
  placeNamesMatch,
  type MapAreaPrecision,
} from '@/lib/mapCoordinates';

const PropertyLeafletMap = dynamic(() => import('./PropertyLeafletMap'), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

interface PropertyMapSectionProps {
  locationIframe?: string | null;
  locationId?: number | null;
  locationName?: string;
  cityName?: string;
  title?: string;
  address?: string | null;
}

class MapErrorBoundary extends Component<
  { children: ReactNode; resetKey?: string },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: { resetKey?: string }) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error: Error) {
    console.error('Property map failed to render:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-[320px] w-full flex-col items-center justify-center gap-3 rounded-lg border bg-muted px-4 text-center text-sm text-muted-foreground">
          <span>نمایش نقشه در حال حاضر ممکن نیست.</span>
          <button
            type="button"
            className="rounded-md border bg-white px-3 py-1.5 text-xs text-foreground hover:bg-muted"
            onClick={() => this.setState({ hasError: false })}
          >
            تلاش مجدد
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

function MapSkeleton() {
  return (
    <div className="flex h-[320px] w-full items-center justify-center rounded-lg border bg-muted">
      <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
    </div>
  );
}

function sanitizeIframe(html?: string | null): string | null {
  const trimmed = html?.trim() || '';
  return trimmed.startsWith('<iframe') ? trimmed : null;
}

export default function PropertyMapSection({
  locationIframe,
  locationId,
  locationName,
  cityName,
  title,
  address,
}: PropertyMapSectionProps) {
  const iframeFromProperty = sanitizeIframe(locationIframe);
  const cityCoords = findCityCoordinates(cityName);
  const placeLabel =
    address?.trim() || [cityName, locationName].filter(Boolean).join('، ');

  const needsLocationLookup = !locationId && Boolean(locationName);

  const { data: locationsData } = useLocations(undefined, {
    enabled: needsLocationLookup,
  });
  const locations = Array.isArray(locationsData) ? locationsData : [];

  const matchedLocation =
    locations.find(
      (item) => placeNamesMatch(item.name, locationName) && placeNamesMatch(item.city_name, cityName)
    ) || locations.find((item) => placeNamesMatch(item.name, locationName));

  const resolvedLocationId = locationId || matchedLocation?.id || null;

  const { data: locationDetail, isLoading: loadingLocationDetail } = useLocationDetail(
    resolvedLocationId,
    {
      enabled: Boolean(resolvedLocationId) && !iframeFromProperty,
    }
  );

  const iframeHtml = iframeFromProperty || sanitizeIframe(locationDetail?.iframe);

  const geocodeQuery = placeLabel ? `${placeLabel} ایران` : null;
  const { data: geocoded, isLoading: loadingGeocode } = useGeocode(geocodeQuery, {
    enabled: Boolean(geocodeQuery),
  });
  const geocodedCoords = geocoded
    ? normalizeIranCoordinates(geocoded.lat, geocoded.lon)
    : null;

  const waitingForBetterCoords = Boolean(geocodeQuery) && loadingGeocode;
  const mapCenter = geocodedCoords || (waitingForBetterCoords ? null : cityCoords);
  const areaPrecision: MapAreaPrecision = geocodedCoords ? 'geocoded' : 'city';
  const radiusMeters = mapAreaRadiusMeters(areaPrecision);

  const showIframe = !mapCenter && Boolean(iframeHtml);
  const showLeaflet = Boolean(mapCenter);
  const waitingForLocation =
    !showIframe &&
    !showLeaflet &&
    ((Boolean(resolvedLocationId) && loadingLocationDetail) || waitingForBetterCoords);

  if (!showIframe && !showLeaflet && !waitingForLocation) {
    return null;
  }

  const subtitle = placeLabel || [cityName, locationName].filter(Boolean).join(' - ');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-3 text-xl">
          <span className="flex items-center gap-2">
            <MapPinned className="h-5 w-5 text-primary" />
            موقعیت ملک
          </span>
          {resolvedLocationId ? (
            <Button asChild variant="outline" size="sm" className="gap-2">
              <Link href={`/locations/${resolvedLocationId}`}>
                مشاهده منطقه
              </Link>
            </Button>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <MapErrorBoundary
          resetKey={`${mapCenter?.[0] ?? 'none'}-${mapCenter?.[1] ?? 'none'}-${radiusMeters}`}
        >
          {waitingForLocation ? (
            <MapSkeleton />
          ) : showIframe && iframeHtml ? (
            <div
              className="w-full overflow-hidden rounded-lg border bg-white [&_iframe]:h-[320px] [&_iframe]:w-full"
              dangerouslySetInnerHTML={{ __html: iframeHtml }}
            />
          ) : showLeaflet && mapCenter ? (
            <PropertyLeafletMap
              center={mapCenter}
              radiusMeters={radiusMeters}
              title={title || locationName || cityName}
              subtitle={subtitle}
            />
          ) : null}
        </MapErrorBoundary>

        <p className="text-xs text-muted-foreground">
          {areaPrecision === 'city'
            ? 'مختصات دقیق این آگهی ثبت نشده؛ محدوده تقریبی شهر نمایش داده می‌شود.'
            : 'نقشه محدوده تقریبی آدرس ثبت‌شده را نشان می‌دهد، نه موقعیت دقیق ساختمان.'}
        </p>
      </CardContent>
    </Card>
  );
}
