'use client';

import React, { useState } from 'react';
import { Search, Filter, SortAsc, SortDesc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useFavorites } from '@/hooks/useFavorites';
import { FavoritePropertyCard, EmptyFavorites } from './FavoritePropertyCard';
import { FavoritesStats } from './FavoritesStats';
import Pagination from '@/components/common/Pagination';
import { FavoritesSearchParams } from '@/types/favorites';

/**
 * صفحه اصلی لیست علاقه‌مندی‌ها
 */
export const FavoritesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useState<FavoritesSearchParams>({
    page: 1,
    page_size: 12,
  });
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading, error } = useFavorites(searchParams);

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  const handleFilterChange = (key: keyof FavoritesSearchParams, value: string | number | undefined) => {
    setSearchParams(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handleSearch = () => {
    // در اینجا می‌توانید منطق جستجو را پیاده‌سازی کنید
    // فعلاً فقط فیلتر کردن بر اساس نام شهر یا نوع ملک را پشتیبانی می‌کنیم
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">خطا در بارگذاری علاقه‌مندی‌ها</p>
            <p className="text-sm text-red-500 mt-2">{error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[--text-dark] mb-2">
          علاقه‌مندی‌های من
        </h1>
        <p className="text-[--text-gray]">
          املاک مورد علاقه‌تان را مدیریت کنید
        </p>
      </div>

      {/* آمار */}
      <FavoritesStats />

      {/* فیلترها و جستجو */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* جستجو */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="جستجو در علاقه‌مندی‌ها..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
            </div>

            {/* فیلتر نوع ملک */}
            <Select
              value={searchParams.property_type || 'all'}
              onValueChange={(value) => handleFilterChange('property_type', value === 'all' ? undefined : value)}
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="نوع ملک" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه انواع</SelectItem>
                <SelectItem value="آپارتمان">آپارتمان</SelectItem>
                <SelectItem value="ویلا">ویلا</SelectItem>
                <SelectItem value="زمین">زمین</SelectItem>
                <SelectItem value="مغازه">مغازه</SelectItem>
              </SelectContent>
            </Select>

            {/* فیلتر شهر */}
            <Select
              value={searchParams.city || 'all'}
              onValueChange={(value) => handleFilterChange('city', value === 'all' ? undefined : value)}
            >
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="شهر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه شهرها</SelectItem>
                <SelectItem value="تهران">تهران</SelectItem>
                <SelectItem value="اصفهان">اصفهان</SelectItem>
                <SelectItem value="شیراز">شیراز</SelectItem>
                <SelectItem value="مشهد">مشهد</SelectItem>
              </SelectContent>
            </Select>

            {/* دکمه جستجو */}
            <Button onClick={handleSearch} className="bg-[--primary] hover:bg-[--primary-hover]">
              <Search size={16} className="ml-2" />
              جستجو
            </Button>
          </div>

          {/* فیلترهای قیمت */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="flex-1">
              <Input
                type="number"
                placeholder="حداقل قیمت (تومان)"
                value={searchParams.min_price || ''}
                onChange={(e) => handleFilterChange('min_price', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <div className="flex-1">
              <Input
                type="number"
                placeholder="حداکثر قیمت (تومان)"
                value={searchParams.max_price || ''}
                onChange={(e) => handleFilterChange('max_price', e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchParams(prev => ({
                  ...prev,
                  min_price: undefined,
                  max_price: undefined,
                  property_type: undefined,
                  city: undefined,
                  page: 1,
                }));
                setSearchTerm('');
              }}
            >
              پاک کردن فیلترها
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* نتایج */}
      {isLoading ? (
        <FavoritesListSkeleton />
      ) : !data?.results.length ? (
        <EmptyFavorites />
      ) : (
        <>
          {/* تعداد نتایج */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-[--text-gray]">
              {data.count} ملک در علاقه‌مندی‌های شما
            </p>
            <Select
              value={searchParams.page_size?.toString() || '12'}
              onValueChange={(value) => handleFilterChange('page_size', Number(value))}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 تا</SelectItem>
                <SelectItem value="12">12 تا</SelectItem>
                <SelectItem value="24">24 تا</SelectItem>
                <SelectItem value="48">48 تا</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* لیست علاقه‌مندی‌ها */}
          <div className="space-y-4 mb-8">
            {data.results.map((favorite) => (
              <FavoritePropertyCard key={favorite.id} favorite={favorite} />
            ))}
          </div>

          {/* Pagination */}
          {data.count > (searchParams.page_size || 12) && (
            <Pagination
              currentPage={searchParams.page || 1}
              totalPages={Math.ceil(data.count / (searchParams.page_size || 12))}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

/**
 * کامپوننت Skeleton برای حالت لودینگ لیست
 */
export const FavoritesListSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row">
              <Skeleton className="w-full sm:w-48 h-48" />
              <div className="flex-1 p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
