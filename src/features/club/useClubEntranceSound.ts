'use client';

import { useEffect } from 'react';

/**
 * افکت صوتی کوتاه ورود به کلاب.
 * اگر autoplay مرورگر مسدود باشد، با اولین تعامل کاربر یک‌بار پخش می‌شود.
 */
export function useClubEntranceSound(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    let played = false;
    let context: AudioContext | null = null;

    const play = async () => {
      if (played) return;
      const AudioContextClass =
        window.AudioContext ||
        (
          window as typeof window & {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!context || context.state === 'closed') {
        context = new AudioContextClass();
      }
      if (context.state === 'suspended') {
        try {
          await context.resume();
        } catch {
          return;
        }
      }
      if (context.state !== 'running') return;

      const now = context.currentTime;
      const master = context.createGain();
      master.gain.setValueAtTime(0.0001, now);
      master.gain.exponentialRampToValueAtTime(0.2, now + 0.025);
      master.gain.setValueAtTime(0.2, now + 0.75);
      master.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);
      master.connect(context.destination);

      // فنفر رو به بالا: C5 → E5 → G5 → C6
      [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
        const oscillator = context?.createOscillator();
        const gain = context?.createGain();
        if (!oscillator || !gain || !context) return;
        const start = now + index * 0.11;
        oscillator.type = index === 3 ? 'triangle' : 'sine';
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(
          index === 3 ? 0.32 : 0.22,
          start + 0.018
        );
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          start + (index === 3 ? 0.7 : 0.32)
        );
        oscillator.connect(gain);
        gain.connect(master);
        oscillator.start(start);
        oscillator.stop(start + (index === 3 ? 0.72 : 0.34));
      });

      // ضربهٔ نرم شروع برای حس بالا آمدن جام
      const impact = context.createOscillator();
      const impactGain = context.createGain();
      impact.type = 'sine';
      impact.frequency.setValueAtTime(145, now);
      impact.frequency.exponentialRampToValueAtTime(68, now + 0.22);
      impactGain.gain.setValueAtTime(0.28, now);
      impactGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
      impact.connect(impactGain);
      impactGain.connect(master);
      impact.start(now);
      impact.stop(now + 0.25);

      // برق نهایی جام
      const sparkle = context.createOscillator();
      const sparkleGain = context.createGain();
      sparkle.type = 'sine';
      sparkle.frequency.setValueAtTime(1567.98, now + 0.48);
      sparkleGain.gain.setValueAtTime(0.0001, now + 0.48);
      sparkleGain.gain.exponentialRampToValueAtTime(0.16, now + 0.5);
      sparkleGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.92);
      sparkle.connect(sparkleGain);
      sparkleGain.connect(master);
      sparkle.start(now + 0.48);
      sparkle.stop(now + 0.94);

      played = true;
      window.removeEventListener('pointerdown', handleInteraction);
    };

    const handleInteraction = () => {
      void play();
    };

    void play();
    window.addEventListener('pointerdown', handleInteraction, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleInteraction);
      if (context && context.state !== 'closed') {
        void context.close();
      }
    };
  }, [enabled]);
}
