'use client';

import type { CSSProperties } from 'react';
import { cn } from '@/lib/utils';

export const CHAR = {
  tutakSit: '/assets/stories/characters/tutak-sit.png',
  tutakStand: '/assets/stories/characters/tutak-stand.png',
  halva: '/assets/stories/characters/halva-wave.png',
  asalak: '/assets/stories/characters/asalak-jump.png',
} as const;

type CharacterImgProps = {
  src: string;
  className?: string;
  style?: CSSProperties;
};

/**
 * تصویر کاراکتر — سایز و جای‌گذاری با style اینلاین کنترل شود
 */
export function CharacterImg({ src, className, style }: CharacterImgProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      draggable={false}
      className={cn('pointer-events-none select-none', className)}
      style={style}
      aria-hidden="true"
    />
  );
}

export const STORY_CAST = [
  { name: 'آقای توتک', hint: 'شیرینی دماوندی' },
  { name: 'خانم حلوا لوز', hint: 'زعفرانی' },
  { name: 'عسلک', hint: 'ظرف عسل' },
] as const;
