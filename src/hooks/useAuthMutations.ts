import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  requestOTP, 
  verifyOTP, 
  refreshToken,
  RequestOTPPayload,
  VerifyOTPPayload,
  RefreshTokenPayload,
  RequestOTPResponse,
  VerifyOTPResponse,
  RefreshTokenResponse
} from '@/services/authApi';
import { saveTokens } from '@/lib/tokenManager';

/**
 * Hook برای درخواست کد OTP
 */
export const useRequestOTP = () => {
  return useMutation<RequestOTPResponse, Error, RequestOTPPayload>({
    mutationFn: requestOTP,
    onSuccess: (data) => {
      toast.success(data.detail);
      // در حالت توسعه، کد OTP را نمایش بده
      if (data.otp) {
        toast.info(`کد تایید: ${data.otp}`, { 
          duration: 10000,
          description: 'این کد فقط در حالت توسعه نمایش داده می‌شود'
        });
      }
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
};

/**
 * Hook برای تایید کد OTP
 */
export const useVerifyOTP = () => {
  return useMutation<VerifyOTPResponse, Error, VerifyOTPPayload>({
    mutationFn: verifyOTP,
    onSuccess: (data) => {
      // ذخیره توکن‌ها با استفاده از tokenManager
      saveTokens(data.access, data.refresh);
      localStorage.setItem('user_data', JSON.stringify(data.user));

      const message = data.created 
        ? '🎉 حساب کاربری شما با موفقیت ایجاد شد'
        : '✅ خوش آمدید';
      
      toast.success(message);
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
};

/**
 * Hook برای رفرش توکن
 * توجه: این hook فقط برای رفرش استفاده می‌شود و error handling در AuthContext انجام می‌شود
 */
export const useRefreshToken = () => {
  return useMutation<RefreshTokenResponse, Error, RefreshTokenPayload>({
    mutationFn: refreshToken,
    retry: 1, // یک بار دیگر تلاش کن
  });
};

