import { NextRequest, NextResponse } from 'next/server';

/**
 * دریافت لیست شهرها
 * GET /api/properties/options/cities/
 * 
 * @description
 * دریافت لیست تمام شهرها برای استفاده در dropdown/select.
 * این endpoint برای کاربران غیراحراز هویت شده نیز قابل دسترسی است.
 * 
 * @returns Array<City> لیست شهرها
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: اتصال به Backend
    // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/properties/options/cities/`, {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    // });
    // const cities = await response.json();

    // Mock response - باید با Backend واقعی جایگزین شود
    const cities = [
      {
        id: 1,
        name: "تهران",
        province: "تهران"
      },
      {
        id: 2,
        name: "اصفهان", 
        province: "اصفهان"
      },
      {
        id: 3,
        name: "شیراز",
        province: "فارس"
      },
      {
        id: 4,
        name: "مشهد",
        province: "خراسان رضوی"
      },
      {
        id: 5,
        name: "تبریز",
        province: "آذربایجان شرقی"
      },
      {
        id: 6,
        name: "کرج",
        province: "البرز"
      },
      {
        id: 7,
        name: "اهواز",
        province: "خوزستان"
      },
      {
        id: 8,
        name: "قم",
        province: "قم"
      },
      {
        id: 9,
        name: "کرمانشاه",
        province: "کرمانشاه"
      },
      {
        id: 10,
        name: "ارومیه",
        province: "آذربایجان غربی"
      }
    ];

    // مرتب‌سازی بر اساس نام
    cities.sort((a, b) => a.name.localeCompare(b.name, 'fa'));

    return NextResponse.json(cities, {
      headers: {
        'Cache-Control': 'public, max-age=3600', // کش 1 ساعته
      },
    });

  } catch (error) {
    console.error('خطا در دریافت لیست شهرها:', error);
    
    return NextResponse.json(
      { 
        error: 'خطا در دریافت لیست شهرها',
        details: error instanceof Error ? error.message : 'خطای ناشناخته'
      },
      { status: 500 }
    );
  }
}
