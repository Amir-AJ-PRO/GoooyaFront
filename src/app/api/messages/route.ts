import { NextRequest, NextResponse } from 'next/server';

/**
 * دریافت لیست پیام‌ها
 * GET /api/messages
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '20';

    // TODO: اتصال به Backend
    // const token = request.headers.get('Authorization');
    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_URL}/v1/messages?page=${page}&limit=${limit}`,
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
    console.error('Messages fetch error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت پیام‌ها' },
      { status: 500 }
    );
  }
}

/**
 * ارسال پیام جدید
 * POST /api/messages
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, content } = body;

    if (!to || !content) {
      return NextResponse.json(
        { error: 'گیرنده و محتوای پیام الزامی است' },
        { status: 400 }
      );
    }

    // TODO: اتصال به Backend
    // const token = request.headers.get('Authorization');
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/messages`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': token || '',
    //   },
    //   body: JSON.stringify(body),
    // });

    return NextResponse.json({
      success: true,
      message: 'پیام با موفقیت ارسال شد',
      data: body,
    });
  } catch (error) {
    console.error('Message send error:', error);
    return NextResponse.json(
      { error: 'خطا در ارسال پیام' },
      { status: 500 }
    );
  }
}

