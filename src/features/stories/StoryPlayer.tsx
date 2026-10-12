'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Play, Volume2, VolumeX, X } from 'lucide-react';
import { getMediaUrl } from '@/lib/utils';
import { getStoryPlaybackUrl } from '@/services/storiesService';
import type { StoryItem } from '@/types/story';
import { StoryCoverImage } from './StoryCoverImage';

type StoryPlayerProps = {
  stories: StoryItem[];
  activeIndex: number;
  onChangeIndex: (index: number) => void;
  onClose: () => void;
  onSeen: (slug: string) => void;
};

/**
 * مدال ریلز با dialog native (top-layer) تا حتماً روی همه چیز بیاید
 */
export function StoryPlayer({
  stories,
  activeIndex,
  onChangeIndex,
  onClose,
  onSeen,
}: StoryPlayerProps) {
  const story = stories[activeIndex];
  const playbackUrl = story ? getStoryPlaybackUrl(story) : null;
  const coverUrl = story?.cover ? getMediaUrl(story.cover) : '';

  const dialogRef = useRef<HTMLDialogElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !mounted) return;
    if (!dialog.open) {
      dialog.showModal();
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
      if (dialog.open) dialog.close();
    };
  }, [mounted]);

  const goNext = useCallback(() => {
    if (activeIndex >= stories.length - 1) {
      onClose();
      return;
    }
    onChangeIndex(activeIndex + 1);
  }, [activeIndex, onChangeIndex, onClose, stories.length]);

  const goPrev = useCallback(() => {
    if (activeIndex <= 0) return;
    onChangeIndex(activeIndex - 1);
  }, [activeIndex, onChangeIndex]);

  const playVideo = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !playbackUrl) return;
    try {
      video.muted = muted;
      await video.play();
      setPlaying(true);
      setFailed(false);
    } catch {
      setPlaying(false);
    }
  }, [muted, playbackUrl]);

  const togglePlay = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !playbackUrl) return;
    if (video.paused) {
      await playVideo();
    } else {
      video.pause();
      setPlaying(false);
    }
  }, [playVideo, playbackUrl]);

  useEffect(() => {
    if (!story) return;
    onSeen(story.slug);
    setProgress(0);
    setFailed(false);
    setPlaying(false);
    const t = window.setTimeout(() => {
      void playVideo();
    }, 80);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.id, playbackUrl]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = muted;
  }, [muted]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === ' ') {
        e.preventDefault();
        void togglePlay();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev, onClose, togglePlay]);

  if (!mounted || !story) return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      className="fixed inset-0 z-[2147483647] m-0 h-[100dvh] w-screen max-h-none max-w-none border-0 bg-black/90 p-0 open:flex open:items-center open:justify-center"
      aria-label={story.title}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex h-[100dvh] w-full max-w-[420px] flex-col overflow-hidden bg-black sm:h-[min(90dvh,760px)] sm:rounded-3xl sm:aspect-[9/16]">
        <div className="absolute inset-x-3 top-3 z-40 flex gap-1" dir="rtl">
          {stories.map((item, i) => (
            <div
              key={item.id}
              className="h-[2.5px] flex-1 overflow-hidden rounded-full bg-white/25"
            >
              <div
                className="h-full origin-right rounded-full bg-white"
                style={{
                  transform: `scaleX(${
                    i < activeIndex ? 1 : i === activeIndex ? progress : 0
                  })`,
                }}
              />
            </div>
          ))}
        </div>

        <div className="absolute inset-x-3 top-8 z-40 flex justify-between">
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white"
            aria-label="بستن"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white"
            aria-label={muted ? 'صدا' : 'بی‌صدا'}
          >
            {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
        </div>

        <StoryCoverImage
          src={story.cover}
          alt=""
          priority
          className="absolute inset-0 h-full w-full object-cover"
        />

        {playbackUrl && !failed ? (
          <video
            key={String(story.id)}
            ref={videoRef}
            src={playbackUrl}
            poster={coverUrl || undefined}
            className="absolute inset-0 z-[5] h-full w-full object-cover"
            playsInline
            preload="auto"
            muted={muted}
            autoPlay
            onTimeUpdate={() => {
              const v = videoRef.current;
              if (!v?.duration) return;
              setProgress(Math.min(1, v.currentTime / v.duration));
            }}
            onPlaying={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={goNext}
            onError={() => setFailed(true)}
            onClick={(e) => {
              e.stopPropagation();
              void togglePlay();
            }}
          />
        ) : null}

        <button
          type="button"
          className="absolute inset-y-0 right-0 z-20 w-1/3"
          aria-label="قبلی"
          onClick={(e) => {
            e.stopPropagation();
            goPrev();
          }}
        />
        <button
          type="button"
          className="absolute inset-y-0 left-0 z-20 w-1/3"
          aria-label="بعدی"
          onClick={(e) => {
            e.stopPropagation();
            goNext();
          }}
        />

        {!playing ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              void playVideo();
            }}
            className="absolute left-1/2 top-1/2 z-30 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white ring-1 ring-white/40 backdrop-blur-md"
            aria-label="پخش"
          >
            <Play className="mr-[-2px] h-7 w-7 fill-white" />
          </button>
        ) : null}

        {failed || !playbackUrl ? (
          <div className="absolute inset-x-4 bottom-28 z-40 rounded-xl bg-black/60 px-3 py-2 text-center text-sm text-white">
            {failed ? 'پخش ویدیو ممکن نشد' : 'ویدیو موجود نیست'}
          </div>
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 bg-gradient-to-t from-black/90 to-transparent px-5 pb-8 pt-16">
          <p className="mb-1 text-xs text-white/70">
            {activeIndex + 1} / {stories.length}
          </p>
          <p className="text-lg font-bold text-white">{story.title}</p>
          {story.description ? (
            <p className="mt-1 line-clamp-2 text-sm text-white/75">{story.description}</p>
          ) : null}
        </div>
      </div>
    </dialog>,
    document.body
  );
}
