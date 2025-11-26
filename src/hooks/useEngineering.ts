/**
 * React Query hooks برای مدیریت خدمات مهندسی
 */

import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import {
  createEngineeringTicket,
  validateEngineeringForm,
  normalizeIranPhone,
} from '@/services/engineeringService';
import {
  CreateEngineeringTicketRequest,
  DuplicateEngineeringTicketError,
  SERVICE_NAME_TO_CODE,
} from '@/types/engineering';

/**
 * Hook برای ثبت درخواست خدمات مهندسی
 */
export const useCreateEngineeringTicket = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: createEngineeringTicket,
    onSuccess: (data) => {
      toast({
        title: "درخواست ثبت شد",
        description: data.detail,
        variant: "default",
      });
    },
    onError: (error: Error) => {
      // بررسی خطای درخواست تکراری
      if ('service_type' in error) {
        const duplicateError = error as DuplicateEngineeringTicketError;
        toast({
          title: "درخواست تکراری",
          description: duplicateError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "خطا در ثبت درخواست",
          description: error.message || "خطای نامشخص رخ داده است",
          variant: "destructive",
        });
      }
    },
  });
};

/**
 * Hook برای مدیریت فرم خدمات مهندسی
 */
export const useEngineeringForm = () => {
  const createTicketMutation = useCreateEngineeringTicket();

  const submitForm = async (formData: {
    fullName: string;
    phone: string;
    serviceType: string; // نام فارسی خدمت
  }) => {
    // اعتبارسنجی
    const validation = validateEngineeringForm(formData);
    if (!validation.isValid) {
      // نمایش اولین خطا
      const firstError = Object.values(validation.errors)[0];
      throw new Error(firstError);
    }

    // نرمال‌سازی شماره تلفن
    const normalizedPhone = normalizeIranPhone(formData.phone);
    if (!normalizedPhone) {
      throw new Error('شماره تلفن معتبر وارد کنید');
    }

    // تبدیل نام فارسی به کد انگلیسی
    const serviceCode = SERVICE_NAME_TO_CODE[formData.serviceType];
    if (!serviceCode) {
      throw new Error('نوع خدمت انتخابی معتبر نیست');
    }

    // ایجاد درخواست
    const request: CreateEngineeringTicketRequest = {
      full_name: formData.fullName.trim(),
      phone: normalizedPhone,
      service_type: serviceCode,
    };

    return createTicketMutation.mutateAsync(request);
  };

  return {
    submitForm,
    isLoading: createTicketMutation.isPending,
    error: createTicketMutation.error,
    isSuccess: createTicketMutation.isSuccess,
    reset: createTicketMutation.reset,
  };
};

/**
 * Hook برای نرمال‌سازی شماره تلفن
 */
export const usePhoneNormalizer = () => {
  return {
    normalizePhone: normalizeIranPhone,
    validatePhone: (phone: string) => {
      const normalized = normalizeIranPhone(phone);
      return {
        isValid: !!normalized,
        normalized,
        error: normalized ? null : 'شماره تلفن معتبر وارد کنید'
      };
    }
  };
};
