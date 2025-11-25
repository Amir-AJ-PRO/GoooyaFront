/**
 * API Service برای مدیریت املاک
 */

import { API_BASE_URL } from '@/lib/constants';
import { apiClient } from '@/lib/api';
import { 
  Property, 
  PropertyListItem,
  CreatePropertyPayload, 
  PropertyType, 
  City, 
  Location 
} from '@/types/property';

/**
 * تبدیل payload به FormData
 */
export const createPropertyFormData = (payload: CreatePropertyPayload): FormData => {
  const formData = new FormData();
  
  // فیلدهای اجباری
  formData.append('title', payload.title);
  formData.append('slug', payload.slug);
  formData.append('property_type', payload.property_type.toString());
  formData.append('city', payload.city.toString());
  formData.append('measure', payload.measure.toString());
  formData.append('rooms', payload.rooms.toString());
  formData.append('transaction_type', payload.transaction_type);
  formData.append('main_image_index', payload.main_image_index.toString());
  formData.append('description', payload.description);
  
  // اضافه کردن تصاویر
  payload.uploaded_images.forEach((file) => {
    formData.append('uploaded_images', file);
  });
  
  // فیلدهای اختیاری
  if (payload.location) formData.append('location', payload.location.toString());
  if (payload.address) formData.append('address', payload.address);
  
  // قیمت - اگر null باشه (قیمت توافقی)، اصلا نمیفرستیم
  if (payload.price !== undefined && payload.price !== null) {
    formData.append('price', payload.price.toString());
    console.log('💰 قیمت ملک:', payload.price);
  } else {
    console.log('🤝 قیمت توافقی فعال است - price ارسال نمی‌شود');
  }
  
  if (payload.mortgage) formData.append('mortgage', payload.mortgage.toString());
  if (payload.rent) formData.append('rent', payload.rent.toString());
  if (payload.year_built) formData.append('year_built', payload.year_built.toString());
  if (payload.floor) formData.append('floor', payload.floor);
  if (payload.document_type) formData.append('document_type', payload.document_type);
  
  // فیلدهای boolean
  if (payload.has_parking !== undefined) {
    formData.append('has_parking', payload.has_parking.toString());
  }
  if (payload.has_storage !== undefined) {
    formData.append('has_storage', payload.has_storage.toString());
  }
  if (payload.has_elevator !== undefined) {
    formData.append('has_elevator', payload.has_elevator.toString());
  }
  
  if (payload.show_status) formData.append('show_status', payload.show_status);
  
  return formData;
};

/**
 * ایجاد ملک جدید
 */
export const createProperty = async (
  payload: CreatePropertyPayload,
  token: string
): Promise<Property> => {
  const formData = createPropertyFormData(payload);
  
  const response = await fetch(`${API_BASE_URL}/api/properties/add/`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });
  
  const data = await response.json();
  
  // چاپ response در console
  console.log('========== Property Creation Response ==========');
  console.log('Status:', response.status);
  console.log('Status Text:', response.statusText);
  console.log('Response OK:', response.ok);
  console.log('Response Data:', data);
  console.log('================================================');
  
  if (!response.ok) {
    // Handle different serialized error formats from backend
    let errorMessage = 'خطا در ثبت ملک';
    
    // 1. اگر data رشته باشد
    if (typeof data === 'string') {
      errorMessage = data;
    } 
    // 2. اگر data.detail موجود باشد
    else if (data.detail) {
      if (typeof data.detail === 'string') {
        errorMessage = data.detail;
      } 
      // اگر detail یک آرایه باشد (validation errors)
      else if (Array.isArray(data.detail)) {
        const errors = data.detail.map((err: any) => {
          if (typeof err === 'string') return err;
          if (err.msg) return err.msg;
          if (err.message) return err.message;
          return JSON.stringify(err);
        });
        errorMessage = errors.join(' | ');
      }
      // اگر detail یک آبجکت باشد
      else if (typeof data.detail === 'object') {
        const errors = Object.entries(data.detail).map(([field, msg]) => {
          return `${field}: ${msg}`;
        });
        errorMessage = errors.join(' | ');
      }
    }
    // 3. اگر data.error موجود باشد
    else if (data.error) {
      errorMessage = typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
    }
    // 4. اگر data.message موجود باشد
    else if (data.message) {
      errorMessage = data.message;
    }
    // 5. Handle validation errors: { field: ["error1", "error2"] }
    else if (typeof data === 'object' && Object.keys(data).length > 0) {
      const errors = [];
      for (const [field, messages] of Object.entries(data)) {
        if (Array.isArray(messages)) {
          errors.push(`${field}: ${messages.join(', ')}`);
        } else if (typeof messages === 'string') {
          errors.push(`${field}: ${messages}`);
        } else if (messages && typeof messages === 'object') {
          errors.push(`${field}: ${JSON.stringify(messages)}`);
        }
      }
      if (errors.length > 0) {
        errorMessage = errors.join(' | ');
      }
    }
    
    console.log('🔴 خطای دریافت شده از سرور:', errorMessage);
    throw new Error(errorMessage);
  }
  
  console.log('✅ Property Created Successfully:', data);
  return data;
};

