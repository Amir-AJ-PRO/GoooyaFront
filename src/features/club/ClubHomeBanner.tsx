'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  CheckCircle2,
  Clapperboard,
  Instagram,
  Sparkles,
} from 'lucide-react';
import './club-confetti.css';

const INSTAGRAM_URL = 'https://instagram.com/goooya.edalat';
const TROPHY_SRC = '/assets/club/gooya-club-trophy-icon.png';
const GIFT_SRC = '/assets/club/gooya-club-gift-icon.png';

/**
 * پوستر گویا کلاب در صفحه اصلی — جام و هدیه به‌عنوان آرت پس‌زمینه
 */
export function ClubHomeBanner() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.22, rootMargin: '0px 0px -8% 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#E0E0E0] px-4 py-5 sm:py-8"
      dir="rtl"
    >
      <div className="container mx-auto">
        <div
          className={`club-home-reveal club-home-poster relative overflow-hidden rounded-[36px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12 ${
            isVisible ? 'club-home-reveal-visible' : ''
          }`}
        >
          <div className="club-home-poster-glow" aria-hidden="true" />
          <div
            className="club-home-reveal-trophy club-home-poster-art"
            aria-hidden="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={TROPHY_SRC}
              alt=""
              className="club-trophy-bob club-home-poster-trophy"
            />
          </div>
          <div
            className="club-home-reveal-trophy club-home-poster-gift"
            aria-hidden="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={GIFT_SRC}
              alt=""
              className="club-home-poster-gift-img"
            />
          </div>
          <div className="club-home-poster-wash" aria-hidden="true" />
          <div className="club-home-poster-notes" aria-hidden="true">
            <span className="club-home-poster-note club-home-poster-note-a">
              تماشا +۱۰
            </span>
            <span className="club-home-poster-note club-home-poster-note-b">
              جواب +۱۰
            </span>
            <span className="club-home-poster-note club-home-poster-note-c">
              جایزه آخر ماه
            </span>
          </div>

          <div className="club-home-poster-copy club-home-reveal-content relative z-10">
            <p className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/40 bg-[#FFF9E8]/90 px-3 py-1 text-[11px] font-bold !text-[#806515] shadow-sm backdrop-blur-[2px]">
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
              قصه ببین، امتیاز بگیر
            </p>
            <h2 className="mt-4 text-2xl font-black leading-tight !text-[#373A50] sm:text-3xl lg:text-[40px]">
              دوست گویا، آماده‌ای برنده بشی؟
            </h2>
            <p className="mt-3 text-[13px] leading-7 !text-[#717171] sm:text-sm lg:text-[15px] lg:leading-8">
              قصه‌ها رو کامل ببین، ادامهٔ ماجرا رو کشف کن، به سوال‌ها جواب بده
              و برای قرعه‌کشی آخر ماه امتیاز جمع کن. هر قسمت یه جایزه کوچیک برات
              داره؛ ببین، جواب بده و تو گویا کلاب بدرخش.
            </p>

            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#373A50]">
              {['قصه رو کامل ببین', 'به سوال جواب بده', 'جایزه ببر'].map(
                (label) => (
                  <li key={label} className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-[#2A86FE]" />
                    {label}
                  </li>
                )
              )}
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/user/club"
                className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#2A86FE] px-5 py-3 text-sm font-bold !text-white shadow-[0_8px_22px_rgba(42,134,254,0.24)] transition-all hover:-translate-y-0.5 hover:bg-[#1F3C88]"
              >
                بزن بریم گویا کلاب
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <Link
                href="/stories"
                className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#DCE4F0] bg-white/90 px-4 py-3 text-sm font-medium !text-[#373A50] backdrop-blur-sm transition-colors hover:border-[#2A86FE]/40 hover:text-[#2A86FE]"
              >
                <Clapperboard className="h-4 w-4" />
                قصه‌ها رو ببین
              </Link>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#DCE4F0] bg-white/90 px-4 py-3 text-sm font-medium !text-[#373A50] backdrop-blur-sm transition-colors hover:border-[#D4AF37]/60 hover:text-[#806515]"
              >
                <Instagram className="h-4 w-4 text-[#E1306C]" />
                @goooya.edalat
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
