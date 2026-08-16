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
    return new URL(trimmed).origin;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  // HTML/SEO documents: browsers must revalidate so title/description/OG
  // updates appear without a manual cache clear. Static assets stay cached.
  const isApi = pathname.startsWith('/api/');
  const isSeoFile =
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    pathname === '/manifest.webmanifest';

  if (!isApi) {
    if (isSeoFile) {
      response.headers.set(
        'Cache-Control',
        'public, max-age=0, s-maxage=300, must-revalidate'
      );
    } else {
      response.headers.set('Cache-Control', 'private, no-cache, must-revalidate');
      response.headers.set('Pragma', 'no-cache');
    }
  }

  const isDevelopment = process.env.NODE_ENV === 'development';

  const supportOrigin =
    tryGetOrigin(process.env.VITE_SUPPORT_API_BASE_URL) ||
    tryGetOrigin(process.env.NEXT_PUBLIC_SUPPORT_API_BASE_URL) ||
    tryGetOrigin(process.env.NEXT_PUBLIC_SUPPORT_API_URL);

  const agentOrigin =
    tryGetOrigin(process.env.NEXT_PUBLIC_AGENT_API_URL) ||
    'https://shahrgpt.com';

  const connectSources = [
    "'self'",
    'https://api.goooya.ir',
    'https://shahrgpt.goooya.ir',
    'https://shahrgpt.com',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://localhost:8020',
    'http://127.0.0.1:8020',
    agentOrigin,
    supportOrigin,
    'ws:',
    'wss:',
  ].filter(Boolean);

  if (isDevelopment) {
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
        "font-src 'self' data: https://cdn.jsdelivr.net",
        "img-src 'self' data: blob: https: http:",
        `connect-src ${connectSources.join(' ')}`,
        "frame-src 'none'",
      ].join('; ')
    );
  } else {
    response.headers.set(
      'Content-Security-Policy',
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net",
        "font-src 'self' data: https:",
        "img-src 'self' data: blob: https:",
        `connect-src ${connectSources.join(' ')}`,
        "frame-src 'none'",
      ].join('; ')
    );
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
