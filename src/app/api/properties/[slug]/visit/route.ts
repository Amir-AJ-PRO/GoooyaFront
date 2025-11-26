import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/constants';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

/**
 * POST /api/properties/<slug>/visit/
 * ثبت درخواست بازدید مستقیماً با slug ملک در URL - پشتیبانی از slug های فارسی
 */
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // دریافت Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'نیاز به احراز هویت دارید' },
        { status: 401 }
      );
    }

    // دریافت slug از URL params
    const { slug } = await context.params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'اسلاگ ملک الزامی است' },
        { status: 400 }
      );
    }

    // Decode Persian characters in slug
    const decodedSlug = decodeURIComponent(slug);

    console.log('🎫 درخواست ثبت تیکت بازدید (با slug در URL):', {
      originalSlug: slug,
      decodedSlug,
      authHeader: authHeader.substring(0, 20) + '...'
    });

    // ارسال درخواست به backend
    const backendResponse = await fetch(`${API_BASE_URL}/v1/properties/visit-tickets/create/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify({ property_slug: decodedSlug }),
    });

    // بررسی Content-Type قبل از parse کردن JSON
    const contentType = backendResponse.headers.get('content-type');
    let responseData;

    if (contentType && contentType.includes('application/json')) {
      responseData = await backendResponse.json();
    } else {
      // اگر response JSON نیست، متن خام رو بخون
      const textResponse = await backendResponse.text();
      console.error('❌ Backend response is not JSON:', {
        status: backendResponse.status,
        statusText: backendResponse.statusText,
        contentType,
        body: textResponse.substring(0, 500)
      });
      
      // اگر response موفق نبود، خطای مناسب برگردون
      if (!backendResponse.ok) {
        let errorMessage = `خطا در ارتباط با سرور (${backendResponse.status})`;
        
        switch (backendResponse.status) {
          case 404:
            errorMessage = 'ملک یافت نشد یا در دسترس نیست';
            break;
          case 401:
            errorMessage = 'نیاز به احراز هویت دارید';
            break;
          case 403:
            errorMessage = 'شما مجوز دسترسی به این عملیات را ندارید';
            break;
          case 500:
            errorMessage = 'خطای داخلی سرور. لطفاً دوباره تلاش کنید';
            break;
        }
        
        return NextResponse.json(
          { error: errorMessage },
          { status: backendResponse.status }
        );
      }
      
      // اگر response موفق بود ولی JSON نبود
      responseData = { 
        message: 'درخواست بازدید با موفقیت ثبت شد.',
        ticket: {
          property_slug: decodedSlug,
          created_at: new Date().toISOString(),
          is_reviewed: false
        }
      };
    }

    if (!backendResponse.ok) {
      // اگر خطای تیکت تکراری باشد
      if (backendResponse.status === 400 && responseData.existing_ticket) {
        return NextResponse.json(responseData, { status: 400 });
      }
      
      // سایر خطاها
      let errorMessage = 'خطا در ثبت درخواست بازدید';
      
      if (responseData.error) {
        errorMessage = responseData.error;
      } else if (responseData.detail) {
        errorMessage = responseData.detail;
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: backendResponse.status }
      );
    }

    console.log('✅ تیکت بازدید با موفقیت ثبت شد (slug URL):', responseData);

    // پاسخ موفق
    return NextResponse.json(responseData, { status: 201 });

  } catch (error) {
    console.error('❌ خطا در API ثبت تیکت بازدید (slug URL):', error);
    return NextResponse.json(
      { error: 'خطای داخلی سرور' },
      { status: 500 }
    );
  }
}
