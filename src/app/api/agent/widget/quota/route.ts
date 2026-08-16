/**
 * GET /api/agent/widget/quota/
 * پروکسی به https://api.goooya.ir/api/agent/widget/quota/
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  ACCESS_TOKEN_KEY,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_KEY,
  buildUpstreamHeaders,
  getBackendBase,
  getClientIp,
  refreshAccessToken,
} from '../_shared';

export async function GET(request: NextRequest) {
  const backendUrl = getBackendBase();
  const cookieStore = await cookies();
  let accessToken = cookieStore.get(ACCESS_TOKEN_KEY)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_KEY)?.value;

  try {
    if (!accessToken && refreshToken) {
      accessToken =
        (await refreshAccessToken(backendUrl, refreshToken)) ?? undefined;
    }

    const clientIp = getClientIp(request);
    const headers = buildUpstreamHeaders(accessToken, clientIp);

    let response = await fetch(`${backendUrl}/api/agent/widget/quota/`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (response.status === 401 && refreshToken) {
      const refreshed = await refreshAccessToken(backendUrl, refreshToken);
      if (refreshed) {
        accessToken = refreshed;
        headers.Authorization = `Bearer ${accessToken}`;
        response = await fetch(`${backendUrl}/api/agent/widget/quota/`, {
          method: 'GET',
          headers,
          cache: 'no-store',
        });
      }
    }

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      console.error('[ShahrGPT] Upstream quota error', {
        upstream: `${backendUrl}/api/agent/widget/quota/`,
        status: response.status,
        payload,
        clientIp,
        hasAuth: Boolean(accessToken),
      });
    }

    const jsonResponse = NextResponse.json(payload, {
      status: response.status,
    });

    if (accessToken && response.status !== 401) {
      jsonResponse.cookies.set(ACCESS_TOKEN_KEY, accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });
    }

    return jsonResponse;
  } catch (error) {
    console.error('ShahrGPT quota proxy error:', error);
    return NextResponse.json(
      { error: 'خطا در دریافت سهمیه' },
      { status: 500 }
    );
  }
}
