/**
 * انواع پاسخ API انیمیشن‌های داستانی گویا
 * GET /api/stories/banner/
 * GET /api/stories/
 * GET /api/stories/<slug>/
 */

export interface StoryItem {
  id: number;
  title: string;
  slug: string;
  cover: string | null;
  video: string | null;
  video_url: string | null;
  playback_url: string | null;
  description: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface StoriesListResponse {
  count: number;
  results: StoryItem[];
}

export interface StoriesBanner {
  title: string;
  image: string | null;
  is_active: boolean;
  stories_endpoint: string;
  updated_at: string | null;
}

export interface StoryNotFoundResponse {
  detail: string;
}
