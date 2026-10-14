'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';
import './stories-floating-mascot.css';

const MASCOT_SRC_WEBM = '/assets/stories/stories-asal-mascot.webm';
/** WebP شفاف — فقط برای iOS (Safari شفافیت WebM را پشتیبانی نمی‌کند) */
const MASCOT_SRC_IOS = '/assets/asal-ios.webp';

/** تشخیص iPhone / iPad / iPod (شامل iPadOS که خود را Mac معرفی می‌کند) */
function isAppleTouchDevice(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/i.test(ua)) return true;
  // iPadOS 13+: desktop UA + touch
  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
}

/** مثبت = چرخش به راست، منفی = چرخش به چپ */
const MASCOT_ROTATE_DEG = 22;
const MASCOT_WIDTH_MOBILE_PX = 60;
const MASCOT_WIDTH_DESKTOP_PX = 60;
/** منفی‌تر = بیشتر از لبه چپ صفحه بیرون می‌رود و دیده نمی‌شود */
const MASCOT_LEFT_MOBILE_PX = -15;
const MASCOT_LEFT_DESKTOP_PX = -15;
/** هر چند میلی‌ثانیه یک‌بار جلب توجه کند */
const MASCOT_NUDGE_EVERY_MS = 5000;
const MASCOT_NUDGE_DURATION_MS = 2400;
const MASCOT_HINTS = [
  'منو بگیر الان میفتم!',
  'بابا توتکم و ندیدی؟',
  'میخوای قصه مو بدونی؟',
  'میخوای جایزه مو بهت نشون بدم؟',
] as const;

let hintCursor = 0;

/**
 * استیکر شناور عسلک در گوشه چپ صفحه اصلی.
 * با پورتال روی body رندر می‌شود تا overflow صفحه آن را نبرد.
 */
export function StoriesFloatingMascot() {
  const [mounted, setMounted] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [nudging, setNudging] = useState(false);
  const [hint, setHint] = useState<(typeof MASCOT_HINTS)[number]>(
    MASCOT_HINTS[0]
  );
  const hideTimerRef = useRef(0);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    setIsIos(isAppleTouchDevice());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || reducedMotion) return undefined;

    const playNudge = () => {
      const nextIndex = hintCursor % MASCOT_HINTS.length;
      hintCursor = nextIndex + 1;
      setHint(MASCOT_HINTS[nextIndex]);
      setNudging(false);
      window.requestAnimationFrame(() => {
        setNudging(true);
      });
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = window.setTimeout(() => {
        setNudging(false);
      }, MASCOT_NUDGE_DURATION_MS);
    };

    const first = window.setTimeout(playNudge, 1200);
    const interval = window.setInterval(playNudge, MASCOT_NUDGE_EVERY_MS);

    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
      window.clearTimeout(hideTimerRef.current);
    };
  }, [mounted, reducedMotion]);

  if (!mounted) return null;

  return createPortal(
    <Link
      href="/stories"
      aria-label="رفتن به صفحه قصه‌ها"
      className={`stories-asal-mascot group fixed select-none outline-none focus-visible:ring-2 focus-visible:ring-[#2A86FE] focus-visible:ring-offset-2 ${
        reducedMotion ? '' : 'stories-asal-mascot-live'
      } ${nudging ? 'stories-asal-mascot-nudge' : ''}`}
      style={
        {
          '--asal-rotate': `${MASCOT_ROTATE_DEG}deg`,
          '--asal-width-mobile': `${MASCOT_WIDTH_MOBILE_PX}px`,
          '--asal-width-desktop': `${MASCOT_WIDTH_DESKTOP_PX}px`,
          '--asal-left-mobile': `${MASCOT_LEFT_MOBILE_PX}px`,
          '--asal-left-desktop': `${MASCOT_LEFT_DESKTOP_PX}px`,
        } as CSSProperties
      }
    >
      <span className="stories-asal-figure">
        {isIos ? (
          <img
            className="stories-asal-mascot-video"
            src={MASCOT_SRC_IOS}
            alt=""
            draggable={false}
          />
        ) : (
          <video
            className="stories-asal-mascot-video"
            src={MASCOT_SRC_WEBM}
            autoPlay={!reducedMotion}
            muted
            loop={!reducedMotion}
            playsInline
            preload="metadata"
          />
        )}
      </span>
      <span className="stories-asal-hint" aria-hidden="true">
        <span className="stories-asal-hint-spark">✦</span>
        <span className="stories-asal-hint-text">{hint}</span>
      </span>
    </Link>,
    document.body
  );
}
