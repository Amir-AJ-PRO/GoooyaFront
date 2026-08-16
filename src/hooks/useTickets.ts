import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { handleApiError } from '@/lib/api';
import {
  submitSimpleTicket,
  submitFullTicket,
  SimpleTicketPayload,
  FullTicketPayload,
  SimpleTicketResponse,
  FullTicketResponse,
} from '@/services/ticketService';

/**
 * Hook برای ثبت تیکت ساده
 */
export const useSubmitSimpleTicket = () => {
  return useMutation<SimpleTicketResponse, Error, SimpleTicketPayload>({
    mutationFn: submitSimpleTicket,
    onSuccess: (data) => {
      toast.success(data.detail || 'درخواست شما با موفقیت ثبت شد');
    },
    onError: (error) => {
      toast.error('خطا در ثبت درخواست', {
        description:
          error.message || handleApiError(error) || 'لطفاً اطلاعات را بررسی کنید',
        duration: 8000,
      });
    },
  });
};

/**
 * Hook برای ثبت تیکت کامل
 */
export const useSubmitFullTicket = () => {
  return useMutation<FullTicketResponse, Error, FullTicketPayload>({
    mutationFn: submitFullTicket,
    onSuccess: (data) => {
      toast.success(data.detail || 'درخواست شما با موفقیت ثبت شد');

      if (data.ticket?.assigned_agent_name) {
        toast.info(`مشاور اختصاص یافته: ${data.ticket.assigned_agent_name}`, {
          duration: 5000,
        });
      }
    },
    onError: (error) => {
      console.error('❌ [useSubmitFullTicket] error:', error);
      console.error('❌ [useSubmitFullTicket] message:', error.message);
      toast.error('خطا در ثبت درخواست', {
        description:
          error.message ||
          handleApiError(error) ||
          'لطفاً اطلاعات وارد شده را بررسی کنید',
        duration: 10000,
      });
    },
  });
};
