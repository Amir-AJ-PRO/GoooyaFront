/**
 * React Query hook برای دریافت لیست شهرها
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

/**
 * نوع داده شهر
 */
export interface City {
  id: number;
  name: string;
  province: string;
}

/**
 * Hook برای دریافت لیست شهرها
 */
export const useCities = (): UseQueryResult<City[], Error> => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const response = await apiClient.get('/api/properties/options/cities/');
      return response.data;
    },
    staleTime: 60 * 60 * 1000, // 1 ساعت
    gcTime: 2 * 60 * 60 * 1000, // 2 ساعت
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
