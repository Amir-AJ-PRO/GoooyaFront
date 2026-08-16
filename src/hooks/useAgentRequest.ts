/**
 * Hook برای درخواست تبدیل به agent
 */

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  submitAgentRequest,
  AgentRequestPayload,
  AgentRequestResponse,
  markAgentRequestPending,
} from '@/services/agentRequestApi';

/**
 * Hook برای ارسال درخواست تبدیل به agent
 */
export const useAgentRequest = () => {
  return useMutation<AgentRequestResponse, Error, AgentRequestPayload>({
    mutationFn: submitAgentRequest,
    onSuccess: (data, variables) => {
      markAgentRequestPending(variables.phone);
      toast.success(
        data.detail || 'درخواست شما با موفقیت ثبت شد. به زودی بررسی خواهد شد.'
      );
    },
    onError: (error) => {
      toast.error('خطا در ثبت درخواست', {
        description: error.message || 'لطفاً دوباره تلاش کنید.',
        duration: 10000,
      });
    },
  });
};
