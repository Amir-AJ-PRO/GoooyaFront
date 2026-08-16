'use client';

import { useHomepageProperties } from '@/hooks/usePropertyMutations';
import HomepagePropertyCard from '@/components/home/HomepagePropertyCard';
import { Card } from '@/components/ui/card';
import { Home, AlertCircle, Castle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * کامپوننت نمایش املاک ویژه در صفحه اصلی
 * فقط املاک واقعی از API نمایش داده می‌شود
 */
function PropertyCardSkeleton() {
  return (
    <article className="mx-auto h-full w-full max-w-[380px] animate-pulse rounded-2xl bg-white p-3 shadow-sm lg:max-w-[360px]">
      <div className="h-[200px] w-full bg-gray-200 sm:h-[220px]" />
      <div className="flex flex-col gap-3 px-1 pb-2 pt-4">
        <div className="h-5 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="flex justify-between">
          <div className="h-4 w-20 rounded bg-gray-200" />
          <div className="h-4 w-16 rounded bg-gray-200" />
        </div>
        <div className="h-7 w-28 self-end rounded bg-gray-200" />
      </div>
    </article>
  );
}

export default function FeaturedProperties() {
  const { data: properties, isLoading, isPending, error } = useHomepageProperties();
  const loading = isPending || isLoading;
  const visibleProperties = properties?.slice(0, 3) ?? [];

  const sectionHeader = (
    <div className="mb-5 mt-8 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Castle className="size-6 text-black" />
        <h2 className="text-lg font-bold text-black">املاک ویژه</h2>
      </div>
      <Link
        href="/properties"
        className="flex items-center gap-1 text-sm text-black transition-colors hover:text-gray-700"
      >
        <span>بیشتر</span>
        <ChevronLeft className="size-5" />
      </Link>
    </div>
  );

  return (
    <section className="relative z-0 bg-[#E0E0E0]">
      <div className="container mx-auto px-4">
        {loading ? (
          <>
            {sectionHeader}
            <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {[1, 2, 3].map((item) => (
                <PropertyCardSkeleton key={item} />
              ))}
            </div>
          </>
        ) : error ? (
          <Card className="border-2 border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />
            <h3 className="mb-2 text-xl font-bold text-red-800">خطا در بارگذاری املاک</h3>
            <p className="mb-4 text-red-600">
              {error.message || 'مشکلی در دریافت املاک پیش آمده است'}
            </p>
            <Button
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              onClick={() => window.location.reload()}
            >
              تلاش مجدد
            </Button>
          </Card>
        ) : visibleProperties.length > 0 ? (
          <>
            {sectionHeader}

            <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {visibleProperties.map((property) => (
                <HomepagePropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        ) : (
          <Card className="border-2 border-dashed p-12 text-center">
            <Home className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-xl font-bold text-gray-700">هنوز ملکی ثبت نشده</h3>
            <p className="mb-6 text-gray-500">
              در حال حاضر ملک ویژه‌ای برای نمایش وجود ندارد
            </p>
            <Link href="/properties">
              <Button variant="outline">
                مشاهده تمام املاک
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </section>
  );
}
