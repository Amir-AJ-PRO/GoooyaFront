/**
 * React Query hooks برای گویا کلاب
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import {
  fetchClubProfile,
  submitClubInstagram,
} from '@/services/clubService';
import type { ClubInstagramResponse, ClubProfile } from '@/types/club';

export const clubQueryKeys = {
  all: ['club'] as const,
  profile: ['club', 'profile'] as const,
};

/**
 * پروفایل گویا کلاب — فقط برای کاربر لاگین
 */
export function useClubProfile(): UseQueryResult<ClubProfile, Error> {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  return useQuery({
    queryKey: clubQueryKeys.profile,
    queryFn: fetchClubProfile,
    // درخواست را هم‌زمان با بازیابی سشن شروع کن تا لود صفحه ترتیبی و کند نشود.
    enabled: authLoading || isAuthenticated,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: (failureCount, error) =>
      error.name !== 'ClubAuthRequiredError' && failureCount < 1,
  });
}

/**
 * ثبت آیدی اینستاگرام
 */
export function useSubmitClubInstagram() {
  const queryClient = useQueryClient();
  return useMutation<ClubInstagramResponse, Error, string>({
    mutationFn: (instagramId) =>
      submitClubInstagram({ instagram_id: instagramId }),
    onSuccess: (data) => {
      queryClient.setQueryData<ClubProfile>(clubQueryKeys.profile, (prev) =>
        prev
          ? {
              ...prev,
              total_points: data.total_points,
              lottery: data.lottery,
            }
          : prev
      );
    },
  });
}
