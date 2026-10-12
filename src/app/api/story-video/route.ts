import { NextRequest, NextResponse } from 'next/server';

/**
 * پروکسی پخش ویدیو داستان — inline + پشتیبانی Range
 */

const ALLOWED_HOST_SUFFIXES = [
  'parspack.net',
  'goooya.ir',
  'amazonaws.com',
  '127.0.0.1',
  'localhost',
];

function isAllowedMediaUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    const host = url.hostname.toLowerCase();
    return ALLOWED_HOST_SUFFIXES.some(
      (suffix) => host === suffix || host.endsWith(`.${suffix}`)
    );
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('url');
  if (!raw || !isAllowedMediaUrl(raw)) {
    return NextResponse.json({ detail: 'آدرس ویدیو نامعتبر است.' }, { status: 400 });
  }

  const range = request.headers.get('range') ?? undefined;
  const upstreamHeaders: HeadersInit = {
    Accept: 'video/mp4,video/*,*/*;q=0.8',
  };
  if (range) {
    upstreamHeaders.Range = range;
  }

  try {
    const upstream = await fetch(raw, {
      headers: upstreamHeaders,
      redirect: 'follow',
      cache: 'no-store',
    });

    if (!upstream.ok && upstream.status !== 206) {
      return NextResponse.json(
        { detail: 'دریافت ویدیو از منبع ممکن نشد.' },
        { status: upstream.status === 404 ? 404 : 502 }
      );
    }

    const headers = new Headers();
    headers.set(
      'Content-Type',
      upstream.headers.get('content-type') || 'video/mp4'
    );
    headers.set('Content-Disposition', 'inline');
    headers.set(
      'Accept-Ranges',
      upstream.headers.get('accept-ranges') || 'bytes'
    );
    headers.set('Cache-Control', 'public, max-age=3600');
    headers.set('Access-Control-Allow-Origin', '*');

    const contentLength = upstream.headers.get('content-length');
    if (contentLength) headers.set('Content-Length', contentLength);
    const contentRange = upstream.headers.get('content-range');
    if (contentRange) headers.set('Content-Range', contentRange);

    return new NextResponse(upstream.body, {
      status: upstream.status,
      headers,
    });
  } catch {
    return NextResponse.json(
      { detail: 'خطا در اتصال به منبع ویدیو.' },
      { status: 502 }
    );
  }
}

export async function HEAD(request: NextRequest) {
  return GET(request);
}
