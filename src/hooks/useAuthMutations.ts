import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

interface RequestOTPPayload {
  phone: string;
}

interface VerifyOTPPayload {
  phone: string;
  code: string;
}

interface RequestOTPResponse {
  success: boolean;
  message: string;
  otp?: string; // فقط development
}

interface VerifyOTPResponse {
  success: boolean;
  user: any;
  created?: boolean;
}

/**
 * درخواست کد OTP از Next.js API
 */
const requestOTP = async (payload: RequestOTPPayload): Promise<RequestOTPResponse> => {
  const response = await fetch('/api/auth/request-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'خطا در ارسال کد تایید');
  }

  return data;
};

/**
 * تایید کد OTP
 */
const verifyOTP = async (payload: VerifyOTPPayload): Promise<VerifyOTPResponse> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // ارسال و دریافت cookies
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'کد تایید نامعتبر است');
  }

  return data;
};

/**
 * Hook برای درخواست کد OTP
 */
export const useRequestOTP = () => {
  return useMutation<RequestOTPResponse, Error, RequestOTPPayload>({
    mutationFn: requestOTP,
    onSuccess: (data) => {
      toast.success(data.message);
      
      // نمایش کد در development
      if (data.otp) {
        toast.info(`کد تایید: ${data.otp}`, { 
          duration: 10000,
          description: 'فقط در حالت توسعه'
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
    onError: (error) => {
      toast.error(error.message);
    }
  });
};
