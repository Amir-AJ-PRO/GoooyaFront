import { NextRequest, NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/constants';

// استفاده از helper function برای دریافت base URL
const API_BASE_URL = getApiBaseUrl();

/**
 * دریافت لیست املاک
 * GET /api/properties/list/
 * 
 * دریافت لیست تمام املاک‌هایی که وضعیت نمایش آن‌ها ok است.
 * این endpoint برای کاربران غیراحراز هویت شده نیز قابل دسترسی است و از Pagination پشتیبانی می‌کند.
 * 
 * @param request NextRequest شامل query parameters
 * @returns PaginatedPropertiesResponse نتایج با pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // استخراج پارامترهای query string
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('page_size') || '20';
    
    // تبدیل به عدد و اعتبارسنجی
    const pageNum = parseInt(page);
    const pageSizeNum = parseInt(pageSize);
    
    // اعتبارسنجی page
    if (isNaN(pageNum) || pageNum < 1) {
      return NextResponse.json(
        { error: 'پارامتر page باید یک عدد صحیح مثبت باشد' },
        { status: 400 }
      );
    }
    
    // اعتبارسنجی page_size (حداکثر 100)
    if (isNaN(pageSizeNum) || pageSizeNum < 1) {
      return NextResponse.json(
        { error: 'پارامتر page_size باید یک عدد صحیح مثبت باشد' },
        { status: 400 }
      );
    }
    
    if (pageSizeNum > 100) {
      return NextResponse.json(
        { error: 'پارامتر page_size نمی‌تواند بیشتر از 100 باشد' },
        { status: 400 }
      );
    }
    
    // ساخت URL برای backend
    const backendUrl = new URL(`${API_BASE_URL}/api/properties/list/`);
    backendUrl.searchParams.set('page', pageNum.toString());
    backendUrl.searchParams.set('page_size', pageSizeNum.toString());try {
      const backendResponse = await fetch(backendUrl.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // کش 5 دقیقه‌ای (300 ثانیه) - هر صفحه به صورت جداگانه کش می‌شود
        next: { revalidate: 300 }
      });
      
      if (!backendResponse.ok) {
        const errorText = await backendResponse.text();
        console.error('❌ خطا از backend:', {
          status: backendResponse.status,
          statusText: backendResponse.statusText,
          error: errorText,
          url: backendUrl.toString()
        });
        
        return NextResponse.json(
          { 
            error: 'خطا در دریافت لیست املاک',
            details: errorText,
            status: backendResponse.status
          },
          { status: backendResponse.status }
        );
      }
      
      const contentType = backendResponse.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('❌ پاسخ backend از نوع JSON نیست:', contentType);
        return NextResponse.json(
          { error: 'پاسخ نامعتبر از سرور' },
          { status: 500 }
        );
      }
      
      const data = await backendResponse.json();// برگرداندن پاسخ بدون تغییر
      return NextResponse.json(data);
      
    } catch (fetchError: any) {
      console.error('❌ خطا در fetch:', {
        error: fetchError.message,
        stack: fetchError.stack,
        url: backendUrl.toString()
      });
      
      return NextResponse.json(
        { 
          error: 'خطا در اتصال به سرور',
          details: fetchError.message || 'خطای ناشناخته در ارتباط با backend'
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('❌ خطا در API لیست املاک:', error);
    
    return NextResponse.json(
      { 
        error: 'خطا در دریافت لیست املاک',
        details: error instanceof Error ? error.message : 'خطای ناشناخته'
      },
      { status: 500 }
    );
  }
}

