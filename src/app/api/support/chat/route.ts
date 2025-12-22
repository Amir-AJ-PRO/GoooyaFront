import { NextRequest, NextResponse } from 'next/server';
import { Agent } from 'undici';

type SupportChatCommand = {
  message: string;
};

type SupportChatCreateResponseDTO = {
  ChatId: string;
  ModelMessage?: string | null;
  ErrorMessage?: string | null;
  IsSuccess: boolean;
};

type SupportChatHistoryResponseDTO = {
  Conversations?: Array<{
    UserId?: string;
    ChatId?: string;
    Message?: string;
    Role?: 'user' | 'assistant' | 0 | 1;
  }>;
  Message?: string;
  IsSuccess?: boolean;
  ChatId?: string;
};

function getSupportBaseUrl(): string {
  // فقط و فقط از این env می‌خوانیم (هیچ fallback دیگری نداریم)
  return process.env.NEXT_PUBLIC_SUPPORT_API_BASE_URL || '';
}

function getCookieOptions() {
  // بک‌اند شما Secure=true + SameSite=None دارد، اما این در HTTP/dev ذخیره نمی‌شود.
  // بنابراین در dev با Lax/بدون Secure ست می‌کنیم؛ در production مطابق نیاز None+Secure.
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
    path: '/',
    maxAge: 15 * 60, // 15 دقیقه
  };
}

function shouldAllowInsecureTls(): boolean {
  // فقط برای توسعه: اگر به https://localhost با dev-cert وصل می‌شوید، ممکن است Node آن را trust نکند
  // با این فلگ می‌توانید در dev اجازه اتصال insecure بدهید.
  return process.env.NODE_ENV !== 'production' && process.env.SUPPORT_ALLOW_INSECURE_TLS === '1';
}

const insecureDispatcher = new Agent({
  connect: {
    rejectUnauthorized: false,
  },
});

function getSupportCookieHeader(request: NextRequest): string | undefined {
  const supportSession = request.cookies.get('support_session')?.value;
  if (!supportSession) return undefined;
  return `support_session=${supportSession}`;
}

async function fetchSupportUpstream(request: NextRequest, url: string, init: RequestInit): Promise<Response> {
  const headers = new Headers(init.headers || {});
  const cookieHeader = getSupportCookieHeader(request);
  if (cookieHeader) headers.set('Cookie', cookieHeader);

  const requestInit: RequestInit & { dispatcher?: unknown } = {
    ...init,
    headers,
    ...(shouldAllowInsecureTls() ? { dispatcher: insecureDispatcher } : {}),
  };

  return fetch(url, requestInit);
}

export async function GET(request: NextRequest) {
  const supportBase = getSupportBaseUrl();
  if (!supportBase) {
    return NextResponse.json(
      { Message: 'NEXT_PUBLIC_SUPPORT_API_BASE_URL تنظیم نشده است', IsSuccess: false, Conversations: [] } satisfies SupportChatHistoryResponseDTO,
      { status: 500 }
    );
  }

  const base = supportBase.replace(/\/+$/, '');
  const candidates = [`${base}/api/Support/get_chat`, `${base}/api/Chat/get_chat`];

  try {
    let upstream: Response | null = null;
    for (const url of candidates) {
      const res = await fetchSupportUpstream(request, url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });
      if (res.status === 404) continue;
      upstream = res;
      break;
    }

    if (!upstream) {
      return NextResponse.json(
        { Message: 'Endpoint not found', IsSuccess: false, Conversations: [] } satisfies SupportChatHistoryResponseDTO,
        { status: 200 }
      );
    }

    const contentType = upstream.headers.get('content-type') || '';
    let data: SupportChatHistoryResponseDTO;

    if (contentType.includes('application/json')) {
      data = (await upstream.json()) as SupportChatHistoryResponseDTO;
    } else {
      const rawText = await upstream.text();
      data = { Message: rawText || 'پاسخ نامعتبر از سرور پشتیبانی', IsSuccess: false, Conversations: [] };
    }

    return NextResponse.json(data, { status: upstream.status });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'خطا در ارتباط با سرور پشتیبانی';
    return NextResponse.json(
      { Message: msg, IsSuccess: false, Conversations: [] } satisfies SupportChatHistoryResponseDTO,
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let body: SupportChatCommand | null = null;
  try {
    body = (await request.json()) as SupportChatCommand;
  } catch {
    body = null;
  }

  if (!body?.message || typeof body.message !== 'string') {
    return NextResponse.json({ ErrorMessage: 'پیام نامعتبر است', IsSuccess: false, ChatId: '' }, { status: 400 });
  }

  const supportBase = getSupportBaseUrl();
  if (!supportBase) {
    return NextResponse.json(
      { ErrorMessage: 'NEXT_PUBLIC_SUPPORT_API_BASE_URL تنظیم نشده است', IsSuccess: false, ChatId: '' },
      { status: 500 }
    );
  }

  const base = supportBase.replace(/\/+$/, '');
  const url = `${base}/api/Support/chat`;

  try {
    const upstream = await fetchSupportUpstream(request, url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Message: body.message }),
    });

    const contentType = upstream.headers.get('content-type') || '';
    let data: SupportChatCreateResponseDTO | null = null;
    let rawText: string | null = null;

    if (contentType.includes('application/json')) {
      data = (await upstream.json()) as SupportChatCreateResponseDTO;
    } else {
      rawText = await upstream.text();
      data = {
        ChatId: '',
        IsSuccess: false,
        ErrorMessage: rawText || 'پاسخ نامعتبر از سرور پشتیبانی',
      };
    }

    const res = NextResponse.json(data, { status: upstream.status });

    if (upstream.ok && data?.IsSuccess && data?.ChatId) {
      // ذخیره ChatId در cookie مرورگر با نام support_session
      res.cookies.set('support_session', data.ChatId, getCookieOptions());
    }

    return res;
  } catch (e: unknown) {
    const message =
      e instanceof Error
        ? e.message
        : 'خطا در ارتباط با سرور پشتیبانی';
    return NextResponse.json(
      {
        ErrorMessage:
          shouldAllowInsecureTls()
            ? message
            : `${message} (اگر بک‌اند روی https://localhost است، ممکن است مشکل از TLS/Dev Certificate باشد. برای تست dev، SUPPORT_ALLOW_INSECURE_TLS=1 را در .env بگذارید)`,
        IsSuccess: false,
        ChatId: '',
      },
      { status: 500 }
    );
  }
}


