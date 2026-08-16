/**
 * Universal API Proxy
 * همه درخواست‌ها به Backend رو از اینجا رد میکنیم
 * Token رو از HttpOnly Cookie میگیریم و به Backend میفرستیم
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { setUserDataCookie } from '@/lib/server/cookies';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// زمان انقضای توکن‌ها (بر اساس تنظیمات Backend)
const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 دقیقه
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30 روز

async function proxyRequest(
  request: NextRequest,
  method: string,
  pathSegments: string[]
) {
  try {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get(ACCESS_TOKEN_KEY)?.value;
    const refreshToken = cookieStore.get(REFRESH_TOKEN_KEY)?.value;
    
    // ساخت URL
    const url = new URL(request.url);
    const queryString = url.search;
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.goooya.ir';
    const targetPath = pathSegments.join('/');
    
    // اضافه کردن trailing slash (Django معمولاً نیاز داره) حتی وقتی query string داریم
    // تا URL هایی مثل /api/properties/options/locations/?city=1 درست ساخته شوند.
    const needsSlash = !targetPath.endsWith('/');
    const targetUrl = `${backendUrl}/${targetPath}${needsSlash ? '/' : ''}${queryString}`;
    
    console.log(`🔄 Proxying ${method} ${targetUrl}`);
    console.log(`📍 Path segments:`, pathSegments);
    
    // ساخت headers — Content-Type را فقط برای JSON ست می‌کنیم
    // برای multipart نباید ست شود تا fetch خودش boundary بسازد
    const headers: Record<string, string> = {};
    const incomingContentType = request.headers.get('content-type') || '';
    const isMultipart = incomingContentType.includes('multipart/form-data');

    // فوروارد IP کلاینت برای سهمیه مهمان (مثلاً ویجت شهر GPT)
    const forwardedFor =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      undefined;
    const clientIp =
      forwardedFor?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      undefined;
    if (clientIp) {
      headers['X-Forwarded-For'] = clientIp;
      headers['X-Real-IP'] = clientIp;
    }
    
    // اگر access token نداریم ولی refresh token داریم، قبل از ارسال درخواست رفرش کنیم
    if (!accessToken && refreshToken) {
      console.log('⚠️ No access token, trying refresh using refresh token...');
      const refreshResponse = await fetch(`${backendUrl}/api/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();
        accessToken = refreshData.access;
        console.log('✅ Access token refreshed (no previous access token)');
      } else {
        console.log('❌ Refresh failed (no previous access token)');
      }
    }

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      console.log('🔑 Token added to request');
    } else {
      console.log('⚠️ No token found');
    }
    
    // دریافت body (اگر POST/PUT/PATCH)
    // مهم: multipart را به‌صورت خام با همان Content-Type (شامل boundary) فوروارد کن
    let body: BodyInit | undefined;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      if (isMultipart) {
        body = await request.arrayBuffer();
        headers['Content-Type'] = incomingContentType;
        console.log('📦 Multipart raw body forwarded');
      } else if (
        incomingContentType.includes('application/json') ||
        incomingContentType === ''
      ) {
        headers['Content-Type'] = 'application/json';
        try {
          const jsonBody = await request.json();
          body = JSON.stringify(jsonBody);
          console.log('📦 Request body:', body);
        } catch {
          console.log('📦 No body');
        }
      } else {
        headers['Content-Type'] = incomingContentType;
        body = await request.arrayBuffer();
        console.log('📦 Raw body forwarded:', incomingContentType);
      }
    }

    // ویجت شهر GPT تا ۶۰ ثانیه تایم‌اوت دارد
    const isShahrGptWidget = targetPath.includes('api/agent/widget');
    const fetchInit: RequestInit = {
      method,
      headers,
      body,
      ...(isShahrGptWidget
        ? { signal: AbortSignal.timeout(65_000) }
        : {}),
    };
    
    // ارسال درخواست به Backend
    let response = await fetch(targetUrl, fetchInit);
    
    console.log(`📬 Response status: ${response.status}`);
    
    // اگر 401 بود، رفرش کن
    if (response.status === 401 && accessToken) {
      console.log('⚠️ Token expired, refreshing...');
      
      if (refreshToken) {
        const refreshResponse = await fetch(`${backendUrl}/api/token/refresh/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
        
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          accessToken = refreshData.access;
          
          console.log('✅ Token refreshed, retrying request');
          
          // دوباره درخواست اصلی
          headers['Authorization'] = `Bearer ${accessToken}`;
          response = await fetch(targetUrl, {
            ...fetchInit,
            headers,
          });
        }
      }
    }
    
    // اگر 204/205 باشد body ندارد (مثل DELETE ملک)؛ JSON برنگردان
    if (response.status === 204 || response.status === 205) {
      const emptyResponse = new NextResponse(null, { status: response.status });

      // اگر token رفرش شد، update کن با maxAge صحیح
      if (accessToken) {
        emptyResponse.cookies.set(ACCESS_TOKEN_KEY, accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: ACCESS_TOKEN_MAX_AGE, // 15 دقیقه
        });
      }

      console.log('✅ Proxy completed (no-content)');
      return emptyResponse;
    }

    // دریافت response data
    const contentType = response.headers.get('content-type');
    let data: any;
    
    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    const jsonResponse = NextResponse.json(data, {
      status: response.status,
    });
    
    // اگر token رفرش شد، update کن با maxAge صحیح
    if (accessToken && response.status !== 401) {
      jsonResponse.cookies.set(ACCESS_TOKEN_KEY, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: ACCESS_TOKEN_MAX_AGE, // 15 دقیقه
      });
    }

    if (
      response.ok &&
      data &&
      typeof data === 'object' &&
      data.user &&
      targetPath.includes('update-profile')
    ) {
      setUserDataCookie(jsonResponse, data.user);
    }
    
    console.log('✅ Proxy completed');
    
    return jsonResponse;
  } catch (error) {
    console.error('❌ Proxy error:', error);

    const isTimeout =
      error instanceof Error &&
      (error.name === 'TimeoutError' || error.name === 'AbortError');

    if (isTimeout) {
      return NextResponse.json(
        {
          error: 'timeout',
          message:
            'درخواست شما بیش از حد معمول طول کشید. لطفا چند لحظه دیگر تلاش کنید.',
        },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: 'خطا در ارتباط با سرور' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return proxyRequest(request, 'GET', resolvedParams.path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return proxyRequest(request, 'POST', resolvedParams.path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return proxyRequest(request, 'PUT', resolvedParams.path);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return proxyRequest(request, 'PATCH', resolvedParams.path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  return proxyRequest(request, 'DELETE', resolvedParams.path);
}
