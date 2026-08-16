/**
 * React Query hooks برای مدیریت علاقه‌مندی‌ها
 */

import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  getFavorites,
  addToFavorites,
  toggleFavorite,
  removeFromFavorites,
  getFavoritesStats,
  checkFavoriteStatus,
} from '@/services/favoritesService';
import {
  FavoritesSearchParams,
  ToggleFavoriteResponse,
} from '@/types/favorites';

// Query Keys
export const FAVORITES_QUERY_KEYS = {
  all: ['favorites'] as const,
  lists: () => [...FAVORITES_QUERY_KEYS.all, 'list'] as const,
  list: (params?: FavoritesSearchParams) => [...FAVORITES_QUERY_KEYS.lists(), params] as const,
  stats: () => [...FAVORITES_QUERY_KEYS.all, 'stats'] as const,
  status: (propertyId: number) => [...FAVORITES_QUERY_KEYS.all, 'status', propertyId] as const,
};

type PropertyWithFavorite = { id?: number; is_favorite?: boolean };

function patchPropertyFavoriteInList<T extends PropertyWithFavorite>(
  items: T[] | undefined,
  propertyId: number,
  isFavorite: boolean
): T[] | undefined {
  if (!items) return items;
  return items.map((item) =>
    item.id === propertyId ? { ...item, is_favorite: isFavorite } : item
  );
}

function getCurrentFavoriteStatus(
  queryClient: QueryClient,
  propertyId: number,
  fallback = false
): boolean {
  const status = queryClient.getQueryData<{ is_favorite: boolean }>(
    FAVORITES_QUERY_KEYS.status(propertyId)
  );
  if (status !== undefined) return status.is_favorite;

  const propertyEntry = queryClient
    .getQueriesData<PropertyWithFavorite>({ queryKey: ['property'] })
    .find(([, data]) => data?.id === propertyId);
  if (propertyEntry?.[1]?.is_favorite !== undefined) {
    return Boolean(propertyEntry[1].is_favorite);
  }

  for (const [, data] of queryClient.getQueriesData<{ results?: PropertyWithFavorite[] }>({
    queryKey: ['properties'],
  })) {
    const match = data?.results?.find((item) => item.id === propertyId);
    if (match?.is_favorite !== undefined) return Boolean(match.is_favorite);
  }

  for (const [, data] of queryClient.getQueriesData<{ results?: PropertyWithFavorite[] }>({
    queryKey: ['searchProperties'],
  })) {
    const match = data?.results?.find((item) => item.id === propertyId);
    if (match?.is_favorite !== undefined) return Boolean(match.is_favorite);
  }

  const homepage = queryClient.getQueryData<PropertyWithFavorite[]>(['homepage-properties']);
  const homepageMatch = homepage?.find((item) => item.id === propertyId);
  if (homepageMatch?.is_favorite !== undefined) return Boolean(homepageMatch.is_favorite);

  return fallback;
}

export function updatePropertyFavoriteInCaches(
  queryClient: QueryClient,
  propertyId: number,
  isFavorite: boolean
) {
  queryClient.setQueryData(FAVORITES_QUERY_KEYS.status(propertyId), { is_favorite: isFavorite });

  queryClient.setQueriesData<PropertyWithFavorite>(
    { queryKey: ['property'] },
    (old) => (old?.id === propertyId ? { ...old, is_favorite: isFavorite } : old)
  );

  queryClient.setQueriesData<{ results?: PropertyWithFavorite[] }>(
    { queryKey: ['properties'] },
    (old) => {
      if (!old?.results) return old;
      return {
        ...old,
        results: patchPropertyFavoriteInList(old.results, propertyId, isFavorite)!,
      };
    }
  );

  queryClient.setQueriesData<{ results?: PropertyWithFavorite[] }>(
    { queryKey: ['searchProperties'] },
    (old) => {
      if (!old?.results) return old;
      return {
        ...old,
        results: patchPropertyFavoriteInList(old.results, propertyId, isFavorite)!,
      };
    }
  );

  queryClient.setQueryData<PropertyWithFavorite[]>(
    ['homepage-properties'],
    (old) => patchPropertyFavoriteInList(old, propertyId, isFavorite)
  );
}

/**
 * Hook برای دریافت لیست علاقه‌مندی‌ها
 */
export const useFavorites = (params?: FavoritesSearchParams) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: FAVORITES_QUERY_KEYS.list(params),
    queryFn: () => getFavorites(params),
    staleTime: 5 * 60 * 1000, // 5 دقیقه
    gcTime: 10 * 60 * 1000, // 10 دقیقه
    enabled: isAuthenticated,
  });
};

