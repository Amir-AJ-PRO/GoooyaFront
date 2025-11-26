import { NextRequest, NextResponse } from 'next/server';
import { 
  initializeSearchIndex, 
  populateSearchIndex, 
  getIndexStatus 
} from '@/lib/searchIndexManager';

/**
 * دریافت وضعیت Index جستجو
 * GET /api/admin/search-index
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: بررسی دسترسی ادمین
    // const token = request.headers.get('Authorization');
    // if (!isAdmin(token)) {
    //   return NextResponse.json({ error: 'دسترسی غیرمجاز' }, { status: 403 });
    // }

    const status = await getIndexStatus();
    
    return NextResponse.json({
      success: true,
      data: status
    });
  } catch (error) {
    console.error('خطا در دریافت وضعیت Index:', error);
    
    return NextResponse.json(
      { 
        error: 'خطا در دریافت وضعیت Index',
        details: error instanceof Error ? error.message : 'خطای ناشناخته'
      },
      { status: 500 }
    );
  }
}

/**
 * مدیریت Index جستجو
 * POST /api/admin/search-index
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: بررسی دسترسی ادمین
    // const token = request.headers.get('Authorization');
    // if (!isAdmin(token)) {
    //   return NextResponse.json({ error: 'دسترسی غیرمجاز' }, { status: 403 });
    // }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'create':
        const createResult = await initializeSearchIndex();
        return NextResponse.json(createResult);

      case 'populate':
        const populateResult = await populateSearchIndex();
        return NextResponse.json(populateResult);

      default:
        return NextResponse.json(
          { error: 'عمل نامعتبر. اعمال مجاز: create, populate' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('خطا در مدیریت Index:', error);
    
    return NextResponse.json(
      { 
        error: 'خطا در مدیریت Index',
        details: error instanceof Error ? error.message : 'خطای ناشناخته'
      },
      { status: 500 }
    );
  }
}
