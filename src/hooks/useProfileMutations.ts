import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  updateProfile, 
  UpdateProfilePayload,
  UpdateProfileResponse 
} from '@/services/authApi';
import { getAccessToken } from '@/lib/tokenManager';

/**
 * Hook برای به‌روزرسانی پروفایل کاربر
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UpdateProfileResponse, 
    Error, 
    UpdateProfilePayload
  >({
    mutationFn: async (payload: UpdateProfilePayload) => {
      const token = getAccessToken();
      if (!token) {
        throw new Error('لطفاً ابتدا وارد شوید');
      }
      return updateProfile(payload, token);
    },
    onSuccess: (data) => {
      // به‌روزرسانی localStorage
      localStorage.setItem('user_data', JSON.stringify(data.user));
      
      // Invalidate queries مرتبط
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      
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

