/**
 * انواع و interfaces مربوط به جستجوی پیشرفته
 */

import { Property } from './property';

/**
 * پارامترهای جستجوی پیشرفته
 */
export interface SearchParams {
  // جستجوی متنی
  q?: string;
  
  // فیلترهای مکانی
  city?: number;
  location?: number;
  
  // فیلترهای ملک
  property_type?: number;
  transaction_type?: 'sale' | 'rent';
  
  // فیلترهای قیمت
  min_price?: number;
  max_price?: number;
  
  // فیلترهای متراژ
  min_measure?: number;
  max_measure?: number;
  
  // فیلترهای اتاق
  rooms?: number;
  min_rooms?: number;
  
  // فیلترهای سال ساخت
  min_year_built?: number;
  max_year_built?: number;
  
  // امکانات
  has_parking?: boolean;
  has_storage?: boolean;
  has_elevator?: boolean;
  has_balcony?: boolean;
  has_pool?: boolean;
  has_security?: boolean;
  
  // ویژگی‌های خاص
  urgent?: boolean;
  under_price?: boolean;
  exchange?: boolean;
  
  // Pagination
  page?: number;
  page_size?: number;
  
  // مرتب‌سازی
  sort_by?: 'created_at' | '-created_at' | 'price' | '-price' | 'measure' | '-measure' | '_score';
}

/**
 * نتیجه جستجوی پیشرفته
 */
export interface SearchResult {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: PropertySearchItem[];
  warning?: string; // برای fallback به database
}

/**
 * آیتم ملک در نتایج جستجو
 */
export interface PropertySearchItem {
  id: number;
  title: string;
  slug: string;
  address: string;
  measure: string;
  rooms: number;
  price: number;
  transaction_type: 'sale' | 'rent';
  city: string;
  location: string;
  property_type: string;
  images: PropertySearchImage[];
  created_at: string;
  updated_at: string;
}

/**
 * تصویر ملک در نتایج جستجو
 */
export interface PropertySearchImage {
  id: number;
  image: string;
  is_main: boolean;
}

/**
 * پیکربندی Elasticsearch
 */
export interface ElasticsearchConfig {
  host: string;
  index: string;
  timeout?: number;
}

/**
 * Query Elasticsearch
 */
export interface ElasticsearchQuery {
  query: {
    bool: {
      must?: any[];
      filter?: any[];
      should?: any[];
      minimum_should_match?: number;
    };
  };
  sort?: any[];
  from?: number;
  size?: number;
}

/**
 * پاسخ Elasticsearch
 */
export interface ElasticsearchResponse {
  hits: {
    total: {
      value: number;
    };
    hits: Array<{
      _source: any;
      _score: number;
    }>;
  };
}

/**
 * خطای Elasticsearch
 */
export interface ElasticsearchError {
  message: string;
  status?: number;
}
