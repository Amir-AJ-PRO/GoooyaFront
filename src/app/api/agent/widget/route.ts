/**
 * POST /api/agent/widget/
 * پروکسی به https://api.goooya.ir/api/agent/widget/
 * JWT از HttpOnly cookie؛ IP کلاینت برای سهمیه مهمان فوروارد می‌شود.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  ACCESS_TOKEN_KEY,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_KEY,
  UPSTREAM_TIMEOUT_MS,
  buildUpstreamHeaders,
  getBackendBase,
  getClientIp,
  refreshAccessToken,
} from './_shared';

export async function POST(request: NextRequest) {
  const backendUrl = getBackendBase();
  const cookieStore = await cookies();
  let accessToken = cookieStore.get(ACCESS_TOKEN_KEY)?.value;
  const refreshToken = cookieStore.get(REFRESH_TOKEN_KEY)?.value;

  try {
    if (!accessToken && refreshToken) {
      accessToken =
        (await refreshAccessToken(backendUrl, refreshToken)) ?? undefined;
    }

    const body = await request.text();
    const clientIp = getClientIp(request);
    const headers = buildUpstreamHeaders(
      accessToken,
      clientIp,
      'application/json'
    );

    let response = await fetch(`${backendUrl}/api/agent/widget/`, {
      method: 'POST',
      headers,
      body,
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
    });

    if (response.status === 401 && refreshToken) {
      const refreshed = await refreshAccessToken(backendUrl, refreshToken);
      if (refreshed) {
        accessToken = refreshed;
        headers.Authorization = `Bearer ${accessToken}`;
        response = await fetch(`${backendUrl}/api/agent/widget/`, {
          method: 'POST',
          headers,
          body,
          signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
        });
      }
    }

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      console.error('[ShahrGPT] Upstream widget error', {
        upstream: `${backendUrl}/api/agent/widget/`,
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
    const isTimeout =
      error instanceof Error &&
      (error.name === 'TimeoutError' || error.name === 'AbortError');

    console.error('[ShahrGPT] Widget proxy exception', {
      backendUrl,
      isTimeout,
      error,
    });

    if (isTimeout) {
      return NextResponse.json(
        {
          error: 'timeout',
          message:
            'درخواست شما بیش از حد معمول طول کشید. لطفا چند لحظه دیگر تلاش کنید.',
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: 'agent_failure', message: 'خطا در پاسخ ایجنت' },
      { status: 500 }
    );
  }
}
