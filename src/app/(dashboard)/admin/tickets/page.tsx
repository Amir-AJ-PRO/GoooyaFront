'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAdviserTickets } from '@/hooks/useTicketAdviser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Eye, FileText, Clock, CheckCircle, XCircle, ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { formatPrice, formatDate, getMediaUrl } from '@/lib/utils';
import Image from 'next/image';

/**
 * صفحه لیست تیکت‌های ثبت ملک برای مشاور گویا
 */
export default function AdviserTicketsPage() {
  const router = useRouter();
  const { backendUser, isLoading: authLoading } = useAuth();
  const [activeStatus, setActiveStatus] = useState<string>('assigned');
  const { data: tickets, isLoading } = useAdviserTickets(activeStatus);
  
  // بررسی دسترسی
  const isGooyaAdviser = backendUser?.agent_profile?.is_goooya_adviser === true;
  
  useEffect(() => {
    if (!authLoading && !isGooyaAdviser) {
      router.replace('/admin');
    }
  }, [authLoading, isGooyaAdviser, router]);

  const statusConfig = {
    pending: { label: 'در انتظار', color: 'bg-gray-500', icon: Clock },
    assigned: { label: 'اختصاص یافته', color: 'bg-primary', icon: FileText },
    rejected: { label: 'رد شده', color: 'bg-red-500', icon: XCircle },
    published: { label: 'منتشر شده', color: 'bg-green-500', icon: CheckCircle },
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    if (!config) return null;
    
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 ml-1" />
        {config.label}
      </Badge>
    );
  };

  // نمایش لودینگ
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  // عدم دسترسی
  if (!isGooyaAdviser) {
    return (
      <div className="container mx-auto py-8 px-4 text-center" dir="rtl">
        <ShieldAlert className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">عدم دسترسی</h1>
        <p className="text-muted-foreground mb-4">
          فقط مشاوران گویا می‌توانند به این بخش دسترسی داشته باشند
        </p>
        <Button onClick={() => router.push('/admin')}>
          بازگشت به داشبورد
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8" dir="rtl">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-2xl shadow-lg">
            <FileText className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              تیکت‌های ثبت ملک
            </h1>
            <p className="text-muted-foreground mt-1">
              مدیریت و بررسی درخواست‌های ثبت ملک
            </p>
          </div>
        </div>
      </div>

      <Tabs value={activeStatus} onValueChange={setActiveStatus} dir="rtl">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="assigned">
            اختصاص یافته
            {tickets && activeStatus === 'assigned' && (
              <Badge variant="secondary" className="mr-2">
                {tickets.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="rejected">رد شده</TabsTrigger>
          <TabsTrigger value="published">منتشر شده</TabsTrigger>
          <TabsTrigger value="">همه</TabsTrigger>
        </TabsList>

        <TabsContent value={activeStatus} className="mt-6" dir="rtl">
          {!tickets || tickets.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">تیکتی یافت نشد</h3>
                <p className="text-muted-foreground">
                  در حال حاضر تیکتی با این وضعیت وجود ندارد
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-xl hover:scale-[1.02] transition-all duration-300 overflow-hidden border-0 shadow-md">
                  {/* تصویر در بالای کارت */}
                  {ticket.images && ticket.images.length > 0 && (
                    <div className="relative w-full h-56 overflow-hidden group">
                      <Image
                        src={getMediaUrl((ticket.images.find(img => img.is_main)?.image || ticket.images[0]?.image)) || '/placeholder.jpg'}
                        alt={ticket.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      {ticket.images.length > 1 && (
                        <Badge className="absolute bottom-3 left-3 bg-black/70 text-white backdrop-blur-sm">
                          {ticket.images.length} عکس
                        </Badge>
                      )}
                      <div className="absolute top-3 right-3">
                        {getStatusBadge(ticket.status)}
                      </div>
                    </div>
                  )}
                  {!ticket.images || ticket.images.length === 0 && (
                    <div className="relative w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">بدون تصویر</p>
                      </div>
                      <div className="absolute top-3 right-3">
                        {getStatusBadge(ticket.status)}
                      </div>
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2">
                      {ticket.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">

                    {/* اطلاعات */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">نوع:</span>
                        <span className="font-medium">{ticket.property_type_title}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">شهر:</span>
                        <span className="font-medium">{ticket.city_name}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">متراژ:</span>
                        <span className="font-medium">{ticket.measure} متر</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">خواب:</span>
                        <span className="font-medium">{ticket.rooms}</span>
                      </div>

                      {ticket.price && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">قیمت:</span>
                          <span className="font-medium text-green-600">
                            {formatPrice(ticket.price)}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-muted-foreground">تاریخ:</span>
                        <span className="text-xs">{formatDate(ticket.created_at)}</span>
                      </div>

                      {ticket.user_phone && (
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">تماس:</span>
                          <span className="text-xs font-mono">{ticket.user_phone}</span>
                        </div>
                      )}
                    </div>

                    {/* دکمه */}
                    <Link href={`/admin/tickets/${ticket.id}`} className="block">
                      <Button 
                        size="lg"
                        className="w-full gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 h-12 font-bold"
                      >
                        <Eye className="w-5 h-5" />
                        🔍 مشاهده و بررسی
                        <ArrowRight className="w-4 h-4 mr-auto" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

