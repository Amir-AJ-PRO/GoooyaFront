import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler, backendFetch } from '@/lib/server/api-handler';
import { decodePathSlug } from '@/lib/utils';
import { z } from 'zod';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

/**
 * POST /api/properties/[slug]/visit/
 * ثبت درخواست بازدید مستقیماً با slug ملک در URL - نسخه امن
 */
export const POST = withApiHandler<any>(
  async (request: NextRequest, context: RouteContext) => {
    const { slug } = await context.params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'اسلاگ ملک الزامی است' },
        { status: 400 }
      );
    }

    const decodedSlug = decodePathSlug(slug);

    // ارسال به backend
    const response = await backendFetch('/v1/properties/visit-tickets/create/', {
      method: 'POST',
      body: JSON.stringify({ property_slug: decodedSlug }),
    });

    const contentType = response.headers.get('content-type');
    
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'پاسخ نامعتبر از سرور' },
        { status: 500 }
      );
    }

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.detail || data.error || 'خطا در ثبت تیکت',
          ...(data.existing_ticket && { existing_ticket: data.existing_ticket }),
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || 'درخواست بازدید با موفقیت ثبت شد',
      data,
    });
  },
  {
    requireAuth: 'user',
  }
);
