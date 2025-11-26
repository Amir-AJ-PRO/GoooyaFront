'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Home, Calendar, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FavoriteItem } from '@/types/favorites';
import { useRemoveFromFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface FavoritePropertyCardProps {
  favorite: FavoriteItem;
  className?: string;
}

/**
 * کامپوننت کارت ملک در لیست علاقه‌مندی‌ها
 */
export const FavoritePropertyCard: React.FC<FavoritePropertyCardProps> = ({
  favorite,
  className,
}) => {
  const removeFromFavoritesMutation = useRemoveFromFavorites();

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    removeFromFavoritesMutation.mutate(favorite.id);
  };

  const formatPrice = (price?: number | null) => {
    if (!price) return 'قیمت توافقی';
    
    if (price >= 1000000000) {
      return `${(price / 1000000000).toFixed(1)} میلیارد تومان`;
    } else if (price >= 1000000) {
      return `${(price / 1000000).toFixed(0)} میلیون تومان`;
    } else {
      return `${price.toLocaleString()} تومان`;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  // لینک ملک - ترجیح با slug، fallback به property_id
  const propertyLink = `/properties/${favorite.property_slug || favorite.property_id}`;

  return (
    <Card className={cn('group hover:shadow-lg transition-all duration-300', className)}>
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row">
          {/* تصویر ملک */}
          <div className="relative w-full sm:w-48 h-48 sm:h-auto">
            <Link href={propertyLink}>
              {favorite.main_image ? (
                <Image
                  src={favorite.main_image}
                  alt={favorite.property_title}
                  fill
                  className="object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-t-lg sm:rounded-l-lg sm:rounded-t-none">
                  <Home className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </Link>
            
            {/* دکمه حذف */}
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 left-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              onClick={handleRemove}
              disabled={removeFromFavoritesMutation.isPending}
              title="حذف از علاقه‌مندی‌ها"
            >
              <Trash2 size={16} />
            </Button>
          </div>

          {/* اطلاعات ملک */}
          <div className="flex-1 p-4">
            <div className="flex flex-col h-full">
              {/* عنوان و قیمت */}
              <div className="flex-1">
                <Link href={propertyLink}>
                  <h3 className="font-semibold text-lg text-[--text-dark] mb-2 line-clamp-2 hover:text-[--primary] transition-colors">
                    {favorite.property_title}
                  </h3>
                </Link>

                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary" className="bg-[--primary]/10 text-[--primary]">
                    {favorite.property_type}
                  </Badge>
                  <span className="text-lg font-bold text-[--accent-gold]">
                    {formatPrice(favorite.property_price)}
                  </span>
                </div>

                {/* آدرس */}
                {favorite.property_address && (
                  <div className="flex items-center gap-2 text-[--text-gray] mb-3">
                    <MapPin size={16} />
                    <span className="text-sm">{favorite.property_address}</span>
                  </div>
                )}
              </div>

              {/* تاریخ اضافه شدن */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-[--text-gray]">
                  <Calendar size={14} />
                  <span>اضافه شده در {formatDate(favorite.created_at)}</span>
                </div>
                
                <Link href={propertyLink}>
                  <Button variant="outline" size="sm" className="text-xs">
                    مشاهده جزئیات
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * کامپوننت نمایش خالی برای وقتی علاقه‌مندی وجود ندارد
 */
export const EmptyFavorites: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
        <Heart className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-[--text-dark] mb-2">
        هنوز ملکی به علاقه‌مندی‌هایتان اضافه نکرده‌اید
      </h3>
      <p className="text-[--text-gray] mb-6">
        با کلیک روی آیکون قلب در کنار هر ملک، آن را به علاقه‌مندی‌هایتان اضافه کنید
      </p>
      <Link href="/properties">
        <Button className="bg-[--primary] hover:bg-[--primary-hover]">
          مشاهده املاک
        </Button>
      </Link>
    </div>
  );
};

// Import Heart icon
import { Heart } from 'lucide-react';
