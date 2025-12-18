import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  updateProfile, 
  UpdateProfilePayload,
  UpdateProfileResponse 
} from '@/services/authApi';

/**
 * Hook برای به‌روزرسانی پروفایل کاربر - نسخه امن
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateProfileResponse, 
    Error, 
    UpdateProfilePayload
  >({
    mutationFn: async (payload: UpdateProfilePayload) => {
      return await updateProfile(payload);
    },
    onSuccess: () => {
      // Invalidate queries مرتبط
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth-me'] });
      
      toast.success('پروفایل با موفقیت به‌روزرسانی شد', {
        description: 'اطلاعات شما ذخیره شد'
      });
    },
    onError: (error) => {
      toast.error('خطا در به‌روزرسانی پروفایل', {
        description: error.message
      });
    }
  });
};
