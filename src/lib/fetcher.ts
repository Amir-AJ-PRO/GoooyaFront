import { getAccessToken } from "./tokenManager";

/**
 * Fetcher برای استفاده با React Query
 */
export async function fetcher<T = any>(url: string, options?: RequestInit): Promise<T> {
  const token = getAccessToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: 'خطایی رخ داده است'
    }));
    throw new Error(error.message || 'خطایی رخ داده است');
  }

  return response.json();
}

/**
 * Helper functions برای HTTP methods
 */
export const api = {
  get: <T = any>(url: string, options?: RequestInit) =>
    fetcher<T>(url, { ...options, method: 'GET' }),

  post: <T = any>(url: string, data?: any, options?: RequestInit) =>
    fetcher<T>(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T = any>(url: string, data?: any, options?: RequestInit) =>
    fetcher<T>(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T = any>(url: string, options?: RequestInit) =>
    fetcher<T>(url, { ...options, method: 'DELETE' }),
};

