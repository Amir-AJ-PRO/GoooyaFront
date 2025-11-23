'use client';

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Eye, MessageSquare, Settings } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";

export default function UserDashboard() {
  const stats = [
    { title: "املاک ذخیره شده", value: "5", icon: Heart },
    { title: "بازدید شده", value: "12", icon: Eye },
    { title: "پیام‌ها", value: "3", icon: MessageSquare },
  ];

  return (
    <div>
      <PageHeader
        title="پنل کاربری"
        description="خوش آمدید"
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

