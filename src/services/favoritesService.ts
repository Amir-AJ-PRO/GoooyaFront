/**
 * سرویس API برای مدیریت علاقه‌مندی‌ها
 */

import { apiClient, handleApiError } from '@/lib/api';
import {
  FavoritesListResponse,
  AddToFavoritesResponse,
  ToggleFavoriteResponse,
  AddToFavoritesRequest,
  FavoritesStats,
  FavoritesSearchParams,
} from '@/types/favorites';

/**
 * دریافت لیست علاقه‌مندی‌های کاربر
 */
export const getFavorites = async (params?: FavoritesSearchParams): Promise<FavoritesListResponse> => {
  try {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.page_size) searchParams.append('page_size', params.page_size.toString());
    if (params?.property_type) searchParams.append('property_type', params.property_type);
    if (params?.city) searchParams.append('city', params.city);
    if (params?.min_price) searchParams.append('min_price', params.min_price.toString());
    if (params?.max_price) searchParams.append('max_price', params.max_price.toString());

    const queryString = searchParams.toString();
    const url = `/api/properties/favorites/${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiClient.get<FavoritesListResponse>(url);
    return response.data;
  } catch (error) {
    console.error('خطا در دریافت لیست علاقه‌مندی‌ها:', error);
    throw new Error(handleApiError(error));
  }
};

/**
 * اضافه کردن ملک به علاقه‌مندی‌ها
 */
export const addToFavorites = async (propertyId: number): Promise<AddToFavoritesResponse> => {
  try {
    const payload: AddToFavoritesRequest = { property_id: propertyId };
    const response = await apiClient.post<AddToFavoritesResponse>('/api/properties/favorites/', payload);
    return response.data;
  } catch (error) {
    console.error('خطا در اضافه کردن به علاقه‌مندی‌ها:', error);
    throw new Error(handleApiError(error));
  }
};

/**
 * تغییر وضعیت علاقه‌مندی (toggle)
 */
export const toggleFavorite = async (propertyId: number): Promise<ToggleFavoriteResponse> => {
  try {
    const response = await apiClient.post<ToggleFavoriteResponse>(
      `/api/properties/favorites/${propertyId}/toggle/`
    );
    return response.data;
  } catch (error) {
    console.error('خطا در تغییر وضعیت علاقه‌مندی:', error);
    throw new Error(handleApiError(error));
  }
};

/**
 * حذف از علاقه‌مندی‌ها
 */
export const removeFromFavorites = async (favoriteId: number): Promise<void> => {
  try {
    await apiClient.delete(`/api/properties/favorites/${favoriteId}/`);
  } catch (error) {
    console.error('خطا در حذف از علاقه‌مندی‌ها:', error);
    throw new Error(handleApiError(error));
  }
};

/**
 * دریافت آمار علاقه‌مندی‌ها (محاسبه شده از لیست)
 */
export const getFavoritesStats = async (): Promise<FavoritesStats> => {
  try {
    // دریافت تمام علاقه‌مندی‌ها برای محاسبه آمار
    const response = await apiClient.get<FavoritesListResponse>('/api/properties/favorites/?page_size=1000');
    const favorites = response.data.results;
    
    // محاسبه آمار
    const stats: FavoritesStats = {
      total_favorites: response.data.count,
      favorites_by_type: {},
      favorites_by_city: {}
    };
    
    // گروه‌بندی بر اساس نوع ملک
    favorites.forEach(favorite => {
      if (favorite.property_type) {
        stats.favorites_by_type[favorite.property_type] = 
          (stats.favorites_by_type[favorite.property_type] || 0) + 1;
      }
    });
    
    // گروه‌بندی بر اساس شهر
    favorites.forEach(favorite => {
      if (favorite.property_city) {
        stats.favorites_by_city[favorite.property_city] = 
          (stats.favorites_by_city[favorite.property_city] || 0) + 1;
      }
    });
    
    return stats;
  } catch (error) {
    console.error('خطا در دریافت آمار علاقه‌مندی‌ها:', error);
    throw new Error(handleApiError(error));
  }
};

/**
 * بررسی وضعیت علاقه‌مندی یک ملک (از طریق جستجو در لیست)
 */
export const checkFavoriteStatus = async (propertyId: number): Promise<{ is_favorite: boolean }> => {
  try {
    // جستجو در لیست علاقه‌مندی‌ها برای پیدا کردن این ملک
    const response = await apiClient.get<FavoritesListResponse>('/api/properties/favorites/?page_size=1000');
    const isFavorite = response.data.results.some(favorite => favorite.property_id === propertyId);
    
    return { is_favorite: isFavorite };
  } catch (error) {
    console.error('خطا در بررسی وضعیت علاقه‌مندی:', error);
    // در صورت خطا، false برگردان
    return { is_favorite: false };
  }
};
