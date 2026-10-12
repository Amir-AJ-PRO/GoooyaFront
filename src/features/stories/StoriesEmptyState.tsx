'use client';

import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CHAR, CharacterImg, STORY_CAST } from './StoriesCastArt';

type StoriesEmptyStateProps = {
  variant: 'empty' | 'error';
  message?: string;
  onRetry?: () => void;
};

/**
 * کارت خالی با کاراکترها — جای هر کاراکتر با top/right/bottom/left اینلاین
 */
export function StoriesEmptyState({
  variant,
  message,
  onRetry,
}: StoriesEmptyStateProps) {
  const isError = variant === 'error';

  return (
    <div
      className="relative mx-auto mb-24 mt-4 w-full max-w-[720px] sm:mb-32 sm:mt-6"
      style={{ paddingTop: isError ? 0 : 56 }}
    >
      {/* ========== شروع کاراکتر توتک ========== */}
      {!isError ? (
        <CharacterImg
          src={CHAR.tutakSit}
          style={{
            position: 'absolute',
            width: '56px',
            height: 'auto',
            zIndex: 30,
            top: '-14px',
            left: '10px',
            right: 'auto',
            bottom: 'auto',
            filter: 'drop-shadow(0 8px 12px rgba(55, 58, 80, 0.18))',
          }}
        />
      ) : null}
      {/* ========== پایان کاراکتر توتک ========== */}

      <div className="relative z-0 overflow-visible rounded-2xl bg-white px-5 py-10 text-center shadow-soft sm:px-10 sm:py-12">
        {/* ========== شروع کاراکتر عسلک ========== */}
        {!isError ? (
          <CharacterImg
            src={CHAR.asalak}
            style={{
              position: 'absolute',
              width: '36px',
              height: 'auto',
              zIndex: 30,
              top: 'auto',
              left: 'auto',
              right: '12px',
              bottom: '12px',
              filter: 'drop-shadow(0 8px 12px rgba(55, 58, 80, 0.18))',
            }}
          />
        ) : null}
        {/* ========== پایان کاراکتر عسلک ========== */}

        {!isError ? (
          <ul className="mb-5 flex flex-wrap items-center justify-center gap-2">
            {STORY_CAST.map((member) => (
              <li
                key={member.name}
                className="rounded-full bg-[#F7F4EA] px-3 py-1 text-[11px] text-[#373A50] sm:text-xs"
              >
                <span className="font-medium">{member.name}</span>
                <span className="mr-1 text-[#717171]">· {member.hint}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <h2 className="mb-3 text-xl font-bold leading-snug text-[#373A50] sm:text-2xl">
          {isError ? 'بارگذاری قصه‌ها ممکن نشد' : 'به‌زودی ماجرا شروع می‌شود...'}
        </h2>
        <p className="mx-auto max-w-md text-[13px] leading-7 text-[#717171] sm:text-sm">
          {isError
            ? message ||
              'مشکلی در دریافت انیمیشن‌ها پیش آمده است. کمی بعد دوباره تلاش کنید.'
            : 'آقای توتک و خانواده‌اش؛ خانم حلوا لوز و عسلک، دنبال یک خانهٔ جدید می‌گردند. به‌زودی این ماجرا را همین‌جا تماشا می‌کنید.'}
        </p>
        {isError && onRetry ? (
          <Button
            type="button"
            onClick={onRetry}
            className="mt-6 rounded-xl bg-[#2A86FE] px-5 text-white hover:bg-[#1F3C88]"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            تلاش مجدد
          </Button>
        ) : null}
      </div>
    </div>
  );
}
