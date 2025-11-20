'use client';

import { use, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Bed, Bath, Square, Phone, Mail, Calendar } from "lucide-react";
import Image from "next/image";

const images = [
  "/assets/property-1.jpg",
  "/assets/property-2.jpg",
  "/assets/property-3.jpg",
  "/assets/property-1.jpg"
];

function Gallery() {
  const [active, setActive] = useState(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="h-96 lg:h-[600px] rounded-2xl overflow-hidden relative">
        <Image 
          src={images[active]} 
          alt={`تصویر ملک ${active + 1}`} 
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {images.map((src, idx) => {
          const isActive = idx === active;
          return (
            <button
              key={String(idx)}
              onClick={() => setActive(idx)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setActive(idx);
              }}
              className={`h-44 lg:h-[290px] rounded-2xl overflow-hidden focus:outline-none relative ${isActive ? "ring-2 ring-primary" : ""}`}
              aria-pressed={isActive}
            >
              <Image 
                src={src} 
                alt={`تصویر کوچک ${idx + 1}`} 
                fill
                className="object-cover transition-transform duration-200"
              />
              {!isActive && (
                <div className="absolute inset-0 bg-black/40 transition-opacity" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface PropertyDetailClientProps {
  params: Promise<{ id: string }>;
}

export default function PropertyDetailClient({ params }: PropertyDetailClientProps) {
  const resolvedParams = use(params);

  return (
    <>
      {/* Image Gallery */}
      <section className="container mx-auto px-4 py-8">
        <Gallery />
      </section>

      {/* Property Info */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">آپارتمان مدرن در تهران</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>تهران، فرشته، خیابان فرشته</span>
                  </div>
                </div>
                <div className="text-left">
                  <div className="text-3xl font-bold text-primary">۸ میلیارد تومان</div>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <span>۳ خواب</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <span>۲ حمام</span>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="h-5 w-5 text-muted-foreground" />
                  <span>۱۲۰ متر</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>۱۴۰۲</span>
                </div>
              </div>
            </div>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">توضیحات</h2>
              <p className="text-muted-foreground leading-relaxed">
                آپارتمان نوساز و مدرن با امکانات کامل در یکی از بهترین مناطق تهران. این واحد دارای نورگیری عالی، چشم‌انداز زیبا، و دسترسی آسان به مراکز خرید و تفریحی می‌باشد. ساختمان دارای لابی مجلل، پارکینگ اختصاصی، انباری، و آسانسور می‌باشد.
              </p>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">امکانات</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  "پارکینگ",
                  "انباری",
                  "آسانسور",
                  "بالکن",
                  "لابی",
                  "سرایداری",
                  "نگهبانی",
                  "سیستم گرمایش",
                  "سیستم سرمایش"
                ].map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">موقعیت مکانی</h2>
              <div className="w-full h-64 md:h-96 bg-muted rounded-md overflow-hidden">
                <iframe
                  title="موقعیت ملک روی نقشه"
                  src={`https://www.google.com/maps?q=${encodeURIComponent("تهران، فرشته، خیابان فرشته")}&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
              <div className="mt-3">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("تهران، فرشته، خیابان فرشته")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-primary underline"
                >
                  باز کردن در Google Maps
                </a>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="font-bold text-lg mb-4">تماس با مشاور</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">نام مشاور</div>
                  <div className="font-semibold">علی محمدی</div>
                </div>
                
                <Button className="w-full gap-2">
                  <Phone className="h-4 w-4" />
                  تماس تلفنی
                </Button>
                
                <Button variant="outline" className="w-full gap-2">
                  <Mail className="h-4 w-4" />
                  ارسال پیام
                </Button>
                
                <Button variant="outline" className="w-full gap-2">
                  <Calendar className="h-4 w-4" />
                  درخواست بازدید
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}

