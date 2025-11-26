import { NextRequest, NextResponse } from 'next/server';

type RouteContext = {
  params: { slug: string };
};

/**
 * ایجاد نظر جدید
 * POST /api/blog/api/[slug]/comments/create/
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { slug } = context.params;
    const body = await request.json();
    
    const { name, email, body: commentBody } = body;

    // اعتبارسنجی
    if (!name || !email || !commentBody) {
      return NextResponse.json(
        { error: 'نام، ایمیل و متن نظر الزامی است' },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: 'نام نمی‌تواند بیشتر از 100 کاراکتر باشد' },
        { status: 400 }
      );
    }

    // بررسی فرمت ایمیل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'فرمت ایمیل نامعتبر است' },
        { status: 400 }
      );
    }

    // TODO: اتصال به Backend
    // const response = await apiClient.post(`/v1/blog/api/${slug}/comments/create/`, {
    //   name,
    //   email,
    //   body: commentBody
    // });
    // return NextResponse.json(response.data, { status: 201 });

    // Mock response
    const mockResponse = {
      detail: "نظر شما با موفقیت ثبت شد و پس از تایید نمایش داده خواهد شد.",
      comment: {
        id: Date.now(), // Mock ID
        name,
        email,
        body: commentBody,
        is_pub: false,
        created: new Date().toISOString(),
        is_answered: false,
        replycomment: []
      }
    };

    return NextResponse.json(mockResponse, { status: 201 });

  } catch (error) {
    console.error('خطا در ایجاد نظر:', error);
    
    return NextResponse.json(
      { 
        error: 'خطا در ثبت نظر',
        details: error instanceof Error ? error.message : 'خطای ناشناخته'
      },
      { status: 500 }
    );
  }
}
