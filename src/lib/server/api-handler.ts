import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken, refreshAccessToken, checkUserAccess, verifyCsrfToken } from './auth';
import { z } from 'zod';

/**
 * API Route Handler با امنیت و validation
 */

interface ApiHandlerOptions {
  /**
   * نوع کاربر مورد نیاز برای دسترسی
   */
  requireAuth?: 'user' | 'agent' | 'admin' | 'admin-agent' | false;
  
  /**
   * بررسی CSRF برای POST/PUT/DELETE
   */
  csrfProtection?: boolean;
  
  /**
   * Schema validation با Zod
   */
  bodySchema?: z.ZodSchema;
  
  /**
   * Schema validation برای query parameters
   */
  querySchema?: z.ZodSchema;
}

type ApiHandler<T = any> = (
  request: NextRequest,
  context: { params: Promise<any> }
) => Promise<NextResponse>;

/**
 * Wrapper برای API routes با امنیت خودکار
 */
export function withApiHandler<T = any>(
  handler: ApiHandler<T>,
  options: ApiHandlerOptions = {}
): ApiHandler<T> {
  const {
    requireAuth = false,
    csrfProtection = true,
    bodySchema,
    querySchema,
  } = options;

  return async (request: NextRequest, context: { params: Promise<any> }) => {
    try {
      // 1. بررسی احراز هویت
      if (requireAuth !== false) {
        const token = await getAccessToken();
        
        if (!token) {
          // سعی در رفرش token
          const refreshed = await refreshAccessToken();
          
          if (!refreshed) {
            return NextResponse.json(
              { error: 'نیاز به احراز هویت دارید', code: 'UNAUTHORIZED' },
              { status: 401 }
            );
          }
        }
        
        // بررسی دسترسی
        const { hasAccess, user } = await checkUserAccess(requireAuth);
        
        if (!hasAccess) {
          return NextResponse.json(
            { error: 'شما دسترسی لازم را ندارید', code: 'FORBIDDEN' },
            { status: 403 }
          );
        }
        
        // اضافه کردن user به request برای استفاده در handler
        (request as any).user = user;
      }
      
      // 2. بررسی CSRF برای درخواست‌های تغییردهنده
      if (
        csrfProtection &&
        ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)
      ) {
        const isValid = await verifyCsrfToken(request);
        
        if (!isValid) {
          return NextResponse.json(
            { error: 'توکن CSRF نامعتبر است', code: 'CSRF_ERROR' },
            { status: 403 }
          );
        }
      }
      
      // 3. Validation body
      if (bodySchema && request.method !== 'GET') {
        try {
          const body = await request.json();
          const validated = bodySchema.parse(body);
          (request as any).validatedBody = validated;
        } catch (error) {
          if (error instanceof z.ZodError) {
            return NextResponse.json(
              {
                error: 'داده‌های ورودی نامعتبر است',
                code: 'VALIDATION_ERROR',
                details: error.errors,
              },
              { status: 400 }
            );
          }
          throw error;
        }
      }
      
      // 4. Validation query parameters
      if (querySchema) {
        try {
          const queryParams = Object.fromEntries(request.nextUrl.searchParams);
          const validated = querySchema.parse(queryParams);
          (request as any).validatedQuery = validated;
        } catch (error) {
          if (error instanceof z.ZodError) {
            return NextResponse.json(
              {
                error: 'پارامترهای جستجو نامعتبر است',
                code: 'VALIDATION_ERROR',
                details: error.errors,
              },
              { status: 400 }
            );
          }
          throw error;
        }
      }
      
      // 5. اجرای handler اصلی
      return await handler(request, context);
      
    } catch (error) {
      // مدیریت خطاهای غیرمنتظره
      console.error('API Handler Error:', {
        url: request.url,
        method: request.method,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      return NextResponse.json(
        {
          error: 'خطای سرور',
          code: 'INTERNAL_ERROR',
          ...(process.env.NODE_ENV === 'development' && {
            details: error instanceof Error ? error.message : String(error),
          }),
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Helper برای ارسال درخواست به Backend با token خودکار
 */
export async function backendFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getAccessToken();
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  
  // اگر 401 بود، سعی در رفرش کن
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    
    if (refreshed) {
      const newToken = await getAccessToken();
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
        
        return await fetch(`${API_BASE_URL}${path}`, {
          ...options,
          headers,
        });
      }
    }
  }
  
  return response;
}

/**
 * Type helper برای دریافت user از request
 */
export interface AuthenticatedRequest extends NextRequest {
  user: {
    userId: string;
    userType: 'user' | 'agent' | 'admin';
    email?: string;
    phone?: string;
    name?: string;
  };
  validatedBody?: any;
  validatedQuery?: any;
}

