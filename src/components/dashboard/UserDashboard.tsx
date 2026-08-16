'use client';

import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  Settings,
  ArrowLeft,
  MapPin,
  Home,
  Building2,
  Search,
  UserRound,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites, useFavoritesStats } from "@/hooks/useFavorites";
import { cn, formatDate, formatPrice, getMediaUrl } from "@/lib/utils";

function formatPropertyPrice(price?: number | null) {
  if (!price) return "قیمت توافقی";
  if (price >= 1_000_000_000) {
    return `${(price / 1_000_000_000).toFixed(1)} میلیارد تومان`;
  }
  if (price >= 1_000_000) {
    return `${formatPrice(Math.round(price / 1_000_000))} میلیون تومان`;
  }
  return `${formatPrice(price)} تومان`;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "صبح بخیر";
  if (hour < 18) return "ظهر بخیر";
  return "عصر بخیر";
}

export default function UserDashboard() {
  const { user, backendUser } = useAuth();
  const { data: favoritesData, isLoading: favoritesLoading } = useFavorites({
    page: 1,
    page_size: 4,
  });
  const { data: favoritesStats, isLoading: statsLoading } = useFavoritesStats();

  const isAgentNotVerified =
    !!backendUser?.agent_profile && !backendUser.agent_profile.is_verified;

  const displayName =
    user?.name?.trim() ||
    backendUser?.full_name?.trim() ||
    backendUser?.name?.trim() ||
    "کاربر گرامی";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  const favoritesCount = favoritesStats?.total_favorites ?? favoritesData?.count ?? 0;
  const citiesCount = Object.keys(favoritesStats?.favorites_by_city ?? {}).length;
  const typesCount = Object.keys(favoritesStats?.favorites_by_type ?? {}).length;
  const recentFavorites = favoritesData?.results ?? [];
  const isLoading = favoritesLoading || statsLoading;

  const topType = Object.entries(favoritesStats?.favorites_by_type ?? {}).sort(
    ([, a], [, b]) => b - a
  )[0];
  const topCity = Object.entries(favoritesStats?.favorites_by_city ?? {}).sort(
    ([, a], [, b]) => b - a
  )[0];

  const stats = [
    {
      title: "علاقه‌مندی‌ها",
      value: favoritesCount,
      hint: "ملک ذخیره شده",
      icon: Heart,
      href: "/user/favorites",
      tone: "bg-rose-500/10 text-rose-600",
    },
    {
      title: "شهرهای مورد علاقه",
      value: citiesCount,
      hint: topCity ? `بیشتر در ${topCity[0]}` : "هنوز انتخابی ندارید",
      icon: MapPin,
      tone: "bg-amber-500/10 text-amber-700",
    },
    {
      title: "انواع ملک",
      value: typesCount,
      hint: topType ? `محبوب: ${topType[0]}` : "پس از ذخیره نمایش داده می‌شود",
      icon: Building2,
      tone: "bg-primary/10 text-primary",
    },
  ];

  const quickActions = [
    {
      title: "جستجوی املاک",
      description: "آگهی‌های جدید را بررسی کنید",
      href: "/properties",
      icon: Search,
    },
    {
      title: "علاقه‌مندی‌ها",
      description: "لیست ذخیره شده‌های شما",
      href: "/user/favorites",
      icon: Heart,
    },
    {
      title: "تنظیمات حساب",
      description: "ویرایش اطلاعات کاربری",
      href: "/user/settings",
      icon: Settings,
    },
    ...(!backendUser?.agent_profile
      ? [
          {
            title: "مشاور شوید",
            description: "ثبت درخواست همکاری",
            href: "/become-agent",
            icon: Sparkles,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-bl from-primary via-primary to-accent text-primary-foreground shadow-medium">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 45%), radial-gradient(circle at 85% 10%, rgba(255,255,255,0.2), transparent 35%)",
          }}
        />
        <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-start gap-4">
            <Avatar className="h-14 w-14 border-2 border-white/30 shadow-soft sm:h-16 sm:w-16">
              <AvatarFallback className="bg-white/15 text-lg font-semibold text-white backdrop-blur-sm">
                {initials || <UserRound className="h-6 w-6" />}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <p className="text-sm text-white/80">{getGreeting()}</p>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {displayName}
              </h1>
              <p className="max-w-xl text-sm text-white/75 sm:text-base">
                {isAgentNotVerified
                  ? "پروفایل مشاور شما در انتظار تأیید است. تا آن زمان از امکانات کاربری استفاده کنید."
                  : "از اینجا علاقه‌مندی‌ها و حساب خود را مدیریت کنید."}
              </p>
              {user?.phone && (
                <p className="pt-1 text-xs text-white/60" dir="ltr">
                  {user.phone}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <Link href="/user/settings">
              <Button
                variant="secondary"
                className="w-full bg-white text-primary hover:bg-white/90 sm:w-auto"
              >
                <Settings className="ml-2 h-4 w-4" />
                تنظیمات
              </Button>
            </Link>
            <Link href="/properties">
              <Button
                variant="outline"
                className="w-full border-white/30 bg-white/10 text-white hover:bg-white/15 hover:text-white sm:w-auto"
              >
                <Search className="ml-2 h-4 w-4" />
                مشاهده املاک
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {isAgentNotVerified && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div className="space-y-1 text-sm">
            <p className="font-semibold">در انتظار تأیید مشاور</p>
            <p className="text-amber-800/90">
              پس از بررسی و تأیید، پنل مشاور برای شما فعال می‌شود.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const content = (
            <div
              className={cn(
                "group h-full rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-smooth",
                stat.href && "hover:-translate-y-0.5 hover:shadow-medium"
              )}
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <span
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-xl",
                    stat.tone
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              {isLoading ? (
                <Skeleton className="mb-2 h-8 w-16" />
              ) : (
                <p className="text-3xl font-bold tracking-tight">
                  {formatPrice(stat.value)}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">{stat.hint}</p>
            </div>
          );

          return stat.href ? (
            <Link key={stat.title} href={stat.href} className="block">
              {content}
            </Link>
          ) : (
            <div key={stat.title}>{content}</div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Recent favorites */}
        <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft sm:p-6 lg:col-span-3">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">آخرین علاقه‌مندی‌ها</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                املاکی که اخیراً ذخیره کرده‌اید
              </p>
            </div>
            <Link href="/user/favorites">
              <Button variant="outline" size="sm" className="gap-1.5">
                همه
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex gap-3 rounded-xl border p-3">
                  <Skeleton className="h-20 w-28 shrink-0 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentFavorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/40 px-4 py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/10">
                <Heart className="h-7 w-7 text-rose-500" />
              </div>
              <h3 className="mb-1 font-semibold">هنوز علاقه‌مندی ندارید</h3>
              <p className="mb-5 max-w-sm text-sm text-muted-foreground">
                با ذخیره کردن املاک مورد علاقه، اینجا سریع به آن‌ها دسترسی دارید.
              </p>
              <Link href="/properties">
                <Button>
                  <Search className="ml-2 h-4 w-4" />
                  شروع جستجو
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentFavorites.map((favorite) => {
                const href = `/properties/${favorite.property_slug || favorite.property_id}`;
                return (
                  <Link
                    key={favorite.id}
                    href={href}
                    className="group flex gap-3 rounded-xl border border-border/60 p-3 transition-smooth hover:border-primary/30 hover:bg-secondary/60"
                  >
                    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {favorite.main_image ? (
                        <Image
                          src={getMediaUrl(favorite.main_image)}
                          alt={favorite.property_title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="112px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Home className="h-7 w-7 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1.5 flex flex-wrap items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary hover:bg-primary/10"
                        >
                          {favorite.property_type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(favorite.created_at)}
                        </span>
                      </div>
                      <h3 className="mb-1 line-clamp-1 font-semibold transition-colors group-hover:text-primary">
                        {favorite.property_title}
                      </h3>
                      <p className="mb-1 text-sm font-medium text-amber-700">
                        {formatPropertyPrice(favorite.property_price)}
                      </p>
                      {(favorite.property_city || favorite.property_address) && (
                        <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {favorite.property_address || favorite.property_city}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Quick actions + breakdown */}
        <aside className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft sm:p-6">
            <h2 className="mb-1 text-lg font-bold">دسترسی سریع</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              میانبرهای پرکاربرد پنل
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center gap-3 rounded-xl border border-border/60 p-3 transition-smooth hover:border-primary/30 hover:bg-secondary/60"
                  >
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-medium">{action.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {action.description}
                      </span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>

          {(topType || topCity) && (
            <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft sm:p-6">
              <h2 className="mb-4 text-lg font-bold">خلاصه علاقه‌مندی</h2>
              <div className="space-y-3">
                {topType && (
                  <div className="flex items-center justify-between rounded-xl bg-secondary/70 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">نوع محبوب</span>
                    <Badge className="bg-primary text-primary-foreground hover:bg-primary">
                      {topType[0]} · {formatPrice(topType[1])}
                    </Badge>
                  </div>
                )}
                {topCity && (
                  <div className="flex items-center justify-between rounded-xl bg-secondary/70 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">شهر محبوب</span>
                    <Badge variant="secondary" className="bg-amber-500/15 text-amber-800 hover:bg-amber-500/15">
                      {topCity[0]} · {formatPrice(topCity[1])}
                    </Badge>
                  </div>
                )}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
