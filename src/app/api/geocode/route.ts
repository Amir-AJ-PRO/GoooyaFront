import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get('q')?.trim();
  if (!query || query.length < 3) {
    return NextResponse.json(null);
  }

  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', query);
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');
  url.searchParams.set('countrycodes', 'ir');

  try {
    const response = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'fa',
        'User-Agent': 'GoooyaRealty/1.0 (https://goooya.ir)',
      },
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      return NextResponse.json(null, { status: 200 });
    }

    const results = (await response.json()) as Array<{ lat?: string; lon?: string }>;
    const first = results[0];
    const lat = Number(first?.lat);
    const lon = Number(first?.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return NextResponse.json(null);
    }

    return NextResponse.json({ lat, lon });
  } catch {
    return NextResponse.json(null);
  }
}
