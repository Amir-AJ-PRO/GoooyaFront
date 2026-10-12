/**
 * React Query hooks برای انیمیشن‌های داستانی گویا
 */

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import {
  fetchStories,
  fetchStoriesBanner,
  fetchStoryBySlug,
} from '@/services/storiesService';
import type { StoriesBanner, StoriesListResponse, StoryItem } from '@/types/story';

export const storiesQueryKeys = {
  all: ['stories'] as const,
  banner: ['stories', 'banner'] as const,
  list: ['stories', 'list'] as const,
  detail: (slug: string) => ['stories', 'detail', slug] as const,
};

/**
 * بنر ورود به داستان‌ها
 */
export function useStoriesBanner(): UseQueryResult<StoriesBanner, Error> {
  return useQuery({
    queryKey: storiesQueryKeys.banner,
    queryFn: fetchStoriesBanner,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1500,
  });
}

/**
 * لیست انیمیشن‌های فعال
 */
export function useStories(): UseQueryResult<StoriesListResponse, Error> {
  return useQuery({
    queryKey: storiesQueryKeys.list,
    queryFn: fetchStories,
    staleTime: 2 * 60 * 1000,
    retry: 1,
    retryDelay: 1500,
  });
}

/**
 * جزئیات یک انیمیشن با اسلاگ
 */
export function useStory(
  slug: string,
  options?: { enabled?: boolean }
): UseQueryResult<StoryItem, Error> {
  return useQuery({
    queryKey: storiesQueryKeys.detail(slug),
    queryFn: () => fetchStoryBySlug(slug),
    enabled: (options?.enabled ?? true) && Boolean(slug),
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (error.name === 'StoryNotFoundError') return false;
      return failureCount < 2;
    },
  });
}
