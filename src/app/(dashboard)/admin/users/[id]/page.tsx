'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageHeader } from '@/components/common/PageHeader';
import { use } from 'react';

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditUser({ params }: Props) {
  const { user } = useAuth();
  const resolvedParams = use(params);
  const userId = resolvedParams.id;

  // Mock data
  const userData = {
    id: userId,
    name: 'محمد رضایی',
    phone: '09123456789',
    email: 'mohammad@example.com',
    type: 'agent',
    status: 'active',
  };

  if (!user || user.type !== 'admin') {
    return null;
  }

  return (
    <div>
      <PageHeader
        title="ویرایش کاربر"
        description={`ویرایش اطلاعات کاربر ${userData.name}`}
      />

      <Card className="mt-6 max-w-2xl">
        <CardHeader>
          <CardTitle>اطلاعات کاربر</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="name">نام و نام خانوادگی</Label>
              <Input 
                id="name" 
                defaultValue={userData.name}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="phone">شماره تماس</Label>
              <Input 
                id="phone" 
                type="tel"
                defaultValue={userData.phone}
                className="mt-2"
                disabled
              />
            </div>

            <div>
              <Label htmlFor="email">ایمیل</Label>
              <Input 
                id="email" 
                type="email"
                defaultValue={userData.email}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="type">نوع کاربر</Label>
              <Select defaultValue={userData.type}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">کاربر عادی</SelectItem>
                  <SelectItem value="agent">مشاور املاک</SelectItem>
                  <SelectItem value="admin">مدیر</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">وضعیت</Label>
              <Select defaultValue={userData.status}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">فعال</SelectItem>
                  <SelectItem value="suspended">معلق</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit">ذخیره تغییرات</Button>
              <Button type="button" variant="outline">انصراف</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

