'use client';

import { useEffect, useMemo, useState } from 'react';
import './club-confetti.css';

type ClubConfettiProps = {
  active: boolean;
  durationMs?: number;
};

/**
 * کاغذرنگی سبک CSS — با prefers-reduced-motion خاموش می‌شود
 */
export function ClubConfetti({ active, durationMs = 2800 }: ClubConfettiProps) {
  const [show, setShow] = useState(false);
  const [reduced, setReduced] = useState(false);

  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: `${(i * 17) % 100}%`,
        delay: `${(i % 12) * 0.08}s`,
        color: ['#2A86FE', '#D4AF37', '#1F3C88', '#F59E0B', '#60A5FA'][i % 5],
        rotate: `${(i * 41) % 360}deg`,
        size: 6 + (i % 5),
      })),
    []
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!active || reduced) {
      setShow(false);
      return;
    }
    setShow(true);
    const t = window.setTimeout(() => setShow(false), durationMs);
    return () => window.clearTimeout(t);
  }, [active, durationMs, reduced]);

  if (!show) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[80] overflow-hidden"
      aria-hidden="true"
    >
      {pieces.map((p) => (
        <span
          key={p.id}
          className="club-confetti-piece absolute top-[-12px] rounded-sm opacity-90"
          style={{
            left: p.left,
            width: p.size,
            height: p.size * 1.4,
            backgroundColor: p.color,
            animationDelay: p.delay,
            transform: `rotate(${p.rotate})`,
          }}
        />
      ))}
    </div>
  );
}
