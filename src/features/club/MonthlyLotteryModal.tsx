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
        className="monthly-lottery-card relative w-full overflow-hidden rounded-2xl border border-[#D4AF37]/55 bg-[#0A0A23] text-white shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
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

        <div className="monthly-lottery-media relative h-[132px] w-full overflow-hidden bg-white sm:h-[148px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={GIFT_CARD_SRC}
            alt=""
            className="monthly-lottery-img h-full w-full select-none object-contain object-center"
            draggable={false}
          />
        </div>

        <div className="monthly-lottery-body relative -mt-px border-0 bg-white px-3.5 pb-4 pt-4 shadow-none">
          <div className="monthly-lottery-eyebrow mb-1.5 flex items-center justify-center gap-1.5">
            <Sparkles className="h-3 w-3 shrink-0" />
            <span>قرعه‌کشی ویژه گویا</span>
            <Sparkles className="h-3 w-3 shrink-0" />
          </div>

          <h2 id={titleId} className="monthly-lottery-title">
            برنده ویژه مشارکت
            <span className="monthly-lottery-title-emoji" aria-hidden="true">
              {' '}
              🎉
            </span>
          </h2>
          <p className="monthly-lottery-prize">۲٬۰۰۰٬۰۰۰ تومان</p>
          <p id={descId} className="monthly-lottery-desc">
            در گویا کلاب فعال باش و شانس خودت رو برای این گیفت‌کارت چند برابر کن
          </p>

          <div className="monthly-lottery-actions flex flex-col gap-1">
            <Link
              href={CLUB_HREF}
              onClick={dismiss}
              className="monthly-lottery-cta-primary inline-flex w-full items-center justify-center rounded-lg px-3 py-2.5 text-center"
            >
              ورود به گویا کلاب
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="monthly-lottery-cta-secondary"
            >
              بعداً یادآوری کن
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
