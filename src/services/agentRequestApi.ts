/**
 * API Service برای درخواست تبدیل به agent
 */

import { apiClient, handleApiError } from '@/lib/api';

/**
 * Interface برای درخواست agent
 */
export interface AgentRequestPayload {
  full_name: string;
  phone: string;
  email?: string;
  national_id?: string;
  license_number?: string;
  office_name?: string;
  office_address?: string;
  office_phone?: string;
  city?: string | number;
  region?: string | number;
  years_of_experience?: number;
  specialties?: string;
  bio?: string;
}

/**
 * Interface برای پاسخ درخواست agent
 */
export interface AgentRequestResponse {
  detail: string;
  ticket: {
    id: number;
    user: number;
    user_phone: string;
    full_name: string;
    phone: string;
    email?: string;
    national_id?: string;
    license_number?: string;
    office_name?: string;
    office_address?: string;
    office_phone?: string;
    city?: number;
    city_name?: string;
    region?: number;
    region_name?: string;
    years_of_experience?: number;
    specialties?: string;
    bio?: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
  };
}

const AGENT_REQUEST_PENDING_PREFIX = 'gooya_agent_request_pending_';

function toOptionalInt(value?: string | number): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = typeof value === 'string' ? parseInt(value, 10) : value;
  return Number.isFinite(parsed) ? parsed : undefined;
}

function buildAgentRequestBody(payload: AgentRequestPayload): Record<string, unknown> {
  const requestData: Record<string, unknown> = {
    full_name: payload.full_name.trim(),
    phone: payload.phone.trim().replace(/\s/g, ''),
  };

  const optionalStrings: Array<keyof AgentRequestPayload> = [
    'email',
    'national_id',
    'license_number',
    'office_name',
    'office_address',
    'office_phone',
    'specialties',
    'bio',
  ];

  for (const field of optionalStrings) {
    const value = payload[field];
    if (typeof value === 'string' && value.trim()) {
      requestData[field] = value.trim();
    }
  }

  const city = toOptionalInt(payload.city);
  const region = toOptionalInt(payload.region);
  const years = toOptionalInt(payload.years_of_experience);

  if (city !== undefined) requestData.city = city;
  if (region !== undefined) requestData.region = region;
  if (years !== undefined) requestData.years_of_experience = years;

  return requestData;
}

function getAgentRequestErrorMessage(error: unknown): string {
  const err = error as {
    response?: { status?: number; data?: unknown };
    message?: string;
  };
  const status = err.response?.status;
  const data = err.response?.data;

  if (status === 401) {
    return 'لطفاً ابتدا وارد حساب کاربری خود شوید.';
  }

  if (status === 403) {
    return 'شما نمی‌توانید درخواست مشاور بدهید. ممکن است قبلاً مشاور باشید یا دسترسی لازم را نداشته باشید.';
  }

  const parsed = handleApiError(error);

  if (status === 500) {
    const duplicateHint =
      'اگر قبلاً درخواست ثبت کرده‌اید، منتظر بررسی تیم گویا بمانید و دوباره ارسال نکنید.';
    if (parsed && parsed !== 'خطای نامشخص') {
      return `${parsed} ${duplicateHint}`;
    }
    return `خطای سرور در ثبت درخواست. ${duplicateHint}`;
  }

  if (parsed && parsed !== 'خطای نامشخص') {
    return parsed;
  }

  return err.message || 'خطا در ثبت درخواست. لطفاً دوباره تلاش کنید.';
}

export function getAgentRequestPendingKey(phone: string): string {
  return `${AGENT_REQUEST_PENDING_PREFIX}${phone}`;
}

export function markAgentRequestPending(phone: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(getAgentRequestPendingKey(phone), new Date().toISOString());
}

export function hasPendingAgentRequest(phone: string): boolean {
  if (typeof window === 'undefined') return false;
  return Boolean(localStorage.getItem(getAgentRequestPendingKey(phone)));
}

export function clearPendingAgentRequest(phone: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(getAgentRequestPendingKey(phone));
}

/**
 * ارسال درخواست تبدیل به agent
 */
export const submitAgentRequest = async (
  payload: AgentRequestPayload
): Promise<AgentRequestResponse> => {
  try {
    const response = await apiClient.post<AgentRequestResponse>(
      '/api/tickets/agent-request/',
      buildAgentRequestBody(payload)
    );

    return response.data;
  } catch (error) {
    throw new Error(getAgentRequestErrorMessage(error));
  }
};