/**
 * Hook برای دریافت آمار علاقه‌مندی‌ها
 */
export const useFavoritesStats = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: FAVORITES_QUERY_KEYS.stats(),
    queryFn: getFavoritesStats,
    staleTime: 10 * 60 * 1000, // 10 دقیقه
    gcTime: 30 * 60 * 1000, // 30 دقیقه
    retry: 1, // فقط یک بار تلاش مجدد
    enabled: isAuthenticated,
    // در صورت خطا، آمار خالی برگردان
    placeholderData: {
      total_favorites: 0,
      favorites_by_type: {},
      favorites_by_city: {}
    }
  });
};

/**
 * Hook ساده برای فقط تعداد کل علاقه‌مندی‌ها
 */
export const useFavoritesCount = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: [...FAVORITES_QUERY_KEYS.all, 'count'],
    queryFn: async () => {
      const response = await getFavorites({ page: 1, page_size: 1 });
      return response.count;
    },
    staleTime: 5 * 60 * 1000, // 5 دقیقه
    gcTime: 10 * 60 * 1000, // 10 دقیقه
    retry: 2,
    enabled: isAuthenticated,
    // در صورت خطا، 0 برگردان
    placeholderData: 0
  });
};

/**
 * Hook برای بررسی وضعیت علاقه‌مندی یک ملک
 */
export const useFavoriteStatus = (propertyId: number) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: FAVORITES_QUERY_KEYS.status(propertyId),
    queryFn: () => checkFavoriteStatus(propertyId),
    staleTime: 2 * 60 * 1000, // 2 دقیقه
    gcTime: 5 * 60 * 1000, // 5 دقیقه
    enabled: isAuthenticated && !!propertyId,
  });
};

/**
 * Hook برای اضافه کردن به علاقه‌مندی‌ها
 */
export const useAddToFavorites = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: addToFavorites,
    onSuccess: (data) => {
      // Invalidate و refetch کردن لیست علاقه‌مندی‌ها
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEYS.stats() });
      
      // بروزرسانی وضعیت علاقه‌مندی ملک
      queryClient.setQueryData(
        FAVORITES_QUERY_KEYS.status(data.property.id),
        { is_favorite: true }
      );

      toast({
        title: "موفقیت",
        description: "ملک به علاقه‌مندی‌های شما اضافه شد",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "خطا",
        description: error.message || "خطا در اضافه کردن به علاقه‌مندی‌ها",
        variant: "destructive",
      });
    },
  });
};

/**
 * Hook برای تغییر وضعیت علاقه‌مندی (toggle)
 */
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: toggleFavorite,
    onMutate: async (propertyId: number) => {
      await queryClient.cancelQueries({ queryKey: ['property'] });
      await queryClient.cancelQueries({ queryKey: ['properties'] });
      await queryClient.cancelQueries({ queryKey: ['searchProperties'] });

      const previousFavoriteStatus = getCurrentFavoriteStatus(queryClient, propertyId, false);
      const nextFavoriteStatus = !previousFavoriteStatus;

      updatePropertyFavoriteInCaches(queryClient, propertyId, nextFavoriteStatus);

      return { propertyId, previousFavoriteStatus };
    },
    onSuccess: (data: ToggleFavoriteResponse, propertyId: number) => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEYS.stats() });

      updatePropertyFavoriteInCaches(queryClient, propertyId, data.is_favorite);

      toast({
        title: data.action === 'added' ? "اضافه شد" : "حذف شد",
        description: data.message,
        variant: "default",
      });
    },
    onError: (error, propertyId, context) => {
      if (context) {
        updatePropertyFavoriteInCaches(
          queryClient,
          context.propertyId,
          context.previousFavoriteStatus
        );
      } else if (propertyId) {
        updatePropertyFavoriteInCaches(queryClient, propertyId, false);
      }

      toast({
        title: "خطا",
        description: error.message || "خطا در تغییر وضعیت علاقه‌مندی",
        variant: "destructive",
      });
    },
  });
};

/**
 * Hook برای حذف از علاقه‌مندی‌ها
 */
export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: removeFromFavorites,
    onSuccess: () => {
      // Invalidate و refetch کردن لیست علاقه‌مندی‌ها
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEYS.stats() });

      toast({
        title: "حذف شد",
        description: "ملک از علاقه‌مندی‌های شما حذف شد",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "خطا",
        description: error.message || "خطا در حذف از علاقه‌مندی‌ها",
        variant: "destructive",
      });
    },
  });
};
