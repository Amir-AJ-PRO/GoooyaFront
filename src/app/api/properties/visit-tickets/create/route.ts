import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler, backendFetch } from '@/lib/server/api-handler';
import { z } from 'zod';

/**
 * Schema validation برای ثبت تیکت بازدید
 */
const createTicketSchema = z.object({
  property_slug: z.string().min(1, 'اسلاگ ملک الزامی است').max(200, 'اسلاگ خیلی طولانی است'),
});

/**
 * POST /api/properties/visit-tickets/create/
 * ثبت درخواست بازدید برای ملک مشخص - نسخه امن
 */
export const POST = withApiHandler<any>(
  async (request: NextRequest) => {
    const { property_slug } = (request as any).validatedBody;
    
    // ارسال به backend با token خودکار
    const response = await backendFetch('/v1/properties/visit-tickets/create/', {
      method: 'POST',
      body: JSON.stringify({ property_slug }),
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
        { error: data.detail || data.error || 'خطا در ثبت تیکت' },
        { status: response.status }
      );
    }
    
    return NextResponse.json({
      success: true,
      data,
    });
  },
  {
    requireAuth: 'user',
    bodySchema: createTicketSchema,
  }
);
