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

function getSupportBaseUrl(): string {
  // طبق درخواست شما: بیس پشتیبانی از .env با کلید VITE_SUPPORT_API_BASE_URL خوانده شود
  // (این route سروری است، پس نیاز نیست NEXT_PUBLIC_ باشد)
  return (
    process.env.VITE_SUPPORT_API_BASE_URL ||
    process.env.NEXT_PUBLIC_SUPPORT_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'https://api.goooya.ir'
  );
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

  const base = getSupportBaseUrl().replace(/\/+$/, '');
  const url = `${base}/api/Support/chat`;

  try {
    const requestInit: RequestInit & { dispatcher?: unknown } = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Message: body.message }),
      ...(shouldAllowInsecureTls() ? { dispatcher: insecureDispatcher } : {}),
    };

    const upstream = await fetch(url, requestInit);

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


