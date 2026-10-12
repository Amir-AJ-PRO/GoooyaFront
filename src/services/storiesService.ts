/**
 * سرویس عمومی انیمیشن‌های داستانی گویا — بدون احراز هویت
 */

import { isAxiosError } from 'axios';
import { apiClient, handleApiError } from '@/lib/api';
import { getMediaUrl } from '@/lib/utils';
import type { StoriesBanner, StoriesListResponse, StoryItem } from '@/types/story';

/** بک‌اند لوکال گاهی کند است؛ کمی بیشتر از پیش‌فرض ۳۰ ثانیه صبر می‌کنیم */
const STORIES_TIMEOUT_MS = 60000;

export class StoryNotFoundError extends Error {
  constructor(message = 'یافت نشد.') {
    super(message);
    this.name = 'StoryNotFoundError';
  }
}

function storiesRequestError(error: unknown): Error {
  if (isAxiosError(error) && error.code === 'ECONNABORTED') {
    return new Error(
      'اتصال به سرور طولانی شد. اگر بک‌اند لوکال است، روشن بودنش روی پورت ۸۰۰۳ را چک کنید و دوباره تلاش کنید.'
    );
  }
  if (isAxiosError(error) && !error.response) {
    return new Error(
      'ارتباط با سرور برقرار نشد. اتصال شبکه یا آدرس API را بررسی کنید.'
    );
  }
  return new Error(handleApiError(error));
}

/**
 * آیا بنر باید در فرانت دیده شود؟
 */
export function isStoriesBannerVisible(
  banner: StoriesBanner | null | undefined
): boolean {
  return Boolean(banner?.is_active && banner.image);
}

/**
 * آدرس پخش: playback_url اولویت دارد، سپس فایل آپلودی و لینک خارجی
 * مسیر نسبی را با base API کامل می‌کند
 */
export function getStoryPlaybackUrl(story: StoryItem): string | null {
  const candidates = [story.playback_url, story.video, story.video_url];
  for (const candidate of candidates) {
    if (typeof candidate !== 'string') continue;
    const trimmed = candidate.trim();
    if (!trimmed) continue;
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('blob:')
    ) {
      return trimmed;
    }
    return getMediaUrl(trimmed);
  }
  return null;
}

/**
 * بنر ورود به بخش داستان‌ها
 */
export async function fetchStoriesBanner(): Promise<StoriesBanner> {
  try {
    const response = await apiClient.get<StoriesBanner>('/api/stories/banner/', {
      timeout: STORIES_TIMEOUT_MS,
    });
    return response.data;
  } catch (error) {
    throw storiesRequestError(error);
  }
}

/**
 * لیست انیمیشن‌های فعال — ترتیب از بک‌اند حفظ می‌شود
 */
export async function fetchStories(): Promise<StoriesListResponse> {
  try {
    const response = await apiClient.get<StoriesListResponse>('/api/stories/', {
      timeout: STORIES_TIMEOUT_MS,
    });
    const data = response.data;
    return {
      count: data.count ?? data.results?.length ?? 0,
      results: Array.isArray(data.results) ? data.results : [],
    };
  } catch (error) {
    throw storiesRequestError(error);
  }
}

/**
 * جزئیات یک انیمیشن برای دیپ‌لینک
 */
export async function fetchStoryBySlug(slug: string): Promise<StoryItem> {
  try {
    const response = await apiClient.get<StoryItem>(
      `/api/stories/${encodeURIComponent(slug)}/`,
      { timeout: STORIES_TIMEOUT_MS }
    );
    return response.data;
  } catch (error) {
    if (isAxiosError<{ detail?: string }>(error) && error.response?.status === 404) {
      throw new StoryNotFoundError(
        typeof error.response.data?.detail === 'string'
          ? error.response.data.detail
          : 'یافت نشد.'
      );
    }
    throw storiesRequestError(error);
  }
}
