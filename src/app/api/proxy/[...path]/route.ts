/**
 * Universal API Proxy
 * همه درخواست‌ها به Backend رو از اینجا رد میکنیم
 * Token رو از HttpOnly Cookie میگیریم و به Backend میفرستیم
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

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
    
    // اضافه کردن trailing slash (Django معمولاً نیاز داره)
    const needsSlash = !targetPath.endsWith('/') && !queryString;
    const targetUrl = `${backendUrl}/${targetPath}${needsSlash ? '/' : ''}${queryString}`;
    
    console.log(`🔄 Proxying ${method} ${targetUrl}`);
    console.log(`📍 Path segments:`, pathSegments);
    
    // ساخت headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
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
    let body: string | undefined;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        const jsonBody = await request.json();
        body = JSON.stringify(jsonBody);
        console.log('📦 Request body:', body);
      } catch {
        // body خالی
        console.log('📦 No body');
      }
    }
    
    // ارسال درخواست به Backend
    let response = await fetch(targetUrl, {
      method,
      headers,
      body,
    });
    
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
            method,
            headers,
            body,
          });
        }
      }
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
    
    console.log('✅ Proxy completed');
    
    return jsonResponse;
  } catch (error) {
    console.error('❌ Proxy error:', error);
    
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
