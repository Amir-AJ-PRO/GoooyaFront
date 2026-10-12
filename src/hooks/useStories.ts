/**
 * React Query hooks برای انیمیشن‌های داستانی گویا
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import {
  fetchStories,
  fetchStoriesBanner,
  fetchStoryBySlug,
  markStoryWatched,
  submitStoryAnswer,
} from '@/services/storiesService';
import type {
  StoriesBanner,
  StoriesListResponse,
  StoryAnswerPayload,
  StoryAnswerResponse,
  StoryDetail,
  StoryWatchResponse,
} from '@/types/story';

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
 * جزئیات یک قسمت با سوالات
 */
export function useStory(
  slug: string,
  options?: { enabled?: boolean }
): UseQueryResult<StoryDetail, Error> {
  return useQuery({
    queryKey: storiesQueryKeys.detail(slug),
    queryFn: () => fetchStoryBySlug(slug),
    enabled: (options?.enabled ?? true) && Boolean(slug),
    staleTime: 30 * 1000,
    retry: (failureCount, error) => {
      if (error.name === 'StoryNotFoundError') return false;
      return failureCount < 2;
    },
  });
}

/**
 * ثبت تماشای کامل
 */
export function useMarkStoryWatched(slug: string) {
  const queryClient = useQueryClient();
  return useMutation<StoryWatchResponse, Error, void>({
    mutationFn: () => markStoryWatched(slug),
    onSuccess: (data) => {
      queryClient.setQueryData<StoryDetail>(
        storiesQueryKeys.detail(slug),
        (prev) =>
          prev
            ? {
                ...prev,
                has_watched: data.has_watched,
                can_answer: true,
              }
            : prev
      );
      void queryClient.invalidateQueries({ queryKey: ['club'] });
    },
  });
}

/**
 * ارسال پاسخ سوال
 */
export function useSubmitStoryAnswer(slug: string) {
  const queryClient = useQueryClient();
  return useMutation<StoryAnswerResponse, Error, StoryAnswerPayload>({
    mutationFn: (payload) => submitStoryAnswer(slug, payload),
    onSuccess: (data, variables) => {
      queryClient.setQueryData<StoryDetail>(
        storiesQueryKeys.detail(slug),
        (prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            questions: prev.questions.map((q) =>
              q.id === variables.question_id
                ? {
                    ...q,
                    answered: true,
                    selected_option: data.selected_option,
                    is_correct: data.is_correct,
                    correct_option: data.correct_option,
                  }
                : q
            ),
          };
        }
      );
      void queryClient.invalidateQueries({ queryKey: ['club'] });
    },
  });
}
