/**
 * انواع و interfaces مربوط به علاقه‌مندی‌ها
 */

import { Property } from './property';

/**
 * آیتم علاقه‌مندی در لیست
 */
export interface FavoriteItem {
  id: number;
  property_id: number;
  property_slug?: string; // اسلاگ ملک برای لینک (اگر backend برگردونه)
  property_title: string;
  property_price?: number | null;
  property_address?: string | null;
  property_city: string;
  property_type: string;
  main_image?: string | null;
  created_at: string;
}

/**
 * پاسخ لیست علاقه‌مندی‌ها
 */
export interface FavoritesListResponse {
  count: number;
  next?: string | null;
  previous?: string | null;
  results: FavoriteItem[];
}

/**
 * پاسخ اضافه کردن به علاقه‌مندی‌ها
 */
export interface AddToFavoritesResponse {
  id: number;
  property: {
    id: number;
    title: string;
    price?: number | null;
    address?: string | null;
    city: {
      id: number;
      name: string;
    };
    property_type: {
      id: number;
      name: string;
    };
    main_image?: string | null;
  };
  created_at: string;
}

/**
 * پاسخ toggle علاقه‌مندی
 */
export interface ToggleFavoriteResponse {
  action: 'added' | 'removed';
  is_favorite: boolean;
  favorite_id?: number | null;
  message: string;
}

/**
 * درخواست اضافه کردن به علاقه‌مندی‌ها
 */
export interface AddToFavoritesRequest {
  property_id: number;
}

/**
 * آمار علاقه‌مندی‌ها
 */
export interface FavoritesStats {
  total_favorites: number;
  favorites_by_type: {
    [key: string]: number;
  };
  favorites_by_city: {
    [key: string]: number;
  };
}

/**
 * پارامترهای جستجو در علاقه‌مندی‌ها
 */
export interface FavoritesSearchParams {
  page?: number;
  page_size?: number;
  property_type?: string;
  city?: string;
  min_price?: number;
  max_price?: number;
}
