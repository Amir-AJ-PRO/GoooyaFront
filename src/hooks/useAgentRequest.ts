/**
 * Hook برای درخواست تبدیل به agent
 */

import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { 
  submitAgentRequest, 
  AgentRequestPayload, 
  AgentRequestResponse 
} from '@/services/agentRequestApi';

/**
 * Hook برای ارسال درخواست تبدیل به agent
 */
export const useAgentRequest = () => {
  const router = useRouter();

  return useMutation<AgentRequestResponse, Error, AgentRequestPayload>({
    mutationFn: submitAgentRequest,
    onSuccess: (data) => {
      toast.success(data.detail || 'درخواست شما با موفقیت ثبت شد. به زودی بررسی خواهد شد.');
      // بعد از 2 ثانیه به صفحه dashboard هدایت کن
      setTimeout(() => {
        router.push('/dashboard/user');
      }, 2000);
    },
    onError: (error) => {
      toast.error(error.message || 'خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.');
    }
  });
};





