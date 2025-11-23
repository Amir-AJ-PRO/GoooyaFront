'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PropertyCard from '@/components/cards/PropertyCard';
import { useProperties } from '@/hooks/usePropertyMutations';
import { ArrowLeft, Loader2, Building2, AlertCircle } from 'lucide-react';

export default function HomePageClient() {
  const { data: properties, isLoading, error, isError } = useProperties();
  
  // فقط 3 ملک اول را نمایش بده
  const featuredProperties = properties?.slice(0, 3) || [];
  
  // اگر خطا داریم
  if (isError) {
    return (
      <section className="py-2 md:py-4 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">املاک ویژه</h2>
              <p className="text-muted-foreground">بهترین املاک منتخب برای شما</p>
            </div>
            <Link href="/properties">
              <Button variant="outline" className="gap-2">
                مشاهده همه
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="text-center py-20">
            <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">خطا در بارگذاری املاک</h3>
            <p className="text-muted-foreground mb-4">
              {error?.message || 'لطفاً بعداً تلاش کنید'}
            </p>
            <Button onClick={() => window.location.reload()}>
              تلاش مجدد
            </Button>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-2 md:py-4 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">املاک ویژه</h2>
            <p className="text-muted-foreground">بهترین املاک منتخب برای شما</p>
          </div>
          <Link href="/properties">
            <Button variant="outline" className="gap-2">
              مشاهده همه
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">در حال بارگذاری املاک...</p>
          </div>
        ) : !properties || featuredProperties.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">هنوز ملکی ثبت نشده است</h3>
            <p className="text-muted-foreground">
              به زودی املاک جدید اضافه خواهند شد
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

