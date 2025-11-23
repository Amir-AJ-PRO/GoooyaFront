'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Eye, Heart, Plus } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import Link from "next/link";

export default function AgentDashboard() {
  const stats = [
    { title: "املاک فعال", value: "8", icon: Building2 },
    { title: "مجموع بازدیدها", value: "1,234", icon: Eye },
    { title: "علاقه‌مندی‌ها", value: "45", icon: Heart },
  ];

  return (
    <div>
      <PageHeader
        title="پنل مشاور"
        description="مدیریت املاک و فعالیت‌های خود"
      >
        <Link href="/agent/properties/new">
          <Button>
            <Plus className="h-4 w-4 ml-2" />
            ثبت ملک جدید
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>املاک اخیر</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              املاک اخیر به زودی نمایش داده می‌شود
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>پیام‌های اخیر</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-center py-8">
              پیام‌های اخیر به زودی نمایش داده می‌شود
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

