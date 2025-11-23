'use client';

import { useAuth } from '@/contexts/AuthContext';
import PropertyForm from '@/components/forms/PropertyForm';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';

export default function NewProperty() {
  const { user } = useAuth();

  if (!user || user.type === 'user') {
    return null;
  }

  return (
    <div>
      <PageHeader
        title="ثبت ملک جدید"
        description="اطلاعات ملک خود را وارد کنید"
      />

      <Card className="mt-6">
        <CardContent className="pt-6">
          <PropertyForm />
        </CardContent>
      </Card>
    </div>
  );
}

