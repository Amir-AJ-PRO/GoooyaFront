/**
 * Shared helpers for ShahrGPT widget Next.js proxy routes.
 * Upstream: https://api.goooya.ir/api/agent/widget/
 */

import { NextRequest } from 'next/server';

export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';
export const ACCESS_TOKEN_MAX_AGE = 15 * 60;
export const UPSTREAM_TIMEOUT_MS = 65_000;

export function getBackendBase(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'https://api.goooya.ir';
}

/**
 * IP واقعی کلاینت برای سهمیه مهمان (داک: بدون JWT بر اساس IP)
 */
export function getClientIp(request: NextRequest): string | undefined {
  const candidates = [
    request.headers.get('x-forwarded-for')?.split(',')[0],
    request.headers.get('x-real-ip'),
    request.headers.get('cf-connecting-ip'),
    request.headers.get('true-client-ip'),
    request.headers.get('x-client-ip'),
  ];

  for (const value of candidates) {
    const ip = value?.trim();
    if (ip) return ip;
  }

  return undefined;
}

export async function refreshAccessToken(
  backendUrl: string,
  refreshToken: string
): Promise<string | null> {
  const refreshResponse = await fetch(`${backendUrl}/api/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!refreshResponse.ok) return null;

  const data = (await refreshResponse.json()) as { access?: string };
  return data.access ?? null;
}

export function buildUpstreamHeaders(
  accessToken: string | undefined,
  clientIp: string | undefined,
  contentType?: string
): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (contentType) {
    headers['Content-Type'] = contentType;
  }

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  if (clientIp) {
    headers['X-Forwarded-For'] = clientIp;
    headers['X-Real-IP'] = clientIp;
  }

  return headers;
}
