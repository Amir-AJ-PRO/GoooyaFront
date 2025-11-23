import { NextRequest, NextResponse } from 'next/server';

/**
 * دریافت لیست کاربران (فقط برای ادمین)
 * GET /api/users
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const type = searchParams.get('type');

    // TODO: اتصال به Backend
    // const token = request.headers.get('Authorization');
    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_URL}/v1/users?page=${page}&limit=${limit}`,
    //   {
    //     headers: {
    //       'Authorization': token || '',
    //     },
    //   }
    // );

    return NextResponse.json({
      success: true,
      data: [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 0,
        totalPages: 0,
      },
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت لیست کاربران' },
      { status: 500 }
    );
  }
}

/**
 * ایجاد کاربر جدید (فقط برای ادمین)
 * POST /api/users
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: اتصال به Backend
    // const token = request.headers.get('Authorization');
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/users`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': token || '',
    //   },
    //   body: JSON.stringify(body),
    // });

    return NextResponse.json({
      success: true,
      message: 'کاربر با موفقیت ایجاد شد',
      data: body,
    });
  } catch (error) {
    console.error('User creation error:', error);
    return NextResponse.json(
      { error: 'خطا در ایجاد کاربر' },
      { status: 500 }
    );
  }
}

