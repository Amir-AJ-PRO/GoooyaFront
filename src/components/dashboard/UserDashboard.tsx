'use client';

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Eye, MessageSquare, Settings, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useFavoritesStats, useFavoritesCount } from "@/hooks/useFavorites";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserDashboard() {
  const { backendUser } = useAuth();
  const { data: favoritesCount, isLoading: countLoading } = useFavoritesCount();
  const { data: favoritesStats, isLoading: statsLoading } = useFavoritesStats();
  const isAgentNotVerified = backendUser?.agent_profile && !backendUser.agent_profile.is_verified;

  const stats = [
    { 
      title: "املاک علاقه‌مند", 
      value: countLoading ? "..." : (favoritesCount ?? 0).toString(), 
      icon: Heart,
      href: "/user/favorites"
    },
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
          const CardWrapper = stat.href ? Link : 'div';
          const cardProps = stat.href ? { href: stat.href } : {};
          
          return (
            <CardWrapper key={index} {...cardProps}>
              <Card className={stat.href ? "hover:shadow-lg transition-shadow cursor-pointer" : ""}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.href ? 'text-[--primary]' : 'text-muted-foreground'}`} />
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold">
                      {(countLoading || statsLoading) && stat.title.includes('علاقه‌مند') ? (
                        <Skeleton className="h-8 w-8" />
                      ) : (
                        stat.value
                      )}
                    </div>
                    {stat.href && (
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </CardContent>
              </Card>
            </CardWrapper>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>املاک علاقه‌مند</CardTitle>
          <Link href="/user/favorites">
            <Button variant="outline" size="sm">
              مشاهده همه
              <ArrowRight className="h-4 w-4 mr-2" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {(countLoading || statsLoading) ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ) : !favoritesCount || favoritesCount === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                شما هنوز هیچ ملکی را به علاقه‌مندی‌ها اضافه نکرده‌اید
              </p>
              <Link href="/properties">
                <Button variant="outline">
                  مشاهده املاک
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">تعداد کل:</span>
                <span className="font-semibold">{favoritesCount || 0} ملک</span>
              </div>
              
              {favoritesStats?.favorites_by_type && Object.keys(favoritesStats.favorites_by_type).length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">محبوب‌ترین نوع:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(favoritesStats.favorites_by_type)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 3)
                      .map(([type, count]) => (
                        <div key={type} className="bg-[--primary]/10 text-[--primary] px-2 py-1 rounded text-xs">
                          {type}: {count}
                        </div>
                      ))}
                  </div>
                </div>
              )}
              
              <Link href="/user/favorites">
                <Button className="w-full bg-[--primary] hover:bg-[--primary-hover]">
                  مدیریت علاقه‌مندی‌ها
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

