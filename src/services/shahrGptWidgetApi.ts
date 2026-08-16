/**
 * سرویس ویجت شهر GPT
 * مطابق داک: https://api.goooya.ir/docs/shahrgpt/
 *
 * کلاینت → POST/GET /api/agent/widget[/quota]/
 * (routeهای Next JWT را از cookie می‌گذارند و به api.goooya.ir پروکسی می‌کنند)
 */

export interface WidgetQuota {
  is_authenticated: boolean;
  max_messages: number;
  remaining_messages: number;
  used_messages: number;
}

export interface WidgetHistoryEntry {
  user_input: string;
  agent_response: string;
}

export interface WidgetProperty {
  title: string;
  image_url?: string;
  price?: string | number;
  mortgage?: string | number;
  rent?: string | number;
  measure?: string | number;
  rooms?: string | number;
  floor?: string;
  location?: string;
  facilities?: string;
  agent?: string;
  agent_phonenumber?: string;
  summary?: string;
  property_url?: string;
}

export interface WidgetSuccessResponse {
  explanation?: string;
  properties?: WidgetProperty[];
  quota: WidgetQuota;
}

export interface WidgetErrorResponse {
  detail?: string;
  message?: string;
  error?: string;
  require_login?: boolean;
  quota?: WidgetQuota;
}

export type AskShahrGPTResult =
  | { ok: true; data: WidgetSuccessResponse }
  | { ok: false; status: number; data: WidgetErrorResponse };

/** مطابق راهنمای Frontend در داک */
const WIDGET_URL = '/api/agent/widget/';
const QUOTA_URL = '/api/agent/widget/quota/';

/** محدودیت‌های schema: WidgetAgentRequest / HistoryTurn */
export const MAX_USER_INPUT_LENGTH = 4000;
export const MAX_AGENT_RESPONSE_LENGTH = 8000;
export const MAX_HISTORY_TURNS = 5;

/**
 * نرمال‌سازی history مطابق داک (حداکثر ۵ نوبت، طول فیلدها)
 */
export function normalizeWidgetHistory(
  history: WidgetHistoryEntry[]
): WidgetHistoryEntry[] {
  return history.slice(-MAX_HISTORY_TURNS).map((turn) => ({
    user_input: turn.user_input.slice(0, MAX_USER_INPUT_LENGTH),
    agent_response: turn.agent_response.slice(0, MAX_AGENT_RESPONSE_LENGTH),
  }));
}

/**
 * دریافت وضعیت سهمیه فعلی (بدون فراخوانی ایجنت)
 * GET /api/agent/widget/quota/
 */
export async function fetchWidgetQuota(): Promise<WidgetQuota | null> {
  try {
    const response = await fetch(QUOTA_URL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      credentials: 'include',
      cache: 'no-store',
    });

    if (!response.ok) {
      let errorBody: unknown = null;
      try {
        errorBody = await response.json();
      } catch {
        errorBody = await response.text().catch(() => null);
      }
      console.error('[ShahrGPT] Quota request failed', {
        url: QUOTA_URL,
        status: response.status,
        data: errorBody,
      });
      return null;
    }

    return (await response.json()) as WidgetQuota;
  } catch (error) {
    console.error('[ShahrGPT] Quota request error', error);
    return null;
  }
}

/**
 * ارسال پیام به ایجنت ویجت شهر GPT
 * POST /api/agent/widget/
 *
 * مطابق نمونه داک:
 * body: { user_input, history? }
 * JWT اختیاری است و در route سرور از cookie به Authorization اضافه می‌شود.
 */
export async function askShahrGPT(
  userInput: string,
  history: WidgetHistoryEntry[] = []
): Promise<AskShahrGPTResult> {
  const trimmedInput = userInput.trim().slice(0, MAX_USER_INPUT_LENGTH);
  const normalizedHistory = normalizeWidgetHistory(history);

  const body: {
    user_input: string;
    history?: WidgetHistoryEntry[];
  } = {
    user_input: trimmedInput, 
  };

  if (normalizedHistory.length > 0) {
    body.history = normalizedHistory;
  }

  const response = await fetch(WIDGET_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  let data: WidgetErrorResponse & Partial<WidgetSuccessResponse> = {};
  try {
    data = await response.json();
  } catch (parseError) {
    console.error('[ShahrGPT] Failed to parse widget response JSON', {
      status: response.status,
      parseError,
    });
    data = {
      message: 'خطا در خواندن پاسخ سرور',
    };
  }

  if (!response.ok) {
    console.error('[ShahrGPT] Widget request failed', {
      url: WIDGET_URL,
      status: response.status,
      data,
      userInput: trimmedInput,
    });
    return {
      ok: false,
      status: response.status,
      data: data as WidgetErrorResponse,
    };
  }

  return {
    ok: true,
    data: data as WidgetSuccessResponse,
  };
}

/**
 * پیام خطای کاربرپسند بر اساس کد و بدنه پاسخ (مطابق جدول خطاهای داک)
 */
export function getWidgetErrorMessage(
  status: number,
  data: WidgetErrorResponse
): string {
  if (data.message) return data.message;
  if (typeof data.detail === 'string') return data.detail;

  switch (status) {
    case 400:
      return 'درخواست نامعتبر است.';
    case 429:
      return data.require_login
        ? 'سقف پیام‌های مهمان تمام شده است. لطفاً وارد حساب کاربری شوید.'
        : 'حداکثر استفاده مجاز را انجام داده‌اید.';
    case 499:
      return 'درخواست لغو شد. لطفا دوباره تلاش کنید.';
    case 500:
      return data.error === 'agent_failure'
        ? 'خطا در پاسخ ایجنت'
        : 'خطا در پاسخ ایجنت';
    case 504:
      return 'درخواست شما بیش از حد معمول طول کشید. لطفا چند لحظه دیگر تلاش کنید.';
    default:
      return 'خطا در پاسخ ایجنت';
  }
}
