/**
 * POST /api/auth/logout
 * پاک کردن HttpOnly Cookies و User Data
 */

import { NextResponse } from 'next/server';
import { clearAuthCookies, clearTokens } from '@/lib/server/cookies';

export async function POST() {
  try {
    await clearTokens();
    
    const response = NextResponse.json({
      success: true,
      message: 'خروج موفقیت‌آمیز',
    });
    
    clearAuthCookies(response);
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    
    return NextResponse.json(
      { error: 'خطا در خروج' },
      { status: 500 }
    );
  }
}
