import { useCallback } from 'react';

/**
 * Hook امن برای ارسال درخواست‌های احراز هویت شده
 * بدون دسترسی به token - همه چیز از طریق HttpOnly Cookie
 */
export const useAuthenticatedFetch = () => {
  /**
   * دریافت CSRF token از cookie
   */
  const getCsrfToken = (): string | null => {
    if (typeof document === 'undefined') return null;
    const matches = document.cookie.match(/csrf_token=([^;]+)/);
    return matches ? matches[1] : null;
  };

  /**
   * ارسال درخواست امن
   */
  const authenticatedFetch = useCallback(async (
    url: string,
    options: RequestInit = {}
  ) => {
    const csrfToken = getCsrfToken();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };
    
    // اضافه کردن CSRF token برای درخواست‌های تغییردهنده
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(options.method || 'GET') && csrfToken) {
      headers['X-CSRF-Token'] = csrfToken;
    }
    
    return fetch(url, {
      ...options,
      headers,
      credentials: 'include', // ارسال cookies
    });
  }, []);

  return { authenticatedFetch };
};
