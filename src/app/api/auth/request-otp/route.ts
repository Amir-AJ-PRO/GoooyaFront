/**
 * POST /api/auth/request-otp
 * درخواست کد OTP
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const requestOtpSchema = z.object({
  phone: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone } = requestOtpSchema.parse(body);

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.goooya.ir';
    const response = await fetch(`${backendUrl}/api/auth/request-otp/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || 'خطا در ارسال کد' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.detail,
      otp: data.otp, // فقط در development
    });
  } catch (error) {
    console.error('Request OTP error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'شماره تلفن نامعتبر', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'خطای سرور' },
      { status: 500 }
    );
  }
}

