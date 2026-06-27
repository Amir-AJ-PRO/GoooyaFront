'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSearchProperties } from '@/hooks/useSearch';
import { useCities, usePropertyTypes, useProperties } from '@/hooks/usePropertyMutations';
import { useLocations } from '@/hooks/useLocations';
import PropertyCard from '@/components/cards/PropertyCard';
import Pagination from '@/components/common/Pagination';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search, Building2, SlidersHorizontal, X, Sparkles } from 'lucide-react';
import { PropertyListItem } from '@/types/property';
import { SearchParams, SearchResult } from '@/types/search';
import { PaginatedPropertiesResponse } from '@/services/propertyApi';
import { cn } from '@/lib/utils';

// Type guard function برای بررسی اینکه data از نوع SearchResult است
function isSearchResult(data: SearchResult | PaginatedPropertiesResponse | undefined): data is SearchResult {
  return data !== undefined && 'warning' in data;
}

export default function PropertiesPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // پارامترهای جستجوی پیشرفته از URL
  const [advancedSearchParams, setAdvancedSearchParams] = useState<SearchParams>({});

  // فیلترهای محلی (برای نمایش)
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [transactionFilter, setTransactionFilter] = useState<string>('sale');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // دریافت شهرها
  const { data: cities = [], isLoading: citiesLoading } = useCities();

  const selectedCityId = cityFilter !== 'all' ? Number(cityFilter) : undefined;
  const { data: locations = [], isLoading: locationsLoading } = useLocations(selectedCityId, {
    enabled: cityFilter !== 'all',
  });

  // دریافت انواع ملک از دیتابیس
  const { data: propertyTypes = [], isLoading: propertyTypesLoading } = usePropertyTypes();

  // استخراج پارامترهای جستجو از URL
  useEffect(() => {
    const params: SearchParams = {};
    let hasAdvancedParams = false;

    const q = searchParams.get('q');
    if (q) {
      params.q = q;
      setSearchTerm(q);
      hasAdvancedParams = true;
    }

    const city = searchParams.get('city');
    if (city) {
      params.city = parseInt(city);
      setCityFilter(city);
      hasAdvancedParams = true;
    }

    const location = searchParams.get('location');
    if (location) {
      params.location = parseInt(location);
      setLocationFilter(location);
      hasAdvancedParams = true;
    }

    const propertyType = searchParams.get('property_type');
    if (propertyType) {
      params.property_type = parseInt(propertyType);
      setPropertyTypeFilter(propertyType);
      hasAdvancedParams = true;
    }

    const transactionType = searchParams.get('transaction_type');
    if (transactionType === 'rent') {
      params.transaction_type = 'rent';
      setTransactionFilter('rent');
      hasAdvancedParams = true;
    } else {
      setTransactionFilter('sale');
    }

    const minPrice = searchParams.get('min_price');
    if (minPrice) {
      params.min_price = parseInt(minPrice);
      hasAdvancedParams = true;
    }

    const maxPrice = searchParams.get('max_price');
    if (maxPrice) {
      params.max_price = parseInt(maxPrice);
      hasAdvancedParams = true;
    }

    // سایر پارامترهای پیشرفته
    const minMeasure = searchParams.get('min_measure');
    if (minMeasure) {
      params.min_measure = parseFloat(minMeasure);
      hasAdvancedParams = true;
    }

    const maxMeasure = searchParams.get('max_measure');
    if (maxMeasure) {
      params.max_measure = parseFloat(maxMeasure);
      hasAdvancedParams = true;
    }

    const rooms = searchParams.get('rooms');
    if (rooms) {
      params.rooms = parseInt(rooms);
      hasAdvancedParams = true;
    }

    // Boolean parameters
    const booleanParams = [
      'has_parking', 'has_storage', 'has_elevator', 'has_balcony',
      'has_pool', 'has_security', 'urgent', 'under_price', 'exchange'
    ];

    const anyParams = params as any;
    booleanParams.forEach(param => {
      const value = searchParams.get(param);
      if (value === 'true') {
        anyParams[param] = true;
        hasAdvancedParams = true;
      }
    });

    // Pagination
    const pageParam = searchParams.get('page');
    if (pageParam) {
      params.page = parseInt(pageParam);
      setPage(parseInt(pageParam));
    }

    const pageSizeParam = searchParams.get('page_size');
    if (pageSizeParam) {
      params.page_size = parseInt(pageSizeParam);
      setPageSize(parseInt(pageSizeParam));
    }

    const sortByParam = searchParams.get('sort_by');
    if (sortByParam) {
      params.sort_by = sortByParam as SearchParams['sort_by'];
      // تبدیل sort_by به format محلی برای نمایش
      const reverseSortMap: Record<string, string> = {
        '-created_at': 'newest',
        'created_at': 'oldest',
        '-price': 'price-high',
        'price': 'price-low'
      };
      if (reverseSortMap[sortByParam]) {
        setSortBy(reverseSortMap[sortByParam]);
      }
    }

    setAdvancedSearchParams(params);
  }, [searchParams]);

  // بررسی اینکه آیا فیلتر یا جستجو اعمال شده است
  const hasSearchParams = Object.keys(advancedSearchParams).some(key => {
    const value = advancedSearchParams[key as keyof SearchParams];
    if (key === 'page' || key === 'page_size') {
      return false;
    }
    return value !== undefined && value !== null && value !== '';
  }) || transactionFilter === 'sale' || transactionFilter === 'rent';

  const searchParamsWithPagination: SearchParams = {
    ...advancedSearchParams,
    transaction_type: transactionFilter as 'sale' | 'rent',
  };

  // همیشه page و page_size را تنظیم می‌کنیم
  if (!searchParamsWithPagination.page) {
    searchParamsWithPagination.page = page || 1;
  }

  if (!searchParamsWithPagination.page_size) {
    searchParamsWithPagination.page_size = pageSize || 20;
  }

  // استفاده از Search API اگر فیلتر وجود دارد
  const { data: searchData, isLoading: searchLoading, isFetching: searchFetching, isPending: searchPending, error: searchError } = useSearchProperties(
    searchParamsWithPagination,
    {
      enabled: hasSearchParams // فقط اگر فیلتر وجود داشته باشد
    }
  );

  // استفاده از List API اگر فیلتر وجود ندارد
  const currentPage = page || 1;
  const currentPageSize = pageSize || 20;
  const { data: listData, isLoading: listLoading, isFetching: listFetching, isPending: listPending, error: listError } = useProperties(
    currentPage,
    currentPageSize,
    !hasSearchParams // فقط اگر فیلتر وجود نداشته باشد فعال باشد
  );

  // انتخاب داده‌ها بر اساس اینکه آیا فیلتر وجود دارد یا نه
  const error = hasSearchParams ? searchError : listError;
  const data = hasSearchParams ? searchData : listData;
  const isLoading = hasSearchParams
    ? (searchPending || searchLoading)
    : (listPending || listLoading);
  const isRefreshing =
    (hasSearchParams ? searchFetching : listFetching) && !isLoading && !!data;

  // Reset به صفحه اول هنگام تغییر فیلترها
  useEffect(() => {
    setPage(1);
  }, [searchTerm, cityFilter, locationFilter, transactionFilter, propertyTypeFilter]);

  // تابع اعمال فیلترهای محلی
  const applyLocalFilters = () => {
    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.set('q', searchTerm.trim());
    }

    if (cityFilter !== 'all') {
      params.set('city', cityFilter);
    }

    if (locationFilter !== 'all') {
      params.set('location', locationFilter);
    }

    params.set('transaction_type', transactionFilter);

    if (propertyTypeFilter !== 'all') {
      params.set('property_type', propertyTypeFilter);
    }

    // مرتب‌سازی (طبق داکیومنت: created_at, -created_at, price, -price, measure, -measure, _score)
    const sortMap: Record<string, string> = {
      'newest': '-created_at',
      'oldest': 'created_at',
      'price-high': '-price',
      'price-low': 'price'
    };
    if (sortMap[sortBy]) {
      params.set('sort_by', sortMap[sortBy]);
    }

    params.set('page', '1');
    params.set('page_size', pageSize.toString());

    const newUrl = params.toString() ? `/properties?${params.toString()}` : '/properties';
    router.push(newUrl);
  };

  // اطمینان از اینکه properties یک آرایه است
  // هر دو API (list و search) ساختار یکسانی دارند
  const propertiesArray: PropertyListItem[] = (data?.results || []) as PropertyListItem[];

  // نمایش warning در صورت وجود (fallback به database)
  useEffect(() => {
    if (isSearchResult(data) && data.warning) {
      console.warn('⚠️ Search API Warning:', data.warning);
    }
  }, [data]);

  // اطلاعات pagination
  const paginationInfo = data ? {
    currentPage: data.page,
    totalPages: data.total_pages,
    totalCount: data.count,
    pageSize: data.page_size,
    resultsCount: data.results.length
  } : null;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Building2 className="h-16 w-16 mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">خطا در بارگذاری املاک</h2>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  const activeFiltersCount = [
    searchTerm && 1,
    cityFilter !== 'all' && 1,
    locationFilter !== 'all' && 1,
    transactionFilter !== 'sale' && 1,
    propertyTypeFilter !== 'all' && 1,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearchTerm('');
    setCityFilter('all');
    setLocationFilter('all');
    setTransactionFilter('sale');
    setPropertyTypeFilter('all');
    setSortBy('newest');
    router.push('/properties');
  };

  const selectTriggerClass = 'h-11 bg-white border-gray-200';
  const transactionLabel = transactionFilter === 'rent' ? 'اجاره' : 'فروش';

  const fromHomeSearch = searchParams.get('from') === 'home';
  const showTransactionFilter = !fromHomeSearch;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-1">املاک موجود</h1>
            <p className="text-muted-foreground">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  در حال بارگذاری...
                </span>
              ) : paginationInfo ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-primary">{paginationInfo.totalCount}</span>
                  <span>ملک موجود</span>
                  {Object.keys(advancedSearchParams).length > 0 && (
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      جستجوی پیشرفته
                    </span>
                  )}
                  {paginationInfo.totalPages > 1 && (
                    <>
                      <span className="mx-2">•</span>
                      <span>صفحه {paginationInfo.currentPage} از {paginationInfo.totalPages}</span>
                    </>
                  )}
                </span>
              ) : (
                <span>در حال بارگذاری...</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* فیلترها */}
      <div className="rounded-xl border border-gray-100 bg-white shadow-sm mb-8 overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50/60">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-semibold text-lg">فیلتر املاک</h2>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full min-w-[1.25rem] text-center">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="hidden sm:inline-flex gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                پاک کردن
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              {showFilters ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className={`p-5 transition-all duration-300 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div
            className={cn(
              'grid grid-cols-1 sm:grid-cols-2 gap-3',
              showTransactionFilter ? 'xl:grid-cols-5' : 'xl:grid-cols-4'
            )}
          >
            <Select
              value={cityFilter}
              onValueChange={(value) => {
                setCityFilter(value);
                setLocationFilter('all');
              }}
            >
              <SelectTrigger className={selectTriggerClass}>
                <SelectValue placeholder="شهر" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه شهرها</SelectItem>
                {citiesLoading ? (
                  <SelectItem value="loading" disabled>در حال بارگذاری...</SelectItem>
                ) : (
                  cities.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Select
              value={locationFilter}
              onValueChange={setLocationFilter}
              disabled={cityFilter === 'all'}
            >
              <SelectTrigger className={selectTriggerClass}>
                <SelectValue placeholder={cityFilter === 'all' ? 'ابتدا شهر را انتخاب کنید' : 'منطقه'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه مناطق</SelectItem>
                {cityFilter === 'all' ? (
                  <SelectItem value="disabled" disabled>ابتدا شهر را انتخاب کنید</SelectItem>
                ) : locationsLoading ? (
                  <SelectItem value="loading" disabled>در حال بارگذاری...</SelectItem>
                ) : locations.length === 0 ? (
                  <SelectItem value="empty" disabled>منطقه‌ای یافت نشد</SelectItem>
                ) : (
                  locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id.toString()}>
                      {loc.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            {showTransactionFilter ? (
              <Select value={transactionFilter} onValueChange={setTransactionFilter}>
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="نوع معامله" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">فروش</SelectItem>
                  <SelectItem value="rent">اجاره</SelectItem>
                </SelectContent>
              </Select>
            ) : null}

            <Select value={propertyTypeFilter} onValueChange={setPropertyTypeFilter}>
              <SelectTrigger className={selectTriggerClass}>
                <SelectValue placeholder="نوع ملک" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">انواع ملک </SelectItem>
                {propertyTypesLoading ? (
                  <SelectItem value="loading" disabled>در حال بارگذاری...</SelectItem>
                ) : (
                  propertyTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id.toString()}>
                      {type.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>

            <Button
              onClick={applyLocalFilters}
              className="h-11 w-full bg-primary hover:bg-primary-hover text-white sm:col-span-2 xl:col-span-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin ml-2" />
              ) : (
                <Search className="h-4 w-4 ml-2" />
              )}
              اعمال فیلتر
            </Button>
          </div>

          {fromHomeSearch && (
            <p className="mt-3 text-sm text-muted-foreground">
              نوع معامله:{' '}
              <span className="font-medium text-foreground">{transactionLabel}</span>
            </p>
          )}

          {searchTerm && (
            <p className="mt-3 text-sm text-muted-foreground">
              نتیجه جستجو برای:{' '}
              <span className="font-medium text-foreground">&laquo;{searchTerm}&raquo;</span>
            </p>
          )}

          {activeFiltersCount > 0 && (
            <div className="flex items-center justify-between gap-2 mt-4 pt-4 border-t border-gray-100 sm:hidden">
              <span className="text-sm text-muted-foreground">
                {activeFiltersCount} فیلتر فعال
              </span>
              <Button variant="outline" size="sm" onClick={clearAllFilters} className="gap-1.5">
                <X className="h-4 w-4" />
                پاک کردن
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* لیست املاک */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : propertiesArray.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-6">
            <Building2 className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">ملکی یافت نشد</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {hasSearchParams
              ? 'با فیلترهای انتخاب‌شده ملکی یافت نشد. لطفاً فیلترها را تغییر دهید.'
              : 'هنوز ملکی در سیستم ثبت نشده است. به زودی املاک جدید اضافه خواهند شد.'}
          </p>
          {activeFiltersCount > 0 && (
            <Button variant="outline" onClick={clearAllFilters} className="gap-2">
              <X className="h-4 w-4" />
              نمایش همه املاک
            </Button>
          )}
        </div>
      ) : (
        <div className="relative">
          {isRefreshing && (
            <div className="absolute inset-0 z-10 flex items-start justify-center bg-white/60 pt-20 backdrop-blur-[1px]">
              <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-md">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">در حال بارگذاری...</span>
              </div>
            </div>
          )}
        <>
          {/* نمایش تعداد نتایج */}
          {paginationInfo && (
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                نمایش <span className="font-semibold text-foreground">{propertiesArray.length}</span> ملک از <span className="font-semibold text-foreground">{paginationInfo.totalCount}</span> ملک
                {paginationInfo.totalPages > 1 && (
                  <span className="mr-2">
                    (صفحه {paginationInfo.currentPage} از {paginationInfo.totalPages})
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Grid املاک */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {propertiesArray.map((property: PropertyListItem, index: number) => (
              <div
                key={property.id}
                className="animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <PropertyCard property={property} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {paginationInfo && (
            <div className="mt-8">
              <Pagination
                currentPage={paginationInfo.currentPage}
                totalPages={paginationInfo.totalPages}
                onPageChange={(newPage) => {
                  // همیشه URL را بروزرسانی کن
                  const newParams = new URLSearchParams(window.location.search);
                  newParams.set('page', newPage.toString());
                  router.push(`/properties?${newParams.toString()}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}
        </>
        </div>
      )}
    </div>
  );
}
