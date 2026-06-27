'use client';

import { useHomepageProperties } from '@/hooks/usePropertyMutations';
import HomepagePropertyCard from '@/components/home/HomepagePropertyCard';
import { Card } from '@/components/ui/card';
import { Home, AlertCircle, Castle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

/**
 * کامپوننت نمایش املاک ویژه در صفحه اصلی
 * فقط املاک واقعی از API نمایش داده می‌شود
 */
function PropertyCardSkeleton() {
  return (
    <article className="mx-auto w-full max-w-[380px] animate-pulse rounded-2xl bg-white p-3 shadow-sm">
      <div className="h-[200px] w-full rounded-xl bg-gray-200 sm:h-[220px]" />
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
    <section className="  bg-[#E0E0E0]">
      <div className="container mx-auto px-4 ">
        {/* هدر */}
        {/* <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4 my-14" >
            <Home className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            املاک <span className="text-primary">ویژه</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            جدیدترین و برترین املاک برای خرید و اجاره
          </p>
        </div> */}

        {/* محتوا */}
        {loading ? (
          <>
            {sectionHeader}
            <div className="mb-8 sm:hidden">
              <div className="-mx-4 flex gap-4 overflow-hidden px-4">
                <div className="w-[85%] shrink-0">
                  <PropertyCardSkeleton />
                </div>
                <div className="w-[15%] shrink-0">
                  <PropertyCardSkeleton />
                </div>
              </div>
            </div>
            <div className="mb-12 hidden grid-cols-1 justify-items-center gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {[1, 2, 3].map((item) => (
                <PropertyCardSkeleton key={item} />
              ))}
            </div>
          </>
        ) : error ? (
          // حالت خطا - نمایش پیام خطا
          <Card className="p-8 text-center border-2 border-red-200 bg-red-50">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-800 mb-2">خطا در بارگذاری املاک</h3>
            <p className="text-red-600 mb-4">
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
        ) : properties && properties.length > 0 ? (
          <>
            {sectionHeader}

            {/* mobile swiper */}
            <div className="mb-8 sm:hidden">
              <div className="-mx-4 px-4">
                <Swiper
                  spaceBetween={16}
                  slidesPerView={1.2}
                  className="w-full"
                >
                  {properties.map((property) => (
                    <SwiperSlide key={property.id} className="pb-4">
                      <HomepagePropertyCard property={property} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            {/* desktop / tablet grid */}
            <div className="mb-12 hidden grid-cols-1 justify-items-center gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              {properties.map((property) => (
                <HomepagePropertyCard key={property.id} property={property} />
              ))}
            </div>
          </>
        ) : (
          // حالت خالی - هیچ ملکی موجود نیست
          <Card className="p-12 text-center border-2 border-dashed">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">هنوز ملکی ثبت نشده</h3>
            <p className="text-gray-500 mb-6">
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

