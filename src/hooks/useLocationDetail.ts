import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import type { LocationDetail } from '@/types/location';

export function useLocationDetail(
  id?: number | null,
  options?: { enabled?: boolean }
): UseQueryResult<LocationDetail, Error> {
  const enabled = (options?.enabled ?? true) && typeof id === 'number' && Number.isFinite(id);

  return useQuery<LocationDetail, Error>({
    queryKey: ['location-detail', id],
    queryFn: async () => {
      const response = await apiClient.get(`/api/properties/locations/${id}/`);
      return response.data as LocationDetail;
    },
    enabled,
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });
}
