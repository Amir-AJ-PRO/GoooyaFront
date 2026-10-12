'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, A11y } from 'swiper/modules';
import 'swiper/css';

import { useHomepageProperties } from '@/hooks/usePropertyMutations';
import HomepagePropertyCard from '@/components/home/HomepagePropertyCard';
import { Card } from '@/components/ui/card';
import { Home, AlertCircle, Castle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

function PropertyCardSkeleton() {
  return (
    <article className="flex h-[340px] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm">
      <div className="h-[180px] w-full animate-pulse bg-gray-200" />
      <div className="flex h-[160px] flex-col gap-2 px-3.5 pb-3.5 pt-3">
        <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-full animate-pulse rounded bg-gray-200" />
        <div className="flex justify-between">
          <div className="h-5 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-5 w-14 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="mt-auto h-6 w-24 self-end animate-pulse rounded bg-gray-200" />
      </div>
    </article>
  );
}

export default function FeaturedProperties() {
  const { data: properties, isLoading, isPending, error } = useHomepageProperties();
  const loading = isPending || isLoading;
  const items = properties ?? [];

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
    <section className="overflow-x-clip bg-[#E0E0E0]">
      <div className="container mx-auto px-4">
        {loading ? (
          <>
            {sectionHeader}
            <div className="mb-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
              {[1, 2, 3, 4].map((item) => (
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
        ) : items.length > 0 ? (
          <>
            {sectionHeader}

            <div
              className="featured-properties-swiper relative mb-12 overflow-hidden [&_.swiper-slide]:h-[340px]"
              dir="rtl"
            >
              <div
                className={
                  items.length > 1
                    ? '[&_.swiper]:overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.2)_3%,rgba(0,0,0,0.55)_8%,rgba(0,0,0,0.85)_14%,black_20%,black_100%)] [-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.2)_3%,rgba(0,0,0,0.55)_8%,rgba(0,0,0,0.85)_14%,black_20%,black_100%)]'
                    : '[&_.swiper]:overflow-hidden'
                }
              >
                <Swiper
                  modules={[Autoplay, A11y]}
                  dir="rtl"
                  slidesPerView={1.3}
                  spaceBetween={12}
                  grabCursor
                  watchOverflow
                  loop={items.length > 4}
                  autoplay={
                    items.length > 1
                      ? {
                          delay: 4500,
                          disableOnInteraction: false,
                          pauseOnMouseEnter: true,
                        }
                      : false
                  }
                  breakpoints={{
                    640: {
                      slidesPerView: 2.4,
                      spaceBetween: 12,
                    },
                    1024: {
                      slidesPerView: 3.65,
                      spaceBetween: 16,
                    },
                    1280: {
                      slidesPerView: 4.55,
                      spaceBetween: 16,
                    },
                  }}
                  className="w-full overflow-hidden"
                >
                  {items.map((property) => (
                    <SwiperSlide key={property.id}>
                      <HomepagePropertyCard property={property} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Blur starts at peek-card start, then intensifies toward the edge */}
              {items.length > 1 && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[22%] sm:w-[18%] lg:w-[16%] xl:w-[14%]"
                >
                  <div className="absolute inset-0 backdrop-blur-[0.5px] [mask-image:linear-gradient(to_right,black_0%,rgba(0,0,0,0.5)_55%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,black_0%,rgba(0,0,0,0.5)_55%,transparent_100%)]" />
                  <div className="absolute inset-y-0 left-0 w-[75%] backdrop-blur-[1.5px] [mask-image:linear-gradient(to_right,black_0%,rgba(0,0,0,0.55)_50%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,black_0%,rgba(0,0,0,0.55)_50%,transparent_100%)]" />
                  <div className="absolute inset-y-0 left-0 w-[45%] backdrop-blur-[2.5px] [mask-image:linear-gradient(to_right,black_0%,rgba(0,0,0,0.6)_45%,transparent_100%)] [-webkit-mask-image:linear-gradient(to_right,black_0%,rgba(0,0,0,0.6)_45%,transparent_100%)]" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#E0E0E0]/90 from-[0%] via-[#E0E0E0]/35 via-[45%] to-transparent to-[100%]" />
                </div>
              )}
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
              <Button variant="outline">مشاهده تمام املاک</Button>
            </Link>
          </Card>
        )}
      </div>
    </section>
  );
}
