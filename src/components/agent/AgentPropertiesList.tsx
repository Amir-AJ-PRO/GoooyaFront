'use client';

import { useState } from 'react';
import { useFilteredAgentProperties, useDeleteProperty } from '@/hooks/useAgentProfile';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
    <div className="space-y-3 sm:space-y-4">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'all' | 'ok')}>
        <TabsList className="grid h-10 w-full grid-cols-2 sm:w-auto">
          <TabsTrigger value="all">همه املاک</TabsTrigger>
          <TabsTrigger value="ok">فعال</TabsTrigger>
        </TabsList>
      </Tabs>

      {propertiesArray.length === 0 ? (
        <Card>
          <CardContent className="py-8 sm:py-12 text-center px-4">
            <Home className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-muted-foreground mb-3 sm:mb-4" />
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
              {activeTab === 'all' 
                ? 'هنوز ملکی ثبت نکرده‌اید'
                : `ملکی با وضعیت "${getStatusLabel(activeTab)}" یافت نشد`
              }
            </p>
            {activeTab === 'all' && (
              <Button className="mt-3 sm:mt-4 text-xs sm:text-sm h-9 sm:h-10" onClick={() => window.location.href = '/agent/properties/new'}>
                افزودن ملک جدید
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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

  const handleEdit = () => {router.push(`/agent/properties/${property.slug}/edit`);
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
        <div className="relative h-40 sm:h-48 bg-gray-200">
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
              <Home className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
            </div>
          )}

          
          {/* Badge وضعیت */}
          <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2">
            <Badge variant={getStatusVariant(property.show_status)} className="text-xs px-1.5 sm:px-2 py-0.5 sm:py-1">
              <span className="hidden sm:inline">{getStatusLabel(property.show_status)}</span>
              <span className="sm:hidden">{getStatusLabel(property.show_status).slice(0, 4)}</span>
            </Badge>
          </div>

          {/* تعداد تصاویر */}
          {property.images.length > 1 && (
            <div className="absolute bottom-1.5 sm:bottom-2 left-1.5 sm:left-2">
              <Badge variant="secondary" className="gap-1 text-xs px-1.5 sm:px-2 py-0.5 sm:py-1">
                <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {property.images.length}
              </Badge>
            </div>
          )}
        </div>

        <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
          {/* عنوان */}
          <h3 className="font-semibold text-sm sm:text-base md:text-lg line-clamp-2 break-words">
            {property.title}
          </h3>

          {/* آدرس */}
          {property.address && (
            <div className="flex items-start gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" />
              <p className="line-clamp-2 break-words">{property.address}</p>
            </div>
          )}

          {/* مشخصات */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-1">
              <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{property.measure} متر</span>
            </div>
            <div className="flex items-center gap-1">
              <BedDouble className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{property.rooms} اتاق</span>
            </div>
          </div>

          {/* قیمت */}
          <div className="flex items-center gap-1.5 sm:gap-2 pt-1.5 sm:pt-2 border-t">
            <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
            <span className="font-bold text-sm sm:text-base md:text-lg truncate">
              {formatPrice(property.price)} تومان
            </span>
          </div>

          {/* تاریخ */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{formatDate(property.created_at)}</span>
          </div>

          {/* دکمه‌ها */}
          <div className="flex gap-1.5 sm:gap-2 pt-1.5 sm:pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 text-xs sm:text-sm h-8 sm:h-9"
              onClick={handleEdit}
            >
              <Pencil className="w-3 h-3 ml-0.5 sm:ml-1" />
              <span className="hidden sm:inline">ویرایش</span>
              <span className="sm:hidden">ویرایش</span>
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              className="h-8 sm:h-9 w-8 sm:w-9 p-0"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
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