/**
 * دریافت لیست انواع املاک
 */
export const getPropertyTypes = async (): Promise<PropertyType[]> => {
  const response = await fetch(`${API_BASE_URL}/api/properties/options/property-types/`);
  
  if (!response.ok) {
    throw new Error('خطا در دریافت انواع املاک');
  }
  
  return response.json();
};

/**
 * دریافت لیست شهرها
 */
export const getCities = async (): Promise<City[]> => {
  const response = await fetch(`${API_BASE_URL}/api/properties/options/cities/`);
  
  if (!response.ok) {
    throw new Error('خطا در دریافت شهرها');
  }
  
  return response.json();
};

/**
 * دریافت لیست مناطق (با فیلتر اختیاری بر اساس شهر)
 */
export const getLocations = async (cityId?: number): Promise<Location[]> => {
  const url = cityId 
    ? `${API_BASE_URL}/api/properties/options/locations/?city=${cityId}`
    : `${API_BASE_URL}/api/properties/options/locations/`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('خطا در دریافت مناطق');
  }
  
  return response.json();
};

/**
 * Interface برای پاسخ paginated
 */
export interface PaginatedPropertiesResponse {
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
  results: PropertyListItem[];
}

/**
 * دریافت لیست تمام املاک با پشتیبانی از Pagination
 * 
 * @param page - شماره صفحه (پیش‌فرض: 1)
 * @param pageSize - تعداد نتایج در هر صفحه (پیش‌فرض: 20، حداکثر: 100)
 * @returns پاسخ paginated شامل results و metadata
 */
export const getProperties = async (
  page: number = 1,
  pageSize: number = 20
): Promise<PaginatedPropertiesResponse> => {
  // محدود کردن pageSize به حداکثر 100
  const validPageSize = Math.min(pageSize, 100);
  
  const url = new URL(`${API_BASE_URL}/api/properties/list/`);
  url.searchParams.append('page', page.toString());
  url.searchParams.append('page_size', validPageSize.toString());
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-store'
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ خطا در دریافت لیست املاک:', {
      status: response.status,
      statusText: response.statusText,
      error: errorText
    });
    throw new Error('خطا در دریافت لیست املاک');
  }
  
  const data = await response.json();
  
  // اگر پاسخ paginated است (دارای results)
  if (data && Array.isArray(data.results)) {
    const count = data.count || 0;
    const currentPage = data.page || page;
    const currentPageSize = data.page_size || validPageSize;
    
    // محاسبه total_pages اگر موجود نباشد
    const totalPages = data.total_pages || (count > 0 ? Math.ceil(count / currentPageSize) : 1);
    
    return {
      count,
      page: currentPage,
      page_size: currentPageSize,
      total_pages: totalPages,
      results: data.results as PropertyListItem[]
    };
  }
  
  // اگر خود پاسخ یک آرایه است (backward compatibility)
  if (Array.isArray(data)) {
    console.warn('⚠️ پاسخ به صورت آرایه مستقیم است (backward compatibility)');
    return {
      count: data.length,
      page: 1,
      page_size: data.length,
      total_pages: 1,
      results: data as PropertyListItem[]
    };
  }
  
  // در غیر این صورت آرایه خالی برگردان
  console.warn('⚠️ پاسخ غیرمنتظره از API (getProperties):', data);
  return {
    count: 0,
    page: page,
    page_size: validPageSize,
    total_pages: 0,
    results: []
  };
};

