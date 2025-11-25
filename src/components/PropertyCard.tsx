'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PropertyListItem } from '@/types/property';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  MapPin, 
  Bed, 
  Ruler,
  TrendingUp,
  User
} from 'lucide-react';
import { amountToWords } from '@/lib/numberToWords';

interface PropertyCardProps {
  property: PropertyListItem;
}

/**
 * کامپوننت کارت نمایش ملک
 */
export default function PropertyCard({ property }: PropertyCardProps) {
  // دیباگ: بررسی داده‌های ملک
  console.log('🏘️ PropertyCard - داده‌های ملک:', {
    id: property.id,
    title: property.title,
    measure: property.measure,
    rooms: property.rooms,
    price: property.price,
    images: property.images?.length || 0,
    city: property.city,
    location: property.location
  });
  
  // پیدا کردن تصویر اصلی
  const mainImage = property.images?.find(img => img.is_main) || property.images?.[0];
  const imageUrl = mainImage?.image 
    ? (mainImage.image.startsWith('http') ? mainImage.image : `${process.env.NEXT_PUBLIC_API_URL || ''}${mainImage.image}`)
    : '/placeholder-property.jpg';

  return (
    <Link href={`/properties/${property.slug}`}>
      <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 h-full border-2 hover:border-primary">
        {/* تصویر */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Badge نوع معامله */}
          <div className="absolute top-3 right-3">
            <Badge 
              className={`${
                property.transaction_type === 'sale' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-semibold px-3 py-1`}
            >
              {property.transaction_type === 'sale' ? '💰 فروش' : '🏠 اجاره'}
            </Badge>
          </div>
        </div>

        <CardContent className="p-5 space-y-3">
          {/* عنوان */}
          <h3 className="font-bold text-lg text-gray-800 line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem]">
            {property.title}
          </h3>

          {/* موقعیت */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="line-clamp-1">
              {typeof property.city === 'string' 
                ? (property.location && typeof property.location === 'string' 
                  ? `${property.city}، ${property.location}` 
                  : property.city)
                : (typeof property.city === 'object' && property.city?.name
                  ? (property.location && typeof property.location === 'object' && property.location?.name
                    ? `${property.city.name}، ${property.location.name}`
                    : property.city.name)
                  : property.address || 'موقعیت نامشخص')
              }
            </span>
          </div>

          {/* مشخصات */}
          <div className="flex items-center gap-4 text-sm text-gray-600 pt-2 border-t">
            {/* متراژ */}
            {property.measure && (
              <div className="flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-gray-500" />
                <span>{property.measure} متر</span>
              </div>
            )}
            
            {/* تعداد اتاق */}
            {property.rooms > 0 && (
              <div className="flex items-center gap-1.5">
                <Bed className="w-4 h-4 text-gray-500" />
                <span>{property.rooms} خواب</span>
              </div>
            )}
          </div>

          {/* قیمت */}
          <div className="pt-3 border-t">
            {property.price ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">
                    {property.price.toLocaleString('en-US')}
                  </span>
                  <span className="text-sm text-gray-500">تومان</span>
                </div>
                <p className="text-xs text-gray-500">
                  {amountToWords(property.price)}
                </p>
              </div>
            ) : property.mortgage || property.rent ? (
              <div className="space-y-1">
                {property.mortgage && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">رهن:</span>
                    <span className="font-semibold text-blue-600">
                      {property.mortgage.toLocaleString('en-US')} تومان
                    </span>
                  </div>
                )}
                {property.rent && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">اجاره:</span>
                    <span className="font-semibold text-purple-600">
                      {property.rent.toLocaleString('en-US')} تومان
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-600" />
                <span className="text-lg font-bold text-amber-600">قیمت توافقی</span>
              </div>
            )}
          </div>
        </CardContent>

        {/* مشاور */}
        {property.agent && typeof property.agent === 'string' && (
          <CardFooter className="px-5 py-3 bg-gray-50 border-t flex items-center gap-2">
            {property.agent_image && (
              <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-primary">
                <Image
                  src={property.agent_image.startsWith('http') ? property.agent_image : `${process.env.NEXT_PUBLIC_API_URL || ''}${property.agent_image}`}
                  alt={property.agent}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="flex items-center gap-2 flex-1">
              <User className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700 font-medium">{property.agent}</span>
            </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}

