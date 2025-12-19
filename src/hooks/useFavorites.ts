/**
 * React Query hooks برای مدیریت علاقه‌مندی‌ها
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
    onSuccess: (data: ToggleFavoriteResponse, propertyId: number) => {
      // Invalidate و refetch کردن لیست علاقه‌مندی‌ها
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEYS.stats() });
      
      // بروزرسانی وضعیت علاقه‌مندی ملک
      queryClient.setQueryData(
        FAVORITES_QUERY_KEYS.status(propertyId),
        { is_favorite: data.is_favorite }
      );

      // بروزرسانی فیلد is_favorite در لیست املاک اگر موجود باشد
      queryClient.invalidateQueries({ queryKey: ['properties'] });

      toast({
        title: data.action === 'added' ? "اضافه شد" : "حذف شد",
        description: data.message,
        variant: "default",
      });
    },
    onError: (error) => {
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
