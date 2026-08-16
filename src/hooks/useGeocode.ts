import { useQuery, UseQueryResult } from '@tanstack/react-query';

type GeocodeResult = {
  lat: number;
  lon: number;
};

export function useGeocode(
  query?: string | null,
  options?: { enabled?: boolean }
): UseQueryResult<GeocodeResult | null, Error> {
  const enabled = (options?.enabled ?? true) && Boolean(query && query.trim().length >= 3);

  return useQuery<GeocodeResult | null, Error>({
    queryKey: ['geocode', query],
    queryFn: async () => {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(query!.trim())}`);
      if (!response.ok) return null;
      return (await response.json()) as GeocodeResult | null;
    },
    enabled,
    staleTime: 1000 * 60 * 60 * 24,
    retry: 0,
  });
}
