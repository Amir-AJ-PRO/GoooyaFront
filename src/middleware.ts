import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware ساده برای Security Headers
 * Authentication در client-side با sessionStorage انجام میشه
 */

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // اضافه کردن Security Headers (ملایم‌تر برای development)
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // CSP Header - اجازه به external resources
  const isDevelopment = process.env.NODE_ENV === 'development';
  
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
        "connect-src 'self' https://api.goooya.ir http://localhost:8000 ws: wss:",
        "frame-src 'none'",
      ].join('; ')
    );
  } else {
    // در production، CSP سخت‌تر
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
        "font-src 'self' data: https://cdn.jsdelivr.net",
        "img-src 'self' data: https:",
        "connect-src 'self' https://api.goooya.ir",
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
