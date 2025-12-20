/**
 * React Query hook برای دریافت لیست عمومی مشاورین
 */

import { useQuery } from '@tanstack/react-query';
import type { AgentsListParams, PaginatedAgentsResponse } from '@/services/agentsPublicApi';
import { getPublicAgentsList } from '@/services/agentsPublicApi';

export const useAgentsList = (params: AgentsListParams, enabled: boolean = true) => {
  const {
    page = 1,
    page_size = 20,
    city,
    region,
    is_verified,
    is_goooya_adviser,
    search,
  } = params;

  return useQuery<PaginatedAgentsResponse, Error>({
    queryKey: [
      'agents',
      {
        page,
        page_size,
        city,
        region,
        is_verified,
        is_goooya_adviser,
        search,
      },
    ],
    queryFn: () => getPublicAgentsList(params),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previousData) => previousData,
  });
};


