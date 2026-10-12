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

/**
 * ورودی واضح گویا کلاب در صفحه اصلی — ریسپانسیو موبایل و دسکتاپ
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
          className={`club-home-reveal relative overflow-hidden rounded-[28px] border border-white/80 bg-gradient-to-br from-white via-[#F7FAFF] to-[#EEF5FF] px-5 py-7 shadow-[0_18px_48px_rgba(31,60,136,0.14)] sm:px-8 sm:py-9 ${
            isVisible ? 'club-home-reveal-visible' : ''
          }`}
        >
          <div
            className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-[#D4AF37]/20 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-20 right-1/4 h-56 w-56 rounded-full bg-[#2A86FE]/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_140px] lg:gap-10">
            <div className="club-home-reveal-content">
              <p className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/30 bg-[#FFF9E8] px-3 py-1 text-[11px] font-bold !text-[#806515]">
                <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                قصه ببین، امتیاز بگیر
              </p>
              <h2 className="mt-4 text-2xl font-black leading-tight !text-[#373A50] sm:text-3xl lg:text-[34px]">
                دوست گویا، آماده‌ای برنده بشی؟
              </h2>
              <p className="mt-3 max-w-2xl text-[13px] leading-7 !text-[#717171] sm:text-sm">
                قصه‌ها رو کامل ببین، ادامهٔ ماجرا رو کشف کن، به سوال‌ها جواب بده
                و برای قرعه‌کشی آخر ماه امتیاز جمع کن.
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

              <div className="mt-6 flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/user/club"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2A86FE] px-5 py-3 text-sm font-bold !text-white shadow-[0_8px_22px_rgba(42,134,254,0.24)] transition-all hover:-translate-y-0.5 hover:bg-[#1F3C88]"
                >
                  بزن بریم گویا کلاب
                  <ArrowLeft className="h-4 w-4" />
                </Link>
                <Link
                  href="/stories"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCE4F0] bg-white px-4 py-3 text-sm font-medium !text-[#373A50] transition-colors hover:border-[#2A86FE]/40 hover:text-[#2A86FE]"
                >
                  <Clapperboard className="h-4 w-4" />
                  قصه‌ها رو ببین
                </Link>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCE4F0] bg-white px-4 py-3 text-sm font-medium !text-[#373A50] transition-colors hover:border-[#D4AF37]/60 hover:text-[#806515]"
                >
                  <Instagram className="h-4 w-4 text-[#E1306C]" />
                  @goooya.edalat
                </a>
              </div>
            </div>

            <div
              className="club-home-reveal-trophy club-trophy-entrance relative mx-auto flex shrink-0 items-center justify-center"
              style={{ width: 120, height: 120 }}
            >
              <div className="absolute inset-3 rounded-full bg-[#D4AF37]/15 blur-xl" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/club/gooya-club-trophy-icon.png"
                alt="آیکون جام طلایی گویا کلاب"
                width={112}
                height={112}
                className="club-trophy-bob relative object-contain drop-shadow-[0_10px_14px_rgba(55,58,80,0.18)]"
                style={{ width: 112, height: 112 }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
