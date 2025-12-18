import { NextRequest, NextResponse } from 'next/server';
import { withApiHandler, backendFetch, AuthenticatedRequest } from '@/lib/server/api-handler';
import { z } from 'zod';

/**
 * Query schema برای لیست کاربران
 */
const getUsersSchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('10'),
  type: z.enum(['user', 'agent', 'admin']).optional(),
});

/**
 * GET /api/users
 * دریافت لیست کاربران (فقط برای ادمین)
 */
export const GET = withApiHandler<any>(
  async (request: NextRequest) => {
    const { page, limit, type } = (request as any).validatedQuery;
    
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(type && { type }),
    });

    const response = await backendFetch(`/v1/users?${queryParams}`);
    
    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.detail || 'خطا در دریافت لیست کاربران' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      data: data.results || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: data.count || 0,
        totalPages: Math.ceil((data.count || 0) / parseInt(limit)),
      },
    });
  },
  {
    requireAuth: 'admin',
    querySchema: getUsersSchema,
    csrfProtection: false,
  }
);

/**
 * Schema برای ایجاد کاربر
 */
const createUserSchema = z.object({
  name: z.string().min(2, 'نام حداقل 2 کاراکتر باید باشد'),
  email: z.string().email('ایمیل معتبر نیست').optional(),
  phone: z.string().min(10, 'شماره تلفن معتبر نیست'),
  password: z.string().min(6, 'رمز عبور حداقل 6 کاراکتر باید باشد'),
  type: z.enum(['user', 'agent', 'admin']).optional().default('user'),
});

/**
 * POST /api/users
 * ایجاد کاربر جدید (فقط برای ادمین)
 */
export const POST = withApiHandler<any>(
  async (request: NextRequest) => {
    const userData = (request as any).validatedBody;

    const response = await backendFetch('/v1/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.detail || 'خطا در ایجاد کاربر' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: 'کاربر با موفقیت ایجاد شد',
      data,
    });
  },
  {
    requireAuth: 'admin',
    bodySchema: createUserSchema,
  }
);
