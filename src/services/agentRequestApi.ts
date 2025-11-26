/**
 * API Service برای درخواست تبدیل به agent
 */

import { apiClient } from '@/lib/api';
import { API_BASE_URL } from '@/lib/constants';

/**
 * Interface برای درخواست agent
 */
export interface AgentRequestPayload {
  full_name: string;
  phone: string;
  email?: string;
  national_id?: string;
  license_number?: string;
  office_name?: string;
  office_address?: string;
  office_phone?: string;
  city?: string | number;
  region?: string | number;
  years_of_experience?: number;
  specialties?: string;
  bio?: string;
}

/**
 * Interface برای پاسخ درخواست agent
 */
export interface AgentRequestResponse {
  detail: string;
  ticket: {
    id: number;
    user: number;
    user_phone: string;
    full_name: string;
    phone: string;
    email?: string;
    national_id?: string;
    license_number?: string;
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
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
  };
}

/**
 * ارسال درخواست تبدیل به agent
 * 
 * @param payload - داده‌های درخواست
 * @returns پاسخ API شامل ticket ایجاد شده
 * @throws Error در صورت خطا
 */
export const submitAgentRequest = async (
  payload: AgentRequestPayload
): Promise<AgentRequestResponse> => {
  try {
    // تبدیل city و region به number اگر string هستند
    const requestData: Record<string, unknown> = {
      full_name: payload.full_name,
      phone: payload.phone,
    };

    if (payload.email) requestData.email = payload.email;
    if (payload.national_id) requestData.national_id = payload.national_id;
    if (payload.license_number) requestData.license_number = payload.license_number;
    if (payload.office_name) requestData.office_name = payload.office_name;
    if (payload.office_address) requestData.office_address = payload.office_address;
    if (payload.office_phone) requestData.office_phone = payload.office_phone;
    
    // تبدیل city به number
    if (payload.city) {
      requestData.city = typeof payload.city === 'string' 
        ? parseInt(payload.city, 10) 
        : payload.city;
    }
    
    // تبدیل region به number
    if (payload.region) {
      requestData.region = typeof payload.region === 'string' 
        ? parseInt(payload.region, 10) 
        : payload.region;
    }
    
    if (payload.years_of_experience !== undefined) {
      requestData.years_of_experience = payload.years_of_experience;
    }
    if (payload.specialties) requestData.specialties = payload.specialties;
    if (payload.bio) requestData.bio = payload.bio;

    const response = await apiClient.post<AgentRequestResponse>(
      '/api/tickets/agent-request/',
      requestData
    );

    return response.data;
  } catch (error) {
    // مدیریت خطاهای validation
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: unknown; status?: number } };
      
      if (axiosError.response?.status === 400) {
        const errorData = axiosError.response.data;
        if (typeof errorData === 'object' && errorData !== null) {
          // استخراج پیام‌های خطا
          const errorMessages: string[] = [];
          
          for (const [key, value] of Object.entries(errorData)) {
            if (Array.isArray(value)) {
              errorMessages.push(...value.map((msg) => `${key}: ${msg}`));
            } else if (typeof value === 'string') {
              errorMessages.push(value);
            }
          }
          
          if (errorMessages.length > 0) {
            throw new Error(errorMessages.join('\n'));
          }
        }
        throw new Error('اطلاعات وارد شده معتبر نیست. لطفاً دوباره تلاش کنید.');
      }
      
      if (axiosError.response?.status === 401) {
        throw new Error('لطفاً ابتدا وارد حساب کاربری خود شوید.');
      }
      
      if (axiosError.response?.status === 403) {
        throw new Error('شما نمی‌توانید درخواست agent بدهید. ممکن است قبلاً agent باشید یا دسترسی لازم را نداشته باشید.');
      }
    }
    
    throw error;
  }
};



