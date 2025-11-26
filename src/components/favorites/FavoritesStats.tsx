'use client';

import React from 'react';
import { Heart, Home, MapPin, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useFavoritesStats } from '@/hooks/useFavorites';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * کامپوننت نمایش آمار علاقه‌مندی‌ها
 */
export const FavoritesStats: React.FC = () => {
  const { data: stats, isLoading, error } = useFavoritesStats();

  if (isLoading) {
    return <FavoritesStatsSkeleton />;
  }

  if (error || !stats) {
    return null;
  }

  const topPropertyType = Object.entries(stats.favorites_by_type)
    .sort(([, a], [, b]) => b - a)[0];
  
  const topCity = Object.entries(stats.favorites_by_city)
    .sort(([, a], [, b]) => b - a)[0];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* تعداد کل علاقه‌مندی‌ها */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[--text-gray]">
            کل علاقه‌مندی‌ها
          </CardTitle>
          <Heart className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[--text-dark]">
            {stats.total_favorites}
          </div>
          <p className="text-xs text-[--text-gray]">
            ملک در لیست علاقه‌مندی‌های شما
          </p>
        </CardContent>
      </Card>

      {/* محبوب‌ترین نوع ملک */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[--text-gray]">
            نوع ملک محبوب
          </CardTitle>
          <Home className="h-4 w-4 text-[--primary]" />
        </CardHeader>
        <CardContent>
          {topPropertyType ? (
            <>
              <div className="text-lg font-bold text-[--text-dark] mb-1">
                {topPropertyType[0]}
              </div>
              <Badge variant="secondary" className="bg-[--primary]/10 text-[--primary]">
                {topPropertyType[1]} ملک
              </Badge>
            </>
          ) : (
            <div className="text-sm text-[--text-gray]">
              داده‌ای موجود نیست
            </div>
          )}
        </CardContent>
      </Card>

      {/* محبوب‌ترین شهر */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[--text-gray]">
            شهر محبوب
          </CardTitle>
          <MapPin className="h-4 w-4 text-[--accent-gold]" />
        </CardHeader>
        <CardContent>
          {topCity ? (
            <>
              <div className="text-lg font-bold text-[--text-dark] mb-1">
                {topCity[0]}
              </div>
              <Badge variant="secondary" className="bg-[--accent-gold]/10 text-[--accent-gold]">
                {topCity[1]} ملک
              </Badge>
            </>
          ) : (
            <div className="text-sm text-[--text-gray]">
              داده‌ای موجود نیست
            </div>
          )}
        </CardContent>
      </Card>

      {/* تنوع علاقه‌مندی‌ها */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-[--text-gray]">
            تنوع علاقه‌مندی
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-[--text-dark] mb-1">
            {Object.keys(stats.favorites_by_type).length}
          </div>
          <p className="text-xs text-[--text-gray]">
            نوع ملک مختلف
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * کامپوننت Skeleton برای حالت لودینگ آمار
 */
export const FavoritesStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

/**
 * کامپوننت نمایش تفصیلی آمار بر اساس نوع ملک
 */
export const FavoritesByType: React.FC = () => {
  const { data: stats, isLoading } = useFavoritesStats();

  if (isLoading || !stats) {
    return <Skeleton className="h-32 w-full" />;
  }

  const sortedTypes = Object.entries(stats.favorites_by_type)
    .sort(([, a], [, b]) => b - a);

  if (sortedTypes.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[--text-dark]">
          توزیع بر اساس نوع ملک
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedTypes.map(([type, count]) => (
            <div key={type} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Home className="h-4 w-4 text-[--primary]" />
                <span className="text-sm font-medium text-[--text-dark]">{type}</span>
              </div>
              <Badge variant="secondary" className="bg-[--primary]/10 text-[--primary]">
                {count} ملک
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * کامپوننت نمایش تفصیلی آمار بر اساس شهر
 */
export const FavoritesByCity: React.FC = () => {
  const { data: stats, isLoading } = useFavoritesStats();

  if (isLoading || !stats) {
    return <Skeleton className="h-32 w-full" />;
  }

  const sortedCities = Object.entries(stats.favorites_by_city)
    .sort(([, a], [, b]) => b - a);

  if (sortedCities.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-[--text-dark]">
          توزیع بر اساس شهر
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedCities.map(([city, count]) => (
            <div key={city} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-[--accent-gold]" />
                <span className="text-sm font-medium text-[--text-dark]">{city}</span>
              </div>
              <Badge variant="secondary" className="bg-[--accent-gold]/10 text-[--accent-gold]">
                {count} ملک
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
