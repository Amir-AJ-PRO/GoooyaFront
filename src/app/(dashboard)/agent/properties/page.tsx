'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Plus, Building2, Edit, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';

export default function AgentProperties() {
  const { user } = useAuth();

  // Mock data
  const properties = [
    {
      id: 1,
      title: "آپارتمان مدرن در تهران",
      location: "تهران، فرشته",
      price: "۸ میلیارد تومان",
      status: "active",
      views: 150,
      createdAt: "۱۴۰۲/۰۸/۱۵",
    },
    {
      id: 2,
      title: "ویلا لوکس با باغ",
      location: "تهران، لواسان",
      price: "۱۵ میلیارد تومان",
      status: "pending",
      views: 89,
      createdAt: "۱۴۰۲/۰۸/۱۰",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">فعال</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">در انتظار تایید</Badge>;
      case 'sold':
        return <Badge className="bg-gray-500">فروخته شده</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (!user || user.type === 'user') {
    return null;
  }

  return (
    <div>
      <PageHeader
        title="املاک من"
        description="مدیریت املاک ثبت شده توسط شما"
      >
        <Link href="/agent/properties/new">
          <Button>
            <Plus className="h-4 w-4 ml-2" />
            ثبت ملک جدید
          </Button>
        </Link>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 mt-6">
        {properties.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-12">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg mb-2">هنوز ملکی ثبت نکرده‌اید</h3>
              <p className="text-muted-foreground mb-4">
                اولین ملک خود را ثبت کنید و شروع به فروش کنید
              </p>
              <Link href="/agent/properties/new">
                <Button>
                  <Plus className="h-4 w-4 ml-2" />
                  ثبت ملک جدید
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          properties.map((property) => (
            <Card key={property.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-2">{property.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{property.location}</span>
                      <span>•</span>
                      <span className="font-semibold text-foreground">{property.price}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(property.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex gap-4 text-sm">
                    <span className="text-muted-foreground">
                      بازدید: <span className="font-semibold text-foreground">{property.views}</span>
                    </span>
                    <span className="text-muted-foreground">
                      تاریخ ثبت: <span className="font-semibold text-foreground">{property.createdAt}</span>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/agent/properties/${property.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 ml-2" />
                        ویرایش
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                      <Trash2 className="h-4 w-4 ml-2" />
                      حذف
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

