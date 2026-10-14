'use client';

import Link from 'next/link';
import { Loader2, Home, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocationDetail } from '@/hooks/useLocationDetail';
import LocationDetailClient from './LocationDetailClient';

interface LocationDetailPageClientProps {
  locationId: number;
}

/**
 * بارگذاری جزئیات منطقه از طریق proxy
 */
export default function LocationDetailPageClient({
  locationId,
}: LocationDetailPageClientProps) {
  const { data: location, isLoading, error } = useLocationDetail(locationId);

  if (isLoading) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-20">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-[#2A86FE]" />
        <p className="text-sm text-[#717171]">در حال بارگذاری اطلاعات منطقه...</p>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Home className="mx-auto mb-4 h-14 w-14 text-red-500" />
        <h1 className="mb-2 text-2xl font-bold text-[#373A50]">منطقه یافت نشد</h1>
        <p className="mb-6 text-sm text-[#717171]">
          {error?.message || 'اطلاعات این منطقه در دسترس نیست.'}
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/cities">
            <Button variant="outline" className="gap-2">
              <ArrowRight className="h-4 w-4" />
              شهرها و مناطق
            </Button>
          </Link>
          <Link href="/properties">
            <Button>لیست املاک</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <LocationDetailClient location={location} />;
}
