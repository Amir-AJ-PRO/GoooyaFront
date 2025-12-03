import { NextRequest, NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/constants';

// استفاده از helper function برای دریافت base URL
const API_BASE_URL = getApiBaseUrl();

/**
 * جستجوی پیشرفته املاک
 * GET /api/search/properties/
 * 
 * @description
 * جستجوی پیشرفته و قدرتمند املاک با استفاده از Elasticsearch.
 * این endpoint امکان جستجوی متنی، فیلتر بر اساس شهر، منطقه، نوع ملک، 
 * قیمت، متراژ و امکانات را فراهم می‌کند.
 * 
 * @param request NextRequest شامل query parameters
 * @returns SearchResult نتایج جستجو با pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // ساخت query string از پارامترهای دریافتی
    // همه پارامترها را مستقیماً به backend می‌فرستیم
    const queryParams = new URLSearchParams();
    
    // اضافه کردن همه پارامترها از searchParams اصلی
    searchParams.forEach((value, key) => {
      queryParams.append(key, value);
    });
    
    // درخواست به Django backend
    const backendUrl = `${API_BASE_URL}/api/search/properties/?${queryParams.toString()}`;
    
    try {
      const response = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json(
          { 
            error: 'خطا در انجام جستجو',
            details: errorText,
            status: response.status
          },
          { status: response.status }
        );
      }
      
      const result = await response.json();
      return NextResponse.json(result);
    } catch (fetchError: any) {
      return NextResponse.json(
        { 
          error: 'خطا در اتصال به سرور',
          details: fetchError.message || 'خطای ناشناخته در ارتباط با backend'
        },
        { status: 500 }
      );
    }
    
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'خطا در انجام جستجو',
        details: error instanceof Error ? error.message : 'خطای ناشناخته'
      },
      { status: 500 }
    );
  }
}
