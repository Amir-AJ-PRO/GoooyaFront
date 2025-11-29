import { NextRequest, NextResponse } from 'next/server';
import { searchProperties } from '@/services/searchService';
import { SearchParams } from '@/types/search';

/**
 * جستجوی پیشرفته املاک
 * GET /api/search/properties
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
    
    // استخراج و تبدیل پارامترهای جستجو
    const params: SearchParams = {};
    
    // جستجوی متنی
    const q = searchParams.get('q');
    if (q) params.q = q;
    
    // فیلترهای مکانی
    const city = searchParams.get('city');
    if (city) params.city = parseInt(city);
    
    const location = searchParams.get('location');
    if (location) params.location = parseInt(location);
    
    // فیلترهای ملک
    const propertyType = searchParams.get('property_type');
    if (propertyType) params.property_type = parseInt(propertyType);
    
    const transactionType = searchParams.get('transaction_type');
    if (transactionType && (transactionType === 'sale' || transactionType === 'rent')) {
      params.transaction_type = transactionType;
    }
    
    // فیلترهای قیمت
    const minPrice = searchParams.get('min_price');
    if (minPrice) params.min_price = parseInt(minPrice);
    
    const maxPrice = searchParams.get('max_price');
    if (maxPrice) params.max_price = parseInt(maxPrice);
    
    // فیلترهای متراژ
    const minMeasure = searchParams.get('min_measure');
    if (minMeasure) params.min_measure = parseFloat(minMeasure);
    
    const maxMeasure = searchParams.get('max_measure');
    if (maxMeasure) params.max_measure = parseFloat(maxMeasure);
    
    // فیلترهای اتاق
    const rooms = searchParams.get('rooms');
    if (rooms) params.rooms = parseInt(rooms);
    
    const minRooms = searchParams.get('min_rooms');
    if (minRooms) params.min_rooms = parseInt(minRooms);
    
    // فیلترهای سال ساخت
    const minYearBuilt = searchParams.get('min_year_built');
    if (minYearBuilt) params.min_year_built = parseInt(minYearBuilt);
    
    const maxYearBuilt = searchParams.get('max_year_built');
    if (maxYearBuilt) params.max_year_built = parseInt(maxYearBuilt);
    
    // فیلترهای امکانات (Boolean)
    const booleanParams = [
      'has_parking', 'has_storage', 'has_elevator', 'has_balcony',
      'has_pool', 'has_security', 'urgent', 'under_price', 'exchange'
    ];
    
    const anyParams = params as any;
    booleanParams.forEach(param => {
      const value = searchParams.get(param);
      if (value === 'true') {
        anyParams[param] = true;
      } else if (value === 'false') {
        anyParams[param] = false;
      }
    });
    
    // Pagination
    const page = searchParams.get('page');
    if (page) {
      const pageNum = parseInt(page);
      if (pageNum > 0) params.page = pageNum;
    }
    
    const pageSize = searchParams.get('page_size');
    if (pageSize) {
      const pageSizeNum = parseInt(pageSize);
      if (pageSizeNum > 0 && pageSizeNum <= 100) {
        params.page_size = pageSizeNum;
      }
    }
    
    // مرتب‌سازی
    const sortBy = searchParams.get('sort_by');
    if (sortBy) {
      const validSorts = [
        'created_at', '-created_at', 'price', '-price', 
        'measure', '-measure', '_score'
      ];
      if (validSorts.includes(sortBy)) {
        params.sort_by = sortBy as any;
      }
    }
    
    // اعتبارسنجی پارامترها
    const validationError = validateSearchParams(params);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }
    
    // انجام جستجو
    const result = await searchProperties(params);
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('خطا در جستجوی املاک:', error);
    
    return NextResponse.json(
      { 
        error: 'خطا در انجام جستجو',
        details: error instanceof Error ? error.message : 'خطای ناشناخته'
      },
      { status: 500 }
    );
  }
}

/**
 * اعتبارسنجی پارامترهای جستجو
 */
function validateSearchParams(params: SearchParams): string | null {
  // بررسی محدوده قیمت
  if (params.min_price && params.max_price && params.min_price > params.max_price) {
    return 'حداقل قیمت نمی‌تواند بیشتر از حداکثر قیمت باشد';
  }
  
  // بررسی محدوده متراژ
  if (params.min_measure && params.max_measure && params.min_measure > params.max_measure) {
    return 'حداقل متراژ نمی‌تواند بیشتر از حداکثر متراژ باشد';
  }
  
  // بررسی محدوده سال ساخت
  if (params.min_year_built && params.max_year_built && params.min_year_built > params.max_year_built) {
    return 'حداقل سال ساخت نمی‌تواند بیشتر از حداکثر سال ساخت باشد';
  }
  
  // بررسی مقادیر منفی
  if (params.min_price && params.min_price < 0) {
    return 'حداقل قیمت نمی‌تواند منفی باشد';
  }
  
  if (params.max_price && params.max_price < 0) {
    return 'حداکثر قیمت نمی‌تواند منفی باشد';
  }
  
  if (params.min_measure && params.min_measure < 0) {
    return 'حداقل متراژ نمی‌تواند منفی باشد';
  }
  
  if (params.max_measure && params.max_measure < 0) {
    return 'حداکثر متراژ نمی‌تواند منفی باشد';
  }
  
  if (params.rooms && params.rooms < 0) {
    return 'تعداد اتاق نمی‌تواند منفی باشد';
  }
  
  if (params.min_rooms && params.min_rooms < 0) {
    return 'حداقل تعداد اتاق نمی‌تواند منفی باشد';
  }
  
  // بررسی سال ساخت
  const currentYear = new Date().getFullYear();
  if (params.min_year_built && (params.min_year_built < 1300 || params.min_year_built > currentYear)) {
    return 'سال ساخت نامعتبر است';
  }
  
  if (params.max_year_built && (params.max_year_built < 1300 || params.max_year_built > currentYear)) {
    return 'سال ساخت نامعتبر است';
  }
  
  // بررسی طول جستجوی متنی
  if (params.q && params.q.length > 200) {
    return 'متن جستجو نمی‌تواند بیشتر از 200 کاراکتر باشد';
  }
  
  return null;
}
