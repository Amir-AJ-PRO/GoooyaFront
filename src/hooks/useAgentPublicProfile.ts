/**
 * React Query hook برای دریافت صفحه عمومی مشاور
 */

import { useQuery } from '@tanstack/react-query';
import type { AgentPublicProfileParams, PublicAgentProfileResponse } from '@/services/agentPublicProfileApi';
import { getPublicAgentProfile } from '@/services/agentPublicProfileApi';

export const useAgentPublicProfile = (
  agentId: number,
  params: AgentPublicProfileParams,
  enabled: boolean = true
) => {
  const { page = 1, page_size = 12 } = params;

  return useQuery<PublicAgentProfileResponse, Error>({
    queryKey: ['agent-public', agentId, { page, page_size }],
    queryFn: () => getPublicAgentProfile(agentId, params),
    enabled: enabled && Number.isFinite(agentId) && agentId > 0,
    staleTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
};


