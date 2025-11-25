import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
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
      toast.error(error.message || 'خطا در ثبت درخواست');
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
      
      if (data.ticket.assigned_agent_name) {
        toast.info(`مشاور اختصاص یافته: ${data.ticket.assigned_agent_name}`, {
          duration: 5000,
        });
      }
    },
    onError: (error) => {
      toast.error(error.message || 'خطا در ثبت درخواست');
    },
  });
};

