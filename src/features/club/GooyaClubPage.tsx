'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  Clapperboard,
  Crown,
  ExternalLink,
  Gift,
  Instagram,
  Loader2,
  RefreshCw,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoginModal from '@/components/LoginModal';
import { useAuth } from '@/contexts/AuthContext';
import { useClubProfile, useSubmitClubInstagram } from '@/hooks/useClub';
import { normalizeInstagramId } from '@/services/clubService';
import { ClubConfetti } from './ClubConfetti';
import { useCountUp } from './useCountUp';
import { useClubEntranceSound } from './useClubEntranceSound';
import './club-confetti.css';

const GOOYA_INSTAGRAM_URL = 'https://instagram.com/goooya.edalat';

/**
 * صفحه جشن‌گونه گویا کلاب در پنل کاربری
 */
export function GooyaClubPage() {
  const { isAuthenticated, isLoading: authLoading, refreshUser } = useAuth();
  const { data, isLoading, isError, error, refetch } = useClubProfile();
  const instagramMutation = useSubmitClubInstagram();

  const [loginOpen, setLoginOpen] = useState(false);
  const [instagramInput, setInstagramInput] = useState('');
  const [confettiBurst, setConfettiBurst] = useState(false);
  const [entryConfetti, setEntryConfetti] = useState(false);

  const totalDisplay = useCountUp(data?.total_points ?? 0);
  const monthDisplay = useCountUp(data?.month_points ?? 0);
  useClubEntranceSound(Boolean(data));

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLoginOpen(true);
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (data) {
      setEntryConfetti(true);
      if (data.lottery.instagram_id) {
        setInstagramInput(data.lottery.instagram_id);
      }
    }
  }, [data]);

  const videosDone = data?.stats.videos_completed ?? 0;
  const beadCount = Math.max(5, videosDone + 2);

  if ((authLoading && !data) || (isAuthenticated && isLoading && !data)) {
    return (
      <div className="space-y-4" dir="rtl" aria-busy="true">
        <div className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#1F3C88] via-[#2A86FE] to-[#65A9FF]">
          <div className="absolute h-40 w-40 animate-pulse rounded-full bg-white/10" />
          <div className="relative text-center text-white">
            <Trophy className="mx-auto h-12 w-12 animate-pulse text-[#D4AF37]" />
            <p className="mt-4 text-base font-bold">در حال آماده‌سازی گویا کلاب...</p>
            <p className="mt-2 text-xs text-white/65">
              امتیازها و جایزه‌های شما در راه است
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-28 animate-pulse rounded-2xl bg-white/80" />
          <div className="h-28 animate-pulse rounded-2xl bg-white/80" />
        </div>
        <div className="h-48 animate-pulse rounded-2xl bg-white/80" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-soft" dir="rtl">
        <Trophy className="mx-auto h-12 w-12 text-[#D4AF37]" />
        <h1 className="mt-4 text-xl font-bold text-[#373A50]">گویا کلاب</h1>
        <p className="mt-2 text-sm leading-7 text-[#717171]">
          برای دیدن امتیازها و شرکت در قرعه‌کشی وارد شوید.
        </p>
        <Button
          type="button"
          className="mt-5 rounded-xl bg-[#2A86FE] hover:bg-[#1F3C88]"
          onClick={() => setLoginOpen(true)}
        >
          ورود به حساب
        </Button>
        <LoginModal
          open={loginOpen}
          onOpenChange={setLoginOpen}
          description="برای ورود به گویا کلاب وارد شوید"
          redirectOnSuccess={false}
          onSuccess={() => {
            void refreshUser();
            void refetch();
          }}
        />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-soft" dir="rtl">
        <p className="text-sm text-[#717171]">
          {error?.message || 'بارگذاری گویا کلاب ممکن نشد.'}
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4 gap-2 rounded-xl"
          onClick={() => void refetch()}
        >
          <RefreshCw className="h-4 w-4" />
          تلاش مجدد
        </Button>
      </div>
    );
  }

  return (
    <div className="relative space-y-5 pb-8" dir="rtl">
      <ClubConfetti active={entryConfetti || confettiBurst} />

      {/* هیرو کاپ */}
      <section className="relative overflow-hidden rounded-[28px] border border-white/80 bg-gradient-to-br from-white via-[#F8FBFF] to-[#EDF5FF] px-5 py-7 shadow-[0_18px_48px_rgba(31,60,136,0.14)] sm:px-8 sm:py-9">
        <div
          className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-[#D4AF37]/20 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-20 right-8 h-56 w-56 rounded-full bg-[#2A86FE]/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_140px] md:text-right">
          <div>
            <p className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/30 bg-[#FFF9E8] px-3 py-1 text-[11px] font-bold !text-[#806515]">
              <Crown className="h-3.5 w-3.5 text-[#D4AF37]" />
              باشگاه امتیازی گویا
            </p>
            <h1 className="mt-4 text-2xl font-black !text-[#373A50] sm:text-3xl">
              {data.full_name || 'دوست گویا'}، آماده‌ای برنده بشی؟
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-7 !text-[#717171]">
              قصه‌ها رو کامل ببین، ادامهٔ ماجرا رو کشف کن، به سوال‌ها جواب بده
              و برای قرعه‌کشی آخر ماه امتیاز جمع کن.
            </p>

            <div className="mt-5 flex flex-wrap items-end gap-5">
              <div className="rounded-2xl border border-[#DCE7F5] bg-white px-4 py-3 shadow-sm">
                <p className="text-[11px] !text-[#717171]">مجموع امتیاز شما</p>
                <p className="text-4xl font-black tracking-tight !text-[#2A86FE] sm:text-5xl">
                  {totalDisplay.toLocaleString('fa-IR')}
                </p>
              </div>
              <div className="rounded-2xl border border-[#E9D99A] bg-[#FFF9E8] px-4 py-3 shadow-sm">
                <p className="text-[10px] !text-[#806515]">این ماه</p>
                <p className="text-lg font-bold !text-[#8A6B0F]">
                  {monthDisplay.toLocaleString('fa-IR')} امتیاز
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row">
              <Link
                href="/stories"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2A86FE] px-5 py-2.5 text-sm font-bold !text-white shadow-[0_8px_22px_rgba(42,134,254,0.24)] transition-all hover:-translate-y-0.5 hover:bg-[#1F3C88]"
              >
                <Clapperboard className="h-4 w-4" />
                بزن بریم قصه‌ها رو ببینیم
              </Link>
              <a
                href={GOOYA_INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#DCE4F0] bg-white px-4 py-2.5 text-sm font-medium !text-[#373A50] transition-all hover:border-[#E1306C]/40 hover:text-[#E1306C]"
              >
                <Instagram className="h-4 w-4 text-[#E1306C]" />
                @goooya.edalat
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div
            className="club-trophy-entrance relative mx-auto flex shrink-0 items-center justify-center"
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
      </section>

      {/* امتیاز ماه / کل */}
      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#E8E8EC] bg-white p-5 shadow-soft">
          <p className="text-xs text-[#717171]">امتیاز این ماه</p>
          <p className="mt-2 text-3xl font-bold text-[#2A86FE]">
            {monthDisplay.toLocaleString('fa-IR')}
          </p>
        </div>
        <div className="rounded-2xl border border-[#E8E8EC] bg-white p-5 shadow-soft">
          <p className="text-xs text-[#717171]">امتیاز کل</p>
          <p className="mt-2 text-3xl font-bold text-[#373A50]">
            {totalDisplay.toLocaleString('fa-IR')}
          </p>
        </div>
      </section>

      {/* آمار و مهره‌ها */}
      <section className="rounded-2xl border border-[#E8E8EC] bg-white p-5 shadow-soft">
        <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-[#373A50]">
          <Sparkles className="h-4 w-4 text-[#D4AF37]" />
          پیشرفت داستانی
        </h2>
        <div className="mb-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-[#F7F8FA] px-2 py-3">
            <p className="text-lg font-bold text-[#373A50]">
              {data.stats.videos_completed.toLocaleString('fa-IR')}
            </p>
            <p className="mt-1 text-[10px] text-[#717171]">قسمت دیده‌شده</p>
          </div>
          <div className="rounded-xl bg-[#F7F8FA] px-2 py-3">
            <p className="text-lg font-bold text-[#373A50]">
              {data.stats.questions_answered.toLocaleString('fa-IR')}
            </p>
            <p className="mt-1 text-[10px] text-[#717171]">پاسخ داده‌شده</p>
          </div>
          <div className="rounded-xl bg-[#F7F8FA] px-2 py-3">
            <p className="text-lg font-bold text-[#373A50]">
              {data.stats.correct_answers.toLocaleString('fa-IR')}
            </p>
            <p className="mt-1 text-[10px] text-[#717171]">پاسخ صحیح</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: beadCount }).map((_, i) => (
            <span
              key={i}
              className={`h-3.5 w-3.5 rounded-full ${
                i < videosDone
                  ? 'bg-[#D4AF37] shadow-[0_0_0_3px_rgba(212,175,55,0.2)]'
                  : 'bg-[#E5E7EB]'
              }`}
              title={i < videosDone ? 'دیده‌شده' : 'باقی‌مانده'}
            />
          ))}
        </div>
      </section>

      {/* راهنمای امتیاز */}
      <section className="rounded-2xl border border-[#E8E8EC] bg-white p-5 shadow-soft">
        <h2 className="mb-3 text-base font-bold text-[#373A50]">راهنمای امتیازها</h2>
        <ul className="space-y-2">
          {data.points_guide.map((item) => (
            <li
              key={item.key}
              className="flex items-center justify-between rounded-xl bg-[#F7F8FA] px-3 py-2.5 text-sm"
            >
              <span className="text-[#373A50]">{item.label}</span>
              <span className="font-bold text-[#2A86FE]">
                {item.points.toLocaleString('fa-IR')} امتیاز
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* قرعه‌کشی */}
      <section className="rounded-2xl border border-[#D4AF37]/35 bg-gradient-to-b from-[#FFF9EB] to-white p-5 shadow-soft">
        <h2 className="mb-2 flex items-center gap-2 text-base font-bold text-[#373A50]">
          <Gift className="h-4 w-4 text-[#D4AF37]" />
          قرعه‌کشی پایان ماه
        </h2>
        <p className="mb-4 text-[13px] leading-7 text-[#717171]">
          {data.lottery.note}
        </p>
        <p className="mb-4 rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/10 px-3 py-2.5 text-[12px] leading-6 text-[#6B5A1E]">
          فالو پیج گویا برای شرکت در قرعه‌کشی الزامی است؛ لایک، کامنت و
          استوری/اشتراک‌گذاری شانس را بیشتر می‌کند.
        </p>

        {!data.lottery.eligible ? (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-[#D4AF37]/50 bg-[#FFF3D6] px-3 py-3 text-[12px] leading-6 text-[#6B5A1E]">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" />
            <span>
              {data.lottery.reason ||
                'برای شرکت در قرعه‌کشی باید آیدی اینستاگرام را ثبت کنید و پیج گویا را فالو داشته باشید.'}
            </span>
          </div>
        ) : (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-[12px] text-emerald-700">
            شما واجد شرایط قرعه‌کشی هستید
            {data.lottery.instagram_id
              ? ` (@${data.lottery.instagram_id})`
              : ''}
            .
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Instagram className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#717171]" />
            <Input
              value={instagramInput}
              onChange={(e) => setInstagramInput(e.target.value)}
              placeholder="آیدی اینستاگرام (بدون @)"
              className="pr-10 text-right"
              disabled={Boolean(data.lottery.instagram_id) || instagramMutation.isPending}
              dir="ltr"
            />
          </div>
          <a
            href={GOOYA_INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#E8E8EC] bg-white px-4 py-2 text-sm font-medium text-[#373A50] transition-colors hover:border-[#2A86FE]/40 hover:text-[#2A86FE]"
          >
            @goooya.edalat را فالو کن
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {!data.lottery.instagram_id ? (
          <Button
            type="button"
            className="mt-3 w-full rounded-xl bg-[#2A86FE] hover:bg-[#1F3C88] sm:w-auto"
            disabled={instagramMutation.isPending || !instagramInput.trim()}
            onClick={() => {
              const normalized = normalizeInstagramId(instagramInput);
              if (!normalized) {
                toast.error('آیدی اینستاگرام را وارد کنید');
                return;
              }
              instagramMutation.mutate(normalized, {
                onSuccess: () => {
                  setConfettiBurst(true);
                  toast.success('آیدی اینستاگرام ثبت شد');
                  void refetch();
                },
                onError: (err) => {
                  toast.error(
                    err instanceof Error ? err.message : 'ثبت آیدی ممکن نشد'
                  );
                },
              });
            }}
          >
            {instagramMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                در حال ثبت...
              </>
            ) : (
              'ثبت آیدی برای قرعه‌کشی'
            )}
          </Button>
        ) : null}
      </section>

    </div>
  );
}
