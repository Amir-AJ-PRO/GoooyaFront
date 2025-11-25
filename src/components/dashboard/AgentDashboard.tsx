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
    <div className="space-y-6">
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

      {/* پروفایل مشاور */}
      <AgentProfileCard />

      {/* آمار */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
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

