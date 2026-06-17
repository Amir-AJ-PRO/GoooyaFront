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

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  const isDevelopment = process.env.NODE_ENV === 'development';

  const supportOrigin =
    tryGetOrigin(process.env.VITE_SUPPORT_API_BASE_URL) ||
    tryGetOrigin(process.env.NEXT_PUBLIC_SUPPORT_API_BASE_URL) ||
    tryGetOrigin(process.env.NEXT_PUBLIC_SUPPORT_API_URL);

  const agentOrigin =
    tryGetOrigin(process.env.NEXT_PUBLIC_AGENT_API_URL) ||
    'http://127.0.0.1:8020'; // ✅ پورت درست شما

  const connectSources = [
    "'self'",
    'https://api.goooya.ir',
    'http://localhost:8000',
    'http://127.0.0.1:8000',
    'http://localhost:8020',
    'http://127.0.0.1:8020', // ✅ این خط مشکل را حل می‌کند
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
        "img-src 'self' data: https: http:",
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
        "img-src 'self' data: https:",
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
