import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/constants';

/**
 * POST /api/properties/visit-tickets/create/
 * ثبت درخواست بازدید برای ملک مشخص با ارسال slug ملک در body درخواست
 */
export async function POST(request: NextRequest) {
  try {
    // دریافت Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'نیاز به احراز هویت دارید' },
        { status: 401 }
      );
    }

    // دریافت body درخواست
    const body = await request.json();
    const { property_slug } = body;

    if (!property_slug) {
      return NextResponse.json(
        { error: 'اسلاگ ملک الزامی است' },
        { status: 400 }
      );
    }

    console.log('🎫 درخواست ثبت تیکت بازدید:', {
      property_slug,
      property_slug_type: typeof property_slug,
      property_slug_length: property_slug?.length,
      authHeader: authHeader.substring(0, 20) + '...'
    });

    // تست چندین URL مختلف برای backend
    const possibleUrls = [
      `${API_BASE_URL}/v1/properties/visit-tickets/create/`,
      `${API_BASE_URL}/api/properties/visit-tickets/create/`,
      `${API_BASE_URL}/properties/visit-tickets/create/`,
      `${API_BASE_URL}/v1/properties/${property_slug}/visit/`,
      `${API_BASE_URL}/api/properties/${property_slug}/visit/`,
      `${API_BASE_URL}/properties/${property_slug}/visit/`,
    ];

    let backendResponse;
    let successfulUrl = null;

    // تست هر URL تا یکی کار کنه
    for (const url of possibleUrls) {
      try {
        console.log(`🔍 تست URL: ${url}`);
        
        backendResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authHeader,
          },
          body: JSON.stringify({ property_slug }),
        });

        if (backendResponse.status !== 404) {
          successfulUrl = url;
          console.log(`✅ URL موفق: ${url} (status: ${backendResponse.status})`);
          break;
        } else {
          console.log(`❌ URL ناموفق: ${url} (404)`);
        }
      } catch (error) {
        console.log(`❌ خطا در URL: ${url}`, error);
        continue;
      }
    }

    if (!successfulUrl) {
      console.error('❌ هیچ URL موفقی یافت نشد');
      return NextResponse.json(
        { error: 'سرویس درخواست بازدید در حال حاضر در دسترس نیست' },
        { status: 503 }
      );
    }

    // اگر به هر دلیلی پاسخی از backend نداریم
    if (!backendResponse) {
      return NextResponse.json(
        { error: 'پاسخی از سرور دریافت نشد' },
        { status: 502 }
      );
    }

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
        
        // تلاش برای استخراج پیام خطا از HTML response
        if (textResponse.includes('<!DOCTYPE') || textResponse.includes('<html')) {
          // اگر HTML response است، پیام کلی برگردان
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
            default:
              errorMessage = `خطا در سرور (کد ${backendResponse.status})`;
          }
        } else {
          // اگر متن ساده است، آن را به عنوان پیام خطا استفاده کن
          errorMessage = textResponse.trim() || errorMessage;
        }
        
        return NextResponse.json(
          { error: errorMessage },
          { status: backendResponse.status }
        );
      }
      
      // اگر response موفق بود ولی JSON نبود
      responseData = { message: 'درخواست با موفقیت ارسال شد' };
    }

    if (!backendResponse.ok) {
      // اگر خطای تیکت تکراری باشد
      if (backendResponse.status === 400 && responseData.existing_ticket) {
        return NextResponse.json(responseData, { status: 400 });
      }
      
      // سایر خطاها - نمایش کامل پیام خطا از backend
      let errorMessage = 'خطا در ثبت درخواست بازدید';
      
      if (responseData.error) {
        errorMessage = responseData.error;
      } else if (responseData.detail) {
        errorMessage = responseData.detail;
      } else if (responseData.message) {
        errorMessage = responseData.message;
      } else if (typeof responseData === 'string') {
        errorMessage = responseData;
      }
      
      // اگر پیام خطا آرایه است (مثل validation errors)
      if (Array.isArray(responseData)) {
        errorMessage = responseData.join(', ');
      }
      
      // اگر object پیچیده‌ای است، تمام پیام‌های خطا را استخراج کن
      if (typeof responseData === 'object' && responseData !== null) {
        const errorMessages = [];
        
        // بررسی فیلدهای مختلف خطا
        for (const [key, value] of Object.entries(responseData)) {
          if (key !== 'existing_ticket' && value) {
            if (Array.isArray(value)) {
              errorMessages.push(`${key}: ${value.join(', ')}`);
            } else if (typeof value === 'string') {
              errorMessages.push(value);
            }
          }
        }
        
        if (errorMessages.length > 0) {
          errorMessage = errorMessages.join(' | ');
        }
      }
      
      return NextResponse.json(
        { error: errorMessage },
        { status: backendResponse.status }
      );
    }

    console.log('✅ تیکت بازدید با موفقیت ثبت شد:', responseData);

    // پاسخ موفق
    return NextResponse.json(responseData, { status: 201 });

  } catch (error) {
    console.error('❌ خطا در API ثبت تیکت بازدید:', error);
    return NextResponse.json(
      { error: 'خطای داخلی سرور' },
      { status: 500 }
    );
  }
}
