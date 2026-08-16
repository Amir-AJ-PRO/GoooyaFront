import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthenticatedFetch } from '@/hooks/useAuthenticatedFetch';
import { 
  CreateVisitTicketPayload, 
  CreateVisitTicketResponse, 
  DuplicateVisitTicketError 
} from '@/types/property';

function normalizeVisitTicketResponse(data: Record<string, unknown>): CreateVisitTicketResponse {
  const payload = (data.data ?? data) as Record<string, unknown>;
  return {
    ...payload,
    message:
      (typeof data.message === 'string' ? data.message : undefined) ??
      (typeof payload.message === 'string' ? payload.message : undefined) ??
      'درخواست بازدید با موفقیت ثبت شد',
  };
}

/**
 * Hook برای مدیریت تیکت‌های بازدید ملک - نسخه امن
 */
export const useVisitTickets = () => {
  const { isAuthenticated } = useAuth();
  const { authenticatedFetch } = useAuthenticatedFetch();

  /**
   * ثبت تیکت بازدید جدید با slug در body
   */
  const createVisitTicket = useMutation<
    CreateVisitTicketResponse,
    Error | DuplicateVisitTicketError,
    CreateVisitTicketPayload
  >({
    mutationFn: async (payload: CreateVisitTicketPayload) => {
      if (!isAuthenticated) {
        throw new Error('نیاز به ورود به حساب کاربری دارید');
      }

      const response = await authenticatedFetch('/api/properties/visit-tickets/create/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        // اگر خطای تیکت تکراری باشد
        if (response.status === 400 && data.existing_ticket) {
          const error = new Error(data.error) as Error & DuplicateVisitTicketError;
          error.error = data.error;
          error.existing_ticket = data.existing_ticket;
          throw error;
        }
        
        // خطاهای مختلف بر اساس status code
        let errorMessage = data.error || 'خطا در ثبت درخواست بازدید';
        
        switch (response.status) {
          case 401:
            errorMessage = 'نیاز به ورود مجدد به حساب کاربری دارید';
            break;
          case 404:
            errorMessage = 'ملک یافت نشد یا در دسترس نیست';
            break;
          case 403:
            errorMessage = 'شما مجوز دسترسی به این عملیات را ندارید';
            break;
          case 500:
            errorMessage = 'خطای داخلی سرور. لطفاً دوباره تلاش کنید';
            break;
        }
        
        throw new Error(errorMessage);
      }

      return normalizeVisitTicketResponse(data);
    },
  });

  /**
   * ثبت تیکت بازدید با slug در URL (پشتیبانی از slug های فارسی)
   */
  const createVisitTicketBySlug = useMutation<
    CreateVisitTicketResponse,
    Error | DuplicateVisitTicketError,
    string
  >({
    mutationFn: async (propertySlug: string) => {
      if (!isAuthenticated) {
        throw new Error('نیاز به ورود به حساب کاربری دارید');
      }

      // Encode Persian characters for URL
      const encodedSlug = encodeURIComponent(propertySlug);

      const response = await authenticatedFetch(`/api/properties/${encodedSlug}/visit/`, {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        // اگر خطای تیکت تکراری باشد
        if (response.status === 400 && data.existing_ticket) {
          const error = new Error(data.error) as Error & DuplicateVisitTicketError;
          error.error = data.error;
          error.existing_ticket = data.existing_ticket;
          throw error;
        }
        
        // خطاهای مختلف بر اساس status code
        let errorMessage = data.error || 'خطا در ثبت درخواست بازدید';
        
        switch (response.status) {
          case 401:
            errorMessage = 'نیاز به ورود مجدد به حساب کاربری دارید';
            break;
          case 404:
            errorMessage = 'ملک یافت نشد یا در دسترس نیست';
            break;
          case 403:
            errorMessage = 'شما مجوز دسترسی به این عملیات را ندارید';
            break;
          case 500:
            errorMessage = 'خطای داخلی سرور. لطفاً دوباره تلاش کنید';
            break;
        }
        
        throw new Error(errorMessage);
      }

      return normalizeVisitTicketResponse(data);
    },
  });

  return {
    // Method 1: با slug در body
    createVisitTicket,
    isCreating: createVisitTicket.isPending,
    createError: createVisitTicket.error,
    
    // Method 2: با slug در URL
    createVisitTicketBySlug,
    isCreatingBySlug: createVisitTicketBySlug.isPending,
    createBySlugError: createVisitTicketBySlug.error,
  };
};
