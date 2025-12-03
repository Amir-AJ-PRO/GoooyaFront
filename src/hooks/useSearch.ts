/**
 * React Query hooks برای جستجوی پیشرفته
 * طبق داکیومنت: GET /api/search/properties/
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { SearchParams, SearchResult } from '@/types/search';
import { API_BASE_URL } from '@/lib/constants';

/**
 * Hook برای جستجوی پیشرفته املاک
 * طبق داکیومنت: GET /api/search/properties/
 */
export const useSearchProperties = (
  params: SearchParams,
  options?: {
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
  }
): UseQueryResult<SearchResult, Error> => {
  return useQuery({
    queryKey: ['searchProperties', params],
    queryFn: async () => {
      // ساخت query parameters طبق داکیومنت
      const queryParams = new URLSearchParams();
      
      // جستجوی متنی
      if (params.q) {
        queryParams.append('q', params.q);
      }
      
      // فیلترهای مکانی (integer)
      if (params.city !== undefined && params.city !== null) {
        queryParams.append('city', params.city.toString());
      }
      
      if (params.location !== undefined && params.location !== null) {
        queryParams.append('location', params.location.toString());
      }
      
      // فیلتر نوع ملک (integer)
      if (params.property_type !== undefined && params.property_type !== null) {
        queryParams.append('property_type', params.property_type.toString());
      }
      
      // نوع معامله (string: sale یا rent)
      if (params.transaction_type) {
        queryParams.append('transaction_type', params.transaction_type);
      }
      
      // فیلترهای قیمت (integer)
      if (params.min_price !== undefined && params.min_price !== null) {
        queryParams.append('min_price', params.min_price.toString());
      }
      
      if (params.max_price !== undefined && params.max_price !== null) {
        queryParams.append('max_price', params.max_price.toString());
      }
      
      // فیلترهای متراژ (float)
      if (params.min_measure !== undefined && params.min_measure !== null) {
        queryParams.append('min_measure', params.min_measure.toString());
      }
      
      if (params.max_measure !== undefined && params.max_measure !== null) {
        queryParams.append('max_measure', params.max_measure.toString());
      }
      
      // فیلترهای اتاق (integer)
      if (params.rooms !== undefined && params.rooms !== null) {
        queryParams.append('rooms', params.rooms.toString());
      }
      
      if (params.min_rooms !== undefined && params.min_rooms !== null) {
        queryParams.append('min_rooms', params.min_rooms.toString());
      }
      
      // فیلترهای سال ساخت (integer)
      if (params.min_year_built !== undefined && params.min_year_built !== null) {
        queryParams.append('min_year_built', params.min_year_built.toString());
      }
      
      if (params.max_year_built !== undefined && params.max_year_built !== null) {
        queryParams.append('max_year_built', params.max_year_built.toString());
      }
      
      // امکانات (boolean - فقط اگر true باشد)
      if (params.has_parking === true) {
        queryParams.append('has_parking', 'true');
      }
      
      if (params.has_storage === true) {
        queryParams.append('has_storage', 'true');
      }
      
      if (params.has_elevator === true) {
        queryParams.append('has_elevator', 'true');
      }
      
      if (params.has_balcony === true) {
        queryParams.append('has_balcony', 'true');
      }
      
      if (params.has_pool === true) {
        queryParams.append('has_pool', 'true');
      }
      
      if (params.has_security === true) {
        queryParams.append('has_security', 'true');
      }
      
      // ویژگی‌های خاص (boolean)
      if (params.urgent === true) {
        queryParams.append('urgent', 'true');
      }
      
      if (params.under_price === true) {
        queryParams.append('under_price', 'true');
      }
      
      if (params.exchange === true) {
        queryParams.append('exchange', 'true');
      }
      
      // Pagination
      if (params.page !== undefined && params.page !== null) {
        queryParams.append('page', params.page.toString());
      }
      
      if (params.page_size !== undefined && params.page_size !== null) {
        queryParams.append('page_size', params.page_size.toString());
      }
      
      // مرتب‌سازی (string: created_at, -created_at, price, -price, measure, -measure, _score)
      if (params.sort_by) {
        queryParams.append('sort_by', params.sort_by);
      }
      
      // استفاده مستقیم از backend API
      const url = `${API_BASE_URL}/api/search/properties/?${queryParams.toString()}`;
      
      console.log('🔍 در حال جستجو:', url);
      console.log('📋 پارامترها:', Object.fromEntries(queryParams));
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ خطا در جستجو:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url
        });
        throw new Error(`خطا در جستجو: ${response.status} ${response.statusText}`);
      }
      
      const data: SearchResult = await response.json();
      
      console.log('✅ جستجو موفق:', {
        count: data.count,
        page: data.page,
        total_pages: data.total_pages,
        results_count: data.results.length,
        warning: data.warning
      });
      
      return data;
    },
    enabled: options?.enabled ?? true,
    staleTime: options?.staleTime ?? 5 * 60 * 1000, // 5 دقیقه
    gcTime: options?.cacheTime ?? 10 * 60 * 1000, // 10 دقیقه
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

