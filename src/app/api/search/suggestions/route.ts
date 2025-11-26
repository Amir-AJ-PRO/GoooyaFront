import { NextRequest, NextResponse } from 'next/server';
import { getSearchSuggestions } from '@/services/searchService';

/**
 * دریافت پیشنهادات جستجو (Autocomplete)
 * GET /api/search/suggestions
 * 
 * @description
 * این endpoint پیشنهادات جستجو را بر اساس متن ورودی کاربر ارائه می‌دهد.
 * از Elasticsearch برای پیشنهادات سریع و دقیق استفاده می‌کند.
 * 
 * @param request NextRequest شامل query parameter 'q'
 * @returns Array<string> لیست پیشنهادات
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    
    // بررسی وجود پارامتر جستجو
    if (!query) {
      return NextResponse.json(
        { error: 'پارامتر جستجو (q) الزامی است' },
        { status: 400 }
      );
    }
    
    // بررسی طول متن جستجو
    if (query.length < 2) {
      return NextResponse.json(
        { suggestions: [] }
      );
    }
    
    if (query.length > 100) {
      return NextResponse.json(
        { error: 'متن جستجو نمی‌تواند بیشتر از 100 کاراکتر باشد' },
        { status: 400 }
      );
    }
    
    // دریافت پیشنهادات
    const suggestions = await getSearchSuggestions(query);
    
    return NextResponse.json({
      suggestions,
      query
    });
    
  } catch (error) {
    console.error('خطا در دریافت پیشنهادات جستجو:', error);
    
    return NextResponse.json(
      { 
        error: 'خطا در دریافت پیشنهادات',
        suggestions: []
      },
      { status: 500 }
    );
  }
}
