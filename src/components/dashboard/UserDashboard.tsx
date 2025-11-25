'use client';

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Eye, MessageSquare, Settings, Briefcase, CheckCircle2, Clock } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { useAuth } from "@/contexts/AuthContext";

export default function UserDashboard() {
  const { backendUser } = useAuth();
  const isAgentNotVerified = backendUser?.agent_profile && !backendUser.agent_profile.is_verified;

  const stats = [
    { title: "املاک ذخیره شده", value: "5", icon: Heart },
    { title: "بازدید شده", value: "12", icon: Eye },
    { title: "پیام‌ها", value: "3", icon: MessageSquare },
  ];

  return (
    <div>
      <PageHeader
        title={isAgentNotVerified ? "پنل مشاور" : "پنل کاربری"}
        description={isAgentNotVerified ? "پروفایل شما در انتظار تأیید است" : "خوش آمدید"}
      >
        <Link href="/user/settings">
          <Button variant="outline">
            <Settings className="h-4 w-4 ml-2" />
            تنظیمات
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* کارت تبدیل به مشاور */}
      {!isAgentNotVerified && !backendUser?.agent_profile && (
        <Card className="mb-8 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>تبدیل به مشاور املاک</CardTitle>
                <CardDescription>
                  با تبدیل به مشاور، به تمام امکانات پلتفرم دسترسی پیدا کنید
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>ثبت و مدیریت املاک</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>داشبورد حرفه‌ای</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span>پشتیبانی کامل</span>
                </div>
              </div>
              <Link href="/become-agent">
                <Button className="w-full md:w-auto" size="lg">
                  <Briefcase className="h-4 w-4 ml-2" />
                  درخواست تبدیل به مشاور
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* پیام در انتظار تایید */}
      {isAgentNotVerified && (
        <Card className="mb-8 border-yellow-500/20 bg-yellow-500/5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <CardTitle>درخواست شما در انتظار تایید است</CardTitle>
                <CardDescription>
                  درخواست تبدیل به مشاور شما در حال بررسی است. به زودی نتیجه را به شما اطلاع خواهیم داد.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>املاک ذخیره شده</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            شما هنوز هیچ ملکی را ذخیره نکرده‌اید
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

