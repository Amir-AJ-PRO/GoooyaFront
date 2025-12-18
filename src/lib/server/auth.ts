import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side Auth Utilities
 * تمام منطق احراز هویت در سمت سرور
 * هیچ توکن یا اطلاعات حساسی به client ارسال نمی‌شود
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface SessionData {
  userId: string;
  userType: 'user' | 'agent' | 'admin';
  email?: string;
  phone?: string;
  name?: string;
}

/**
 * تنظیمات امن برای Cookies
 */
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

/**
 * تنظیمات CSRF Cookie
 */
const CSRF_COOKIE_OPTIONS = {
  httpOnly: false, // باید برای JavaScript قابل دسترسی باشه تا بتونه در header بفرسته
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 60 * 60 * 24, // 1 day
};

/**
 * ذخیره session در HttpOnly Cookie
 */
export async function setSession(
  accessToken: string,
  refreshToken: string,
  sessionData: SessionData
): Promise<void> {
  const cookieStore = await cookies();
  
  // ذخیره tokens به صورت امن
  cookieStore.set('session_token', accessToken, COOKIE_OPTIONS);
  cookieStore.set('refresh_token', refreshToken, COOKIE_OPTIONS);
  
  // ذخیره اطلاعات session (غیرحساس)
  cookieStore.set('session_data', JSON.stringify(sessionData), {
    ...COOKIE_OPTIONS,
    httpOnly: false, // قابل خواندن برای client
  });
  
  // تولید CSRF token
  const csrfToken = generateCsrfToken();
  cookieStore.set('csrf_token', csrfToken, CSRF_COOKIE_OPTIONS);
}

/**
 * دریافت access token از cookie
 */
export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('session_token')?.value || null;
}

/**
 * دریافت refresh token از cookie
 */
export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('refresh_token')?.value || null;
}

/**
 * دریافت session data از cookie
 */
export async function getSessionData(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const sessionData = cookieStore.get('session_data')?.value;
  
  if (!sessionData) return null;
  
  try {
    return JSON.parse(sessionData);
  } catch {
    return null;
  }
}

/**
 * پاک کردن session
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.delete('session_token');
  cookieStore.delete('refresh_token');
  cookieStore.delete('session_data');
  cookieStore.delete('csrf_token');
}

/**
 * رفرش access token
 */
export async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = await getRefreshToken();
  
  if (!refreshToken) {
    return false;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    if (!response.ok) {
      await clearSession();
      return false;
    }
    
    const data = await response.json();
    const cookieStore = await cookies();
    
    // ذخیره token جدید
    cookieStore.set('session_token', data.access, COOKIE_OPTIONS);
    
    return true;
  } catch {
    await clearSession();
    return false;
  }
}

/**
 * تولید CSRF token
 */
function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * بررسی CSRF token
 */
export async function verifyCsrfToken(request: NextRequest): Promise<boolean> {
  const cookieStore = await cookies();
  const csrfCookie = cookieStore.get('csrf_token')?.value;
  const csrfHeader = request.headers.get('x-csrf-token');
  
  return !!csrfCookie && csrfCookie === csrfHeader;
}

/**
 * دریافت user از backend با استفاده از access token
 */
export async function getCurrentUser(token: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/users/me/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      return null;
    }
    
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * بررسی دسترسی کاربر
 */
export async function checkUserAccess(
  requiredType: 'user' | 'agent' | 'admin' | 'admin-agent'
): Promise<{ hasAccess: boolean; user: SessionData | null }> {
  const sessionData = await getSessionData();
  
  if (!sessionData) {
    return { hasAccess: false, user: null };
  }
  
  let hasAccess = false;
  
  if (requiredType === 'admin-agent') {
    hasAccess = sessionData.userType === 'admin' || sessionData.userType === 'agent';
  } else {
    hasAccess = sessionData.userType === requiredType;
  }
  
  return { hasAccess, user: sessionData };
}

