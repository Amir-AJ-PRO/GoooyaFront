import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'nodejs';
export const maxDuration = 60;

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const ACCESS_TOKEN_MAX_AGE = 15 * 60;

function getBackendUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'https://api.goooya.ir';
}

/**
 * ثبت تیکت کامل ملک (multipart/form-data)
 * POST /api/tickets/full/
 *
 * بدنه را خام (با همان Content-Type و boundary) به بک‌اند فوروارد می‌کند
 * تا فایل‌های تصویری در Node/undici خراب نشوند.
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get(ACCESS_TOKEN_KEY)?.value;
    const refreshToken = cookieStore.get(REFRESH_TOKEN_KEY)?.value;

    const incomingContentType = request.headers.get('content-type') || '';
    const rawBody = await request.arrayBuffer();

    if (!incomingContentType.includes('multipart/form-data')) {
      return NextResponse.json(
        {
          error: 'invalid_content_type',
          detail: 'درخواست باید به‌صورت multipart/form-data ارسال شود.',
        },
        { status: 400 }
      );
    }

    const backendUrl = getBackendUrl();

    const sendToBackend = async (token?: string) => {
      const headers: Record<string, string> = {
        // حفظ boundary اصلی کلاینت
        'Content-Type': incomingContentType,
      };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      return fetch(`${backendUrl}/api/tickets/full/`, {
        method: 'POST',
        headers,
        body: rawBody,
        cache: 'no-store',
      });
    };

    let backendResponse = await sendToBackend(accessToken);

    if (backendResponse.status === 401 && refreshToken) {
      const refreshResponse = await fetch(`${backendUrl}/api/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
        cache: 'no-store',
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        accessToken = refreshData.access as string;
        backendResponse = await sendToBackend(accessToken);

        const res = await buildResponse(backendResponse);
        res.cookies.set(ACCESS_TOKEN_KEY, accessToken, {
          httpOnly: true,
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: ACCESS_TOKEN_MAX_AGE,
        });
        return res;
      }
    }

    return await buildResponse(backendResponse);
  } catch (error) {
    console.error('❌ /api/tickets/full route error:', error);
    return NextResponse.json(
      {
        error: 'خطا در ثبت درخواست ملک',
        details: error instanceof Error ? error.message : 'خطای ناشناخته',
      },
      { status: 500 }
    );
  }
}

async function buildResponse(backendResponse: Response): Promise<NextResponse> {
  const contentType = backendResponse.headers.get('content-type') || '';
  const status = backendResponse.status;

  let data: unknown;
  if (contentType.includes('application/json')) {
    data = await backendResponse.json();
  } else {
    const text = await backendResponse.text();
    data = text
      ? { detail: text }
      : { detail: `خطای سرور (${status})` };
  }

  if (status >= 400) {
    console.error('❌ Backend /api/tickets/full/ error:', {
      status,
      contentType,
      body: data,
      bodyJson: (() => {
        try {
          return JSON.stringify(data, null, 2);
        } catch {
          return String(data);
        }
      })(),
    });
  }

  return NextResponse.json(data, { status });
}
