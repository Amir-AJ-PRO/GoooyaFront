'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileText,
  ArrowLeft,
  Clock,
  Shield,
  UserRound,
  Users,
  Building2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAdviserTickets, useAdviserTicketsCount } from '@/hooks/useTicketAdviser';
import Link from 'next/link';
import { cn, formatDate, formatPrice } from '@/lib/utils';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'صبح بخیر';
  if (hour < 18) return 'ظهر بخیر';
  return 'عصر بخیر';
}

export default function AdminPage() {
  const { user, backendUser } = useAuth();
  const router = useRouter();

  const isGooyaAdviser = backendUser?.agent_profile?.is_goooya_adviser === true;
  const { data: ticketsCount, isLoading: countLoading } = useAdviserTicketsCount(isGooyaAdviser);
  const { data: tickets, isLoading: ticketsLoading } = useAdviserTickets(
    'assigned',
    isGooyaAdviser
  );

  useEffect(() => {
    if (user && user.type !== 'admin') {
      router.replace('/user');
    }
  }, [user, router]);

  if (!user || user.type !== 'admin') {
    return null;
  }

  const displayName =
    user.name?.trim() ||
    backendUser?.full_name?.trim() ||
    backendUser?.name?.trim() ||
    'مدیر گرامی';
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');

  const recentTickets = Array.isArray(tickets) ? tickets.slice(0, 4) : [];
  const waitingCount = ticketsCount ?? 0;

  const stats = [
    {
      title: 'تیکت‌های در انتظار',
      value: waitingCount,
      hint: isGooyaAdviser ? 'درخواست ثبت ملک کاربران' : 'فقط برای مشاور گویا فعال است',
      icon: FileText,
      href: isGooyaAdviser ? '/admin/tickets' : undefined,
      tone: 'bg-amber-500/10 text-amber-700',
      enabled: isGooyaAdviser,
    },
    {
      title: 'کاربران',
      value: null as number | null,
      hint: 'فهرست زنده هنوز متصل نیست',
      icon: Users,
      href: '/admin/users',
      tone: 'bg-primary/10 text-primary',
      enabled: false,
    },
    {
      title: 'املاک',
      value: null as number | null,
      hint: 'بررسی آگهی‌ها از مسیر تیکت‌ها',
      icon: Building2,
      href: isGooyaAdviser ? '/admin/tickets' : '/admin/properties',
      tone: 'bg-emerald-500/10 text-emerald-600',
      enabled: false,
    },
  ];

  const quickActions = [
    ...(isGooyaAdviser
      ? [
          {
            title: 'تیکت‌های ثبت ملک',
            description:
              waitingCount > 0
                ? `${formatPrice(waitingCount)} درخواست در انتظار بررسی`
                : 'بررسی درخواست‌های کاربران',
            href: '/admin/tickets',
            icon: FileText,
          },
        ]
      : []),
    {
      title: 'مدیریت کاربران',
      description: 'این بخش هنوز به داده واقعی وصل نیست',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'مدیریت املاک',
      description: isGooyaAdviser
        ? 'تأیید آگهی از طریق تیکت‌ها انجام می‌شود'
        : 'این بخش هنوز به داده واقعی وصل نیست',
      href: isGooyaAdviser ? '/admin/tickets' : '/admin/properties',
      icon: Building2,
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-bl from-primary via-primary to-accent text-primary-foreground shadow-medium">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 45%), radial-gradient(circle at 85% 10%, rgba(255,255,255,0.2), transparent 35%)',
          }}
        />
        <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/30 bg-white/15 text-lg font-semibold shadow-soft backdrop-blur-sm sm:h-16 sm:w-16">
              {initials || <UserRound className="h-6 w-6" />}
            </div>
            <div className="space-y-1.5">
              <p className="text-sm text-white/80">{getGreeting()}</p>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {displayName}
                </h1>
                <Badge className="gap-1 bg-white/20 text-white hover:bg-white/20">
                  <Shield className="h-3.5 w-3.5" />
                  مدیر
                </Badge>
              </div>
              <p className="max-w-xl text-sm text-white/75 sm:text-base">
                {isGooyaAdviser
                  ? 'درخواست‌های ثبت ملک را بررسی و منتشر کنید.'
                  : 'از اینجا بخش‌های مدیریتی سیستم را دنبال کنید.'}
              </p>
            </div>
          </div>

          {isGooyaAdviser && (
            <div className="flex flex-col gap-2 sm:items-end">
              <Link href="/admin/tickets">
                <Button
                  variant="secondary"
                  className="w-full bg-white text-primary hover:bg-white/90 sm:w-auto"
                >
                  <FileText className="ml-2 h-4 w-4" />
                  مشاهده تیکت‌ها
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const content = (
            <div
              className={cn(
                'group h-full rounded-2xl border border-border/70 bg-card p-5 shadow-soft transition-smooth',
                stat.href && 'hover:-translate-y-0.5 hover:shadow-medium'
              )}
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <span
                  className={cn(
                    'inline-flex h-10 w-10 items-center justify-center rounded-xl',
                    stat.tone
                  )}
                >
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              {stat.enabled && countLoading ? (
                <Skeleton className="mb-2 h-8 w-16" />
              ) : stat.value === null ? (
                <p className="text-lg font-semibold text-muted-foreground">—</p>
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
              <h2 className="text-lg font-bold">تیکت‌های اخیر</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                درخواست‌های ثبت ملک در انتظار بررسی
              </p>
            </div>
            {isGooyaAdviser && (
              <Link href="/admin/tickets">
                <Button variant="outline" size="sm" className="gap-1.5">
                  همه
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>

          {!isGooyaAdviser ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/40 px-4 py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mb-1 font-semibold">دسترسی مشاور گویا لازم است</h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                بررسی تیکت‌های ثبت ملک فقط برای مشاوران گویا فعال است.
              </p>
            </div>
          ) : ticketsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="space-y-2 rounded-xl border p-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : recentTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/40 px-4 py-12 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10">
                <FileText className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="mb-1 font-semibold">تیکت در انتظاری نیست</h3>
              <p className="max-w-sm text-sm text-muted-foreground">
                درخواست جدیدی برای بررسی وجود ندارد.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/admin/tickets/${ticket.id}`}
                  className="group block rounded-xl border border-border/60 p-3 transition-smooth hover:border-primary/30 hover:bg-secondary/60"
                >
                  <div className="mb-1.5 flex flex-wrap items-center gap-2">
                    <Badge className="bg-amber-500/15 text-amber-800 hover:bg-amber-500/15">
                      <Clock className="ml-1 h-3 w-3" />
                      در انتظار
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(ticket.created_at)}
                    </span>
                  </div>
                  <h3 className="mb-1 line-clamp-1 font-semibold transition-colors group-hover:text-primary">
                    {ticket.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {[ticket.city_name, ticket.property_type_title]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </section>

        <aside className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-border/70 bg-card p-5 shadow-soft sm:p-6">
            <h2 className="mb-1 text-lg font-bold">دسترسی سریع</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              میانبرهای پنل مدیریت
            </p>
            <div className="grid grid-cols-1 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href + action.title}
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
        </aside>
      </div>
    </div>
  );
}
