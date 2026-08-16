'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { User, ArrowRight } from 'lucide-react';
import Link from 'next/link';

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditUser(_props: Props) {
  const { user } = useAuth();

  if (!user || user.type !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
          <User className="h-7 w-7 text-primary" />
          ویرایش کاربر
        </h1>
        <p className="mt-2 text-muted-foreground">
          این صفحه هنوز به داده واقعی کاربر متصل نیست
        </p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/40 px-4 py-16 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <User className="h-7 w-7 text-primary" />
        </div>
        <h3 className="mb-1 font-semibold">ویرایش در دسترس نیست</h3>
        <p className="mb-5 max-w-sm text-sm text-muted-foreground">
          اطلاعات نمونه حذف شد تا داده ساختگی با حساب واقعی اشتباه گرفته نشود.
        </p>
        <Link href="/admin">
          <Button variant="outline" className="gap-2">
            <ArrowRight className="h-4 w-4" />
            بازگشت به داشبورد
          </Button>
        </Link>
      </div>
    </div>
  );
}
