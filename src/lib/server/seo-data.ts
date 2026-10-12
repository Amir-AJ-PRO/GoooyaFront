import { getApiBaseUrl } from '@/lib/constants';
import { encodePathSlug } from '@/lib/utils';
import type { Property, PropertyType, City, Location } from '@/types/property';
import type { CityDetail } from '@/types/city';
import type { LocationDetail } from '@/types/location';
import type { BlogPost, BlogListResponse } from '@/types/blog';
import type { PaginatedPropertiesResponse } from '@/services/propertyApi';
import type { PublicAgentProfileResponse } from '@/services/agentPublicProfileApi';
import type { PaginatedAgentsResponse } from '@/services/agentsPublicApi';
import type { StoriesBanner, StoriesListResponse, StoryItem } from '@/types/story';

const API = getApiBaseUrl();

async function fetchJson<T>(url: string, revalidate = 60): Promise<T | null> {
  try {
    const response = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate, tags: ['seo'] },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchPropertyForSeo(
  slug: string
): Promise<{ property: Property | null; notFound: boolean }> {
  try {
    const response = await fetch(`${API}/api/properties/${encodePathSlug(slug)}/`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 60, tags: ['seo', `property-${slug}`] },
    });
    if (response.status === 404) return { property: null, notFound: true };
    if (!response.ok) return { property: null, notFound: false };
    return { property: (await response.json()) as Property, notFound: false };
  } catch {
    return { property: null, notFound: false };
  }
}

export async function fetchPropertiesPageForSeo(
  page = 1,
  pageSize = 100
): Promise<PaginatedPropertiesResponse | null> {
  const url = new URL(`${API}/api/properties/list/`);
  url.searchParams.set('page', String(page));
  url.searchParams.set('page_size', String(pageSize));
  return fetchJson<PaginatedPropertiesResponse>(url.toString(), 60);
}

export async function fetchCitiesForSeo(): Promise<City[]> {
  const data = await fetchJson<City[]>(`${API}/api/properties/options/cities/`, 3600);
  return Array.isArray(data) ? data : [];
}

export async function fetchLocationsForSeo(cityId?: number): Promise<Location[]> {
  const url = cityId
    ? `${API}/api/properties/options/locations/?city=${cityId}`
    : `${API}/api/properties/options/locations/`;
  const data = await fetchJson<Location[]>(url, 3600);
  return Array.isArray(data) ? data : [];
}

export async function fetchPropertyTypesForSeo(): Promise<PropertyType[]> {
  const data = await fetchJson<PropertyType[]>(
    `${API}/api/properties/options/property-types/`,
    3600
  );
  return Array.isArray(data) ? data : [];
}

export async function fetchCityForSeo(id: number): Promise<CityDetail | null> {
  return fetchJson<CityDetail>(`${API}/api/properties/cities/${id}/`, 600);
}

export async function fetchLocationForSeo(id: number): Promise<LocationDetail | null> {
  return fetchJson<LocationDetail>(`${API}/api/properties/locations/${id}/`, 600);
}

export async function fetchAgentForSeo(
  agentId: number
): Promise<PublicAgentProfileResponse | null> {
  return fetchJson<PublicAgentProfileResponse>(
    `${API}/api/agents/${agentId}/?page=1&page_size=1`,
    600
  );
}

export async function fetchAgentsPageForSeo(
  page = 1,
  pageSize = 100
): Promise<PaginatedAgentsResponse | null> {
  return fetchJson<PaginatedAgentsResponse>(
    `${API}/api/agents/list/?page=${page}&page_size=${pageSize}`,
    600
  );
}

export async function fetchBlogPostForSeo(slug: string): Promise<BlogPost | null> {
  return fetchJson<BlogPost>(`${API}/api/blog/api/${encodeURIComponent(slug)}/`, 600);
}

export async function fetchBlogListForSeo(
  page = 1,
  pageSize = 50
): Promise<BlogListResponse | null> {
  return fetchJson<BlogListResponse>(
    `${API}/api/blog/api/list/?page=${page}&page_size=${pageSize}`,
    600
  );
}

export async function fetchStoriesBannerForSeo(): Promise<StoriesBanner | null> {
  return fetchJson<StoriesBanner>(`${API}/api/stories/banner/`, 120);
}

export async function fetchStoriesListForSeo(): Promise<StoriesListResponse | null> {
  return fetchJson<StoriesListResponse>(`${API}/api/stories/`, 120);
}

export async function fetchStoryForSeo(slug: string): Promise<StoryItem | null> {
  return fetchJson<StoryItem>(
    `${API}/api/stories/${encodeURIComponent(slug)}/`,
    120
  );
}

export async function resolvePropertyFilterLabels(params: {
  city?: string | null;
  location?: string | null;
  propertyType?: string | null;
}): Promise<{
  cityName?: string;
  locationName?: string;
  propertyTypeName?: string;
}> {
  const [cities, types, locations] = await Promise.all([
    params.city ? fetchCitiesForSeo() : Promise.resolve([]),
    params.propertyType ? fetchPropertyTypesForSeo() : Promise.resolve([]),
    params.city && params.location
      ? fetchLocationsForSeo(Number(params.city))
      : params.location
        ? fetchLocationsForSeo()
        : Promise.resolve([]),
  ]);

  const cityId = params.city ? Number(params.city) : NaN;
  const locationId = params.location ? Number(params.location) : NaN;
  const typeId = params.propertyType ? Number(params.propertyType) : NaN;

  return {
    cityName: Number.isFinite(cityId)
      ? cities.find((city) => city.id === cityId)?.name
      : undefined,
    locationName: Number.isFinite(locationId)
      ? locations.find((loc) => loc.id === locationId)?.name
      : undefined,
    propertyTypeName: Number.isFinite(typeId)
      ? types.find((type) => type.id === typeId)?.title
      : undefined,
  };
}
