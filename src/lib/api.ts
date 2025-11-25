import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import {
  isTokenExpired,
  isSessionValid,
  saveTokens,
  clearTokens,
  getRefreshToken,
  getAccessToken,
  areTokensRecentlySaved,
} from './tokenManager';
import { tokenRefreshManager } from './tokenRefreshManager';
import { API_BASE_URL } from './constants';

const API_BASE = API_BASE_URL;

/**
 * Axios instance برای درخواست‌های API با پیکربندی امنیتی
 */
export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
    // Security Headers
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 30000,
  // از credentials استفاده کن برای cookies (برای CSRF token)
  withCredentials: false,
});

/**
 * Flag برای جلوگیری از redirect های متعدد
 */
let isRedirectingToLogin = false;

/**
 * Redirect به صفحه login
 */
const redirectToLogin = (): void => {
  if (isRedirectingToLogin) return;
  
  isRedirectingToLogin = true;
  clearTokens();
  
  // پاک کردن صف refresh manager
  tokenRefreshManager.clearQueue();
  
  if (typeof window !== 'undefined') {
    // ذخیره URL فعلی برای redirect بعد از login
    const currentPath = window.location.pathname + window.location.search;
    if (currentPath !== '/login' && currentPath !== '/') {
      sessionStorage.setItem('redirectAfterLogin', currentPath);
    }
    
    window.location.href = '/login';
  }
};

/**
 * Request Interceptor - اضافه کردن Authorization header
 * 
 * این interceptor فقط token را به header اضافه می‌کند.
 * رفرش پیشگیرانه در اینجا انجام نمی‌شود تا از race condition جلوگیری شود.
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // اگر درخواست برای refresh token است، token نگذار
    if (config.url?.includes('/api/token/refresh/')) {
      return config;
    }

    const token = getAccessToken();
    
    if (token && config.headers) {
      // بررسی session validity
      if (!isSessionValid()) {
        redirectToLogin();
        return Promise.reject(new Error('نشست شما منقضی شده است'));
      }

      // اضافه کردن Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor - مدیریت خطای 401 و رفرش خودکار token
 * 
 * این interceptor وقتی 401 دریافت می‌کند:
 * 1. بررسی می‌کند که آیا session هنوز معتبر است
 * 2. از TokenRefreshManager برای رفرش استفاده می‌کند (با queue و lock)
 * 3. درخواست اصلی را دوباره ارسال می‌کند
 * 4. در صورت شکست، به login redirect می‌کند
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Reset redirect flag در صورت دریافت پاسخ موفق
    isRedirectingToLogin = false;
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // اگر درخواست برای refresh token بود، مستقیماً reject کن
    if (originalRequest?.url?.includes('/api/token/refresh/')) {
      redirectToLogin();
      return Promise.reject(error);
    }

    // مدیریت خطای 401 (Unauthorized)
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // جلوگیری از تلاش مجدد بی‌نهایت
      originalRequest._retry = true;

      // بررسی session validity
      if (!isSessionValid()) {
        redirectToLogin();
        return Promise.reject(new Error('نشست شما منقضی شده است'));
      }

      try {
        const refreshToken = getRefreshToken();
        
        if (!refreshToken) {
          throw new Error('Refresh token یافت نشد');
        }

        // اگر token ها به تازگی ذخیره شده‌اند، از رفرش مجدد جلوگیری کن
        if (areTokensRecentlySaved()) {
          // فقط token جدید را به header اضافه کن و درخواست را دوباره بفرست
          const newAccessToken = getAccessToken();
          if (newAccessToken && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        }

        // استفاده از TokenRefreshManager برای رفرش امن
        const newAccessToken = await tokenRefreshManager.refreshAccessToken(refreshToken);
        
        // ذخیره token جدید
        saveTokens(newAccessToken, refreshToken);

        // بروزرسانی Authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // تلاش مجدد با token جدید
        return apiClient(originalRequest);
      } catch (refreshError) {
        // اگر رفرش ناموفق بود، redirect به login
        console.error('خطا در رفرش توکن:', refreshError);
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }

    // مدیریت خطای 403 (Forbidden) - ممکن است کاربر دسترسی نداشته باشد
    if (error.response?.status === 403) {
      console.warn('دسترسی غیرمجاز:', error.response.data);
      // می‌توانید اینجا یک notification نمایش دهید
    }

    // مدیریت خطای شبکه
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('خطای شبکه: لطفاً اتصال اینترنت خود را بررسی کنید');
      // می‌توانید اینجا یک notification نمایش دهید
    }

    // مدیریت timeout
    if (error.code === 'ECONNABORTED') {
      console.error('زمان درخواست به پایان رسید');
      // می‌توانید اینجا یک notification نمایش دهید
    }

    return Promise.reject(error);
  }
);

/**
 * Helper function برای ساخت URL های API
 */
export const buildApiUrl = (endpoint: string): string => {
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  
  const base = API_BASE.endsWith('/') ? API_BASE.slice(0, -1) : API_BASE;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  return `${base}${path}`;
};

/**
 * Helper function برای مدیریت خطاهای API
 */
export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    // خطاهای دریافتی از backend
    if (error.response?.data) {
      const data = error.response.data;
      
      // اگر backend پیام خطای فارسی ارسال کرده
      if (typeof data === 'object' && 'detail' in data) {
        return data.detail as string;
      }
      
      // اگر خطا به صورت string است
      if (typeof data === 'string') {
        return data;
      }
      
      // اگر خطا به صورت array است (validation errors)
      if (Array.isArray(data)) {
        return data.join(', ');
      }
    }
    
    // خطاهای شبکه
    if (error.code === 'ERR_NETWORK') {
      return 'خطای شبکه: لطفاً اتصال اینترنت خود را بررسی کنید';
    }
    
    // خطای timeout
    if (error.code === 'ECONNABORTED') {
      return 'زمان درخواست به پایان رسید';
    }
    
    // سایر خطاهای axios
    return error.message || 'خطای ناشناخته';
  }
  
  // خطاهای JavaScript عادی
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'خطای ناشناخته';
};

export default apiClient;

