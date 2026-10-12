/**
 * سرویس انیمیشن‌های داستانی گویا
 * لیست/جزئیات عمومی؛ watch و answers نیازمند JWT (از طریق proxy)
 */

import { isAxiosError } from 'axios';
import { apiClient, handleApiError } from '@/lib/api';
import { getMediaUrl } from '@/lib/utils';
import type {
  StoriesBanner,
  StoriesListResponse,
  StoryAnswerPayload,
  StoryAnswerResponse,
  StoryDetail,
  StoryItem,
  StoryWatchResponse,
} from '@/types/story';

const STORIES_TIMEOUT_MS = 60000;

export class StoryNotFoundError extends Error {
  constructor(message = 'یافت نشد.') {
    super(message);
    this.name = 'StoryNotFoundError';
  }
}

export class StoryAuthRequiredError extends Error {
  constructor(message = 'برای ادامه وارد شوید.') {
    super(message);
    this.name = 'StoryAuthRequiredError';
  }
}

function storiesRequestError(error: unknown): Error {
  if (isAxiosError(error) && error.response?.status === 401) {
    return new StoryAuthRequiredError(
      typeof error.response.data?.detail === 'string'
        ? error.response.data.detail
        : 'برای ادامه وارد شوید.'
    );
  }
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
 * آدرس خام پخش از فیلدهای استوری
 */
export function getStoryPlaybackUrl(
  story: Pick<StoryItem, 'playback_url' | 'video' | 'video_url'>
): string | null {
  const candidates = [story.playback_url, story.video, story.video_url];
  for (const candidate of candidates) {
    if (typeof candidate !== 'string') continue;
    const trimmed = candidate.trim();
    if (!trimmed) continue;
    if (
      trimmed.startsWith('http://') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('blob:') ||
      trimmed.startsWith('/api/story-video')
    ) {
      return trimmed;
    }
    return getMediaUrl(trimmed);
  }
  return null;
}

/**
 * برای پخش در <video>: URLهای خارجی CDN از پروکسی همان‌origin رد می‌شوند
 * تا Content-Disposition: attachment باعث خطای پخش نشود.
 */
export function getStoryVideoElementSrc(
  story: Pick<StoryItem, 'playback_url' | 'video' | 'video_url'>
): string | null {
  const raw = getStoryPlaybackUrl(story);
  if (!raw) return null;
  if (raw.startsWith('blob:') || raw.startsWith('/api/story-video')) {
    return raw;
  }
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    try {
      const host = new URL(raw).hostname.toLowerCase();
      const needsProxy =
        host.includes('parspack.net') ||
        host.includes('amazonaws.com') ||
        host.endsWith('goooya.ir');
      if (needsProxy) {
        return `/api/story-video?url=${encodeURIComponent(raw)}`;
      }
    } catch {
      /* keep raw */
    }
  }
  return raw;
}

/**
 * ادغام فیلدهای مدیا از لیست + جزئیات (تا با خطای detail URL از دست نرود)
 */
export function mergeStoryMedia(
  primary?: Pick<StoryItem, 'playback_url' | 'video' | 'video_url' | 'cover'> | null,
  fallback?: Pick<StoryItem, 'playback_url' | 'video' | 'video_url' | 'cover'> | null
): Pick<StoryItem, 'playback_url' | 'video' | 'video_url' | 'cover'> {
  return {
    cover: primary?.cover || fallback?.cover || null,
    playback_url: primary?.playback_url || fallback?.playback_url || null,
    video: primary?.video || fallback?.video || null,
    video_url: primary?.video_url || fallback?.video_url || null,
  };
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
 * لیست انیمیشن‌های فعال
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
 * جزئیات یک قسمت (با سوالات؛ اگر لاگین باشد has_watched/answered پر می‌شود)
 */
export async function fetchStoryBySlug(slug: string): Promise<StoryDetail> {
  try {
    // اسلاگ را encode دستی نکن — axios/Next خودش درست encode می‌کنند
    // (encodeURIComponent دوباره باعث %25 و 404 می‌شود)
    const response = await apiClient.get<StoryDetail>(
      `/api/stories/${slug}/`,
      { timeout: STORIES_TIMEOUT_MS }
    );
    const data = response.data;
    return {
      ...data,
      questions_count: data.questions_count ?? data.questions?.length ?? 0,
      has_watched: Boolean(data.has_watched),
      can_answer: Boolean(data.can_answer),
      questions: Array.isArray(data.questions) ? data.questions : [],
    };
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

/**
 * ثبت تماشای کامل قسمت — JWT اجباری
 */
export async function markStoryWatched(slug: string): Promise<StoryWatchResponse> {
  try {
    const response = await apiClient.post<StoryWatchResponse>(
      `/api/stories/${slug}/watch/`,
      {},
      { timeout: STORIES_TIMEOUT_MS }
    );
    return response.data;
  } catch (error) {
    throw storiesRequestError(error);
  }
}

/**
 * ارسال پاسخ سوال — JWT اجباری
 */
export async function submitStoryAnswer(
  slug: string,
  payload: StoryAnswerPayload
): Promise<StoryAnswerResponse> {
  try {
    const response = await apiClient.post<StoryAnswerResponse>(
      `/api/stories/${slug}/answers/`,
      payload,
      { timeout: STORIES_TIMEOUT_MS }
    );
    return response.data;
  } catch (error) {
    throw storiesRequestError(error);
  }
}
