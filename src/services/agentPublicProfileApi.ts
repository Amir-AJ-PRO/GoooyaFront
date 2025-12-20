/**
 * API Service برای صفحه عمومی مشاور
 *
 * Endpoint: GET /api/agents/<agent_id>/
 * این endpoint عمومی است و شماره تماس شخصی مشاور را نمایش نمی‌دهد.
 * لیست ملک‌ها دارای pagination است.
 */

import { apiClient } from '@/lib/api';
import type { PropertyListItem } from '@/types/property';
import type { PublicAgentListItem } from '@/services/agentsPublicApi';

export interface PaginatedAgentPropertiesResponse {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: PropertyListItem[];
}

export interface PublicAgentProfileResponse {
  agent: PublicAgentListItem;
  properties: PaginatedAgentPropertiesResponse;
}

export interface AgentPublicProfileParams {
  page?: number;
  page_size?: number;
}

export async function getPublicAgentProfile(
  agentId: number,
  params: AgentPublicProfileParams = {}
): Promise<PublicAgentProfileResponse> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, params.page_size ?? 12));

  const response = await apiClient.get<PublicAgentProfileResponse>(`/api/agents/${agentId}/`, {
    params: {
      page,
      page_size: pageSize,
    },
  });

  const data = response.data as any;

  // نرمال‌سازی properties در صورت نبود total_pages
  if (data?.properties) {
    const props = data.properties;
    const count = Number(props.count ?? 0);
    const currentPage = Number(props.page ?? page);
    const currentPageSize = Number(props.page_size ?? pageSize);
    const totalPages =
      Number(props.total_pages ?? 0) || (count > 0 ? Math.ceil(count / currentPageSize) : 1);

    return {
      agent: data.agent as PublicAgentListItem,
      properties: {
        count,
        page: currentPage,
        page_size: currentPageSize,
        total_pages: totalPages,
        results: Array.isArray(props.results) ? (props.results as PropertyListItem[]) : [],
      },
    };
  }

  return {
    agent: data?.agent as PublicAgentListItem,
    properties: {
      count: 0,
      page,
      page_size: pageSize,
      total_pages: 0,
      results: [],
    },
  };
}


