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
    
    console.log('🔍 Checking cookies in /api/auth/me');
    console.log('Access token exists:', !!accessToken);
    console.log('Access token length:', accessToken?.length);
    console.log('All cookies:', cookieStore.getAll().map(c => c.name));
    
    if (!accessToken) {
      console.log('❌ No access token found in cookies');
      return NextResponse.json(
        { error: 'احراز هویت نشده' },
        { status: 401 }
      );
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.goooya.ir';
    
    // امتحان endpoint های مختلف تا endpoint صحیح پیدا بشه
    const endpoints = [
      '/api/auth/me/',
      '/api/users/me/',
      '/v1/users/me/',
      '/v1/auth/me/',
    ];
    
    let response: Response | null = null;
    let successEndpoint = '';
    
    console.log('🔍 Trying to find correct backend endpoint...');
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🔄 Testing endpoint: ${backendUrl}${endpoint}`);
        const testResponse = await fetch(`${backendUrl}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        
        console.log(`📬 Endpoint ${endpoint} returned status: ${testResponse.status}`);
        
        // قبول می‌کنیم: 200 (OK), 401 (Unauthorized - endpoint درسته اما token منقضی شده)
        // رد می‌کنیم: 404 (Not Found), 405 (Method Not Allowed)
        if (testResponse.ok || testResponse.status === 401) {
          response = testResponse;
          successEndpoint = endpoint;
          console.log(`✅ Found working endpoint: ${endpoint} (status: ${testResponse.status})`);
          break;
        }
      } catch (error) {
        console.log(`❌ Endpoint ${endpoint} failed with error:`, error);
      }
    }
    
    if (!response) {
      console.log('❌ No working endpoint found - all endpoints returned 404 or error');
      console.log('⚠️ Backend might not have /me endpoint implemented yet');
      console.log('⚠️ Keeping user logged in despite this error');
      
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
      console.log('⚠️ Access token expired, trying refresh...');
      
      const refreshToken = cookieStore.get(REFRESH_TOKEN_KEY)?.value;
      
      if (!refreshToken) {
        console.log('❌ No refresh token found');
        
        // پاک کردن Cookie ها
        const jsonResponse = NextResponse.json(
          { error: 'نشست منقضی شده' },
          { status: 401 }
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
        console.log('❌ Refresh failed');
        
        const jsonResponse = NextResponse.json(
          { error: 'نشست منقضی شده' },
          { status: 401 }
        );
        jsonResponse.cookies.delete(ACCESS_TOKEN_KEY);
        jsonResponse.cookies.delete(REFRESH_TOKEN_KEY);
        return jsonResponse;
      }

      const refreshData = await refreshResponse.json();
      console.log('✅ Token refreshed');
      
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
      console.log('❌ Backend error:', response.status);
      
      const jsonResponse = NextResponse.json(
        { error: 'خطا در دریافت اطلاعات' },
        { status: response.status }
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
    console.log('✅ User data fetched successfully');
    
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
    console.error('Get user error:', error);
    
    return NextResponse.json(
      { error: 'خطای سرور' },
      { status: 500 }
    );
  }
}
