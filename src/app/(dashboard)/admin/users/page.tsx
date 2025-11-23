'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/common/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, User } from 'lucide-react';
import Link from 'next/link';

export default function AdminUsers() {
  const { user } = useAuth();

  // Mock data
  const users = [
    {
      id: '1',
      name: 'محمد رضایی',
      phone: '09123456789',
      type: 'agent',
      status: 'active',
      createdAt: '۱۴۰۲/۰۸/۱۵',
    },
    {
      id: '2',
      name: 'علی احمدی',
      phone: '09187654321',
      type: 'user',
      status: 'active',
      createdAt: '۱۴۰۲/۰۸/۱۰',
    },
  ];

  const getUserTypeBadge = (type: string) => {
    switch (type) {
      case 'admin':
        return <Badge className="bg-purple-500">مدیر</Badge>;
      case 'agent':
        return <Badge className="bg-blue-500">مشاور</Badge>;
      case 'user':
        return <Badge className="bg-gray-500">کاربر</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">فعال</Badge>;
      case 'suspended':
        return <Badge className="bg-red-500">معلق</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (!user || user.type !== 'admin') {
    return null;
  }

  return (
    <div>
      <PageHeader
        title="مدیریت کاربران"
        description="لیست و مدیریت کاربران سیستم"
      />

      <Card className="mt-6">
        <CardContent className="pt-6">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg mb-2">کاربری یافت نشد</h3>
              <p className="text-muted-foreground">
                هنوز کاربری در سیستم ثبت نشده است
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">نام</TableHead>
                  <TableHead className="text-right">شماره تماس</TableHead>
                  <TableHead className="text-right">نوع کاربر</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right">تاریخ ثبت</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name || 'نامشخص'}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>{getUserTypeBadge(user.type)}</TableCell>
                    <TableCell>{getStatusBadge(user.status)}</TableCell>
                    <TableCell>{user.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Link href={`/admin/users/${user.id}`}>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

