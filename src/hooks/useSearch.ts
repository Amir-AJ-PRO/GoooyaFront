/**
 * React Query hooks برای جستجوی پیشرفته
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { SearchParams, SearchResult } from '@/types/search';
import { apiClient } from '@/lib/api';

/**
 * Hook برای جستجوی پیشرفته املاک
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
      // ساخت query parameters
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
      
      const response = await apiClient.get(`/api/search/properties?${queryParams.toString()}`);
      return response.data;
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
      
      const response = await apiClient.get(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
      return response.data;
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
      queryParams.append(key, value.toString());
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
