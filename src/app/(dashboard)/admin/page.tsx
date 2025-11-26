'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Building2, MessageSquare, TrendingUp, FileText, ArrowLeft, Clock, CheckCircle, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAdviserTicketsCount } from '@/hooks/useTicketAdviser';
import Link from 'next/link';

export default function AdminPage() {
  const { user, backendUser } = useAuth();
  const router = useRouter();
  
  // دریافت تعداد تیکت‌های در انتظار (فقط برای مشاور گویا)
  const isGooyaAdviser = backendUser?.agent_profile?.is_goooya_adviser === true;
  const { data: ticketsCount } = useAdviserTicketsCount(isGooyaAdviser);

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
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      iconBg: "bg-gradient-to-br from-purple-500 to-pink-500",
    },
    {
      title: "املاک",
      value: "۴۵۶",
      icon: Building2,
      change: "+۸%",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      iconBg: "bg-gradient-to-br from-blue-500 to-cyan-500",
    },
    {
      title: "پیام‌ها",
      value: "۸۹",
      icon: MessageSquare,
      change: "+۲۳%",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      iconBg: "bg-gradient-to-br from-green-500 to-emerald-500",
    },
    {
      title: "فروش",
      value: "۳۲",
      icon: TrendingUp,
      change: "+۱۵%",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      iconBg: "bg-gradient-to-br from-orange-500 to-red-500",
    },
  ];

  if (!user || user.type !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {/* Header با گرادیانت زیبا */}
      <div className="mb-8" dir="rtl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              داشبورد مدیریت
            </h1>
            <p className="text-gray-600 mt-1">خوش آمدید! آمار و مدیریت سیستم</p>
          </div>
        </div>
      </div>

      {/* کارت تیکت‌ها - بزرگ و برجسته برای مشاور گویا */}
      {isGooyaAdviser && (
        <Card className="mb-8 border-0 shadow-xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 text-white overflow-hidden relative group hover:shadow-2xl transition-all duration-300" dir="rtl">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardContent className="pt-8 pb-8 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-1 flex items-center gap-2">
                      تیکت‌های ثبت ملک
                      {ticketsCount !== undefined && ticketsCount > 0 && (
                        <Badge className="bg-white text-primary text-lg px-4 py-1 shadow-lg">
                          {ticketsCount} جدید
                        </Badge>
                      )}
                    </h2>
                    <p className="text-white/80">مدیریت و بررسی درخواست‌های ثبت ملک کاربران</p>
                  </div>
                </div>
                {ticketsCount !== undefined && ticketsCount > 0 && (
                  <div className="flex items-center gap-2 text-white/80">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">در انتظار بررسی شما</span>
                  </div>
                )}
              </div>
              <Link href="/admin/tickets">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-gray-50 shadow-xl gap-2 px-8 py-6 text-lg font-bold group-hover:scale-105 transition-transform duration-300"
                >
                  <FileText className="h-5 w-5" />
                  مشاهده تیکت‌ها
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* کارت‌های آمار با طراحی مدرن */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden relative cursor-pointer"
              dir="rtl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <CardContent className="pt-6 relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-xl shadow-lg ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${stat.gradient} text-white shadow-md`}>
                    {stat.change}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">از ماه گذشته</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* کارت‌های پایین */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* فعالیت‌های اخیر */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300" dir="rtl">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-xl">آخرین فعالیت‌ها</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-gray-600 font-medium">فعالیت‌های اخیر</p>
              <p className="text-sm text-gray-400 mt-1">به زودی نمایش داده می‌شود</p>
            </div>
          </CardContent>
        </Card>

        {/* املاک در انتظار تایید */}
        <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300" dir="rtl">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-xl">املاک در انتظار تایید</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
                <Building2 className="h-8 w-8 text-orange-600" />
              </div>
              <p className="text-gray-600 font-medium">املاک منتظر بررسی</p>
              <p className="text-sm text-gray-400 mt-1">به زودی نمایش داده می‌شود</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

