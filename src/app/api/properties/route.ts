import { NextRequest, NextResponse } from 'next/server';

/**
 * دریافت لیست املاک
 * GET /api/properties
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '10';
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // TODO: اتصال به Backend
    // const response = await fetch(
    //   `${process.env.NEXT_PUBLIC_API_URL}/v1/properties?page=${page}&limit=${limit}...`,
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // );

    // Mock response
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
    console.error('Properties fetch error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت لیست املاک' },
      { status: 500 }
    );
  }
}

/**
 * ایجاد ملک جدید
 * POST /api/properties
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // TODO: اتصال به Backend
    // const token = request.headers.get('Authorization');
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/properties`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': token || '',
    //   },
    //   body: JSON.stringify(body),
    // });

    return NextResponse.json({
      success: true,
      message: 'ملک با موفقیت ثبت شد',
      data: body,
    });
  } catch (error) {
    console.error('Property creation error:', error);
    return NextResponse.json(
      { error: 'خطا در ثبت ملک' },
      { status: 500 }
    );
  }
}

