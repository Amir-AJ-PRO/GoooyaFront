'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus, Building2 } from 'lucide-react';
import AgentPropertiesList from '@/components/agent/AgentPropertiesList';

export default function AgentPropertiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold sm:text-3xl">
            <Building2 className="h-7 w-7 text-primary" />
            املاک من
          </h1>
          <p className="mt-2 text-muted-foreground">
            مدیریت، ویرایش و حذف آگهی‌های ثبت‌شده
          </p>
        </div>
        <Link href="/agent/properties/new">
          <Button className="w-full gap-2 sm:w-auto">
            <Plus className="h-4 w-4" />
            ثبت ملک جدید
          </Button>
        </Link>
      </div>

      <AgentPropertiesList />
    </div>
  );
}
