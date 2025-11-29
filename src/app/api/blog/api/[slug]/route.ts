import { NextRequest, NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

/**
 * دریافت جزئیات مقاله
 * GET /api/blog/api/[slug]/
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { slug } = await context.params;

    // TODO: اتصال به Backend
    // const response = await apiClient.get(`/v1/blog/api/${slug}/`);
    // return NextResponse.json(response.data);

    // Mock response
    const mockPost = {
      id: 1,
      title: "راهنمای خرید ملک",
      slug: "guide-buying-property",
      category: {
        id: 1,
        name: "املاک",
        slug: "real-estate"
      },
      author: "ماهان دیزاین",
      body: `
        <h2>مقدمه</h2>
        <p>خرید ملک یکی از مهم‌ترین تصمیمات مالی در زندگی هر فرد محسوب می‌شود. در این راهنما، نکات کلیدی برای خرید ملک را بررسی می‌کنیم.</p>
        
        <h3>نکات مهم قبل از خرید</h3>
        <ul>
          <li>بررسی وضعیت حقوقی ملک</li>
          <li>ارزیابی قیمت بازار</li>
          <li>بازدید دقیق از ملک</li>
          <li>بررسی امکانات محیطی</li>
        </ul>
        
        <h3>مراحل خرید</h3>
        <p>فرآیند خرید ملک شامل مراحل مختلفی است که باید با دقت انجام شود...</p>
      `,
      thumbnail: "/assets/property-1.jpg",
      pub_date: "2024-01-15T10:30:00Z",
      updated: "2024-01-16T14:20:00Z",
      status: true,
      description: "راهنمای کامل خرید ملک برای تازه‌واردان",
      blogtags: [
        { id: 1, name: "خرید ملک" },
        { id: 2, name: "راهنما" }
      ],
      comment: [
        {
          id: 1,
          name: "علی احمدی",
          email: "ali@example.com",
          body: "مقاله بسیار مفیدی بود. ممنون",
          is_pub: true,
          created: "2024-01-16T10:00:00Z",
          is_answered: true,
          replycomment: [
            {
              id: 1,
              body: "خوشحالیم که مفید بوده",
              created: "2024-01-16T11:00:00Z"
            }
          ]
        },
        {
          id: 2,
          name: "محمد رضایی",
          email: "mohammad@example.com",
          body: "سوالی دارم در مورد مراحل قانونی...",
          is_pub: true,
          created: "2024-01-17T09:00:00Z",
          is_answered: false,
          replycomment: []
        }
      ],
      comment_count: 5
    };

    return NextResponse.json(mockPost, {
      headers: {
        'Cache-Control': 'public, max-age=600', // کش 10 دقیقه‌ای
      },
    });

  } catch (error) {
    console.error('خطا در دریافت جزئیات مقاله:', error);
    
    return NextResponse.json(
      { 
        error: 'مقاله یافت نشد',
        details: error instanceof Error ? error.message : 'خطای ناشناخته'
      },
      { status: 404 }
    );
  }
}
