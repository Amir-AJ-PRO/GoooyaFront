'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, MessageSquare, TrendingUp } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.type !== 'admin') {
      router.replace('/user');
    }
  }, [user, router]);

  const stats = [
    {
      title: "کاربران",
      value: "۱,۲۳۴",
      icon: Users,
      change: "+۱۲%",
    },
    {
      title: "املاک",
      value: "۴۵۶",
      icon: Building2,
      change: "+۸%",
    },
    {
      title: "پیام‌ها",
      value: "۸۹",
      icon: MessageSquare,
      change: "+۲۳%",
    },
    {
      title: "فروش",
      value: "۳۲",
      icon: TrendingUp,
      change: "+۱۵%",
    },
  ];

  if (!user || user.type !== 'admin') {
    return null;
  }

  return (
    <div>
      <PageHeader
        title="داشبورد مدیریت"
        description="آمار و مدیریت سیستم"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-500 mt-1">{stat.change} از ماه گذشته</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>آخرین فعالیت‌ها</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              فعالیت‌های اخیر به زودی نمایش داده می‌شود
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>املاک در انتظار تایید</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              املاک در انتظار تایید به زودی نمایش داده می‌شود
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

