/**
 * Cookie Management - Server-side Only
 * HttpOnly Cookies برای امنیت کامل
 */

import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';

export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const USER_DATA_KEY = 'user_data';

// زمان انقضای توکن‌ها (بر اساس تنظیمات Backend)
export const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 دقیقه
export const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30 روز

/**
 * تنظیمات امنیتی Cookie — همیشه HttpOnly تا JavaScript به توکن/پروفایل دسترسی نداشته باشد
 */
export const getAuthCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge,
});

const getCookieOptions = getAuthCookieOptions;

/**
 * ذخیره Access Token در HttpOnly Cookie
 */
export async function setAccessToken(token: string) {
  (await cookies()).set(ACCESS_TOKEN_KEY, token, getCookieOptions(ACCESS_TOKEN_MAX_AGE));
}

/**
 * ذخیره Refresh Token در HttpOnly Cookie
 */
export async function setRefreshToken(token: string) {
  (await cookies()).set(REFRESH_TOKEN_KEY, token, getCookieOptions(REFRESH_TOKEN_MAX_AGE));
}

/**
 * ذخیره هر دو Token
 */
export async function setTokens(accessToken: string, refreshToken: string) {
  await setAccessToken(accessToken);
  await setRefreshToken(refreshToken);
}

/**
 * دریافت Access Token
 */
export async function getAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(ACCESS_TOKEN_KEY)?.value;
}

/**
 * دریافت Refresh Token
 */
export async function getRefreshToken(): Promise<string | undefined> {
  return (await cookies()).get(REFRESH_TOKEN_KEY)?.value;
}

export function parseUserDataCookie(value?: string): unknown | null {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function setUserDataCookie(response: NextResponse, user: unknown) {
  response.cookies.set(
    USER_DATA_KEY,
    JSON.stringify(user),
    getAuthCookieOptions(REFRESH_TOKEN_MAX_AGE)
  );
}

export function clearAuthCookies(response: NextResponse) {
  const expired = getAuthCookieOptions(0);
  response.cookies.set(ACCESS_TOKEN_KEY, '', expired);
  response.cookies.set(REFRESH_TOKEN_KEY, '', expired);
  response.cookies.set(USER_DATA_KEY, '', expired);
}

/**
 * پاک کردن تمام Token ها
 */
export async function clearTokens() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_TOKEN_KEY);
  cookieStore.delete(REFRESH_TOKEN_KEY);
  cookieStore.delete(USER_DATA_KEY);
}

/**
 * بررسی وجود Token
 */
export async function hasTokens(): Promise<boolean> {
  const access = await getAccessToken();
  const refresh = await getRefreshToken();
  return !!(access && refresh);
}

