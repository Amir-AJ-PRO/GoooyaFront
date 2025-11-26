'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useProperties } from '@/hooks/usePropertyMutations';
import { useSearchProperties } from '@/hooks/useSearch';
import { useCities } from '@/hooks/useCities';
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
import { Input } from '@/components/ui/input';
import { Loader2, Search, Building2, SlidersHorizontal, X, Sparkles } from 'lucide-react';
import { PropertyListItem } from '@/types/property';
import { SearchParams } from '@/types/search';

export default function PropertiesPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  
  // پارامترهای جستجوی پیشرفته از URL
  const [advancedSearchParams, setAdvancedSearchParams] = useState<SearchParams>({});
  const [useAdvancedSearch, setUseAdvancedSearch] = useState(false);
  
  // فیلترهای محلی (برای نمایش)
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [transactionFilter, setTransactionFilter] = useState<string>('all');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showFilters, setShowFilters] = useState(true);
  
  // دریافت شهرها
  const { data: cities = [], isLoading: citiesLoading } = useCities();
  
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
      hasAdvancedParams = true;
    }
    
    const propertyType = searchParams.get('property_type');
    if (propertyType) {
      params.property_type = parseInt(propertyType);
      setPropertyTypeFilter(propertyType);
      hasAdvancedParams = true;
    }
    
    const transactionType = searchParams.get('transaction_type');
    if (transactionType && (transactionType === 'sale' || transactionType === 'rent')) {
      params.transaction_type = transactionType;
      setTransactionFilter(transactionType);
      hasAdvancedParams = true;
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
    
    booleanParams.forEach(param => {
      const value = searchParams.get(param);
      if (value === 'true') {
        params[param as keyof SearchParams] = true;
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
    }
    
    setAdvancedSearchParams(params);
    setUseAdvancedSearch(hasAdvancedParams);
  }, [searchParams]);
  
  // استفاده از API مناسب بر اساس نوع جستجو
  const { data: propertiesData, isLoading: propertiesLoading, error: propertiesError } = useProperties(page, pageSize, {
    enabled: !useAdvancedSearch
  });
  
  const { data: searchData, isLoading: searchLoading, error: searchError } = useSearchProperties(advancedSearchParams, {
    enabled: useAdvancedSearch
  });
  
  // انتخاب داده‌های مناسب
  const isLoading = useAdvancedSearch ? searchLoading : propertiesLoading;
  const error = useAdvancedSearch ? searchError : propertiesError;
  const data = useAdvancedSearch ? searchData : propertiesData;
  
  // Reset به صفحه اول هنگام تغییر فیلترها
  useEffect(() => {
    if (!useAdvancedSearch) {
    setPage(1);
    }
  }, [searchTerm, cityFilter, transactionFilter, propertyTypeFilter, useAdvancedSearch]);
  
  // تابع اعمال فیلترهای محلی
  const applyLocalFilters = () => {
    const params = new URLSearchParams();
    
    if (searchTerm.trim()) {
      params.set('q', searchTerm.trim());
    }
    
    if (cityFilter !== 'all') {
      params.set('city', cityFilter);
    }
    
    if (transactionFilter !== 'all') {
      params.set('transaction_type', transactionFilter);
    }
    
    if (propertyTypeFilter !== 'all') {
      params.set('property_type', propertyTypeFilter);
    }
    
    // مرتب‌سازی
    if (sortBy !== 'newest') {
      const sortMap: Record<string, string> = {
        'oldest': 'created_at',
        'price-high': '-price',
        'price-low': 'price'
      };
      if (sortMap[sortBy]) {
        params.set('sort_by', sortMap[sortBy]);
      }
    }
    
    params.set('page', '1');
    params.set('page_size', pageSize.toString());
    
    const newUrl = params.toString() ? `/properties?${params.toString()}` : '/properties';
    router.push(newUrl);
  };
  
  // اطمینان از اینکه properties یک آرایه است
  const propertiesArray: PropertyListItem[] = data?.results || [];
  
  // فیلتر و مرتب‌سازی املاک (فقط برای حالت عادی)
  const filteredProperties = useAdvancedSearch ? propertiesArray : propertiesArray
    .filter((property: PropertyListItem) => {
      // اگر فیلتری فعال نیست، همه را نمایش بده
      if (!searchTerm && cityFilter === 'all' && transactionFilter === 'all' && propertyTypeFilter === 'all') {
        return true;
      }
      
      // فیلتر جستجو
      const cityName = typeof property.city === 'object' && property.city?.name ? property.city.name : '';
      const locationName = typeof property.location === 'object' && property.location?.name ? property.location.name : '';
      
      const matchesSearch = !searchTerm || 
                           property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           cityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           locationName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // فیلتر شهر
      const propertyCityId = typeof property.city === 'object' && property.city?.id 
        ? property.city.id.toString() 
        : '';
      const matchesCity = cityFilter === 'all' || propertyCityId === cityFilter;
      
      // فیلتر نوع معامله
      const matchesTransaction = transactionFilter === 'all' || 
                                 property.transaction_type === transactionFilter;
      
      // فیلتر نوع ملک
      const propertyTypeId = typeof property.property_type === 'object' && property.property_type?.id 
        ? property.property_type.id.toString() 
        : '';
      const matchesType = propertyTypeFilter === 'all' || propertyTypeId === propertyTypeFilter;
      
      return matchesSearch && matchesCity && matchesTransaction && matchesType;
    })
    .sort((a: PropertyListItem, b: PropertyListItem) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        default:
          return 0;
      }
    });
  
  // استخراج انواع املاک یکتا
  const uniquePropertyTypes = Array.from(
    new Set(
      propertiesArray
        .filter((p: PropertyListItem) => typeof p.property_type === 'object' && p.property_type?.id)
        .map((p: PropertyListItem) => JSON.stringify(p.property_type))
    )
  ).map((str: string) => JSON.parse(str));
  
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
  
  // تعداد فیلترهای فعال
  const activeFiltersCount = [
    searchTerm && 1,
    cityFilter !== 'all' && 1,
    transactionFilter !== 'all' && 1,
    propertyTypeFilter !== 'all' && 1,
    sortBy !== 'newest' && 1
  ].filter(Boolean).length;

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
                  {useAdvancedSearch && (
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
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-100 p-6 mb-8 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <SlidersHorizontal className="h-5 w-5 text-primary" />
            </div>
            <h2 className="font-semibold text-lg">فیلترها و جستجو</h2>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-1 bg-primary text-white text-xs font-bold rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            {showFilters ? <X className="h-4 w-4" /> : <SlidersHorizontal className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className={`space-y-4 transition-all duration-300 ${showFilters ? 'block' : 'hidden md:block'}`}>
          {/* ردیف اول فیلترها */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* جستجو */}
          <div className="relative md:col-span-2 lg:col-span-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" />
            <Input
              placeholder="جستجو در عنوان، شهر، منطقه..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10 h-11 bg-white border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            )}
          </div>
            
            {/* شهر */}
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger>
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
          
          {/* نوع معامله */}
          <Select value={transactionFilter} onValueChange={setTransactionFilter}>
            <SelectTrigger>
              <SelectValue placeholder="نوع معامله" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              <SelectItem value="sale">فروش</SelectItem>
              <SelectItem value="rent">اجاره</SelectItem>
            </SelectContent>
          </Select>
          
          {/* نوع ملک */}
          <Select value={propertyTypeFilter} onValueChange={setPropertyTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="نوع ملک" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه</SelectItem>
              {uniquePropertyTypes.map((type) => (
                <SelectItem key={type.id} value={type.id.toString()}>
                  {type.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          </div>
          
          {/* ردیف دوم فیلترها */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* مرتب‌سازی */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="مرتب‌سازی" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">جدیدترین</SelectItem>
              <SelectItem value="oldest">قدیمی‌ترین</SelectItem>
              <SelectItem value="price-high">گران‌ترین</SelectItem>
              <SelectItem value="price-low">ارزان‌ترین</SelectItem>
            </SelectContent>
          </Select>
          
          {/* تعداد در هر صفحه */}
          <Select 
            value={pageSize.toString()} 
            onValueChange={(value) => {
              setPageSize(Number(value));
                setPage(1);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="تعداد در صفحه" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12 ملک</SelectItem>
              <SelectItem value="20">20 ملک</SelectItem>
              <SelectItem value="30">30 ملک</SelectItem>
              <SelectItem value="50">50 ملک</SelectItem>
            </SelectContent>
          </Select>
            
            {/* دکمه اعمال فیلترها */}
            <Button 
              onClick={applyLocalFilters}
              className="bg-primary hover:bg-primary-hover text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              اعمال فیلترها
            </Button>
            
            {/* فضای خالی برای تراز */}
            <div className="hidden lg:block"></div>
          </div>
        </div>
        
        {/* دکمه پاک کردن فیلترها */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setCityFilter('all');
                setTransactionFilter('all');
                setPropertyTypeFilter('all');
                setSortBy('newest');
                // پاک کردن URL params
                router.push('/properties');
              }}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              پاک کردن همه فیلترها
            </Button>
            <span className="text-sm text-muted-foreground">
              {activeFiltersCount} فیلتر فعال
            </span>
          </div>
        )}
      </div>
      
      {/* لیست املاک */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-muted mb-6">
            <Building2 className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">ملکی یافت نشد</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            {propertiesArray.length === 0 
              ? 'هنوز ملکی در سیستم ثبت نشده است. به زودی املاک جدید اضافه خواهند شد.'
              : 'با فیلترهای انتخاب شده ملکی یافت نشد. لطفاً فیلترها را تغییر دهید.'
            }
          </p>
          {propertiesArray.length > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setCityFilter('all');
                setTransactionFilter('all');
                setPropertyTypeFilter('all');
                setSortBy('newest');
                router.push('/properties');
              }}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              نمایش همه املاک
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* نمایش تعداد نتایج */}
          {paginationInfo && (
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                نمایش <span className="font-semibold text-foreground">{filteredProperties.length}</span> ملک از <span className="font-semibold text-foreground">{paginationInfo.totalCount}</span> ملک
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
            {filteredProperties.map((property: PropertyListItem, index: number) => (
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
                  if (useAdvancedSearch) {
                    // برای جستجوی پیشرفته، URL را بروزرسانی کن
                    const newParams = new URLSearchParams(window.location.search);
                    newParams.set('page', newPage.toString());
                    router.push(`/properties?${newParams.toString()}`);
                  } else {
                  setPage(newPage);
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
