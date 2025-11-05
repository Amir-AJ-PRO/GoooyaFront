import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook برای ارسال درخواست‌های احراز هویت شده با مدیریت خودکار رفرش توکن
 */
export const useAuthenticatedFetch = () => {
  const { refreshAccessToken, logout } = useAuth();

  const authenticatedFetch = useCallback(async (
    url: string,
    options: RequestInit = {}
  ) => {
    const makeRequest = async (token: string) => {
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
    };

    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        logout();
        throw new Error('لطفاً وارد شوید');
      }

      let response = await makeRequest(token);

      // اگر 401 بود، رفرش کن و دوباره امتحان کن
      if (response.status === 401) {
        await refreshAccessToken();
        const newToken = localStorage.getItem('access_token');
        
        if (newToken) {
          response = await makeRequest(newToken);
        }
      }

      return response;
    } catch (error) {
      console.error('خطا در درخواست:', error);
      throw error;
    }
  }, [refreshAccessToken, logout]);

  return { authenticatedFetch };
};

