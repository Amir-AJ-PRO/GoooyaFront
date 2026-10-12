'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Loader2, Lock, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { StoryQuestion } from '@/types/story';

type StoryQuestionsProps = {
  questions: StoryQuestion[];
  canAnswer: boolean;
  hasWatched: boolean;
  isAuthenticated: boolean;
  submittingQuestionId: number | null;
  onRequireLogin: () => void;
  onSubmitAnswer: (questionId: number, selectedOption: number) => void;
};

/**
 * سوالات چهارگزینه‌ای قسمت — قفل تا تماشای کامل + لاگین برای ارسال
 */
export function StoryQuestions({
  questions,
  canAnswer,
  hasWatched,
  isAuthenticated,
  submittingQuestionId,
  onRequireLogin,
  onSubmitAnswer,
}: StoryQuestionsProps) {
  const [drafts, setDrafts] = useState<Record<number, number | null>>({});

  if (questions.length === 0) {
    return (
      <div className="rounded-2xl bg-[#F7F8FA] px-4 py-6 text-center text-sm text-[#717171]">
        برای این قسمت سوالی ثبت نشده است.
      </div>
    );
  }

  const sorted = [...questions].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-base font-bold text-[#373A50]">سوالات این قسمت</h3>
        {!hasWatched || !canAnswer ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#D4AF37]/15 px-2.5 py-1 text-[11px] font-medium text-[#8A7020]">
            <Lock className="h-3 w-3" aria-hidden="true" />
            اول ویدیو را تا انتها ببینید
          </span>
        ) : null}
      </div>

      {sorted.map((question, index) => {
        const locked = question.answered;
        const selected =
          locked && question.selected_option != null
            ? question.selected_option
            : drafts[question.id] ?? null;
        const submitting = submittingQuestionId === question.id;
        return (
          <article
            key={question.id}
            className="rounded-2xl border border-[#E8E8EC] bg-white p-4 text-right shadow-sm"
          >
            <p className="mb-3 text-sm font-bold leading-7 text-[#373A50]">
              <span className="ml-1 text-[#2A86FE]">{index + 1}.</span>
              {question.text}
            </p>

            <ul className="space-y-2">
              {question.options.map((option) => {
                const isSelected = selected === option.id;
                const showResult = locked && question.correct_option != null;
                const isCorrectOption =
                  showResult && option.id === question.correct_option;
                const isWrongSelected =
                  showResult &&
                  isSelected &&
                  question.is_correct === false;

                return (
                  <li key={option.id}>
                    <button
                      type="button"
                      disabled={locked || submitting}
                      onClick={() => {
                        if (!isAuthenticated) {
                          onRequireLogin();
                          return;
                        }
                        if (!canAnswer || !hasWatched) return;
                        setDrafts((prev) => ({
                          ...prev,
                          [question.id]: option.id,
                        }));
                      }}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-xl border px-3 py-2.5 text-right text-[13px] transition-colors',
                        'disabled:cursor-default',
                        isCorrectOption &&
                          'border-emerald-400 bg-emerald-50 text-emerald-800',
                        isWrongSelected &&
                          'border-rose-300 bg-rose-50 text-rose-800',
                        !showResult &&
                          isSelected &&
                          'border-[#2A86FE] bg-[#2A86FE]/8 text-[#1F3C88]',
                        !showResult &&
                          !isSelected &&
                          'border-[#E8E8EC] bg-[#FAFAFB] text-[#373A50] hover:border-[#2A86FE]/40'
                      )}
                    >
                      {isCorrectOption ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      ) : isWrongSelected ? (
                        <XCircle className="h-4 w-4 shrink-0 text-rose-500" />
                      ) : isSelected ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#2A86FE]" />
                      ) : (
                        <Circle className="h-4 w-4 shrink-0 text-[#C4C4C8]" />
                      )}
                      <span className="flex-1 leading-6">{option.text}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {!locked ? (
              <Button
                type="button"
                className="mt-3 w-full rounded-xl !bg-[#2A86FE] !text-white shadow-[0_6px_18px_rgba(42,134,254,0.22)] hover:!bg-[#1F3C88] disabled:!bg-[#AFCFF8] disabled:!text-white disabled:opacity-100"
                disabled={
                  locked ||
                  submitting ||
                  (isAuthenticated &&
                    (!hasWatched || !canAnswer || selected == null))
                }
                onClick={() => {
                  if (!isAuthenticated) {
                    onRequireLogin();
                    return;
                  }
                  if (!canAnswer || !hasWatched) return;
                  if (selected == null) return;
                  onSubmitAnswer(question.id, selected);
                }}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin !text-white" />
                    <span className="!text-white">در حال ارسال...</span>
                  </>
                ) : !hasWatched || !canAnswer ? (
                  <span className="!text-white">
                    اول ویدیو را تا انتها ببینید
                  </span>
                ) : !isAuthenticated ? (
                  <span className="!text-white">برای پاسخ وارد شوید</span>
                ) : (
                  <span className="!text-white">ثبت پاسخ</span>
                )}
              </Button>
            ) : (
              <p
                className={cn(
                  'mt-3 text-center text-xs font-medium',
                  question.is_correct ? 'text-emerald-600' : 'text-rose-500'
                )}
              >
                {question.is_correct
                  ? 'پاسخ صحیح — امتیاز ثبت شد'
                  : 'پاسخ ثبت شد — این بار اشتباه بود'}
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}
