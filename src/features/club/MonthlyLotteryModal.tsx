'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { X } from 'lucide-react';
import './monthly-lottery-modal.css';

const SESSION_KEY = 'gooya-monthly-lottery-dismissed';
const OPEN_DELAY_MS = 900;
const CLUB_HREF = '/user/club';
const GIFT_CARD_SRC = '/assets/club/monthly-lottery-gift-card.jpg';

type MonthlyLotteryModalProps = {
  /** تأخیر باز شدن بعد از mount (میلی‌ثانیه) */
  openDelayMs?: number;
};

/**
 * پاپ‌آپ قرعه‌کشی انتهای ماه — تم لوکس سرمه‌ای/طلایی
 * بعد از بستن، تا پایان سشن دوباره نشان داده نمی‌شود.
 */
export function MonthlyLotteryModal({
  openDelayMs = OPEN_DELAY_MS,
}: MonthlyLotteryModalProps) {
  const titleId = useId();
  const descId = useId();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  const dismiss = useCallback(() => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* ignore quota / private mode */
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return undefined;

    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === '1') {
        return undefined;
      }
    } catch {
      /* show once even if storage blocked */
    }

    const timer = window.setTimeout(() => setOpen(true), openDelayMs);
    return () => window.clearTimeout(timer);
  }, [mounted, openDelayMs]);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dismiss();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, dismiss]);

  if (!mounted || !open) return null;

  return createPortal(
    <div
      className="monthly-lottery-backdrop fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4 backdrop-blur-[2px] sm:p-6"
      role="presentation"
      onClick={dismiss}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        dir="rtl"
        className="monthly-lottery-card relative w-full max-w-[440px] overflow-hidden rounded-3xl border border-[#D4AF37]/35 bg-[#0B0C1E] text-white shadow-[0_24px_64px_rgba(0,0,0,0.55)] sm:max-w-[520px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="monthly-lottery-grain pointer-events-none absolute inset-0 z-[1]"
          aria-hidden="true"
        />

        <button
          type="button"
          onClick={dismiss}
          aria-label="بستن"
          className="absolute left-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white/90 backdrop-blur-sm transition hover:bg-black/55 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/70"
        >
          <X className="h-4 w-4" strokeWidth={2.25} />
        </button>

        <div className="relative z-[2]">
          {/* کارت هدیه اصلی */}
          <div className="relative overflow-hidden border-b border-[#D4AF37]/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={GIFT_CARD_SRC}
              alt="گیفت کارت ۲ میلیون تومانی گویا — برنده ویژه مشارکت"
              className="block h-auto w-full select-none object-cover"
              draggable={false}
            />
          </div>

          {/* متن و CTA — هم‌تم با کارت */}
          <div className="relative px-5 pb-5 pt-4 sm:px-7 sm:pb-6 sm:pt-5">
            <p
              id={titleId}
              className="text-center text-[15px] font-bold leading-7 text-white sm:text-base"
            >
              برنده ویژه مشارکت 🎉
            </p>
            <p className="mt-1 text-center text-lg font-bold tracking-tight text-[#F0D78C] sm:text-xl">
              ۲٬۰۰۰٬۰۰۰ تومان
              <span className="mr-1 text-xs font-medium text-white/65 sm:text-sm">
                گیفت کارت خرید
              </span>
            </p>

            <p
              id={descId}
              className="mx-auto mt-3 max-w-[36rem] text-center text-[12.5px] leading-7 text-white/78 sm:text-[13.5px] sm:leading-8"
            >
              به پاس همراهی ارزشمند شما در خانواده بزرگ گویا، قرعه‌کشی بزرگ انتهای
              ماه برگزار می‌شود! با فعالیت در گویا کلاب، شانس خود را برای برنده شدن
              این جایزه ویژه چند برابر کنید.
            </p>

            <div className="mt-5 flex flex-col gap-2.5">
              <Link
                href={CLUB_HREF}
                onClick={dismiss}
                className="monthly-lottery-cta-primary inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-center text-[13px] font-bold text-[#1a1408] transition sm:text-sm"
              >
                ورود به گویا کلاب و شرکت در قرعه‌کشی
              </Link>

              <button
                type="button"
                onClick={dismiss}
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-4 py-2.5 text-[13px] font-medium text-white/80 transition hover:border-white/25 hover:bg-white/[0.07] hover:text-white sm:text-sm"
              >
                بعداً یادآوری کن
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
