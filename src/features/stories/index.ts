/**
 * فقط typeهای عمومی. کامپوننت‌های کلاینت را مستقیم import کنید
 * تا Webpack/RSC به خطای module.call نخورند.
 */

export type {
  StoryItem,
  StoriesBanner,
  StoriesListResponse,
  StoryNotFoundResponse,
} from '@/types/story';
