'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Building2, ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';

export default function AdminProperties() {
  const { user, backendUser } = useAuth();
  const isGooyaAdviser = backendUser?.agent_profile?.is_goooya_adviser === true;

  if (!user || user.type !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
          <Building2 className="h-7 w-7 text-primary" />
          مدیریت املاک
        </h1>
        <p className="mt-2 text-muted-foreground">
          بررسی آگهی‌ها از مسیر تیکت‌های ثبت ملک انجام می‌شود
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/40 px-4 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Building2 className="h-7 w-7 text-primary" />
        </div>
        <h3 className="mb-1 font-semibold">فهرست نمونه حذف شد</h3>
        <p className="mb-5 max-w-sm text-sm text-muted-foreground">
          این صفحه قبلاً املاک ساختگی نشان می‌داد. تأیید و انتشار آگهی‌ها از تیکت‌های مشاور گویا انجام می‌شود.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {isGooyaAdviser && (
            <Link href="/admin/tickets">
              <Button className="gap-2">
                <FileText className="h-4 w-4" />
                تیکت‌های ثبت ملک
              </Button>
            </Link>
          )}
          <Link href="/admin">
            <Button variant="outline" className="gap-2">
              <ArrowRight className="h-4 w-4" />
              بازگشت به داشبورد
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
