'use client';

/**
 * کامپوننت نمایش نتایج جستجو
 */

import React from 'react';
import { AlertTriangle, Search, SortAsc, SortDesc, Grid, List } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination';

import { SearchResult, SearchParams, PropertySearchItem } from '@/types/search';
import { searchParamsToString } from '@/hooks/useSearch';

interface SearchResultsProps {
  data?: SearchResult;
  isLoading?: boolean;
  error?: Error | null;
  searchParams: SearchParams;
  onParamsChange: (params: SearchParams) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  data,
  isLoading = false,
  error = null,
  searchParams,
  onParamsChange,
  viewMode = 'grid',
  onViewModeChange
}) => {
  // مدیریت تغییر مرتب‌سازی
  const handleSortChange = (sortBy: string) => {
    onParamsChange({
      ...searchParams,
      sort_by: sortBy as SearchParams['sort_by'],
      page: 1 // بازگشت به صفحه اول
    });
  };

  // مدیریت تغییر صفحه
  const handlePageChange = (page: number) => {
    onParamsChange({
      ...searchParams,
      page
    });
  };

  // مدیریت تغییر تعداد نتایج در صفحه
  const handlePageSizeChange = (pageSize: string) => {
    onParamsChange({
      ...searchParams,
      page_size: parseInt(pageSize),
      page: 1 // بازگشت به صفحه اول
    });
  };

  // نمایش خطا
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          خطا در دریافت نتایج جستجو: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* هدر نتایج */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">نتایج جستجو</h2>
          <p className="text-gray-600 mt-1">
            {searchParamsToString(searchParams)}
          </p>
          {data && (
            <p className="text-sm text-gray-500 mt-1">
              {data.count.toLocaleString()} نتیجه یافت شد
            </p>
          )}
        </div>

        {/* کنترل‌های نمایش */}
        <div className="flex items-center gap-2">
          {onViewModeChange && (
            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* مرتب‌سازی */}
          <Select value={searchParams.sort_by || '-created_at'} onValueChange={handleSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-created_at">جدیدترین</SelectItem>
              <SelectItem value="created_at">قدیمی‌ترین</SelectItem>
              <SelectItem value="-price">گران‌ترین</SelectItem>
              <SelectItem value="price">ارزان‌ترین</SelectItem>
              <SelectItem value="-measure">بزرگ‌ترین</SelectItem>
              <SelectItem value="measure">کوچک‌ترین</SelectItem>
              {searchParams.q && (
                <SelectItem value="_score">مرتبط‌ترین</SelectItem>
              )}
            </SelectContent>
          </Select>

          {/* تعداد نتایج در صفحه */}
          <Select 
            value={(searchParams.page_size || 20).toString()} 
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* هشدار fallback */}
      {data?.warning && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {data.warning}
          </AlertDescription>
        </Alert>
      )}

      {/* نتایج */}
      {isLoading ? (
        <SearchResultsSkeleton viewMode={viewMode} />
      ) : data?.results.length === 0 ? (
        <EmptyResults searchParams={searchParams} />
      ) : (
        <>
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {data?.results.map((property) => (
              <PropertySearchCard 
                key={property.id} 
                property={property} 
                viewMode={viewMode}
              />
            ))}
          </div>

          {/* Pagination */}
          {data && data.total_pages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={data.page}
                totalPages={data.total_pages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

/**
 * کامپوننت کارت ملک در نتایج جستجو
 */
const PropertySearchCard: React.FC<{
  property: PropertySearchItem;
  viewMode: 'grid' | 'list';
}> = ({ property, viewMode }) => {
  const mainImage = property.images.find(img => img.is_main) || property.images[0];

  if (viewMode === 'list') {
    return (
      <div className="flex bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        {/* تصویر */}
        <div className="w-48 h-32 flex-shrink-0">
          {mainImage ? (
            <img
              src={mainImage.image}
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* محتوا */}
        <div className="flex-1 p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {property.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-2">
                {property.address}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                <span>{property.measure} متر</span>
                <span>{property.rooms} خواب</span>
                <span>{property.city}</span>
                {property.location && <span>{property.location}</span>}
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {property.property_type}
                </Badge>
                <Badge variant={property.transaction_type === 'sale' ? 'default' : 'outline'}>
                  {property.transaction_type === 'sale' ? 'فروش' : 'اجاره'}
                </Badge>
              </div>
            </div>

            <div className="text-left">
          <p className="text-xl font-bold text-primary">
            {property.price ? property.price.toLocaleString() : 'توافقی'} تومان
          </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid mode - کارت ساده
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* تصویر */}
      <div className="w-full h-48 relative">
        {mainImage ? (
          <img
            src={mainImage.image}
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Search className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      {/* محتوا */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-2 line-clamp-1">
          {property.address}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>{property.measure} متر</span>
          <span>{property.rooms} خواب</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {property.property_type}
            </Badge>
            <Badge variant={property.transaction_type === 'sale' ? 'default' : 'outline'} className="text-xs">
              {property.transaction_type === 'sale' ? 'فروش' : 'اجاره'}
            </Badge>
          </div>
          
          <p className="text-lg font-bold text-primary">
            {property.price ? property.price.toLocaleString() : 'توافقی'} تومان
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * نمایش حالت خالی
 */
const EmptyResults: React.FC<{ searchParams: SearchParams }> = ({ searchParams }) => {
  const hasFilters = Object.keys(searchParams).length > 0;

  return (
    <div className="text-center py-12">
      <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {hasFilters ? 'نتیجه‌ای یافت نشد' : 'جستجو کنید'}
      </h3>
      <p className="text-gray-600 mb-6">
        {hasFilters 
          ? 'با تغییر فیلترهای جستجو مجدداً تلاش کنید'
          : 'برای یافتن املاک مورد نظر، جستجو کنید یا فیلترها را تنظیم کنید'
        }
      </p>
    </div>
  );
};

/**
 * Skeleton برای حالت loading
 */
const SearchResultsSkeleton: React.FC<{ viewMode: 'grid' | 'list' }> = ({ viewMode }) => {
  const skeletonCount = 8;

  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={index} className="flex bg-white rounded-lg shadow-md overflow-hidden">
            <Skeleton className="w-48 h-32 flex-shrink-0" />
            <div className="flex-1 p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: skeletonCount }).map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
          <Skeleton className="w-full h-48" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
