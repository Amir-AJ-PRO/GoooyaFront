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
  address?: string;
  measure: string | number;
  year_built?: number;
  floor?: string;
  rooms: number;
  document_type?: string;
  transaction_type: TransactionType;
  price?: number;
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
  
  // Relations (می‌تواند ID، Object یا String باشد)
  city: number | City | string;
  location?: number | Location | string;
  property_type: number | PropertyType | string;
  agent?: number | AgentInfo;
  agent_image?: string; // URL تصویر agent (برای backward compatibility)
  
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
  phone: string;
  profile_image?: string;
  office_name?: string;
  office_address?: string;
  office_phone?: string;
  city?: number;
  city_name?: string;
  region?: number;
  region_name?: string;
  years_of_experience?: number;
  specialties?: string;
  bio?: string;
  website?: string;
  instagram?: string;
  is_verified?: boolean;
  is_goooya_adviser?: boolean;
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
