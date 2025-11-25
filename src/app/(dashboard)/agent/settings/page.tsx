'use client';

import { PageHeader } from '@/components/common/PageHeader';
import AgentProfileSettings from '@/components/agent/AgentProfileSettings';

export default function AgentSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="تنظیمات پروفایل"
        description="ویرایش اطلاعات پروفایل مشاور"
      />
      <AgentProfileSettings />
    </div>
  );
}

