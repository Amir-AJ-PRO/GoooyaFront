/**
 * API Service برای دریافت لیست عمومی مشاورین
 *
 * Endpoint: GET /api/agents/list/
 * نکته: این endpoint عمومی است و شماره تماس شخصی مشاور را برنمی‌گرداند.
 */

import { apiClient } from '@/lib/api';

export interface PublicAgentListItem {
  id: number;
  full_name: string;
  profile_image: string | null;
  office_name: string | null;
  office_address?: string | null;
  office_phone?: string | null;
  city: number | null;
  city_name?: string | null;
  region: number | null;
  region_name?: string | null;
  locations_names?: string[];
  years_of_experience?: number;
  specialties?: string | null;
  bio?: string | null;
  website?: string | null;
  instagram?: string | null;
  is_verified: boolean;
  is_goooya_adviser?: boolean;
  ranking?: number;
  properties_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaginatedAgentsResponse {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: PublicAgentListItem[];
}

export interface AgentsListParams {
  page?: number;
  page_size?: number;
  city?: number;
  region?: number;
  is_goooya_adviser?: boolean;
  is_verified?: boolean;
  search?: string;
}

export async function getPublicAgentsList(
  params: AgentsListParams = {}
): Promise<PaginatedAgentsResponse> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(100, Math.max(1, params.page_size ?? 20));

  const response = await apiClient.get<PaginatedAgentsResponse>('/api/agents/list/', {
    params: {
      ...params,
      page,
      page_size: pageSize,
    },
  });

  const data = response.data as any;

  // اگر پاسخ paginated است (دارای results)
  if (data && Array.isArray(data.results)) {
    const count = Number(data.count ?? 0);
    const currentPage = Number(data.page ?? page);
    const currentPageSize = Number(data.page_size ?? pageSize);
    const totalPages =
      Number(data.total_pages ?? 0) || (count > 0 ? Math.ceil(count / currentPageSize) : 1);

    return {
      count,
      page: currentPage,
      page_size: currentPageSize,
      total_pages: totalPages,
      results: data.results as PublicAgentListItem[],
    };
  }

  // backward compatibility: اگر خود پاسخ یک آرایه است
  if (Array.isArray(data)) {
    return {
      count: data.length,
      page: 1,
      page_size: data.length,
      total_pages: 1,
      results: data as PublicAgentListItem[],
    };
  }

  return {
    count: 0,
    page,
    page_size: pageSize,
    total_pages: 0,
    results: [],
  };
}


