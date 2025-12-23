import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getApiBaseUrl } from '@/lib/constants';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 دقیقه

const API_BASE_URL = getApiBaseUrl();

/**
 * ایجاد ملک جدید (multipart/form-data)
 * POST /api/properties/add/
 *
 * این route برای این ساخته شده که:
 * - client نتونه توکن HttpOnly رو بخونه
 * - ولی ما در server token رو از cookie بخونیم و Authorization رو به backend بدیم
 * - و multipart (تصاویر) رو بدون دستکاری به backend فوروارد کنیم
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get(ACCESS_TOKEN_KEY)?.value;
    const refreshToken = cookieStore.get(REFRESH_TOKEN_KEY)?.value;

    // دریافت formData از درخواست ورودی
    const formData = await request.formData();

    const sendToBackend = async (token?: string) => {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // نکته: Content-Type را ست نمی‌کنیم تا fetch خودش boundary را درست بزند
      return fetch(`${API_BASE_URL}/api/properties/add/`, {
        method: 'POST',
        headers,
        body: formData,
        cache: 'no-store',
      });
    };

    // تلاش اول
    let backendResponse = await sendToBackend(accessToken);

    // اگر 401 و refreshToken داریم، رفرش کن و یک بار دیگر امتحان کن
    if (backendResponse.status === 401 && refreshToken) {
      const refreshResponse = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
        cache: 'no-store',
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        accessToken = refreshData.access;
        backendResponse = await sendToBackend(accessToken);

        // برای بهتر شدن UX: access_token را آپدیت کن تا درخواست‌های بعدی کمتر 401 بخورن
        const res = await buildResponse(backendResponse);
        if (accessToken) {
          res.cookies.set(ACCESS_TOKEN_KEY, accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: ACCESS_TOKEN_MAX_AGE,
          });
        }
        return res;
      }
    }

    return await buildResponse(backendResponse);
  } catch (error) {
    return NextResponse.json(
      {
        error: 'خطا در ثبت ملک',
        details: error instanceof Error ? error.message : 'خطای ناشناخته',
      },
      { status: 500 }
    );
  }
}

async function buildResponse(backendResponse: Response): Promise<NextResponse> {
  const contentType = backendResponse.headers.get('content-type') || '';
  const status = backendResponse.status;

  if (contentType.includes('application/json')) {
    const data = await backendResponse.json();
    return NextResponse.json(data, { status });
  }

  const text = await backendResponse.text();
  return NextResponse.json({ raw: text }, { status });
}


