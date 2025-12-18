import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler, backendFetch, AuthenticatedRequest } from '@/lib/server/api-handler';
import { z } from 'zod';

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/users/[id]
 * دریافت اطلاعات یک کاربر
 */
export const GET = withApiHandler<any>(
  async (request: NextRequest, context: RouteContext) => {
    const { id } = await context.params;

    const response = await backendFetch(`/v1/users/${id}`);

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.detail || 'خطا در دریافت اطلاعات کاربر' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data,
    });
  },
  {
    requireAuth: 'admin-agent',
    csrfProtection: false,
  }
);

/**
 * Schema برای بروزرسانی کاربر
 */
const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  type: z.enum(['user', 'agent', 'admin']).optional(),
});

/**
 * PATCH /api/users/[id]
 * بروزرسانی کاربر
 */
export const PATCH = withApiHandler<any>(
  async (request: NextRequest, context: RouteContext) => {
    const { id } = await context.params;
    const updateData = (request as any).validatedBody;

    const response = await backendFetch(`/v1/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.detail || 'خطا در بروزرسانی کاربر' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: 'کاربر با موفقیت بروزرسانی شد',
      data,
    });
  },
  {
    requireAuth: 'admin',
    bodySchema: updateUserSchema,
  }
);
