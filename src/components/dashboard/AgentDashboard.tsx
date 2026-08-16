'use client';

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import {
  Building2,
  Plus,
  Settings,
  ArrowLeft,
  MapPin,
  Home,
  CheckCircle,
  Clock,
  ImageIcon,
  FileText,
  UserRound,
  Heart,
  BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useAgentProfile, useAgentProperties } from "@/hooks/useAgentProfile";
import { useAdviserTicketsCount } from "@/hooks/useTicketAdviser";
import { cn, formatDate, formatPrice, getMediaUrl } from "@/lib/utils";
import type { AgentProperty } from "@/services/agentService";

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

function getStatusLabel(status: string) {
  switch (status) {
    case "ok":
      return "فعال";
    case "pending":
      return "در انتظار تأیید";
    case "rejected":
      return "رد شده";
    default:
      return status;
  }
}

function getNamedValue(value: unknown): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value !== null && "name" in value) {
    return String((value as { name?: string }).name || "");
  }
  if (typeof value === "object" && value !== null && "title" in value) {
    return String((value as { title?: string }).title || "");
  }
  return "";
}

function getMainImage(property: AgentProperty) {
  return property.images?.find((img) => img.is_main) || property.images?.[0];
}

export default function AgentDashboard() {
  const { user, backendUser } = useAuth();
  const { data: profile, isLoading: profileLoading } = useAgentProfile();
  const { data: properties, isLoading: propertiesLoading } = useAgentProperties();
  const isGooyaAdviser = backendUser?.agent_profile?.is_goooya_adviser === true;
  const { data: ticketsCount } = useAdviserTicketsCount(isGooyaAdviser);

  const propertiesArray = Array.isArray(properties) ? properties : [];
  const isLoading = profileLoading || propertiesLoading;

  const displayName =
    profile?.full_name?.trim() ||
    user?.name?.trim() ||
    backendUser?.full_name?.trim() ||
    backendUser?.name?.trim() ||
    "مشاور گرامی";
  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  const totalCount = propertiesArray.length;
  const activeCount = propertiesArray.filter((p) => p.show_status === "ok").length;
  const pendingCount = propertiesArray.filter((p) => p.show_status === "pending").length;
  const totalImages = propertiesArray.reduce(
    (sum, p) => sum + (p.images?.length || 0),
    0
  );

  const recentProperties = useMemo(
    () =>
      [...propertiesArray]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        .slice(0, 4),
    [propertiesArray]
  );

  const locationLine = [profile?.office_name, profile?.city, profile?.region]
    .filter(Boolean)
    .join(" · ");

  const stats = [
    {
      title: "املاک من",
      value: totalCount,
      hint: pendingCount > 0 ? `${formatPrice(pendingCount)} در انتظار تأیید` : "کل آگهی‌های ثبت‌شده",
      icon: Building2,
      href: "/agent/properties",
      tone: "bg-primary/10 text-primary",
      skipSkeleton: false,
    },
    {
      title: "فعال",
      value: activeCount,
      hint: "نمایش داده می‌شود",
      icon: CheckCircle,
      href: "/agent/properties",
      tone: "bg-emerald-500/10 text-emerald-600",
      skipSkeleton: false,
    },
    {
      title: isGooyaAdviser ? "تیکت‌های در انتظار" : "تصاویر",
      value: isGooyaAdviser ? ticketsCount ?? 0 : totalImages,
      hint: isGooyaAdviser ? "درخواست ثبت ملک کاربران" : "آپلود شده در آگهی‌ها",
      icon: isGooyaAdviser ? FileText : ImageIcon,
      href: isGooyaAdviser ? "/admin/tickets" : undefined,
      tone: isGooyaAdviser
        ? "bg-amber-500/10 text-amber-700"
        : "bg-violet-500/10 text-violet-600",
      skipSkeleton: isGooyaAdviser,
    },
  ];

  const quickActions = [
    {
      title: "ثبت ملک جدید",
      description: "آگهی تازه اضافه کنید",
      href: "/agent/properties/new",
      icon: Plus,
    },
    {
      title: "املاک من",
      description: "ویرایش و مدیریت آگهی‌ها",
      href: "/agent/properties",
      icon: Building2,
    },
    {
      title: "تنظیمات پروفایل",
      description: "اطلاعات دفتر و تماس",
      href: "/agent/settings",
      icon: Settings,
    },
    ...(isGooyaAdviser
      ? [
          {
            title: "تیکت‌های ثبت ملک",
            description:
              ticketsCount && ticketsCount > 0
                ? `${formatPrice(ticketsCount)} درخواست در انتظار`
                : "بررسی درخواست کاربران",
            href: "/admin/tickets",
            icon: FileText,
          },
        ]
      : [
          {
            title: "علاقه‌مندی‌ها",
            description: "املاک ذخیره شده",
            href: "/user/favorites",
            icon: Heart,
          },
        ]),
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
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
              {profile?.profile_image && (
                <AvatarImage
                  src={getMediaUrl(profile.profile_image)}
                  alt={displayName}
                />
              )}
              <AvatarFallback className="bg-white/15 text-lg font-semibold text-white backdrop-blur-sm">
                {initials || <UserRound className="h-6 w-6" />}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <p className="text-sm text-white/80">{getGreeting()}</p>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {profileLoading ? "…" : displayName}
                </h1>
                {profile?.is_verified && (
                  <Badge className="gap-1 bg-white/20 text-white hover:bg-white/20">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    مشاور تأییدشده
                  </Badge>
                )}
              </div>
              <p className="max-w-xl text-sm text-white/75 sm:text-base">
                {locationLine || "از اینجا آگهی‌ها و پروفایل مشاور خود را مدیریت کنید."}
              </p>
              {(profile?.phone || user?.phone) && (
                <p className="pt-1 text-xs text-white/60" dir="ltr">
                  {profile?.phone || user?.phone}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <Link href="/agent/properties/new">
              <Button
                variant="secondary"
                className="w-full bg-white text-primary hover:bg-white/90 sm:w-auto"
              >
                <Plus className="ml-2 h-4 w-4" />
                ثبت ملک جدید
              </Button>
            </Link>
            <Link href="/agent/settings">
              <Button
                variant="outline"
                className="w-full border-white/30 bg-white/10 text-white hover:bg-white/15 hover:text-white sm:w-auto"
              >
                <Settings className="ml-2 h-4 w-4" />
                تنظیمات پروفایل
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {pendingCount > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div className="space-y-1 text-sm">
            <p className="font-semibold">
              {formatPrice(pendingCount)} آگهی در انتظار تأیید
            </p>
            <p className="text-amber-800/90">
              پس از بررسی، آگهی در سایت نمایش داده می‌شود.
            </p>
          </div>
        </div>
      )}

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
              {isLoading && !stat.skipSkeleton ? (
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
        <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft sm:p-6 lg:col-span-3">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">آخرین املاک</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                آگهی‌هایی که اخیراً ثبت کرده‌اید
              </p>
            </div>
            <Link href="/agent/properties">
              <Button variant="outline" size="sm" className="gap-1.5">
                همه
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {propertiesLoading ? (
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
          ) : recentProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/40 px-4 py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Home className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-1 font-semibold">هنوز ملکی ثبت نکرده‌اید</h3>
              <p className="mb-5 max-w-sm text-sm text-muted-foreground">
                با ثبت اولین آگهی، اینجا سریع به املاک خود دسترسی دارید.
              </p>
              <Link href="/agent/properties/new">
                <Button>
                  <Plus className="ml-2 h-4 w-4" />
                  ثبت ملک جدید
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentProperties.map((property) => {
                const mainImage = getMainImage(property);
                const cityName = getNamedValue(property.city);
                const typeName = getNamedValue(property.property_type);
                return (
                  <Link
                    key={property.id}
                    href={`/agent/properties/${property.slug}/edit`}
                    className="group flex gap-3 rounded-xl border border-border/60 p-3 transition-smooth hover:border-primary/30 hover:bg-secondary/60"
                  >
                    <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {mainImage?.image ? (
                        <Image
                          src={getMediaUrl(mainImage.image)}
                          alt={property.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="112px"
                          unoptimized
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
                          variant={property.show_status === "ok" ? "default" : "secondary"}
                          className={cn(
                            property.show_status === "ok" &&
                              "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/15",
                            property.show_status === "pending" &&
                              "bg-amber-500/15 text-amber-800 hover:bg-amber-500/15",
                            property.show_status === "rejected" &&
                              "bg-red-500/15 text-red-700 hover:bg-red-500/15"
                          )}
                        >
                          {getStatusLabel(property.show_status)}
                        </Badge>
                        {typeName && (
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary hover:bg-primary/10"
                          >
                            {typeName}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(property.created_at)}
                        </span>
                      </div>
                      <h3 className="mb-1 line-clamp-1 font-semibold transition-colors group-hover:text-primary">
                        {property.title}
                      </h3>
                      <p className="mb-1 text-sm font-medium text-amber-700">
                        {formatPropertyPrice(property.price)}
                      </p>
                      {(cityName || property.address) && (
                        <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          {property.address || cityName}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <aside className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft sm:p-6">
            <h2 className="mb-1 text-lg font-bold">دسترسی سریع</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              میانبرهای پرکاربرد پنل مشاور
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

          {(profile?.years_of_experience || profile?.specialties || profile?.id) && (
            <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft sm:p-6">
              <h2 className="mb-4 text-lg font-bold">خلاصه پروفایل</h2>
              <div className="space-y-3">
                {typeof profile?.years_of_experience === "number" &&
                  profile.years_of_experience > 0 && (
                    <div className="flex items-center justify-between rounded-xl bg-secondary/70 px-3 py-2.5">
                      <span className="text-sm text-muted-foreground">سابقه</span>
                      <Badge className="bg-primary text-primary-foreground hover:bg-primary">
                        {formatPrice(profile.years_of_experience)} سال
                      </Badge>
                    </div>
                  )}
                {profile?.license_number && (
                  <div className="flex items-center justify-between rounded-xl bg-secondary/70 px-3 py-2.5">
                    <span className="text-sm text-muted-foreground">پروانه</span>
                    <span className="text-sm font-medium">{profile.license_number}</span>
                  </div>
                )}
                {profile?.id && (
                  <Link
                    href={`/agents/${profile.id}`}
                    className="flex items-center justify-between rounded-xl bg-secondary/70 px-3 py-2.5 transition-smooth hover:bg-secondary"
                  >
                    <span className="text-sm text-muted-foreground">پروفایل عمومی</span>
                    <span className="flex items-center gap-1 text-sm font-medium text-primary">
                      مشاهده
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </span>
                  </Link>
                )}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
}
