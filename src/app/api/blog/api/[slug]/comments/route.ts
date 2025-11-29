import { NextRequest, NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{ slug: string }>;
};

/**
 * دریافت نظرات مقاله
 * GET /api/blog/api/[slug]/comments/
 */
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { slug } = await context.params;

    // TODO: اتصال به Backend
    // const response = await apiClient.get(`/v1/blog/api/${slug}/comments/`);
    // return NextResponse.json(response.data);

    // Mock response
    const mockComments = {
      count: 2,
      results: [
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
      ]
    };

    return NextResponse.json(mockComments);

  } catch (error) {
    console.error('خطا در دریافت نظرات:', error);
    
    return NextResponse.json(
      { 
        error: 'خطا در دریافت نظرات',
        details: error instanceof Error ? error.message : 'خطای ناشناخته'
      },
      { status: 500 }
    );
  }
}
