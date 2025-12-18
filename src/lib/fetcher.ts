/**
 * Fetcher برای React Query
 * با HttpOnly Cookies - بدون نیاز به Token
 */

export async function fetcher<T = any>(url: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> | undefined),
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // ارسال cookies
  });

  if (response.status === 401) {
    // Redirect به login
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      const currentPath = window.location.pathname + window.location.search;
      if (currentPath !== '/login' && currentPath !== '/') {
        sessionStorage.setItem('redirectAfterLogin', currentPath);
      }
      window.location.href = '/login';
    }
  }

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
