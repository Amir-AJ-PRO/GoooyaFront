'use client';

import { useState } from 'react';
import { useFilteredAgentProperties, useDeleteProperty } from '@/hooks/useAgentProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Home, 
  MapPin, 
  DollarSign, 
  Maximize, 
  BedDouble,
  Calendar,
  Eye,
  Clock,
  XCircle,
  Pencil,
  Trash2,
  Loader2
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AgentProperty } from '@/services/agentService';
import { getMediaUrl, formatPrice, formatDate } from '@/lib/utils';

/**
 * کامپوننت نمایش لیست املاک agent
 */
export default function AgentPropertiesList() {
  const [activeTab, setActiveTab] = useState<'all' | 'ok'>('all');
  
  const { data: allProperties, isLoading, error } = useFilteredAgentProperties(
    activeTab === 'all' ? undefined : activeTab
  );

  if (isLoading) {
    return <PropertiesListSkeleton />;
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-red-600">
            <XCircle className="w-5 h-5" />
            <p>خطا در دریافت لیست املاک</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // اطمینان از اینکه allProperties یک آرایه است
  const propertiesArray = Array.isArray(allProperties) ? allProperties : [];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>املاک من</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">همه املاک</TabsTrigger>
              <TabsTrigger value="ok">فعال</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {propertiesArray.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Home className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {activeTab === 'all' 
                ? 'هنوز ملکی ثبت نکرده‌اید'
                : `ملکی با وضعیت "${getStatusLabel(activeTab)}" یافت نشد`
              }
            </p>
            {activeTab === 'all' && (
              <Button className="mt-4" onClick={() => window.location.href = '/agent/properties/new'}>
                افزودن ملک جدید
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {propertiesArray.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * کارت نمایش یک ملک
 */
function PropertyCard({ property }: { property: AgentProperty }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();
  const deleteMutation = useDeleteProperty();
  const mainImage = property.images.find((img) => img.is_main) || property.images[0];

  const handleEdit = () => {
    console.log('Editing property:', { id: property.id, slug: property.slug, title: property.title });
    router.push(`/agent/properties/${property.slug}/edit`);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(property.slug);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف ملک</AlertDialogTitle>
            <AlertDialogDescription>
              آیا مطمئن هستید که می‌خواهید "{property.title}" را حذف کنید؟
              این عملیات قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>لغو</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  در حال حذف...
                </>
              ) : (
                'حذف'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {/* تصویر */}
        <div className="relative h-48 bg-gray-200">
          {mainImage && getMediaUrl(mainImage.image) ? (
            <Image
              src={getMediaUrl(mainImage.image)!}
              alt={property.title}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Home className="w-12 h-12 text-gray-400" />
            </div>
          )}

          
          {/* Badge وضعیت */}
          <div className="absolute top-2 right-2">
            <Badge variant={getStatusVariant(property.show_status)}>
              {getStatusLabel(property.show_status)}
            </Badge>
          </div>

          {/* تعداد تصاویر */}
          {property.images.length > 1 && (
            <div className="absolute bottom-2 left-2">
              <Badge variant="secondary" className="gap-1">
                <Eye className="w-3 h-3" />
                {property.images.length}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          {/* عنوان */}
          <h3 className="font-semibold text-lg line-clamp-1">
            {property.title}
          </h3>

          {/* آدرس */}
          {property.address && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="line-clamp-1">{property.address}</p>
            </div>
          )}

          {/* مشخصات */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <Maximize className="w-4 h-4 text-muted-foreground" />
              <span>{property.measure} متر</span>
            </div>
            <div className="flex items-center gap-1">
              <BedDouble className="w-4 h-4 text-muted-foreground" />
              <span>{property.rooms} اتاق</span>
            </div>
          </div>

          {/* قیمت */}
          <div className="flex items-center gap-2 pt-2 border-t">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="font-bold text-lg">
              {formatPrice(property.price)} تومان
            </span>
          </div>

          {/* تاریخ */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(property.created_at)}</span>
          </div>

          {/* دکمه‌ها */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={handleEdit}
            >
              <Pencil className="w-3 h-3 ml-1" />
              ویرایش
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

/**
 * دریافت label وضعیت
 */
function getStatusLabel(status: string): string {
  switch (status) {
    case 'ok':
      return 'فعال';
    case 'pending':
      return 'در انتظار تأیید';
    case 'rejected':
      return 'رد شده';
    default:
      return status;
  }
}

/**
 * دریافت variant badge بر اساس وضعیت
 */
function getStatusVariant(status: string): 'default' | 'secondary' | 'destructive' {
  switch (status) {
    case 'ok':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'rejected':
      return 'destructive';
    default:
      return 'secondary';
  }
}

/**
 * Skeleton برای حالت loading
 */
function PropertiesListSkeleton() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

