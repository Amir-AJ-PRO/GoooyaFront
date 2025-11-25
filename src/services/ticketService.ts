import apiClient from '@/lib/api';

/**
 * Types برای Ticket API
 */

export interface SimpleTicketPayload {
  full_name?: string;
  phone?: string;
  is_referral?: boolean;
}

export interface SimpleTicketResponse {
  detail: string;
  ticket: {
    id: number;
    full_name: string;
    phone: string | null;
    is_referral: boolean;
    referral_code: string | null;
    status: string;
    created_at: string;
  };
  referral_code?: string;
}

export interface FullTicketPayload {
  title: string;
  property_type: number;
  city: number;
  location?: number;
  address?: string;
  measure: number;
  rooms?: number;
  transaction_type: 'sale' | 'rent';
  price?: number;
  mortgage?: number;
  rent?: number;
  description?: string;
  uploaded_images?: File[];
  main_image_index?: number;
  // اطلاعات تماس
  full_name?: string;
  phone?: string;
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

export interface FullTicketResponse {
  detail: string;
  ticket: {
    id: number;
    title: string;
    status: string;
    city: number;
    city_name: string;
    location: number | null;
    location_name: string | null;
    property_type: number;
    property_type_title: string;
    measure: number;
    rooms: number;
    price: number | null;
    transaction_type: string;
    assigned_agent: number | null;
    assigned_agent_name: string | null;
    assigned_at: string | null;
    created_at: string;
  };
}

/**
 * ثبت تیکت ساده
 */
export const submitSimpleTicket = async (
  payload: SimpleTicketPayload
): Promise<SimpleTicketResponse> => {
  const response = await apiClient.post<SimpleTicketResponse>(
    '/api/tickets/simple/',
    payload
  );
  return response.data;
};

/**
 * ثبت تیکت کامل
 */
export const submitFullTicket = async (
  payload: FullTicketPayload
): Promise<FullTicketResponse> => {
  const formData = new FormData();

  // اضافه کردن فیلدهای ساده
  Object.keys(payload).forEach((key) => {
    const value = payload[key as keyof FullTicketPayload];
    
    if (key === 'uploaded_images') {
      return; // Skip - بعداً اضافه می‌کنیم
    }
    
    if (value !== undefined && value !== null && value !== '') {
      formData.append(key, value.toString());
    }
  });

  // اضافه کردن تصاویر
  if (payload.uploaded_images && payload.uploaded_images.length > 0) {
    payload.uploaded_images.forEach((file) => {
      formData.append('uploaded_images', file);
    });
    
    if (payload.main_image_index !== undefined) {
      formData.append('main_image_index', payload.main_image_index.toString());
    }
  }

  const response = await apiClient.post<FullTicketResponse>(
    '/api/tickets/full/',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export default {
  submitSimpleTicket,
  submitFullTicket,
};

