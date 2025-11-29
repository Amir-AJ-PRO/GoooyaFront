/**
 * مدیریت Index Elasticsearch برای املاک
 */

import { 
  createIndex, 
  indexDocument, 
  updateDocument, 
  deleteDocument,
  isElasticsearchAvailable 
} from './elasticsearch';
import { Property } from '@/types/property';
import { apiClient } from './api';

/**
 * تبدیل Property به سند Elasticsearch
 */
export const propertyToElasticsearchDocument = (property: Property): any => {
  const anyProperty = property as any;

  return {
    id: anyProperty.id,
    title: anyProperty.title,
    slug: anyProperty.slug,
    address: anyProperty.address || '',
    description: anyProperty.description || '',
    measure: parseFloat(anyProperty.measure.toString()),
    rooms: anyProperty.rooms,
    price: anyProperty.price || 0,
    transaction_type: anyProperty.transaction_type,
    year_built: anyProperty.year_built,
    floor: anyProperty.floor,
    
    // Relations - استخراج ID و نام
    city_id: typeof anyProperty.city === 'object' ? anyProperty.city.id : anyProperty.city,
    city_name: typeof anyProperty.city === 'object' ? anyProperty.city.name : anyProperty.city,
    location_id: typeof anyProperty.location === 'object' ? anyProperty.location?.id : anyProperty.location,
    location_name: typeof anyProperty.location === 'object' ? anyProperty.location?.city_name : anyProperty.location,
    property_type_id: typeof anyProperty.property_type === 'object' ? anyProperty.property_type.id : anyProperty.property_type,
    property_type_name: typeof anyProperty.property_type === 'object' ? anyProperty.property_type.name : anyProperty.property_type,
    
    // Boolean fields
    has_parking: property.has_parking || false,
    has_storage: property.has_storage || false,
    has_elevator: property.has_elevator || false,
    has_balcony: property.has_balcony || false,
    urgent: property.urgent || false,
    under_price: property.under_price || false,
    exchange: property.exchange || false,
    
    // Status
    show_status: property.show_status,
    
    // Images
    images: property.images || [],
    
    // Timestamps
    created_at: property.created_at,
    updated_at: property.updated_at,
  };
};

/**
 * ایجاد یا بروزرسانی Index
 */
export const initializeSearchIndex = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const isAvailable = await isElasticsearchAvailable();
    
    if (!isAvailable) {
      return {
        success: false,
        message: 'Elasticsearch در دسترس نیست'
      };
    }
    
    await createIndex();
    
    return {
      success: true,
      message: 'Index با موفقیت ایجاد شد'
    };
  } catch (error) {
    console.error('خطا در ایجاد Index:', error);
    return {
      success: false,
      message: `خطا در ایجاد Index: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`
    };
  }
};

/**
 * Index کردن تمام املاک از Django backend
 */
export const populateSearchIndex = async (): Promise<{ 
  success: boolean; 
  message: string; 
  indexed: number;
  errors: number;
}> => {
  try {
    const isAvailable = await isElasticsearchAvailable();
    
    if (!isAvailable) {
      return {
        success: false,
        message: 'Elasticsearch در دسترس نیست',
        indexed: 0,
        errors: 0
      };
    }
    
    let page = 1;
    let indexed = 0;
    let errors = 0;
    const pageSize = 100;
    
    while (true) {
      try {
        // دریافت املاک از Django backend
        const response = await apiClient.get(`/v1/properties/?page=${page}&page_size=${pageSize}&show_status=ok`);
        const properties = response.data.results;
        
        if (!properties || properties.length === 0) {
          break; // پایان داده‌ها
        }
        
        // Index کردن هر ملک
        for (const property of properties) {
          try {
            const document = propertyToElasticsearchDocument(property);
            await indexDocument(property.id, document);
            indexed++;
          } catch (error) {
            console.error(`خطا در index کردن ملک ${property.id}:`, error);
            errors++;
          }
        }
        
        page++;
        
        // اگر تعداد نتایج کمتر از pageSize بود، پایان داده‌ها
        if (properties.length < pageSize) {
          break;
        }
      } catch (error) {
        console.error(`خطا در دریافت صفحه ${page}:`, error);
        errors++;
        break;
      }
    }
    
    return {
      success: true,
      message: `Index کردن کامل شد. ${indexed} ملک index شد، ${errors} خطا`,
      indexed,
      errors
    };
  } catch (error) {
    console.error('خطا در populate کردن Index:', error);
    return {
      success: false,
      message: `خطا در populate کردن Index: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`,
      indexed: 0,
      errors: 0
    };
  }
};