/**
 * دریافت جزئیات یک ملک با slug
 * 
 * این endpoint نیاز به احراز هویت دارد و برای هر بازدید، یک تیکت بازدید ثبت می‌شود.
 * 
 * @param slug - اسلاگ یکتای ملک (مثال: apartment-120-meter-region-1)
 * @returns جزئیات کامل ملک
 * @throws Error در صورت خطا (404: ملک یافت نشد، 401: نیاز به احراز هویت)
 */
export const getPropertyBySlug = async (slug: string): Promise<Property> => {
  try {
    console.log('📥 در حال دریافت جزئیات ملک:', slug);
    
    const response = await apiClient.get<Property>(`/api/properties/${slug}/`);
    
    console.log('✅ دریافت جزئیات ملک موفق:', {
      id: response.data.id,
      title: response.data.title,
      agent: response.data.agent ? 'دارد' : 'ندارد'
    });
    
    return response.data;
  } catch (error: any) {
    console.error('❌ خطا در دریافت جزئیات ملک:', {
      slug,
      status: error.response?.status,
      message: error.response?.data || error.message
    });
    
    // مدیریت خطاهای مختلف
    if (error.response?.status === 404) {
      throw new Error('ملک مورد نظر یافت نشد یا در حال حاضر قابل نمایش نیست');
    }
    
    if (error.response?.status === 401) {
      throw new Error('برای مشاهده جزئیات ملک، لطفاً وارد شوید');
    }
    
    // خطاهای دیگر
    const errorMessage = error.response?.data?.detail || 
                        error.response?.data?.message || 
                        error.message || 
                        'خطا در دریافت جزئیات ملک';
    
    throw new Error(errorMessage);
  }
};

/**
 * دریافت املاک برای نمایش در صفحه اصلی
 * GET /api/properties/homepage/
 * حداکثر 6 ملک با display_in_home=true
 */
export const getHomepageProperties = async (): Promise<PropertyListItem[]> => {
  const response = await fetch(`${API_BASE_URL}/api/properties/homepage/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    // برای client-side fetch، cache را از طریق React Query مدیریت می‌کنیم
    cache: 'no-store'
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ خطا در دریافت املاک صفحه اصلی:', {
      status: response.status,
      statusText: response.statusText,
      error: errorText
    });
    throw new Error('خطا در دریافت املاک صفحه اصلی');
  }
  
  const data = await response.json();
  
  console.log('📦 پاسخ کامل از API:', data);
  
  // اگر پاسخ paginated است (دارای results)، results را برگردان
  if (data && Array.isArray(data.results)) {
    console.log('✅ دریافت املاک صفحه اصلی (paginated):', {
      count: data.count,
      resultsCount: data.results.length,
      firstProperty: data.results[0]
    });
    return data.results as PropertyListItem[];
  }
  
  // اگر خود پاسخ یک آرایه است، مستقیماً برگردان
  if (Array.isArray(data)) {
    console.log('✅ دریافت املاک صفحه اصلی (آرایه مستقیم):', data.length);
    return data as PropertyListItem[];
  }
  
  // در غیر این صورت آرایه خالی برگردان
  console.warn('⚠️ پاسخ غیرمنتظره از API:', data);
  return [];
};

/**
 * تولید slug از عنوان
 */
export const generateSlug = (title: string): string => {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\u0600-\u06FFa-z0-9\-]/g, '')
    .substring(0, 250);
};

