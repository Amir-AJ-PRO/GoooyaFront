/**
 * انواع و Interfaces مربوط به املاک
 */

export type TransactionType = 'sale' | 'rent';
export type ShowStatus = 'ok' | 'pending' | 'sold' | 'not';

export interface PropertyImage {
  id?: number;
  image: string;
  is_main: boolean;
}

export interface PropertyType {
  id: number;
  title: string;
}

export interface City {
  id: number;
  name: string;
  province?: string;
}

export interface Location {
  id: number;
  name: string;
  city: number;
  city_name: string;
}

export interface Property {
  id: number;
  title: string;
  slug: string;
  
  // فیلدهای محاسبه شده (Computed Fields)
  address?: string | null; // محاسبه شده: "شهر، منطقه"
  location_iframe?: string | null; // محاسبه شده: iframe از منطقه
  
  measure: string | number;
  year_built?: number;
  floor?: string;
  rooms: number;
  document_type?: string;
  transaction_type: TransactionType;
  price?: number | null;
  price_per_meter?: number;
  mortgage?: number;
  rent?: number;
  agreed_price?: boolean;
  exchange?: boolean;
  urgent?: boolean;
  under_price?: boolean;
  has_parking: boolean;
  has_storage: boolean;
  has_elevator: boolean;
  has_balcony?: boolean;
  description?: string;
  show_status: ShowStatus;
  
  // Relations
  city: string; // نام شهر
  location?: string; // نام منطقه
  property_type: string; // نام نوع ملک
  agent: AgentInfo; // اطلاعات کامل مشاور
  agent_image?: string; // URL تصویر agent (برای backward compatibility)
  
  // فیلد جدید برای وضعیت علاقه‌مندی
  is_favorite: boolean;
  
  images: PropertyImage[];
  created_at: string;
  updated_at: string;
}

export interface PropertyListItem {
  id: number;
  title: string;
  slug: string;
  address?: string;
  measure: string;
  rooms: number;
  price?: number;
  mortgage?: number;
  rent?: number;
  transaction_type: TransactionType;
  city: string | {
    id: number;
    name: string;
  };
  location?: string | {
    id: number;
    name: string;
  };
  property_type: string | {
    id: number;
    title: string;
  };
  agent?: string;
  agent_image?: string;
  images: PropertyImage[];
  created_at: string;
  updated_at: string;
}

export interface AgentInfo {
  id: number;
  full_name: string;
  phone?: string | null;
  profile_image?: string | null;
  office_name?: string | null;
  office_address?: string | null;
  office_phone?: string | null;
  city?: number | null;
  city_name?: string | null;
  region?: number | null;
  region_name?: string | null;
  years_of_experience: number; // پیش‌فرض: 0
  specialties?: string | null;
  bio?: string | null;
  website?: string | null;
  instagram?: string | null;
  is_verified: boolean;
  is_goooya_adviser: boolean;
}

/**
 * Payload برای ایجاد ملک جدید
 */
export interface CreatePropertyPayload {
  // فیلدهای اجباری
  title: string;
  slug: string;
  property_type: number;
  city: number;
  measure: string | number;
  rooms: number;
  transaction_type: TransactionType;
  uploaded_images: File[];
  main_image_index: number;
  description: string; // اجباری - توضیحات ملک
  
  // فیلدهای اختیاری
  location?: number;
  address?: string;
  price?: number | null; // می‌تواند null باشد (قیمت توافقی)
  mortgage?: number;
  rent?: number;
  year_built?: number;
  floor?: string;
  document_type?: string;
  has_parking?: boolean;
  has_storage?: boolean;
  has_elevator?: boolean;
  show_status?: ShowStatus;
}

/**
 * Form Data برای مراحل مختلف
 */
export interface PropertyFormStep1 {
  title: string;
  slug: string;
  property_type: number;
  city: number;
  measure: string;
  rooms: number;
  transaction_type: TransactionType;
  price?: number;
  mortgage?: number;
  rent?: number;
  uploaded_images: File[];
  main_image_index: number;
}

export interface PropertyFormStep2 {
  location?: number;
  address?: string;
  description?: string;
  year_built?: number;
  floor?: string;
  document_type?: string;
}

export interface PropertyFormStep3 {
  has_parking: boolean;
  has_storage: boolean;
  has_elevator: boolean;
}
