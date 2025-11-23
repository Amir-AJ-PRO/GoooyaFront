'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Building2 } from 'lucide-react';

export default function AgentPropertiesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            املاک من
          </h1>
          <p className="text-muted-foreground mt-2">
            مدیریت املاک ثبت شده
          </p>
        </div>
        <Link href="/agent/properties/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            ثبت ملک جدید
          </Button>
        </Link>
      </div>

      {/* Empty State */}
      <Card>
        <CardHeader>
          <CardTitle>املاک شما</CardTitle>
          <CardDescription>
            لیست تمام املاک ثبت شده توسط شما
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">هنوز ملکی ثبت نکرده‌اید</h3>
            <p className="text-muted-foreground mb-6">
              با ثبت اولین ملک خود، آن را در این لیست مشاهده خواهید کرد
            </p>
            <Link href="/agent/properties/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                ثبت اولین ملک
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
