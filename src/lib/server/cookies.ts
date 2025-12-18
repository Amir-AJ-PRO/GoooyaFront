/**
 * Cookie Management - Server-side Only
 * HttpOnly Cookies برای امنیت کامل
 */

import { cookies } from 'next/headers';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// زمان انقضای توکن‌ها (بر اساس تنظیمات Backend)
const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 دقیقه
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30 روز

/**
 * تنظیمات امنیتی Cookie
 */
const getCookieOptions = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge,
  // اطمینان از ارسال Cookie در همه درخواست‌ها
  domain: undefined, // استفاده از domain فعلی
});

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

/**
 * پاک کردن تمام Token ها
 */
export async function clearTokens() {
  (await cookies()).delete(ACCESS_TOKEN_KEY);
  (await cookies()).delete(REFRESH_TOKEN_KEY);
}

/**
 * بررسی وجود Token
 */
export async function hasTokens(): Promise<boolean> {
  const access = await getAccessToken();
  const refresh = await getRefreshToken();
  return !!(access && refresh);
}

