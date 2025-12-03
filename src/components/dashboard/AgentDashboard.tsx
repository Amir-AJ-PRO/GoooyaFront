'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Eye, Heart, Plus, CheckCircle, Clock, XCircle } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import Link from "next/link";
import AgentProfileCard from "@/components/agent/AgentProfileCard";
import AgentPropertiesList from "@/components/agent/AgentPropertiesList";
import { useAgentProperties } from "@/hooks/useAgentProfile";
import { useMemo } from "react";

export default function AgentDashboard() {
  const { data: properties, isLoading } = useAgentProperties();

  // محاسبه آمار
  const stats = useMemo(() => {
    // اطمینان از اینکه properties یک آرایه است
    const propertiesArray = Array.isArray(properties) ? properties : [];
    
    if (propertiesArray.length === 0) {
      return [
        { title: "مجموع املاک", value: "0", icon: Building2, color: "text-blue-600" },
        { title: "املاک فعال", value: "0", icon: CheckCircle, color: "text-green-600" },
        { title: "تصاویر آپلود شده", value: "0", icon: Eye, color: "text-purple-600" },
      ];
    }

    const totalCount = propertiesArray.length;
    const activeCount = propertiesArray.filter(p => p.show_status === 'ok').length;
    const totalImages = propertiesArray.reduce((sum, p) => sum + (p.images?.length || 0), 0);

    return [
      { title: "مجموع املاک", value: totalCount.toString(), icon: Building2, color: "text-blue-600" },
      { title: "املاک فعال", value: activeCount.toString(), icon: CheckCircle, color: "text-green-600" },
      { title: "تصاویر آپلود شده", value: totalImages.toString(), icon: Eye, color: "text-purple-600" },
    ];
  }, [properties]);

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6 px-2 sm:px-4 md:px-0">
      <PageHeader
        title="پنل مشاور"
        description="مدیریت املاک و فعالیت‌های خود"
      >
        <Link href="/agent/properties/new" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10">
            <Plus className="h-3 w-3 sm:h-4 sm:w-4 ml-1 sm:ml-2" />
            <span className="hidden sm:inline">ثبت ملک جدید</span>
            <span className="sm:hidden">ثبت ملک</span>
          </Button>
        </Link>
      </PageHeader>

      {/* پروفایل مشاور */}
      <AgentProfileCard />

      {/* آمار */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-3 sm:p-6">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color} flex-shrink-0`} />
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="text-xl sm:text-2xl font-bold">
                  {isLoading ? '...' : stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* لیست املاک */}
      <AgentPropertiesList />
    </div>
  );
}

