/**
 * انواع پاسخ API انیمیشن‌های داستانی گویا
 * GET /api/stories/banner/
 * GET /api/stories/
 * GET /api/stories/<slug>/
 * POST /api/stories/<slug>/watch/
 * POST /api/stories/<slug>/answers/
 */

export interface StoryQuestionOption {
  id: number;
  text: string;
}

export interface StoryQuestion {
  id: number;
  text: string;
  order: number;
  options: StoryQuestionOption[];
  answered: boolean;
  selected_option: number | null;
  is_correct: boolean | null;
  /** تا قبل از پاسخ کاربر null است — لو نده */
  correct_option: number | null;
}

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
  questions_count?: number;
  has_watched?: boolean;
  can_answer?: boolean;
  questions?: StoryQuestion[];
}

/** جزئیات قسمت با سوالات (همان StoryItem غنی‌شده) */
export type StoryDetail = StoryItem & {
  questions_count: number;
  has_watched: boolean;
  can_answer: boolean;
  questions: StoryQuestion[];
};

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

export interface StoryWatchResponse {
  already_watched: boolean;
  points_earned: number;
  total_points: number;
  has_watched: boolean;
}

export interface StoryAnswerPayload {
  question_id: number;
  selected_option: number;
}

export interface StoryAnswerResponse {
  already_answered: boolean;
  is_correct: boolean;
  selected_option: number;
  correct_option: number;
  points_earned: number;
  total_points: number;
}
