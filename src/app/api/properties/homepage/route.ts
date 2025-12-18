import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from '@/lib/constants';

/**
 * GET /api/properties/homepage/
 * دریافت املاک ویژه برای نمایش در صفحه اصلی
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // استخراج پارامترهای query string
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('page_size') || '6';
    
    const pageNum = parseInt(page);
    const pageSizeNum = parseInt(pageSize);// سعی در ارتباط با backend
    const backendUrl = new URL(`${API_BASE_URL}/v1/properties/homepage/`);
    backendUrl.searchParams.set('page', pageNum.toString());
    backendUrl.searchParams.set('page_size', pageSizeNum.toString());
    
    try {
      const backendResponse = await fetch(backendUrl.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 }
      });

      const contentType = backendResponse.headers.get('content-type');
      
      if (backendResponse.ok && contentType && contentType.includes('application/json')) {
        const data = await backendResponse.json();return NextResponse.json(data.results || []);
      }
    } catch (backendError) {}

    // اگر backend در دسترس نیست، داده‌های نمونه برگردان
    const mockProperties = [
      {
        id: 1,
        title: "آپارتمان 120 متری در منطقه 1",
        slug: "apartment-120-meter-region-1",
        address: "تهران، منطقه 1",
        measure: "120",
        rooms: 3,
        price: 5000000000,
        transaction_type: "sale",
        city: "تهران",
        location: "منطقه 1",
        property_type: "آپارتمان",
        agent: "محمد رضایی",
        agent_image: "/assets/team-photo-1.jpg",
        images: [
          {
            id: 1,
            image: "/assets/property-1.jpg",
            is_main: true
          }
        ],
        created_at: "2024-01-15T10:30:00Z",
        updated_at: "2024-01-15T10:30:00Z"
      },
      {
        id: 2,
        title: "ویلا 250 متری در شمال",
        slug: "villa-250-meter-north",
        address: "مازندران، نوشهر",
        measure: "250",
        rooms: 4,
        price: 8000000000,
        transaction_type: "sale",
        city: "نوشهر",
        location: "منطقه ساحلی",
        property_type: "ویلا",
        agent: "علی احمدی",
        agent_image: "/assets/team-photo-2.jpg",
        images: [
          {
            id: 2,
            image: "/assets/property-2.jpg",
            is_main: true
          }
        ],
        created_at: "2024-01-14T15:20:00Z",
        updated_at: "2024-01-14T15:20:00Z"
      },
      {
        id: 3,
        title: "آپارتمان 90 متری در منطقه 5",
        slug: "apartment-90-meter-region-5",
        address: "تهران، منطقه 5",
        measure: "90",
        rooms: 2,
        price: 3500000000,
        transaction_type: "sale",
        city: "تهران",
        location: "منطقه 5",
        property_type: "آپارتمان",
        agent: "فاطمه کریمی",
        agent_image: "/assets/team-photo-1.jpg",
        images: [
          {
            id: 3,
            image: "/assets/property-3.jpg",
            is_main: true
          }
        ],
        created_at: "2024-01-13T09:15:00Z",
        updated_at: "2024-01-13T09:15:00Z"
      }
    ];

    // محدود کردن به تعداد درخواست شده
    const limitedProperties = mockProperties.slice(0, pageSizeNum);return NextResponse.json(limitedProperties);

  } catch (error) {
    console.error('❌ خطا در API املاک صفحه اصلی:', error);
    
    // در صورت خطا، آرایه خالی برگردان
    return NextResponse.json([]);
  }
}
