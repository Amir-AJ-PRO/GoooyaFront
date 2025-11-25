import apiClient from '@/lib/api';

/**
 * Types برای Agent API
 */

export interface AgentProfile {
  id: number;
  user: number;
  user_phone?: string;
  full_name: string;
  national_id: string | null;
  license_number: string | null;
  profile_image: string | null;
  phone: string | null;
  office_name: string | null;
  office_address: string | null;
  office_phone: string | null;
  city: string | null; // نام شهر (در response به صورت string برمی‌گردد)
  region: string | null; // نام منطقه (در response به صورت string برمی‌گردد)
  years_of_experience: number;
  specialties: string | null;
  bio: string | null;
  website: string | null;
  instagram: string | null;
  is_verified: boolean;
  is_goooya_adviser?: boolean;
  ranking?: number;
  locations_names?: string[];
  properties_count?: number;
  created_at: string;
  updated_at: string;
}

export interface PropertyImage {
  id: number;
  image: string;
  is_main: boolean;
}

export interface AgentProperty {
  id: number;
  title: string;
  slug: string;
  address?: string;
  measure: string;
  rooms: number;
  price: number;
  transaction_type: string;
  show_status: string;
  city: number | object;
  location: number | object;
  property_type: number | object;
  agent: number;
  images: PropertyImage[];
  created_at: string;
  updated_at: string;
  // Features
  has_parking?: boolean;
  has_storage?: boolean;
  has_elevator?: boolean;
  has_balcony?: boolean;
  has_pool?: boolean;
  has_jacuzzi?: boolean;
  has_sauna?: boolean;
  has_security?: boolean;
  has_janitor?: boolean;
  has_conference_hall?: boolean;
  has_gas?: boolean;
  has_electricity?: boolean;
  has_water?: boolean;
  has_phone?: boolean;
  has_wastewater?: boolean;
  has_license?: boolean;
  double_glazed_windows?: boolean;
  sound_insulation?: boolean;
  has_well?: boolean;
}

export interface UpdateAgentProfilePayload {
  full_name?: string;
  profile_image?: File | null;
  delete_profile_image?: boolean;
  office_name?: string;
  office_address?: string;
  office_phone?: string;
  city?: number; // ID شهر (ForeignKey)
  region?: number; // ID منطقه (ForeignKey)
  years_of_experience?: number;
  specialties?: string;
  bio?: string;
  website?: string;
  instagram?: string;
}

export interface UpdateAgentProfileResponse {
  detail: string;
  agent: AgentProfile;
}

/**
 * دریافت پروفایل agent
 */
export const getAgentProfile = async (): Promise<AgentProfile> => {
  const response = await apiClient.get<AgentProfile>('/api/agents/profile/');
  return response.data;
};

/**
 * دریافت لیست املاک agent
 */
export const getAgentProperties = async (): Promise<AgentProperty[]> => {
  const response = await apiClient.get<AgentProperty[]>('/api/agents/properties/');
  return response.data;
};

/**
 * بروزرسانی پروفایل agent
 */
