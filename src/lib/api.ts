import axios from 'axios';
import { formatApiValidationErrorInline } from '@/lib/apiErrors';

/**
 * Axios instance برای Next.js API Proxy
 * همه درخواست‌ها از /api/proxy رد میشن
 */
export const apiClient = axios.create({
  baseURL: '/api/proxy', // تغییر به proxy
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
  withCredentials: true, // برای ارسال cookies
});

// برای FormData نباید Content-Type دستی ست شود تا boundary درست ساخته شود
apiClient.interceptors.request.use((config) => {
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    const headers = config.headers;
    if (headers && typeof headers === 'object') {
      if (typeof (headers as { delete?: (key: string) => void }).delete === 'function') {
        (headers as { delete: (key: string) => void }).delete('Content-Type');
      } else {
        delete (headers as Record<string, unknown>)['Content-Type'];
        delete (headers as Record<string, unknown>)['content-type'];
      }
    }
  }
  return config;
});

/**
 * Helper برای مدیریت خطاهای API
 */
export const handleApiError = (error: unknown): string => {
  if (error && typeof error === 'object') {
    const err = error as {
      response?: { data?: unknown };
      message?: string;
    };

    if (err.response?.data !== undefined) {
      return formatApiValidationErrorInline(
        err.response.data,
        err.message || 'خطای نامشخص'
      );
    }

    if (typeof err.message === 'string' && err.message.trim()) {
      return err.message;
    }
  }

  return 'خطای نامشخص';
};

export default apiClient;
