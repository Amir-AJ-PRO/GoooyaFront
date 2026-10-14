'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import './stories-storyline.css';
import { getMediaUrl } from '@/lib/utils';
import { getStoryVideoElementSrc } from '@/services/storiesService';
import type { StoryItem } from '@/types/story';

const PREVIEW_SECONDS = 3;
const CARD_WIDTH_PX = 240;

type StoriesStorylineProps = {
  stories: StoryItem[];
  onSelectStory: (story: StoryItem) => void;
};

type StoryCardProps = {
  story: StoryItem;
  onSelect: (story: StoryItem) => void;
};

const LONG_PRESS_MS = 320;

/**
 * کارت داستان — ظاهر حرفه‌ای، تامنیل ثابت، بدون برچسب قسمت
 * روی موبایل: لمس طولانی روی تصویر = همان حالت hover دسکتاپ + پیش‌نمایش
 */
function StoryCard({ story, onSelect }: StoryCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const longPressTimerRef = useRef<number>(0);
  const suppressNextClickRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [isHot, setIsHot] = useState(false);

  const thumbnail = story.cover ? getMediaUrl(story.cover) : '';
  const playbackUrl = getStoryVideoElementSrc(story);

  const stopPreview = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        /* ignore */
      }
    }
    setPreviewing(false);
  }, []);

  const startPreview = useCallback(async () => {
    if (!playbackUrl) return;
    const video = videoRef.current;
    if (!video) return;
    setPreviewing(true);
    try {
      video.muted = true;
      video.playsInline = true;
      video.currentTime = 0;
      await video.play();
    } catch {
      setPreviewing(false);
    }
  }, [playbackUrl]);

  const clearLongPressTimer = useCallback(() => {
    if (longPressTimerRef.current) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = 0;
    }
  }, []);

  const endMediaInteraction = useCallback(
    (fromLongPress: boolean) => {
      clearLongPressTimer();
      if (fromLongPress) {
        suppressNextClickRef.current = true;
      }
      setIsHot(false);
      stopPreview();
    },
    [clearLongPressTimer, stopPreview]
  );

  useEffect(
    () => () => {
      clearLongPressTimer();
      stopPreview();
    },
    [clearLongPressTimer, stopPreview]
  );

  return (
    <div
      onClick={() => {
        if (suppressNextClickRef.current) {
          suppressNextClickRef.current = false;
          return;
        }
        setIsHot(false);
        stopPreview();
        onSelect(story);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsHot(false);
          stopPreview();
          onSelect(story);
        }
      }}
      role="button"
      tabIndex={0}
      data-hot={isHot ? 'true' : 'false'}
      className={`group flex cursor-pointer select-none flex-col overflow-hidden rounded-2xl border bg-white text-right shadow-[0_1px_2px_rgba(55,58,80,0.04)] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2A86FE]/40 hover:-translate-y-0.5 hover:border-[#2A86FE]/25 hover:shadow-[0_12px_28px_rgba(55,58,80,0.12)] data-[hot=true]:-translate-y-0.5 data-[hot=true]:border-[#2A86FE]/25 data-[hot=true]:shadow-[0_12px_28px_rgba(55,58,80,0.12)] ${
        isHot ? 'border-[#2A86FE]/25' : 'border-[#E8E8EC]'
      }`}
      style={{ width: CARD_WIDTH_PX, minWidth: CARD_WIDTH_PX, maxWidth: CARD_WIDTH_PX }}
      aria-label={`پخش ${story.title}`}
    >
      <div
        className="relative w-full shrink-0 touch-manipulation overflow-hidden bg-[#F3F4F6]"
        style={{ height: 148 }}
        onMouseEnter={() => {
          setIsHot(true);
          void startPreview();
        }}
        onMouseLeave={() => {
          setIsHot(false);
          stopPreview();
        }}
        onTouchStart={(e) => {
          const touch = e.touches[0];
          touchStartRef.current = touch
            ? { x: touch.clientX, y: touch.clientY }
            : null;
          clearLongPressTimer();
          suppressNextClickRef.current = false;
          longPressTimerRef.current = window.setTimeout(() => {
            setIsHot(true);
            void startPreview();
            suppressNextClickRef.current = true;
          }, LONG_PRESS_MS);
        }}
        onTouchMove={(e) => {
          const start = touchStartRef.current;
          const touch = e.touches[0];
          if (!start || !touch) return;
          const moved =
            Math.abs(touch.clientX - start.x) > 12 ||
            Math.abs(touch.clientY - start.y) > 12;
          if (moved) {
            clearLongPressTimer();
            if (isHot) {
              setIsHot(false);
              stopPreview();
            }
            suppressNextClickRef.current = false;
          }
        }}
        onTouchEnd={() => {
          touchStartRef.current = null;
          const wasLongPress = suppressNextClickRef.current;
          endMediaInteraction(wasLongPress);
        }}
        onTouchCancel={() => {
          touchStartRef.current = null;
          endMediaInteraction(suppressNextClickRef.current);
        }}
        onContextMenu={(e) => {
          if (isHot || suppressNextClickRef.current) {
            e.preventDefault();
          }
        }}
      >
        {thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbnail}
            alt={story.title}
            className={`h-full w-full object-cover transition-[transform,opacity] duration-500 ease-out group-hover:scale-[1.04] group-data-[hot=true]:scale-[1.04] ${
              previewing ? 'opacity-0' : 'opacity-100'
            }`}
            draggable={false}
          />
        ) : (
          <div
            className="h-full w-full bg-gradient-to-br from-[#2A86FE]/20 via-[#373A50]/30 to-[#D4AF37]/15"
            aria-hidden="true"
          />
        )}

        {playbackUrl ? (
          <video
            ref={videoRef}
            src={playbackUrl}
            muted
            playsInline
            preload="metadata"
            className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${
              previewing ? 'opacity-100' : 'opacity-0'
            }`}
            onTimeUpdate={() => {
              const video = videoRef.current;
              if (video && video.currentTime >= PREVIEW_SECONDS) {
                stopPreview();
              }
            }}
            onEnded={stopPreview}
          />
        ) : null}

        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/35 to-transparent"
          aria-hidden="true"
        />

        {!previewing ? (
          <span
            className={`pointer-events-none absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#373A50] shadow-md backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-data-[hot=true]:opacity-100 ${
              isHot ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Play className="mr-[-1px] h-3.5 w-3.5 fill-current" aria-hidden="true" />
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col px-3.5 pb-4 pt-3">
        <h3 className="line-clamp-1 text-[13px] font-bold leading-snug text-[#373A50]">
          {story.title}
        </h3>
        {story.description ? (
          <p className="mt-1.5 line-clamp-2 text-[10px] leading-5 text-[#9CA3AF]">
            {story.description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/**
 * سوایپر افقی — فضای پایین برای کاراکتر عسلک
 */
export function StoriesStoryline({
  stories,
  onSelectStory,
}: StoriesStorylineProps) {
  if (stories.length === 0) return null;

  return (
    <div className="w-full overflow-hidden pb-14 sm:pb-16" dir="rtl">
      <Swiper
        dir="rtl"
        loop={false}
        watchOverflow
        spaceBetween={16}
        slidesPerView="auto"
        className="stories-storyline-swiper !overflow-visible"
      >
        {stories.map((story) => (
          <SwiperSlide
            key={story.id}
            style={{ width: CARD_WIDTH_PX }}
            className="!h-auto"
          >
            <StoryCard story={story} onSelect={onSelectStory} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
