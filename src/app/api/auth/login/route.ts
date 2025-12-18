/**
 * POST /api/auth/login
 * دریافت OTP و تبدیل به HttpOnly Cookie
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { cookies } from 'next/headers';

const loginSchema = z.object({
  phone: z.string().min(10),
  code: z.string().min(4),
});

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// زمان انقضای توکن‌ها (بر اساس تنظیمات Backend)
const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 دقیقه
const REFRESH_TOKEN_MAX_AGE = 30 * 24 * 60 * 60; // 30 روز

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, code } = loginSchema.parse(body);

    // ارسال به Backend Django
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.goooya.ir';
    const response = await fetch(`${backendUrl}/api/auth/verify-otp/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone, code }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.detail || 'خطا در ورود' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // ساخت Response با Cookie
    const jsonResponse = NextResponse.json({
      success: true,
      user: data.user,
      created: data.created,
    });
    
    // Set کردن Cookie ها مستقیماً در Response با maxAge مناسب
    const baseCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      path: '/',
    };
    
    // Access Token با عمر 15 دقیقه
    jsonResponse.cookies.set(ACCESS_TOKEN_KEY, data.access, {
      ...baseCookieOptions,
      maxAge: ACCESS_TOKEN_MAX_AGE,
    });
    
    // Refresh Token با عمر 30 روز
    jsonResponse.cookies.set(REFRESH_TOKEN_KEY, data.refresh, {
      ...baseCookieOptions,
      maxAge: REFRESH_TOKEN_MAX_AGE,
    });
    
    // ذخیره User Data در cookie (غیر HttpOnly تا JavaScript بتونه بخونه)
    // این کار کمک می‌کنه که بعد از refresh صفحه، user data رو داشته باشیم
    jsonResponse.cookies.set('user_data', JSON.stringify(data.user), {
      httpOnly: false, // قابل خواندن برای JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: REFRESH_TOKEN_MAX_AGE, // 30 روز (مثل refresh token)
    });
    
    console.log('✅ Tokens set in response cookies');
    console.log('Access token length:', data.access?.length);
    console.log('Refresh token length:', data.refresh?.length);

    return jsonResponse;
  } catch (error) {
    console.error('Login error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'داده‌های ورودی نامعتبر', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'خطای سرور' },
      { status: 500 }
    );
  }
}
