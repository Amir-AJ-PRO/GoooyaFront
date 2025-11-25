import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdviserTickets,
  getAdviserTicketsCount,
  getAdviserTicketDetail,
  reviewTicket,
  ReviewTicketPayload,
} from '@/services/ticketAdviserService';
import { toast } from 'sonner';

/**
 * دریافت لیست تیکت‌های مشاور
 */
export const useAdviserTickets = (status?: string) => {
  return useQuery({
    queryKey: ['adviserTickets', status],
    queryFn: () => getAdviserTickets(status),
    staleTime: 1000 * 60 * 2, // 2 دقیقه
  });
};

/**
 * دریافت تعداد تیکت‌های در انتظار
 */
export const useAdviserTicketsCount = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['adviserTicketsCount'],
    queryFn: getAdviserTicketsCount,
    staleTime: 1000 * 60 * 1, // 1 دقیقه
    refetchInterval: 1000 * 60 * 2, // هر 2 دقیقه رفرش شود
    enabled, // فقط وقتی enabled باشه query اجرا بشه
  });
};

/**
 * دریافت جزئیات تیکت
 */
export const useAdviserTicketDetail = (ticketId: number) => {
  return useQuery({
    queryKey: ['adviserTicket', ticketId],
    queryFn: () => getAdviserTicketDetail(ticketId),
    enabled: !!ticketId,
  });
};

/**
 * Hook برای بررسی و تایید/رد تیکت
 * 
 * استفاده:
 * ```tsx
 * const reviewMutation = useReviewTicket();
 * 
 * // تایید تیکت
 * await reviewMutation.mutateAsync({
 *   ticketId: 123,
 *   payload: {
 *     action: 'approve',
 *     agent_notes: 'ملک در شرایط خوبی است'
 *   }
 * });
 * 
 * // رد تیکت
 * await reviewMutation.mutateAsync({
 *   ticketId: 123,
 *   payload: {
 *     action: 'reject',
 *     agent_notes: 'اطلاعات ناقص است'
 *   }
 * });
 * ```
 */
export const useReviewTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, payload }: { ticketId: number; payload: ReviewTicketPayload }) =>
      reviewTicket(ticketId, payload),
    onSuccess: (data, variables) => {
      // تشخیص نوع عملیات از payload.action
      const isApprove = variables.payload.action === 'approve';
      const action = isApprove ? 'تایید و منتشر' : 'رد';
      const icon = isApprove ? '✅' : '❌';
      
      // نمایش پیام موفقیت
      toast.success(`${icon} تیکت با موفقیت ${action} شد`, {
        description: data.detail,
        duration: 5000,
      });
      
      // رفرش کش‌های مرتبط
      queryClient.invalidateQueries({ queryKey: ['adviserTickets'] });
      queryClient.invalidateQueries({ queryKey: ['adviserTicketsCount'] });
      queryClient.invalidateQueries({ queryKey: ['adviserTicket', variables.ticketId] });
    },
    onError: (error: any) => {
      // مدیریت خطاها مطابق داکیومنت
      let errorMessage = 'خطا در بررسی تیکت';
      
      if (error.response?.status === 400) {
        errorMessage = error.response?.data?.detail || 'action نامعتبر است یا وضعیت تیکت مناسب نیست';
      } else if (error.response?.status === 401) {
        errorMessage = 'احراز هویت نشده است. لطفاً دوباره وارد شوید';
      } else if (error.response?.status === 403) {
        errorMessage = 'شما مجاز به انجام این عملیات نیستید';
      } else if (error.response?.status === 404) {
        errorMessage = 'تیکت یافت نشد';
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }
      
      toast.error(errorMessage, {
        duration: 5000,
      });
    },
  });
};

