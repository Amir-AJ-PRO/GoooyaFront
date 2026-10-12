const STORAGE_KEY = 'goooya.stories.seen';

/**
 * اسلاگ داستان‌های دیده‌شده در این مرورگر
 */
export function getSeenStorySlugs(): string[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === 'string');
  } catch {
    return [];
  }
}

/**
 * علامت‌گذاری داستان به‌عنوان دیده‌شده
 */
export function markStorySeen(slug: string): string[] {
  const next = Array.from(new Set([...getSeenStorySlugs(), slug]));
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}