/**
 * Index کردن یک ملک
 */
export const indexProperty = async (property: Property): Promise<{ success: boolean; message: string }> => {
  try {
    const isAvailable = await isElasticsearchAvailable();
    
    if (!isAvailable) {
      return {
        success: false,
        message: 'Elasticsearch در دسترس نیست'
      };
    }
    
    // فقط املاک با وضعیت 'ok' index می‌شوند
    if (property.show_status !== 'ok') {
      // اگر ملک قبلاً index شده بود، حذفش کن
      await deletePropertyFromIndex(property.id);
      return {
        success: true,
        message: 'ملک از Index حذف شد (وضعیت غیرفعال)'
      };
    }
    
    const document = propertyToElasticsearchDocument(property);
    await indexDocument(property.id, document);
    
    return {
      success: true,
      message: 'ملک با موفقیت index شد'
    };
  } catch (error) {
    console.error('خطا در index کردن ملک:', error);
    return {
      success: false,
      message: `خطا در index کردن ملک: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`
    };
  }
};

/**
 * بروزرسانی یک ملک در Index
 */
export const updatePropertyInIndex = async (property: Property): Promise<{ success: boolean; message: string }> => {
  try {
    const isAvailable = await isElasticsearchAvailable();
    
    if (!isAvailable) {
      return {
        success: false,
        message: 'Elasticsearch در دسترس نیست'
      };
    }
    
    // اگر وضعیت ملک 'ok' نیست، از Index حذفش کن
    if (property.show_status !== 'ok') {
      await deletePropertyFromIndex(property.id);
      return {
        success: true,
        message: 'ملک از Index حذف شد (وضعیت غیرفعال)'
      };
    }
    
    const document = propertyToElasticsearchDocument(property);
    await updateDocument(property.id, document);
    
    return {
      success: true,
      message: 'ملک در Index بروزرسانی شد'
    };
  } catch (error) {
    console.error('خطا در بروزرسانی ملک در Index:', error);
    return {
      success: false,
      message: `خطا در بروزرسانی ملک: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`
    };
  }
};

/**
 * حذف یک ملک از Index
 */
export const deletePropertyFromIndex = async (propertyId: number): Promise<{ success: boolean; message: string }> => {
  try {
    const isAvailable = await isElasticsearchAvailable();
    
    if (!isAvailable) {
      return {
        success: false,
        message: 'Elasticsearch در دسترس نیست'
      };
    }
    
    await deleteDocument(propertyId);
    
    return {
      success: true,
      message: 'ملک از Index حذف شد'
    };
  } catch (error) {
    console.error('خطا در حذف ملک از Index:', error);
    return {
      success: false,
      message: `خطا در حذف ملک: ${error instanceof Error ? error.message : 'خطای ناشناخته'}`
    };
  }
};

/**
 * بررسی وضعیت Index
 */
export const getIndexStatus = async (): Promise<{
  available: boolean;
  indexExists: boolean;
  documentCount?: number;
  error?: string;
}> => {
  try {
    const isAvailable = await isElasticsearchAvailable();
    
    if (!isAvailable) {
      return {
        available: false,
        indexExists: false,
        error: 'Elasticsearch در دسترس نیست'
      };
    }
    
    // TODO: بررسی وجود Index و تعداد اسناد
    // این قسمت نیاز به پیاده‌سازی بیشتر دارد
    
    return {
      available: true,
      indexExists: true,
      documentCount: 0 // TODO: دریافت تعداد واقعی اسناد
    };
  } catch (error) {
    return {
      available: false,
      indexExists: false,
      error: error instanceof Error ? error.message : 'خطای ناشناخته'
    };
  }
};
