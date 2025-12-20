/**
 * GET /api/auth/me
 * دریافت اطلاعات کاربر با HttpOnly Cookie
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// زمان انقضای توکن‌ها (بر اساس تنظیمات Backend)
const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 دقیقه
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30 روز

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    let accessToken = cookieStore.get(ACCESS_TOKEN_KEY)?.value;
    const refreshToken = cookieStore.get(REFRESH_TOKEN_KEY)?.value;

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.goooya.ir';

    // اگر access token نداریم ولی refresh token داریم، اول رفرش کنیم
    if (!accessToken && refreshToken) {
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
      }
    }

    if (!accessToken) {
      // مهم: برای جلوگیری از لاگ 401 در کنسول مرورگر (Failed to load resource),
      // برای کاربر مهمان 200 برمی‌گردونیم و با success=false مشخص می‌کنیم.
      return NextResponse.json(
        { success: false, user: null, message: 'Unauthenticated' },
        { status: 200 }
      );
    }
    
    // امتحان endpoint های مختلف تا endpoint صحیح پیدا بشه
    const endpoints = [
      '/api/auth/me/',
      '/api/users/me/',
      '/v1/users/me/',
      '/v1/auth/me/',
    ];
    
    let response: Response | null = null;
    let successEndpoint = '';
    
    for (const endpoint of endpoints) {
      try {
        const testResponse = await fetch(`${backendUrl}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });

        // قبول می‌کنیم: 200 (OK), 401 (Unauthorized - endpoint درسته اما token منقضی شده)
        // رد می‌کنیم: 404 (Not Found), 405 (Method Not Allowed)
        if (testResponse.ok || testResponse.status === 401) {
          response = testResponse;
          successEndpoint = endpoint;
          break;
        }
      } catch (error) {
      }
    }
    
    if (!response) {
      // نباید کاربر رو logout کنیم فقط به خاطر اینکه endpoint نداریم
      // بهتره یک response ساده برگردونیم
      return NextResponse.json(
        { 
          success: false,
          error: 'Backend endpoint not found',
          message: 'Keeping session alive'
        },
        { status: 200 } // 200 برمیگردونیم تا کاربر logout نشه
      );
    }

    // اگر 401 بود، سعی در رفرش
    if (response.status === 401) {
      if (!refreshToken) {
        // پاک کردن Cookie ها
        const jsonResponse = NextResponse.json(
          { success: false, user: null, message: 'Session expired' },
          { status: 200 }
        );
        jsonResponse.cookies.delete(ACCESS_TOKEN_KEY);
        jsonResponse.cookies.delete(REFRESH_TOKEN_KEY);
        return jsonResponse;
      }

      // رفرش Token - endpoint صحیح: /api/token/refresh/
      const refreshResponse = await fetch(`${backendUrl}/api/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!refreshResponse.ok) {
        const jsonResponse = NextResponse.json(
          { success: false, user: null, message: 'Session expired' },
          { status: 200 }
        );
        jsonResponse.cookies.delete(ACCESS_TOKEN_KEY);
        jsonResponse.cookies.delete(REFRESH_TOKEN_KEY);
        return jsonResponse;
      }

      const refreshData = await refreshResponse.json();
      
      // دوباره درخواست اصلی با endpoint صحیح که پیدا کردیم
      response = await fetch(`${backendUrl}${successEndpoint}`, {
        headers: {
          'Authorization': `Bearer ${refreshData.access}`,
        },
      });
      
      // Update کردن Cookie
      accessToken = refreshData.access;
    }

    if (!response.ok) {
      // برای جلوگیری از لاگ 401 در کنسول مرورگر، 200 برگردون
      const jsonResponse = NextResponse.json(
        { success: false, user: null, message: 'Failed to fetch user' },
        { status: 200 }
      );
      
      // فقط در صورت 401 کوکی‌ها رو پاک کن (احراز هویت نامعتبر)
      // برای خطاهای دیگه (مثلاً 404, 500) کوکی‌ها رو نگه دار
      if (response.status === 401) {
        jsonResponse.cookies.delete(ACCESS_TOKEN_KEY);
        jsonResponse.cookies.delete(REFRESH_TOKEN_KEY);
      }
      
      return jsonResponse;
    }

    const userData = await response.json();
    
    // بازگشت با Cookie به‌روز
    const jsonResponse = NextResponse.json({
      success: true,
      user: userData,
    });
    
    // اگر token رفرش شده بود، update کن با maxAge مناسب
    if (accessToken) {
      jsonResponse.cookies.set(ACCESS_TOKEN_KEY, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: ACCESS_TOKEN_MAX_AGE, // 15 دقیقه
      });
    }
    
    return jsonResponse;
  } catch (error) {
    return NextResponse.json(
      { success: false, user: null, message: 'Server error' },
      { status: 200 }
    );
  }
}
