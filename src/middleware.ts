import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware ساده برای Security Headers
 * Authentication در client-side با sessionStorage انجام میشه
 */

function tryGetOrigin(raw?: string): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    // اگر کاربر مقدار را با path داده باشد، فقط origin را برمی‌داریم
    return new URL(trimmed).origin;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // اضافه کردن Security Headers (ملایم‌تر برای development)
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // CSP Header - اجازه به external resources
  const isDevelopment = process.env.NODE_ENV === 'development';
  const supportOrigin =
    tryGetOrigin(process.env.VITE_SUPPORT_API_BASE_URL) ||
    tryGetOrigin(process.env.NEXT_PUBLIC_SUPPORT_API_BASE_URL) ||
    tryGetOrigin(process.env.NEXT_PUBLIC_SUPPORT_API_URL);
  
  if (isDevelopment) {
    // در حالت development، CSP را خیلی آزاد میگذاریم
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
        "font-src 'self' data: https://cdn.jsdelivr.net",
        "img-src 'self' data: https: http:",
        // connect-src: اجازه‌ی اتصال به API ها (شامل support با baseUrl از .env)
        [
          "connect-src 'self'",
          'https://api.goooya.ir',
          'http://localhost:8000',
          supportOrigin,
          'ws:',
          'wss:',
        ].filter(Boolean).join(' '),
        "frame-src 'none'",
      ].join('; ')
    );
  } else {
    // در production، CSP سخت‌تر
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        // Next.js برای بوت‌استرپ/هیدریشن به inline script نیاز دارد.
        // اگر nonce-based CSP خواستی، باید nonce روی scriptها هم ست شود.
        "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
        "font-src 'self' data: https://cdn.jsdelivr.net",
        "img-src 'self' data: https:",
        [
          "connect-src 'self'",
          'https://api.goooya.ir',
          supportOrigin,
        ].filter(Boolean).join(' '),
        "frame-src 'none'",
      ].join('; ')
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
