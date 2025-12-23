/**
 * React Query hook برای دریافت لیست مناطق/محله‌ها
 * Endpoint: GET /api/properties/options/locations/
 * Endpoint (filter): GET /api/properties/options/locations/?city=1
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { Location } from '@/types/property';

export const useLocations = (
  cityId?: number,
  options?: {
    enabled?: boolean;
  }
): UseQueryResult<Location[], Error> => {
  const enabled = options?.enabled ?? true;

  return useQuery({
    queryKey: ['locations', cityId],
    queryFn: async () => {
      const url = cityId
        ? `/api/properties/options/locations/?city=${cityId}`
        : `/api/properties/options/locations/`;

      const response = await apiClient.get(url);
      const data = response.data as Location[];

      // Fallback: اگر backend به هر دلیلی همه مناطق را برگرداند،
      // در فرانت فقط مناطق همان شهر انتخاب‌شده را نمایش بده.
      if (cityId) {
        return data.filter((loc) => loc.city === cityId);
      }

      return data;
    },
    enabled,
    staleTime: 60 * 60 * 1000, // 1 ساعت (طبق داکیومنت backend)
    gcTime: 2 * 60 * 60 * 1000, // 2 ساعت
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};


