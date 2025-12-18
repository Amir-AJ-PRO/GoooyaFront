'use client';

import { useHomepageProperties } from '@/hooks/usePropertyMutations';
import PropertyCard from '@/components/PropertyCard';
import { Card } from '@/components/ui/card';
import { Loader2, Home, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * کامپوننت نمایش املاک ویژه در صفحه اصلی
 * فقط املاک واقعی از API نمایش داده می‌شود
 */
export default function FeaturedProperties() {
  const { data: properties, isLoading, error } = useHomepageProperties();return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* هدر */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
            <Home className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            املاک <span className="text-primary">ویژه</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            جدیدترین و برترین املاک برای خرید و اجاره
          </p>
        </div>

        {/* محتوا */}
        {isLoading ? (
          // حالت بارگذاری
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-gray-600 text-lg">در حال بارگذاری املاک...</p>
          </div>
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
          // نمایش املاک واقعی از API
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {/* دکمه مشاهده همه */}
            <div className="text-center">
              <Link href="/properties">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary-hover hover:to-blue-700 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                >
                  <Home className="w-5 h-5 ml-2" />
                  مشاهده تمام املاک
                </Button>
              </Link>
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