/**
 * Hook برای پیشنهادات جستجو (Autocomplete)
 * طبق داکیومنت: GET /api/search/suggestions/
 */
export const useSearchSuggestions = (
  query: string,
  options?: {
    enabled?: boolean;
    debounceMs?: number;
  }
): UseQueryResult<{ suggestions: string[]; query: string }, Error> => {
  return useQuery({
    queryKey: ['searchSuggestions', query],
    queryFn: async () => {
      if (!query || query.length < 2) {
        return { suggestions: [], query };
      }
      
      const url = `${API_BASE_URL}/api/search/suggestions?q=${encodeURIComponent(query)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        console.error('❌ خطا در دریافت پیشنهادات:', response.status);
        return { suggestions: [], query };
      }
      
      const data = await response.json();
      return { suggestions: data.suggestions || [], query };
    },
    enabled: (options?.enabled ?? true) && query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 دقیقه
    gcTime: 5 * 60 * 1000, // 5 دقیقه
    retry: 1,
  });
};

/**
 * Hook برای جستجوی سریع (بدون فیلتر)
 */
export const useQuickSearch = (
  searchTerm: string,
  options?: {
    enabled?: boolean;
  }
): UseQueryResult<SearchResult, Error> => {
  const searchParams: SearchParams = {
    q: searchTerm,
    page: 1,
    page_size: 10,
    sort_by: '_score'
  };
  
  return useSearchProperties(searchParams, {
    enabled: (options?.enabled ?? true) && searchTerm.length >= 2,
    staleTime: 1 * 60 * 1000, // 1 دقیقه
  });
};

/**
 * Helper function برای ساخت URL جستجو
 */
export const buildSearchUrl = (params: SearchParams): string => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (typeof value === 'boolean' && value === true) {
        queryParams.append(key, 'true');
      } else if (typeof value !== 'boolean') {
        queryParams.append(key, value.toString());
      }
    }
  });
  
  return `/properties?${queryParams.toString()}`;
};

/**
 * Helper function برای پاک کردن فیلترهای خالی
 */
export const cleanSearchParams = (params: SearchParams): SearchParams => {
  const cleaned: SearchParams = {};
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      cleaned[key as keyof SearchParams] = value;
    }
  });
  
  return cleaned;
};

/**
 * Helper function برای تبدیل SearchParams به readable string
 */
export const searchParamsToString = (params: SearchParams): string => {
  const parts: string[] = [];
  
  if (params.q) {
    parts.push(`جستجو: "${params.q}"`);
  }
  
  if (params.city) {
    parts.push(`شهر: ${params.city}`);
  }
  
  if (params.location) {
    parts.push(`منطقه: ${params.location}`);
  }
  
  if (params.property_type) {
    parts.push(`نوع ملک: ${params.property_type}`);
  }
  
  if (params.transaction_type) {
    parts.push(`نوع معامله: ${params.transaction_type === 'sale' ? 'فروش' : 'اجاره'}`);
  }
  
  if (params.min_price || params.max_price) {
    const priceRange = [];
    if (params.min_price) priceRange.push(`از ${params.min_price.toLocaleString()}`);
    if (params.max_price) priceRange.push(`تا ${params.max_price.toLocaleString()}`);
    parts.push(`قیمت: ${priceRange.join(' ')}`);
  }
  
  if (params.min_measure || params.max_measure) {
    const measureRange = [];
    if (params.min_measure) measureRange.push(`از ${params.min_measure}`);
    if (params.max_measure) measureRange.push(`تا ${params.max_measure}`);
    parts.push(`متراژ: ${measureRange.join(' ')} متر`);
  }
  
  if (params.rooms) {
    parts.push(`${params.rooms} خواب`);
  }
  
  const features = [];
  if (params.has_parking) features.push('پارکینگ');
  if (params.has_storage) features.push('انباری');
  if (params.has_elevator) features.push('آسانسور');
  if (params.has_balcony) features.push('بالکن');
  if (params.has_pool) features.push('استخر');
  if (params.has_security) features.push('نگهبانی');
  
  if (features.length > 0) {
    parts.push(`امکانات: ${features.join('، ')}`);
  }
  
  return parts.join(' | ') || 'همه املاک';
};
