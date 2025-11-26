/**
 * React Query hooks برای بلاگ
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { 
  BlogPost, 
  BlogListResponse, 
  BlogListParams, 
  CreateCommentPayload, 
  CreateCommentResponse,
  BlogComment
} from '@/types/blog';

/**
 * Hook برای دریافت لیست مقالات
 */
export const useBlogPosts = (
  params: BlogListParams = {},
  options?: { enabled?: boolean }
): UseQueryResult<BlogListResponse, Error> => {
  return useQuery({
    queryKey: ['blogPosts', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
      
      const response = await apiClient.get(`/api/blog/api/list/?${queryParams.toString()}`);
      return response.data;
    },
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000, // 5 دقیقه
    gcTime: 10 * 60 * 1000, // 10 دقیقه
    retry: 2,
  });
};

/**
 * Hook برای دریافت جزئیات مقاله
 */
export const useBlogPost = (
  slug: string,
  options?: { enabled?: boolean }
): UseQueryResult<BlogPost, Error> => {
  return useQuery({
    queryKey: ['blogPost', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/api/blog/api/${slug}/`);
      return response.data;
    },
    enabled: (options?.enabled ?? true) && !!slug,
    staleTime: 10 * 60 * 1000, // 10 دقیقه
    gcTime: 30 * 60 * 1000, // 30 دقیقه
    retry: 2,
  });
};

/**
 * Hook برای دریافت نظرات مقاله
 */
export const useBlogComments = (
  slug: string,
  options?: { enabled?: boolean }
): UseQueryResult<{ count: number; results: BlogComment[] }, Error> => {
  return useQuery({
    queryKey: ['blogComments', slug],
    queryFn: async () => {
      const response = await apiClient.get(`/api/blog/api/${slug}/comments/`);
      return response.data;
    },
    enabled: (options?.enabled ?? true) && !!slug,
    staleTime: 2 * 60 * 1000, // 2 دقیقه
    gcTime: 5 * 60 * 1000, // 5 دقیقه
    retry: 2,
  });
};

/**
 * Hook برای ایجاد نظر جدید
 */
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ slug, comment }: { slug: string; comment: CreateCommentPayload }) => {
      const response = await apiClient.post(`/api/blog/api/${slug}/comments/create/`, comment);
      return response.data as CreateCommentResponse;
    },
    onSuccess: (data, variables) => {
      // بروزرسانی کش نظرات
      queryClient.invalidateQueries({ queryKey: ['blogComments', variables.slug] });
      
      // بروزرسانی تعداد نظرات در جزئیات مقاله
      queryClient.invalidateQueries({ queryKey: ['blogPost', variables.slug] });
    },
  });
};
