import axios from 'axios';

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

/**
 * Helper برای مدیریت خطاهای API
 */
export const handleApiError = (error: any): string => {
  if (error.response?.data) {
    const data = error.response.data;
    
    if (typeof data === 'string') return data;
    if (data.detail) {
      if (typeof data.detail === 'string') return data.detail;
      if (Array.isArray(data.detail)) {
        return data.detail.map((err: any) => 
          typeof err === 'string' ? err : err.msg || err.message || JSON.stringify(err)
        ).join(' | ');
      }
      if (typeof data.detail === 'object') {
        return Object.entries(data.detail).map(([field, msg]) => `${field}: ${msg}`).join(' | ');
      }
    }
    if (data.error) return typeof data.error === 'string' ? data.error : JSON.stringify(data.error);
    if (data.message) return data.message;
    
    if (typeof data === 'object' && Object.keys(data).length > 0) {
      const errors = [];
      for (const [field, messages] of Object.entries(data)) {
        if (Array.isArray(messages)) {
          errors.push(`${field}: ${(messages as string[]).join(', ')}`);
        } else if (typeof messages === 'string') {
          errors.push(`${field}: ${messages}`);
        }
      }
      if (errors.length > 0) return errors.join(' | ');
    }
  }
  
  return error.message || 'خطای نامشخص';
};

export default apiClient;
