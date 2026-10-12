'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Loader2, Lock, PartyPopper, Sparkles, X } from 'lucide-react';
import { toast } from 'sonner';
import LoginModal from '@/components/LoginModal';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  useMarkStoryWatched,
  useStory,
  useSubmitStoryAnswer,
} from '@/hooks/useStories';
import { getMediaUrl } from '@/lib/utils';
import {
  getStoryPlaybackUrl,
  getStoryVideoElementSrc,
  mergeStoryMedia,
  StoryAuthRequiredError,
} from '@/services/storiesService';
import type { StoryItem } from '@/types/story';
import { StoryQuestions } from './StoryQuestions';
import './story-modal.css';

type StoryModalProps = {
  story: StoryItem;
  episodeNumber: number;
  onClose: () => void;
  onSeen: (slug: string) => void;
};

/**
 * پاپ‌آپ استاندارد قسمت داستانی.
 * ویدیو در قاب 16:9 محدود است و سوال‌ها فقط پس از تماشای کامل باز می‌شوند.
 */
export function StoryModal({
  story: listStory,
  episodeNumber,
  onClose,
  onSeen,
}: StoryModalProps) {
  const { isAuthenticated, refreshUser } = useAuth();
  const slug = listStory.slug;
  const { data: detail, isLoading, isError, error, refetch } = useStory(slug, {
    enabled: Boolean(slug),
  });
  const watchMutation = useMarkStoryWatched(slug);
  const answerMutation = useSubmitStoryAnswer(slug);

  const story = detail ?? listStory;
  const media = mergeStoryMedia(detail, listStory);
  const directUrl = getStoryPlaybackUrl(media);
  const proxiedUrl = getStoryVideoElementSrc(media);
  const poster = media.cover ? getMediaUrl(media.cover) : undefined;

  const [useDirectUrl, setUseDirectUrl] = useState(false);
  const videoUrl = useMemo(
    () => (useDirectUrl ? directUrl : proxiedUrl || directUrl),
    [directUrl, proxiedUrl, useDirectUrl]
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const watchRegisteredRef = useRef(Boolean(detail?.has_watched));
  const [mounted, setMounted] = useState(false);
  const [isFinished, setIsFinished] = useState(Boolean(detail?.has_watched));
  const [showQuestions, setShowQuestions] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [celebrateButton, setCelebrateButton] = useState(false);
  const [answerReward, setAnswerReward] = useState<number | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    onSeen(slug);
  }, [onSeen, slug]);

  useEffect(() => {
    if (detail?.has_watched) {
      setIsFinished(true);
      watchRegisteredRef.current = true;
    }
  }, [detail?.has_watched]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const registerWatch = useCallback(async (): Promise<boolean> => {
    if (watchRegisteredRef.current || detail?.has_watched) return true;
    if (!isAuthenticated) return false;

    try {
      const result = await watchMutation.mutateAsync();
      watchRegisteredRef.current = true;
      if (!result.already_watched && result.points_earned > 0) {
        toast.success(`${result.points_earned} امتیاز تماشا گرفتید`, {
          description: `مجموع امتیاز: ${result.total_points}`,
        });
      }
      return true;
    } catch (watchError) {
      if (watchError instanceof StoryAuthRequiredError) return false;
      toast.error(
        watchError instanceof Error
          ? watchError.message
          : 'ثبت تماشای ویدیو ممکن نشد'
      );
      return false;
    }
  }, [detail?.has_watched, isAuthenticated, watchMutation]);

  const finishVideo = useCallback(() => {
    if (isFinished) return;
    setIsFinished(true);
    setCelebrateButton(true);
    void registerWatch();
    window.setTimeout(() => setCelebrateButton(false), 2600);
  }, [isFinished, registerWatch]);

  const revealQuestions = useCallback(async () => {
    if (!isFinished) return;
    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }

    const registered = await registerWatch();
    if (!registered) {
      setLoginOpen(true);
      return;
    }

    await refetch();
    setShowQuestions(true);
    window.setTimeout(() => {
      contentRef.current?.scrollTo({
        top: contentRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }, 50);
  }, [isAuthenticated, isFinished, refetch, registerWatch]);

  if (!mounted) return null;

  const questions = detail?.questions ?? [];
  const canAnswer =
    Boolean(detail?.can_answer) || (isFinished && watchRegisteredRef.current);

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-50 z-[10050] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="story-modal-title"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7">
          <button
            type="button"
            onClick={onClose}
            className="absolute left-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#373A50] shadow-md transition-colors hover:bg-[#F3F4F6] sm:left-5 sm:top-5"
            aria-label="بستن مدال"
          >
            <X className="h-5 w-5" />
          </button>

          <div ref={contentRef} dir="rtl">
            <div className="relative mb-5 aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-inner">
              {videoUrl && !videoFailed ? (
                <video
                  key={videoUrl}
                  ref={videoRef}
                  src={videoUrl}
                  poster={poster}
                  className="h-full w-full object-contain"
                  controls
                  controlsList="nodownload"
                  muted
                  playsInline
                  preload="metadata"
                  onEnded={finishVideo}
                  onTimeUpdate={(event) => {
                    const video = event.currentTarget;
                    if (
                      video.duration > 0 &&
                      video.duration - video.currentTime <= 0.25
                    ) {
                      finishVideo();
                    }
                  }}
                  onError={() => {
                    if (
                      !useDirectUrl &&
                      directUrl &&
                      proxiedUrl &&
                      directUrl !== proxiedUrl
                    ) {
                      setUseDirectUrl(true);
                      return;
                    }
                    setVideoFailed(true);
                  }}
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm text-white/80">
                  {videoFailed
                    ? 'پخش ویدیو ممکن نشد.'
                    : 'ویدیویی برای این قسمت موجود نیست.'}
                </div>
              )}
          </div>

            <div className="text-right">
              <p className="mb-1 text-xs font-semibold text-[#2A86FE]">
                قسمت {episodeNumber.toLocaleString('fa-IR')}
              </p>
              <h2
                id="story-modal-title"
                className="text-xl font-bold leading-8 text-[#373A50]"
              >
                {story.title}
              </h2>
              {story.description ? (
                <p className="mt-2 text-[13px] leading-7 text-[#717171]">
                  {story.description}
                </p>
              ) : null}
            </div>

            <div className="my-4 border-t border-[#E8E8EC]" />

            <section className="relative" aria-label="سوالات قسمت">
              {celebrateButton ? (
                <div
                  className="pointer-events-none absolute inset-x-0 -top-10 z-20 h-24 overflow-visible"
                  aria-hidden="true"
                >
                  {Array.from({ length: 20 }).map((_, index) => (
                    <span
                      key={index}
                      className="story-button-confetti absolute left-1/2 top-1/2 rounded-sm"
                      style={
                        {
                          '--confetti-x': `${((index * 37) % 220) - 110}px`,
                          '--confetti-y': `${-25 - ((index * 19) % 70)}px`,
                          '--confetti-rotate': `${(index * 71) % 360}deg`,
                          '--confetti-delay': `${(index % 5) * 45}ms`,
                          backgroundColor: [
                            '#2A86FE',
                            '#D4AF37',
                            '#1F3C88',
                            '#F59E0B',
                            '#EC4899',
                          ][index % 5],
                        } as CSSProperties
                      }
                    />
                  ))}
                </div>
              ) : null}

              <Button
                type="button"
                disabled={watchMutation.isPending}
                onClick={() => {
                  if (!isFinished) {
                    toast.info('ابتدا ویدیو را تا انتها مشاهده کنید', {
                      description:
                        'بعد از پایان کامل ویدیو، امکان شرکت در مسابقه فعال می‌شود.',
                    });
                    return;
                  }
                  void revealQuestions();
                }}
                className={`story-contest-button relative w-full overflow-hidden rounded-xl !text-white shadow-[0_8px_24px_rgba(42,134,254,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:!bg-[#1F3C88] hover:shadow-[0_12px_30px_rgba(31,60,136,0.35)] disabled:!text-white ${
                  isFinished
                    ? 'story-contest-button-active !bg-[#2A86FE]'
                    : '!bg-[#2A86FE]'
                }`}
              >
                {watchMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="!text-white">در حال ثبت تماشا...</span>
                  </>
                ) : !isFinished ? (
                  <>
                    <Lock className="h-4 w-4 !text-white" />
                    <span className="!text-white">
                      شرکت در مسابقه و پاسخ به سوالات
                    </span>
                  </>
                ) : showQuestions ? (
                  <>
                    <Sparkles className="h-4 w-4 !text-white" />
                    <span className="!text-white">
                      سوالات مسابقه نمایش داده شد
                    </span>
                  </>
                ) : (
                  <>
                    <PartyPopper className="h-4 w-4 !text-white" />
                    <span className="!text-white">
                      شرکت در مسابقه و پاسخ به سوالات
                    </span>
                  </>
                )}
              </Button>

              {showQuestions ? (
                <div className="mt-5">
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2 py-8 text-sm text-[#717171]">
                      <Loader2 className="h-4 w-4 animate-spin text-[#2A86FE]" />
                      در حال بارگذاری سوال...
                    </div>
                  ) : isError ? (
                    <div className="rounded-2xl bg-[#F7F8FA] p-4 text-center">
                      <p className="text-sm text-[#717171]">
                        {error?.message || 'بارگذاری سوال ممکن نشد.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => void refetch()}
                        className="mt-3 text-sm font-medium text-[#2A86FE]"
                      >
                        تلاش مجدد
                      </button>
                    </div>
                  ) : (
                    <StoryQuestions
                      questions={questions}
                      canAnswer={canAnswer}
                      hasWatched={isFinished}
                      isAuthenticated={isAuthenticated}
                      submittingQuestionId={
                        answerMutation.isPending
                          ? answerMutation.variables?.question_id ?? null
                          : null
                      }
                      onRequireLogin={() => setLoginOpen(true)}
                      onSubmitAnswer={(questionId, selectedOption) => {
                        answerMutation.mutate(
                          {
                            question_id: questionId,
                            selected_option: selectedOption,
                          },
                          {
                            onSuccess: (result) => {
                              if (
                                !result.already_answered &&
                                result.points_earned > 0
                              ) {
                                setAnswerReward(result.points_earned);
                              }
                              toast.success('پاسخ شما با موفقیت ثبت شد', {
                                description:
                                  result.points_earned > 0
                                    ? `${result.points_earned} امتیاز گرفتید`
                                    : undefined,
                              });
                            },
                            onError: (answerError) => {
                              if (
                                answerError instanceof StoryAuthRequiredError
                              ) {
                                setLoginOpen(true);
                                return;
                              }
                              toast.error(
                                answerError instanceof Error
                                  ? answerError.message
                                  : 'ثبت پاسخ ممکن نشد'
                              );
                            },
                          }
                        );
                      }}
                    />
                  )}

                  {answerReward !== null ? (
                    <div className="mt-4 rounded-2xl border border-[#D4AF37]/40 bg-gradient-to-l from-[#FFF8DF] to-white p-4 text-center shadow-sm">
                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#D4AF37]/15 text-[#9A7815]">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <p className="mt-2 text-sm font-bold text-[#373A50]">
                        {answerReward.toLocaleString('fa-IR')} امتیاز در گویا
                        کلاب کسب کردید
                      </p>
                      <p className="mt-1 text-[11px] leading-5 text-[#717171]">
                        امتیازها و وضعیت قرعه‌کشی را در گویا کلاب ببینید.
                      </p>
                      <Link
                        href="/user/club"
                        onClick={onClose}
                        className="mt-3 inline-flex items-center justify-center rounded-xl bg-[#2A86FE] px-4 py-2 text-xs font-medium !text-white transition-colors hover:bg-[#1F3C88]"
                      >
                        رفتن به گویا کلاب
                      </Link>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </section>
          </div>
        </div>
      </div>

      <LoginModal
        open={loginOpen}
        onOpenChange={setLoginOpen}
        description="برای پاسخ به سوالات وارد شوید"
        redirectOnSuccess={false}
        onSuccess={() => {
          void (async () => {
            await refreshUser();
            await refetch();
            const registered = await registerWatch();
            if (registered) setShowQuestions(true);
          })();
        }}
      />
    </>,
    document.body
  );
}
