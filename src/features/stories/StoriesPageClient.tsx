'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useStories, useStoriesBanner, useStory } from '@/hooks/useStories';
import { isStoriesBannerVisible } from '@/services/storiesService';
import type { StoryItem } from '@/types/story';
import { CHAR, CharacterImg, STORY_CAST } from './StoriesCastArt';
import { StoriesBanner } from './StoriesBanner';
import { StoriesBannerSkeleton, StoriesExploreSkeleton } from './StoriesSkeleton';
import { StoriesEmptyState } from './StoriesEmptyState';
import { StoryModal } from './StoryModal';
import { getSeenStorySlugs, markStorySeen } from './seenStories';

/**
 * صفحه Explore — پنل کاراکترها همیشه؛ سوایپر خط داستانی وقتی انیمیشن فعال باشد
 */
export function StoriesPageClient() {
  const searchParams = useSearchParams();
  const playParam = searchParams.get('play');

  const { data: banner, isLoading: bannerLoading } = useStoriesBanner();
  const { data, isLoading, isError, error, refetch } = useStories();
  const storiesFromList = data?.results ?? [];

  const needsDetail = Boolean(
    playParam &&
      !isLoading &&
      !storiesFromList.some((item) => item.slug === playParam)
  );
  const { data: deepStory } = useStory(playParam ?? '', {
    enabled: needsDetail,
  });

  const stories = useMemo(() => {
    if (!deepStory) return storiesFromList;
    if (storiesFromList.some((item) => item.slug === deepStory.slug)) {
      return storiesFromList;
    }
    return [...storiesFromList, deepStory];
  }, [deepStory, storiesFromList]);

  const [seenSlugs, setSeenSlugs] = useState<Set<string>>(new Set());
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [urlBootstrapped, setUrlBootstrapped] = useState(false);

  useEffect(() => {
    setSeenSlugs(new Set(getSeenStorySlugs()));
  }, []);

  useEffect(() => {
    if (urlBootstrapped || isLoading || stories.length === 0) return;
    setUrlBootstrapped(true);
    if (!playParam) return;
    const idx = stories.findIndex((item) => item.slug === playParam);
    if (idx >= 0) setActiveIndex(idx);
  }, [isLoading, playParam, stories, urlBootstrapped]);

  const syncUrl = useCallback((slug: string | null) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (slug) url.searchParams.set('play', slug);
    else url.searchParams.delete('play');
    window.history.replaceState(window.history.state, '', url.toString());
  }, []);

  const openByIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= stories.length) return;
      const story = stories[index];
      setActiveIndex(index);
      if (story?.slug) syncUrl(story.slug);
    },
    [stories, syncUrl]
  );

  const openByStory = useCallback(
    (story: StoryItem) => {
      const idx = stories.findIndex((item) => item.id === story.id);
      if (idx >= 0) openByIndex(idx);
    },
    [openByIndex, stories]
  );

  const closePlayer = useCallback(() => {
    setActiveIndex(null);
    syncUrl(null);
  }, [syncUrl]);

  const onSeen = useCallback((slug: string) => {
    setSeenSlugs(new Set(markStorySeen(slug)));
  }, []);

  const showPlayer =
    activeIndex !== null &&
    activeIndex >= 0 &&
    activeIndex < stories.length &&
    Boolean(stories[activeIndex]);

  return (
    <div className="relative min-h-[70vh] bg-[#E0E0E0] pb-8 sm:pb-10" dir="rtl">
      <div className="container relative mx-auto px-4 pt-6 sm:pt-8">
        {bannerLoading ? (
          <StoriesBannerSkeleton className="mb-8" />
        ) : isStoriesBannerVisible(banner) ? (
          <StoriesBanner banner={banner} variant="hero" linked={false} className="mb-8" />
        ) : null}

        <header className="relative z-10 mb-8 sm:mb-10">
          <div className="mb-3 flex items-center gap-2 text-xs text-[#717171] sm:text-sm">
            <Link href="/" className="transition-colors hover:text-[#2A86FE]">
              خانه
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-[#373A50]">قصه‌های دماوند</span>
          </div>
          <h1 className="flex items-center gap-1.5 text-[1.65rem] font-bold leading-snug text-[#373A50] sm:text-3xl lg:text-[34px]">
            <span>انیمیشن‌های داستانی گویا</span>
            {/* ========== شروع کاراکتر خانم حلوا لوز ========== */}
            <CharacterImg
              src={CHAR.halva}
              style={{
                position: 'relative',
                width: '44px',
                height: 'auto',
                zIndex: 20,
                top: '0px',
                left: '0px',
                right: 'auto',
                bottom: 'auto',
                flexShrink: 0,
                filter: 'drop-shadow(0 8px 12px rgba(55, 58, 80, 0.18))',
              }}
            />
            {/* ========== پایان کاراکتر خانم حلوا لوز ========== */}
          </h1>
          <p className="mt-2 max-w-xl text-[13px] leading-7 text-[#717171] sm:text-sm">
            روی کاور هر قسمت بزنید تا در مدال پخش شود
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {STORY_CAST.map((member) => (
              <li
                key={member.name}
                className="rounded-full border border-white/80 bg-white/90 px-3 py-1 text-[11px] text-[#373A50] shadow-sm sm:text-xs"
              >
                {member.name}
              </li>
            ))}
          </ul>
        </header>

        {isLoading ? (
          <StoriesExploreSkeleton />
        ) : isError ? (
          <StoriesEmptyState
            variant="error"
            message={error?.message}
            onRetry={() => {
              void refetch();
            }}
          />
        ) : stories.length === 0 ? (
          <StoriesEmptyState variant="empty" />
        ) : (
          <StoriesEmptyState
            variant="storyline"
            stories={stories}
            onSelectStory={openByStory}
          />
        )}
      </div>

      {showPlayer && activeIndex !== null && stories[activeIndex] ? (
        <StoryModal
          story={stories[activeIndex]}
          episodeNumber={activeIndex + 1}
          onClose={closePlayer}
          onSeen={onSeen}
        />
      ) : null}
    </div>
  );
}
