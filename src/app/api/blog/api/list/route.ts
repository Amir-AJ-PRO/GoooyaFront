import { NextRequest, NextResponse } from 'next/server';
import { apiClient } from '@/lib/api';

/**
 * دریافت لیست مقالات
 * GET /api/blog/api/list/
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get('page') || '1';
    const pageSize = searchParams.get('page_size') || '20';
    const category = searchParams.get('category');
    const author = searchParams.get('author');

    // ساخت query parameters
    const queryParams = new URLSearchParams();
    queryParams.set('page', page);
    queryParams.set('page_size', pageSize);
    if (category) queryParams.set('category', category);
    if (author) queryParams.set('author', author);

    // TODO: اتصال به Backend
    // const response = await apiClient.get(`/v1/blog/api/list/?${queryParams.toString()}`);
    // return NextResponse.json(response.data);

    // Mock response
    const mockResponse = {
      count: 15,
      page: parseInt(page),
      page_size: parseInt(pageSize),
      total_pages: Math.ceil(15 / parseInt(pageSize)),
      results: [
        {
          id: 1,
          title: "راهنمای خرید ملک",
          slug: "guide-buying-property",
          category: {
            id: 1,
            name: "املاک",
            slug: "real-estate"
          },
          author: "ماهان دیزاین",
          thumbnail: "/assets/property-1.jpg",
          pub_date: "2024-01-15T10:30:00Z",
          description: "راهنمای کامل خرید ملک برای تازه‌واردان",
          status: true,
          blogtags: [
            { id: 1, name: "خرید ملک" },
            { id: 2, name: "راهنما" }
          ],
          comment_count: 5
        },
        {
          id: 2,
          title: "نکات مهم در اجاره خانه",
          slug: "rental-tips",
          category: {
            id: 1,
            name: "املاک",
            slug: "real-estate"
          },
          author: "علی احمدی",
          thumbnail: "/assets/property-2.jpg",
          pub_date: "2024-01-10T14:20:00Z",
          description: "نکات کلیدی که باید هنگام اجاره خانه در نظر بگیرید",
          status: true,
          blogtags: [
            { id: 3, name: "اجاره" },
            { id: 4, name: "نکات" }
          ],
          comment_count: 3
        },
        {
          id: 3,
          title: "بازار املاک در سال 1403",
          slug: "real-estate-market-2024",
          category: {
            id: 2,
            name: "بازار",
            slug: "market"
          },
          author: "سارا محمدی",
          thumbnail: "/assets/property-3.jpg",
          pub_date: "2024-01-05T09:15:00Z",
          description: "تحلیل وضعیت بازار املاک و پیش‌بینی‌های سال آینده",
          status: true,
          blogtags: [
            { id: 5, name: "بازار املاک" },
            { id: 6, name: "تحلیل" }
          ],
          comment_count: 8
        }
      ]
    };

    return NextResponse.json(mockResponse, {
      headers: {
        'Cache-Control': 'public, max-age=300', // کش 5 دقیقه‌ای
      },
    });

  } catch (error) {
    console.error('خطا در دریافت لیست مقالات:', error);
    
    return NextResponse.json(
      { 
        error: 'خطا در دریافت لیست مقالات',
        details: error instanceof Error ? error.message : 'خطای ناشناخته'
      },
      { status: 500 }
    );
  }
}
