'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { Sparkles, X } from 'lucide-react';
import './monthly-lottery-modal.css';

const SESSION_KEY = 'gooya-monthly-lottery-dismissed';
const OPEN_DELAY_MS = 650;
const CLUB_HREF = '/user/club';
const GIFT_CARD_SRC = '/assets/club/monthly-lottery-gift-card.jpg';

type MonthlyLotteryModalProps = {
  openDelayMs?: number;
};

/**
 * پاپ‌آپ کوچک قرعه‌کشی — وسط صفحه، استایل لوکس قبلی
 */
export function MonthlyLotteryModal({
  openDelayMs = OPEN_DELAY_MS,
}: MonthlyLotteryModalProps) {
  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [shouldOpen, setShouldOpen] = useState(false);

  const dismiss = useCallback(() => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1');
    } catch {
      /* ignore */
    }
    setShouldOpen(false);
    dialogRef.current?.close();
  }, []);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(SESSION_KEY) === '1') {
        return undefined;
      }
    } catch {
      /* show once */
    }

    const timer = window.setTimeout(() => setShouldOpen(true), openDelayMs);
    return () => window.clearTimeout(timer);
  }, [openDelayMs]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (shouldOpen && !dialog.open) {
      dialog.showModal();
    }
    if (!shouldOpen && dialog.open) {
      dialog.close();
    }
  }, [shouldOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    const onCancel = (event: Event) => {
      event.preventDefault();
      dismiss();
    };

    dialog.addEventListener('cancel', onCancel);
    return () => dialog.removeEventListener('cancel', onCancel);
  }, [dismiss]);

  useEffect(() => {
    if (!shouldOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="monthly-lottery-dialog"
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          dismiss();
        }
      }}
    >
      <div
        dir="rtl"
        className="monthly-lottery-card relative w-full overflow-hidden rounded-2xl border border-[#D4AF37]/55 bg-[#0B0C1E] text-white shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="monthly-lottery-glow" aria-hidden="true" />
        <div className="monthly-lottery-sparkles" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <button
          type="button"
          onClick={dismiss}
          aria-label="بستن"
          className="absolute -left-2 -top-2 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-[#D4AF37]/45 bg-[#0B0C1E] text-white shadow-lg transition hover:border-[#D4AF37] hover:text-[#F0D78C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
        >
          <X className="h-3.5 w-3.5" strokeWidth={2.5} />
        </button>

        <div className="relative h-[132px] w-full overflow-hidden bg-[#0B0C1E] sm:h-[148px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={GIFT_CARD_SRC}
            alt=""
            className="monthly-lottery-img h-full w-full select-none object-contain object-center"
            draggable={false}
          />
        </div>

        <div className="relative bg-white/10 px-3.5 pb-3.5 pt-4 backdrop-blur-md supports-[backdrop-filter]:bg-white/[0.08]">
          <div className="mb-1 flex items-center justify-center gap-1 text-[#F0D78C]">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span className="text-[10px] font-bold tracking-wide">
              قرعه‌کشی ویژه گویا
            </span>
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          </div>

          <h2
            id={titleId}
            className="text-center text-[13px] font-bold leading-6 text-white"
          >
            برنده ویژه مشارکت 🎉
          </h2>
          <p className="monthly-lottery-prize mt-0.5 text-center text-[16px] font-bold text-[#F0D78C]">
            ۲٬۰۰۰٬۰۰۰ تومان
          </p>
          <p
            id={descId}
            className="mt-1.5 text-center text-[11px] leading-5 text-white/80"
          >
            در گویا کلاب فعال باش و شانس خودت رو برای این گیفت‌کارت چند برابر کن.
          </p>

          <div className="mt-3 flex flex-col gap-1">
            <Link
              href={CLUB_HREF}
              onClick={dismiss}
              className="monthly-lottery-cta-primary inline-flex w-full items-center justify-center rounded-lg px-3 py-2.5 text-center text-[12px] font-bold"
            >
              ورود به گویا کلاب
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="inline-flex w-full items-center justify-center rounded-lg px-3 py-1.5 text-[11px] font-medium text-white/55 transition hover:text-white/90"
            >
              بعداً یادآوری کن
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
