/**
 * سرویس گویا کلاب — JWT اجباری (از طریق proxy)
 */

import { isAxiosError } from 'axios';
import { apiClient, handleApiError } from '@/lib/api';
import type {
  ClubInstagramPayload,
  ClubInstagramResponse,
  ClubProfile,
} from '@/types/club';

const CLUB_TIMEOUT_MS = 60000;

export class ClubAuthRequiredError extends Error {
  constructor(message = 'برای مشاهده گویا کلاب وارد شوید.') {
    super(message);
    this.name = 'ClubAuthRequiredError';
  }
}

function clubRequestError(error: unknown): Error {
  if (isAxiosError(error) && error.response?.status === 401) {
    return new ClubAuthRequiredError(
      typeof error.response.data?.detail === 'string'
        ? error.response.data.detail
        : 'برای مشاهده گویا کلاب وارد شوید.'
    );
  }
  return new Error(handleApiError(error));
}

/**
 * حذف @ از ابتدای آیدی اینستاگرام
 */
export function normalizeInstagramId(raw: string): string {
  return raw.trim().replace(/^@+/, '');
}

/**
 * پروفایل گویا کلاب کاربر
 */
export async function fetchClubProfile(): Promise<ClubProfile> {
  try {
    const response = await apiClient.get<ClubProfile>('/api/club/', {
      timeout: CLUB_TIMEOUT_MS,
    });
    return response.data;
  } catch (error) {
    throw clubRequestError(error);
  }
}

/**
 * ثبت آیدی اینستاگرام برای قرعه‌کشی (هر کاربر فقط یکی)
 */
export async function submitClubInstagram(
  payload: ClubInstagramPayload
): Promise<ClubInstagramResponse> {
  try {
    const response = await apiClient.post<ClubInstagramResponse>(
      '/api/club/instagram/',
      {
        instagram_id: normalizeInstagramId(payload.instagram_id),
      },
      { timeout: CLUB_TIMEOUT_MS }
    );
    return response.data;
  } catch (error) {
    throw clubRequestError(error);
  }
}
