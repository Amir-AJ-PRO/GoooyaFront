'use client';

import { useState } from 'react';
import { useProperty } from '@/hooks/usePropertyMutations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';
import { 
  MapPin, 
  Bed, 
  Square, 
  Calendar,
  Building2,
  Phone,
  Heart,
  Share2,
  ArrowRight,
  Loader2,
  Home,
  Car,
  Warehouse,
  ArrowUpDown,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/constants';
import Link from 'next/link';

interface PropertyDetailClientProps {
  slug: string;
}

// فرمت قیمت
const formatPrice = (price?: number): string => {
  if (!price) return 'توافقی';
  
  if (price >= 1000000000) {
    return `${(price / 1000000000).toFixed(2)} میلیارد تومان`;
  } else if (price >= 1000000) {
    return `${(price / 1000000).toFixed(0)} میلیون تومان`;
  }
  return `${price.toLocaleString('fa-IR')} تومان`;
};

export default function PropertyDetailClient({ slug }: PropertyDetailClientProps) {
  const { data: property, isLoading, error } = useProperty(slug);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }
  
  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <Home className="h-16 w-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">ملک یافت نشد</h1>
          <p className="text-muted-foreground mb-6">
            {error?.message || 'ملک مورد نظر یافت نشد یا در حال حاضر قابل نمایش نیست'}
          </p>
          <Link href="/properties">
            <Button variant="outline">
              <ArrowRight className="h-4 w-4 mr-2" />
              بازگشت به لیست املاک
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const mainImage = property.images?.[selectedImageIndex];
  const imageUrl = mainImage ? `${API_BASE_URL}${mainImage.image}` : '/assets/property-placeholder.jpg';
  
  // محاسبه نوع شهر و منطقه با optional chaining
  const cityName = typeof property.city === 'object' && property.city?.name 
    ? property.city.name 
    : '';
  const locationName = property.location && typeof property.location === 'object' && property.location?.name
    ? property.location.name 
    : '';
  const propertyTypeName = typeof property.property_type === 'object' && property.property_type?.title
    ? property.property_type.title 
    : '';
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/properties">
        <Button variant="ghost" className="mb-6">
          <ArrowRight className="h-4 w-4 mr-2" />
          بازگشت به لیست املاک
        </Button>
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ستون اصلی - تصاویر و جزئیات */}
        <div className="lg:col-span-2 space-y-6">
          {/* تصویر اصلی */}
          <Card className="overflow-hidden">
            <div className="relative h-96 md:h-[500px]">
              <Image
                src={imageUrl}
                alt={property.title}
                fill
                className="object-cover"
                priority
              />
              
              {/* بج‌ها */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <div className="flex gap-2">
                  <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold">
                    {property.transaction_type === 'sale' ? 'فروش' : 'اجاره'}
                  </div>
                  <div className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                    {propertyTypeName}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button size="icon" variant="secondary" className="rounded-full">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button size="icon" variant="secondary" className="rounded-full">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* گالری تصاویر */}
            {property.images && property.images.length > 1 && (
              <div className="p-4">
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {property.images.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        index === selectedImageIndex 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <Image
                        src={`${API_BASE_URL}${img.image}`}
                        alt={`تصویر ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>
          
          {/* عنوان و موقعیت */}
          <Card>
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
              
              <div className="flex items-center gap-2 text-muted-foreground mb-6">
                <MapPin className="h-5 w-5" />
                <span>
                  {cityName}
                  {locationName && ` - ${locationName}`}
                </span>
              </div>
              
              {property.address && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">{property.address}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* مشخصات کلی */}
          <Card>
            <CardHeader>
              <CardTitle>مشخصات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Square className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">متراژ</p>
                    <p className="font-bold">{property.measure} متر</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Bed className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">تعداد خواب</p>
                    <p className="font-bold">{property.rooms}</p>
                  </div>
                </div>
                
                {property.year_built && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">سال ساخت</p>
                      <p className="font-bold">{property.year_built}</p>
                    </div>
                  </div>
                )}
                
                {property.floor && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">طبقه</p>
                      <p className="font-bold">{property.floor}</p>
                    </div>
                  </div>
                )}
                
                {property.document_type && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">نوع سند</p>
                      <p className="font-bold">{property.document_type}</p>
                    </div>
                  </div>
                )}
                
                {property.price_per_meter && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Square className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">قیمت هر متر</p>
                      <p className="font-bold text-xs">
                        {formatPrice(property.price_per_meter)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* امکانات */}
          <Card>
            <CardHeader>
              <CardTitle>امکانات و ویژگی‌ها</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className={`flex items-center gap-2 ${property.has_parking ? 'text-green-600' : 'text-muted-foreground'}`}>
                  <Car className="h-5 w-5" />
                  <span>پارکینگ</span>
                  {property.has_parking && <CheckCircle2 className="h-4 w-4 mr-auto" />}
                </div>
                
                <div className={`flex items-center gap-2 ${property.has_storage ? 'text-green-600' : 'text-muted-foreground'}`}>
                  <Warehouse className="h-5 w-5" />
                  <span>انباری</span>
                  {property.has_storage && <CheckCircle2 className="h-4 w-4 mr-auto" />}
                </div>
                
                <div className={`flex items-center gap-2 ${property.has_elevator ? 'text-green-600' : 'text-muted-foreground'}`}>
                  <ArrowUpDown className="h-5 w-5" />
                  <span>آسانسور</span>
                  {property.has_elevator && <CheckCircle2 className="h-4 w-4 mr-auto" />}
                </div>
                
                {property.has_balcony && (
                  <div className="flex items-center gap-2 text-green-600">
                    <Home className="h-5 w-5" />
                    <span>بالکن</span>
                    <CheckCircle2 className="h-4 w-4 mr-auto" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* توضیحات */}
          {property.description && (
            <Card>
              <CardHeader>
                <CardTitle>توضیحات</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: property.description }}
                />
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* ستون سمت چپ - قیمت و تماس */}
        <div className="space-y-6">
          {/* قیمت */}
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>قیمت</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {property.transaction_type === 'sale' ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">قیمت کل</p>
                  <p className="text-3xl font-bold text-primary">
                    {formatPrice(property.price)}
                  </p>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">رهن</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(property.mortgage)}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">اجاره (ماهانه)</p>
                    <p className="text-2xl font-bold text-primary">
                      {formatPrice(property.rent)}
                    </p>
                  </div>
                </>
              )}
              
              <Separator />
              
              <Button className="w-full gap-2" size="lg">
                <Phone className="h-5 w-5" />
                تماس با مشاور
              </Button>
              
              <Button variant="outline" className="w-full">
                درخواست بازدید
              </Button>
            </CardContent>
          </Card>
          
          {/* اطلاعات اضافی */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">اطلاعات تکمیلی</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">شناسه ملک:</span>
                <span className="font-mono">#{property.id}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">تاریخ ثبت:</span>
                <span>
                  {new Date(property.created_at).toLocaleDateString('fa-IR')}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">آخرین به‌روزرسانی:</span>
                <span>
                  {new Date(property.updated_at).toLocaleDateString('fa-IR')}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

