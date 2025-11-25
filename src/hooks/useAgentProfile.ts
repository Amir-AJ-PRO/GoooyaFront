import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getAgentProfile,
  getAgentProperties,
  updateAgentProfile,
  updateProperty,
  deleteProperty,
  UpdateAgentProfilePayload,
  UpdatePropertyPayload,
  AgentProfile,
  AgentProperty,
} from '@/services/agentService';

/**
 * Query Keys
 */
export const agentQueryKeys = {
  profile: ['agent', 'profile'] as const,
  properties: ['agent', 'properties'] as const,
};

/**
 * Hook برای دریافت پروفایل agent
 */
export const useAgentProfile = () => {
  return useQuery<AgentProfile, Error>({
    queryKey: agentQueryKeys.profile,
    queryFn: getAgentProfile,
    staleTime: 5 * 60 * 1000, // 5 دقیقه
    retry: 2,
  });
};

/**
 * Hook برای دریافت املاک agent
 */
export const useAgentProperties = () => {
  return useQuery<AgentProperty[], Error>({
    queryKey: agentQueryKeys.properties,
    queryFn: getAgentProperties,
    staleTime: 2 * 60 * 1000, // 2 دقیقه
    retry: 2,
  });
};

/**
 * Hook برای بروزرسانی پروفایل agent
 */
export const useUpdateAgentProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAgentProfile,
    onSuccess: (response) => {
      // بروزرسانی cache با agent جدید
      queryClient.setQueryData(agentQueryKeys.profile, response.agent);
      toast.success(response.detail || 'پروفایل با موفقیت بروزرسانی شد');
    },
    onError: (error: any) => {
      toast.error(error.message || 'خطا در بروزرسانی پروفایل');
    },
  });
};

/**
 * Hook برای فیلتر کردن املاک بر اساس وضعیت
 */
export const useFilteredAgentProperties = (status?: 'ok' | 'pending' | 'rejected') => {
  const { data, ...rest } = useAgentProperties();

  const filteredData = status
    ? data?.filter((property) => property.show_status === status)
    : data;

  return {
    data: filteredData,
    ...rest,
  };
};

/**
 * Hook برای بروزرسانی ملک
 */
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AgentProperty,
    Error,
    { slug: string; payload: UpdatePropertyPayload }
  >({
    mutationFn: ({ slug, payload }) => updateProperty(slug, payload),
    onSuccess: (data) => {
      // بروزرسانی لیست املاک
      queryClient.invalidateQueries({ queryKey: agentQueryKeys.properties });
      toast.success('ملک با موفقیت بروزرسانی شد');
    },
    onError: (error) => {
      toast.error(error.message || 'خطا در بروزرسانی ملک');
    },
  });
};

/**
 * Hook برای حذف ملک
 */
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (slug) => deleteProperty(slug),
    onSuccess: () => {
      // بروزرسانی لیست املاک
      queryClient.invalidateQueries({ queryKey: agentQueryKeys.properties });
      toast.success('ملک با موفقیت حذف شد');
    },
    onError: (error) => {
      toast.error(error.message || 'خطا در حذف ملک');
    },
  });
};

