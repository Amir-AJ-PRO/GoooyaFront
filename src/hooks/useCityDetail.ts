/**
 * جزئیات یک شهر
 * Endpoint: GET /api/properties/cities/<id>/
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { CityDetail } from '@/types/city';

export function useCityDetail(
  cityId?: number | null,
  options?: { enabled?: boolean }
): UseQueryResult<CityDetail, Error> {
  const enabled = (options?.enabled ?? true) && Boolean(cityId);

  return useQuery({
    queryKey: ['city-detail', cityId],
    queryFn: async () => {
      const response = await apiClient.get<CityDetail>(
        `/api/properties/cities/${cityId}/`
      );
      return response.data;
    },
    enabled,
    staleTime: 60 * 60 * 1000,
    gcTime: 2 * 60 * 60 * 1000,
    retry: 1,
  });
}
