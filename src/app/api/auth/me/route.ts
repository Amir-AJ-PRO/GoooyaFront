/**
 * GET /api/auth/me
 * دریافت اطلاعات کاربر با HttpOnly Cookie
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  ACCESS_TOKEN_KEY,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_KEY,
  USER_DATA_KEY,
  clearAuthCookies,
  getAuthCookieOptions,
  parseUserDataCookie,
  setUserDataCookie,
} from '@/lib/server/cookies';

function sessionFromUserCookie(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const user = parseUserDataCookie(cookieStore.get(USER_DATA_KEY)?.value);
  if (!user) return null;

  const response = NextResponse.json({
    success: true,
    user,
    message: 'Keeping session alive',
  });
  setUserDataCookie(response, user);
  return response;
}

export async function GET(_request: NextRequest) {
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
      const cached = sessionFromUserCookie(cookieStore);
      if (cached) return cached;

      return NextResponse.json(
        { 
          success: false,
          error: 'Backend endpoint not found',
          message: 'Keeping session alive'
        },
        { status: 200 }
      );
    }

    // اگر 401 بود، سعی در رفرش
    if (response.status === 401) {
      if (!refreshToken) {
        const jsonResponse = NextResponse.json(
          { success: false, user: null, message: 'Session expired' },
          { status: 200 }
        );
        clearAuthCookies(jsonResponse);
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
        clearAuthCookies(jsonResponse);
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
      if (response.status === 401) {
        const jsonResponse = NextResponse.json(
          { success: false, user: null, message: 'Failed to fetch user' },
          { status: 200 }
        );
        clearAuthCookies(jsonResponse);
        return jsonResponse;
      }

      const cached = sessionFromUserCookie(cookieStore);
      if (cached) return cached;

      return NextResponse.json(
        { success: false, user: null, message: 'Failed to fetch user' },
        { status: 200 }
      );
    }

    const userData = await response.json();
    
    const jsonResponse = NextResponse.json({
      success: true,
      user: userData,
    });

    if (accessToken) {
      jsonResponse.cookies.set(
        ACCESS_TOKEN_KEY,
        accessToken,
        getAuthCookieOptions(ACCESS_TOKEN_MAX_AGE)
      );
    }
    setUserDataCookie(jsonResponse, userData);
    
    return jsonResponse;
  } catch (error) {
    return NextResponse.json(
      { success: false, user: null, message: 'Server error' },
      { status: 200 }
    );
  }
}
