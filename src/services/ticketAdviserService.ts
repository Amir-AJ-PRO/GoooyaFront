import api from '@/lib/api';

/**
 * تیکت ملک برای مشاور گویا
 */
export interface AdviserTicket {
  id: number;
  title: string;
  status: 'pending' | 'assigned' | 'reviewing' | 'approved' | 'rejected' | 'published';
  city: number;
  city_name: string;
  location?: number;
  location_name?: string;
  property_type: number;
  property_type_title: string;
  address?: string;
  measure: number;
  rooms: number;
  transaction_type: 'sale' | 'rent';
  price?: number;
  mortgage?: number;
  rent?: number;
  description?: string;
  has_parking?: boolean;
  has_storage?: boolean;
  has_elevator?: boolean;
  has_balcony?: boolean;
  has_pool?: boolean;
  has_security?: boolean;
  has_gas?: boolean;
  has_electricity?: boolean;
  assigned_agent?: number;
  assigned_agent_name?: string;
  user?: number;
  user_phone?: string;
  images?: Array<{
    id: number;
    image: string;
    is_main: boolean;
  }>;
  agent_notes?: string;
  assigned_at?: string;
  reviewed_at?: string;
  created_at: string;
}

/**
 * لیست تیکت‌های مشاور گویا
 */
export const getAdviserTickets = async (status?: string): Promise<AdviserTicket[]> => {
  const params = status ? { status } : {};
  const response = await api.get('/api/tickets/adviser/list/', { params });
  return response.data;
};

/**
 * دریافت تعداد تیکت‌های در انتظار
 */
export const getAdviserTicketsCount = async (): Promise<number> => {
  const tickets = await getAdviserTickets('assigned');
  return tickets.length;
};

/**
 * دریافت جزئیات تیکت
 */
export const getAdviserTicketDetail = async (ticketId: number): Promise<AdviserTicket> => {
  const response = await api.get(`/api/tickets/adviser/${ticketId}/`);
  return response.data;
};

/**
 * پارامترهای بررسی تیکت
 * مطابق با API: PATCH /api/tickets/adviser/<ticket_id>/review/
 */
export interface ReviewTicketPayload {
  /** "approve" برای تایید یا "reject" برای رد */
  action: 'approve' | 'reject';
  /** یادداشت مشاور (اختیاری) */
  agent_notes?: string;
}

/**
 * پاسخ API تایید/رد تیکت
 */
export interface ReviewTicketResponse {
  /** پیام موفقیت */
  detail: string;
  /** اطلاعات تیکت به‌روزرسانی شده */
  ticket: {
    id: number;
    title: string;
    status: 'published' | 'rejected' | 'approved';
    property_created?: number;
    agent_notes?: string;
    reviewed_at: string;
  };
}

/**
 * بررسی و تایید/رد تیکت
 * 
 * @param ticketId - شناسه تیکت
 * @param payload - داده‌های بررسی (action و agent_notes)
 * @returns پاسخ API شامل detail و ticket
 * 
 * @throws 400 - اگر action نامعتبر باشد یا وضعیت تیکت مناسب نباشد
 * @throws 401 - اگر احراز هویت نشده باشد
 * @throws 403 - اگر کاربر مشاور گویا نباشد
 * @throws 404 - اگر تیکت یافت نشود
 */
export const reviewTicket = async (
  ticketId: number,
  payload: ReviewTicketPayload
): Promise<ReviewTicketResponse> => {
  const response = await api.patch(`/api/tickets/adviser/${ticketId}/review/`, payload);
  return response.data;
};

