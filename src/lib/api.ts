import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { isTokenExpired, isSessionValid, saveTokens, clearTokens, getRefreshToken } from './tokenManager';
import { API_BASE_URL } from './constants';

const API_BASE = API_BASE_URL;

/**
 * Axios instance برای درخواست‌های API
 */
export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

/**
 * Request Interceptor - بررسی و رفرش توکن قبل از ارسال درخواست
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('access_token');
    
    if (token && config.headers) {
      // بررسی اینکه آیا توکن منقضی شده یا نزدیک به انقضا است
      if (isTokenExpired(token)) {
        // اگر session معتبر است، رفرش کن
        if (isSessionValid()) {
          try {
            const refresh = getRefreshToken();
            if (refresh) {
              const response = await axios.post(`${API_BASE}/api/token/refresh/`, {
                refresh
              });
              saveTokens(response.data.access, refresh);
              config.headers.Authorization = `Bearer ${response.data.access}`;
              return config;
            }
          } catch (error) {
            clearTokens();
            window.location.href = '/login';
            return Promise.reject(error);
          }
        } else {
          clearTokens();
          window.location.href = '/login';
          return Promise.reject(new Error('Session expired'));
        }
      }
      
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor - مدیریت خطای 401
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest) {
      originalRequest._retry = true;

      if (isSessionValid()) {
        try {
          const refresh = getRefreshToken();
          if (!refresh) throw new Error('No refresh token');

          const response = await axios.post(`${API_BASE}/api/token/refresh/`, { refresh });
          saveTokens(response.data.access, refresh);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
          }
          return apiClient(originalRequest);
        } catch (refreshError) {
          clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        clearTokens();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

