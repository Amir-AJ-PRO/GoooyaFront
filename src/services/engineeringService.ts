/**
 * سرویس API برای خدمات مهندسی
 */

import { apiClient, handleApiError } from '@/lib/api';
import {
  CreateEngineeringTicketRequest,
  CreateEngineeringTicketResponse,
  DuplicateEngineeringTicketError,
} from '@/types/engineering';

/**
 * ثبت درخواست خدمات مهندسی
 */
export const createEngineeringTicket = async (
  data: CreateEngineeringTicketRequest
): Promise<CreateEngineeringTicketResponse> => {
  try {
    const response = await apiClient.post<CreateEngineeringTicketResponse>(
      '/api/tickets/engineering-service/',
      data
    );
    return response.data;
  } catch (error: any) {
    console.error('خطا در ثبت درخواست خدمات مهندسی:', error);
    
    // بررسی خطای درخواست تکراری
    if (error.response?.status === 400) {
      const errorMessage = error.response.data?.detail || error.response.data?.message;
      
      if (errorMessage && errorMessage.includes('قبلاً برای خدمت')) {
        const duplicateError = new Error(errorMessage) as DuplicateEngineeringTicketError;
        duplicateError.service_type = data.service_type;
        duplicateError.service_type_display = error.response.data?.service_type_display || '';
        throw duplicateError;
      }
    }
    
    throw new Error(handleApiError(error));
  }
};

/**
 * نرمال‌سازی شماره تلفن ایران
 */
export const normalizeIranPhone = (input: string): string | null => {
  if (!input) return null;
  
  // تبدیل ارقام فارسی به انگلیسی
  const persianToEnglish = (str: string) => {
    const map: Record<string, string> = {
      '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
      '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
    };
    return str.replace(/[۰-۹٠-٩]/g, (d) => map[d] ?? d);
  };

  let phone = input.trim();
  phone = persianToEnglish(phone);
  phone = phone.replace(/^\+/, "");
  phone = phone.replace(/[^0-9]/g, "");

  // بررسی فرمت‌های مختلف شماره ایران
  if (/^0?9\d{9}$/.test(phone)) {
    if (phone.length === 11 && phone.startsWith("0")) {
      phone = phone.slice(1);
    }
    return `09${phone.slice(1)}`;
  }

  if (/^98?9\d{9}$/.test(phone)) {
    if (phone.length === 12 && phone.startsWith("98")) {
      return `09${phone.slice(3)}`;
    }
    if (phone.length === 11 && phone.startsWith("9")) {
      return `09${phone.slice(1)}`;
    }
  }

  return null;
};

/**
 * اعتبارسنجی داده‌های فرم
 */
export const validateEngineeringForm = (data: {
  fullName: string;
  phone: string;
  serviceType: string;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // بررسی نام
  if (!data.fullName.trim()) {
    errors.fullName = 'نام و نام خانوادگی الزامی است';
  } else if (data.fullName.trim().length < 2) {
    errors.fullName = 'نام باید حداقل 2 کاراکتر باشد';
  }

  // بررسی شماره تلفن
  const normalizedPhone = normalizeIranPhone(data.phone);
  if (!normalizedPhone) {
    errors.phone = 'شماره تلفن معتبر وارد کنید (مثال: 09123456789)';
  }

  // بررسی نوع خدمت
  if (!data.serviceType) {
    errors.serviceType = 'انتخاب نوع خدمت الزامی است';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
