'use client';

import Link from 'next/link';
import { Loader2, Home, ArrowRight } from 'lucide-react';
import { useCityDetail } from '@/hooks/useCityDetail';
import { Button } from '@/components/ui/button';
import CityDetailClient from './CityDetailClient';

interface CityPageClientProps {
  cityId: number;
}

/**
 * بارگذاری جزئیات شهر از طریق proxy — روی لوکال و پروداکشن پایدارتر از SSR مستقیم است
 */
export default function CityPageClient({ cityId }: CityPageClientProps) {
  const { data: city, isLoading, error } = useCityDetail(cityId);

  if (isLoading) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-20">
        <Loader2 className="mb-4 h-12 w-12 animate-spin text-[#2A86FE]" />
        <p className="text-sm text-[#717171]">در حال بارگذاری اطلاعات شهر...</p>
      </div>
    );
  }

  if (error || !city) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <Home className="mx-auto mb-4 h-14 w-14 text-red-500" />
        <h1 className="mb-2 text-2xl font-bold text-[#373A50]">شهر یافت نشد</h1>
        <p className="mb-6 text-sm text-[#717171]">
          {error?.message || 'اطلاعات این شهر در حال حاضر در دسترس نیست.'}
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/cities">
            <Button variant="outline" className="gap-2">
              <ArrowRight className="h-4 w-4" />
              شهرها و مناطق
            </Button>
          </Link>
          <Link href="/properties">
            <Button>املاک</Button>
          </Link>
        </div>
      </div>
    );
  }

  return <CityDetailClient city={city} />;
}
