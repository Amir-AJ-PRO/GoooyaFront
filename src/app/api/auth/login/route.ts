/**
 * POST /api/auth/login
 * دریافت OTP و تبدیل به HttpOnly Cookie
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  ACCESS_TOKEN_KEY,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_KEY,
  REFRESH_TOKEN_MAX_AGE,
  getAuthCookieOptions,
  setUserDataCookie,
} from '@/lib/server/cookies';

const loginSchema = z.object({
  phone: z.string().min(10),
  code: z.string().min(4),
});

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
    
    jsonResponse.cookies.set(
      ACCESS_TOKEN_KEY,
      data.access,
      getAuthCookieOptions(ACCESS_TOKEN_MAX_AGE)
    );
    jsonResponse.cookies.set(
      REFRESH_TOKEN_KEY,
      data.refresh,
      getAuthCookieOptions(REFRESH_TOKEN_MAX_AGE)
    );
    setUserDataCookie(jsonResponse, data.user);
    
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
