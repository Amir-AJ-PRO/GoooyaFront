/**
 * API Service برای مدیریت املاک
 */

import { API_BASE_URL } from '@/lib/constants';
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
  
  // اضافه کردن تصاویر
  payload.uploaded_images.forEach((file) => {
    formData.append('uploaded_images', file);
  });
  
  // فیلدهای اختیاری
  if (payload.location) formData.append('location', payload.location.toString());
  if (payload.address) formData.append('address', payload.address);
  if (payload.price) formData.append('price', payload.price.toString());
  if (payload.mortgage) formData.append('mortgage', payload.mortgage.toString());
  if (payload.rent) formData.append('rent', payload.rent.toString());
  if (payload.description) formData.append('description', payload.description);
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
  
  if (!response.ok) {
    throw new Error(data.detail || 'خطا در ثبت ملک');
  }
  
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
 * دریافت لیست تمام املاک
 */
export const getProperties = async (): Promise<PropertyListItem[]> => {
  const response = await fetch(`${API_BASE_URL}/api/properties/list/`);
  
  if (!response.ok) {
    throw new Error('خطا در دریافت لیست املاک');
  }
  
  return response.json();
};

/**
 * دریافت جزئیات یک ملک با slug
 */
export const getPropertyBySlug = async (slug: string): Promise<Property> => {
  const response = await fetch(`${API_BASE_URL}/api/properties/${slug}/`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('ملک مورد نظر یافت نشد');
    }
    throw new Error('خطا در دریافت جزئیات ملک');
  }
  
  return response.json();
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

