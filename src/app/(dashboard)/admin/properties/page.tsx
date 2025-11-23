'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/common/PageHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X, Eye, Building2 } from 'lucide-react';

export default function AdminProperties() {
  const { user } = useAuth();

  // Mock data
  const properties = [
    {
      id: '1',
      title: 'آپارتمان مدرن در تهران',
      agent: 'محمد رضایی',
      location: 'تهران، فرشته',
      price: '۸ میلیارد تومان',
      status: 'pending',
      createdAt: '۱۴۰۲/۰۸/۱۵',
    },
    {
      id: '2',
      title: 'ویلا لوکس با باغ',
      agent: 'علی احمدی',
      location: 'تهران، لواسان',
      price: '۱۵ میلیارد تومان',
      status: 'active',
      createdAt: '۱۴۰۲/۰۸/۱۰',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">فعال</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">در انتظار تایید</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">رد شده</Badge>;
      case 'sold':
        return <Badge className="bg-gray-500">فروخته شده</Badge>;
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
        title="مدیریت املاک"
        description="بررسی و تایید املاک ثبت شده"
      />

      <Card className="mt-6">
        <CardContent className="pt-6">
          {properties.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg mb-2">ملکی یافت نشد</h3>
              <p className="text-muted-foreground">
                هنوز ملکی در سیستم ثبت نشده است
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">عنوان</TableHead>
                  <TableHead className="text-right">مشاور</TableHead>
                  <TableHead className="text-right">موقعیت</TableHead>
                  <TableHead className="text-right">قیمت</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right">تاریخ ثبت</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.title}</TableCell>
                    <TableCell>{property.agent}</TableCell>
                    <TableCell>{property.location}</TableCell>
                    <TableCell>{property.price}</TableCell>
                    <TableCell>{getStatusBadge(property.status)}</TableCell>
                    <TableCell>{property.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" title="مشاهده">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {property.status === 'pending' && (
                          <>
                            <Button variant="outline" size="sm" className="text-green-500 hover:text-green-600" title="تایید">
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600" title="رد">
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
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