export const updateAgentProfile = async (
  payload: UpdateAgentProfilePayload
): Promise<UpdateAgentProfileResponse> => {
  // اگر profile_image یا delete_profile_image وجود داشته باشد، از FormData استفاده کن
  const hasFile = payload.profile_image instanceof File;
  const shouldDelete = payload.delete_profile_image === true;
  
  if (hasFile || shouldDelete) {
  const formData = new FormData();
    
    Object.keys(payload).forEach((key) => {
      const value = payload[key as keyof UpdateAgentProfilePayload];
      
      if (key === 'profile_image' && value instanceof File) {
        formData.append('profile_image', value);
      } else if (key === 'delete_profile_image' && value === true) {
        formData.append('delete_profile_image', 'true');
      } else if (key !== 'profile_image' && key !== 'delete_profile_image') {
        // برای string ها: فقط اگر خالی نباشند
        if (typeof value === 'string' && value.trim() !== '') {
          formData.append(key, value);
        }
        // برای number ها: فقط اگر undefined نباشد
        else if (typeof value === 'number') {
          formData.append(key, value.toString());
        }
      }
    });
    
    console.log('FormData to API:', Array.from(formData.entries())); // برای debug
    
    const response = await apiClient.patch<UpdateAgentProfileResponse>(
      '/api/agents/profile/update/',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
  } else {
    // برای payload های بدون فایل، از JSON استفاده کن
    const jsonPayload: Record<string, any> = {};
    Object.keys(payload).forEach((key) => {
      const value = payload[key as keyof UpdateAgentProfilePayload];
      
      // Skip کردن فیلدهای مربوط به عکس
      if (key === 'profile_image' || key === 'delete_profile_image') {
        return;
      }
      
      // برای string ها: فقط اگر خالی نباشند
      if (typeof value === 'string' && value.trim() !== '') {
        jsonPayload[key] = value;
      }
      // برای number ها: فقط اگر undefined نباشد (0 هم valid است)
      else if (typeof value === 'number') {
        jsonPayload[key] = value;
      }
    });
    
    console.log('JSON Payload to API:', jsonPayload); // برای debug
    
    const response = await apiClient.patch<UpdateAgentProfileResponse>(
      '/api/agents/profile/update/',
      jsonPayload
    );
    return response.data;
  }
};

/**
 * Types برای بروزرسانی ملک
 */
export interface UpdatePropertyPayload {
  title?: string;
  slug?: string;
  address?: string;
  measure?: number;
  year_built?: number;
  floor?: string;
  rooms?: number;
  document_type?: string;
  transaction_type?: 'sale' | 'rent';
  price?: number;
  mortgage?: number;
  rent?: number;
  price_per_meter?: number;
  agreed_price?: boolean;
  exchange?: boolean;
  urgent?: boolean;
  under_price?: boolean;
  description?: string;
  goooya_description?: string;
  city?: number;
  location?: number;
  property_type?: number;
  // Features
  has_parking?: boolean;
  has_storage?: boolean;
  has_elevator?: boolean;
  has_balcony?: boolean;
  has_pool?: boolean;
  has_jacuzzi?: boolean;
  has_sauna?: boolean;
  has_security?: boolean;
  has_janitor?: boolean;
  has_conference_hall?: boolean;
  has_gas?: boolean;
  has_electricity?: boolean;
  has_water?: boolean;
  has_phone?: boolean;
  has_wastewater?: boolean;
  has_license?: boolean;
  double_glazed_windows?: boolean;
  sound_insulation?: boolean;
  has_well?: boolean;
  // Images
  uploaded_images?: File[];
  main_image_index?: number;
  deleted_image_ids?: number[];
  set_main_image_id?: number;
}

/**
 * بروزرسانی ملک
 * مطابق با API Documentation: PATCH /api/properties/<slug>/update/
 * 
 * نکات:
 * - تمام پارامترها اختیاری هستند
 * - برای ویرایش بدون تصویر: از JSON استفاده می‌کند
 * - برای ویرایش با تصویر: از FormData استفاده می‌کند
 * - فقط agent صاحب ملک می‌تواند آن را ویرایش کند
 */
export const updateProperty = async (
  slug: string,
  payload: UpdatePropertyPayload
): Promise<AgentProperty> => {
  console.log('🔧 updateProperty called');
  console.log('📝 Slug:', slug);
  console.log('📦 Payload:', payload);

  // بررسی: آیا تغییری در تصاویر داریم؟
  const hasImageChanges = 
    (payload.uploaded_images && payload.uploaded_images.length > 0) ||
    (payload.deleted_image_ids && payload.deleted_image_ids.length > 0) ||
    payload.set_main_image_id !== undefined;

  console.log('🖼️ Has image changes:', hasImageChanges);

  // اگر تغییری در تصاویر داریم، از FormData استفاده کن
  if (hasImageChanges) {
    const formData = new FormData();

    // 1. اضافه کردن فیلدهای ساده (غیر از تصاویر)
    Object.entries(payload).forEach(([key, value]) => {
      // Skip image-related fields
      if (['uploaded_images', 'deleted_image_ids', 'main_image_index', 'set_main_image_id'].includes(key)) {
        return;
      }
      
      // فقط فیلدهایی که مقدار معتبر دارن
      if (value !== undefined && value !== null) {
        // برای boolean ها و number های 0
        if (typeof value === 'boolean' || typeof value === 'number') {
          formData.append(key, value.toString());
        } 
        // برای string ها فقط اگر خالی نباشن
        else if (typeof value === 'string' && value.trim() !== '') {
          formData.append(key, value);
        }
      }
    });

    // 2. اضافه کردن تصاویر جدید
    if (payload.uploaded_images && payload.uploaded_images.length > 0) {
      console.log(`📸 Adding ${payload.uploaded_images.length} new images`);
      payload.uploaded_images.forEach((file) => {
        formData.append('uploaded_images', file);
      });
      
      // اندیس تصویر اصلی در لیست تصاویر جدید
      if (payload.main_image_index !== undefined) {
        formData.append('main_image_index', payload.main_image_index.toString());
        console.log('⭐ Main image index:', payload.main_image_index);
      }
    }

    // 3. اضافه کردن ID های تصاویر حذفی
    if (payload.deleted_image_ids && payload.deleted_image_ids.length > 0) {
      console.log('🗑️ Deleting images:', payload.deleted_image_ids);
      payload.deleted_image_ids.forEach((id) => {
        formData.append('deleted_image_ids', id.toString());
      });
    }

    // 4. تنظیم تصویر موجود به عنوان اصلی
    if (payload.set_main_image_id !== undefined) {
      formData.append('set_main_image_id', payload.set_main_image_id.toString());
      console.log('⭐ Setting existing image as main:', payload.set_main_image_id);
    }

    // لاگ محتویات FormData
    console.log('📤 FormData entries:');
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`  ${key}: [File] ${value.name} (${value.size} bytes)`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }
    
    try {
      const response = await apiClient.patch<AgentProperty>(
        `/api/properties/${slug}/update/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('✅ Update successful:', response.status);
      return response.data;
    } catch (error: any) {
      console.error('❌ Update failed (FormData)');
      console.error('Status:', error?.response?.status);
      console.error('Data:', error?.response?.data);
      throw error;
    }
  } 
  // اگر فقط فیلدهای ساده تغییر کردن، از JSON استفاده کن
  else {
    const jsonPayload: Record<string, any> = {};

    Object.entries(payload).forEach(([key, value]) => {
      // Skip image-related fields
      if (['uploaded_images', 'deleted_image_ids', 'main_image_index', 'set_main_image_id'].includes(key)) {
        return;
      }
      
      // فقط فیلدهایی که مقدار معتبر دارن
      if (value !== undefined && value !== null) {
        // برای boolean ها و number های 0
        if (typeof value === 'boolean' || typeof value === 'number') {
          jsonPayload[key] = value;
        } 
        // برای string ها فقط اگر خالی نباشن
        else if (typeof value === 'string' && value.trim() !== '') {
          jsonPayload[key] = value;
        }
      }
    });

    console.log('📤 JSON payload:', jsonPayload);
    
    try {
      const response = await apiClient.patch<AgentProperty>(
        `/api/properties/${slug}/update/`,
        jsonPayload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('✅ Update successful:', response.status);
      return response.data;
    } catch (error: any) {
      console.error('❌ Update failed (JSON)');
      console.error('Status:', error?.response?.status);
      console.error('Data:', error?.response?.data);
      throw error;
    }
  }
};

/**
 * حذف ملک
 */
export const deleteProperty = async (slug: string): Promise<void> => {
  await apiClient.delete(`/api/properties/${slug}/delete/`);
};

export default {
  getAgentProfile,
  getAgentProperties,
  updateAgentProfile,
  updateProperty,
  deleteProperty,
};

