'use client';

import { useEffect, useRef, useState } from 'react';
import { useProperty } from '@/hooks/usePropertyMutations';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useVisitTickets } from '@/hooks/useVisitTickets';
import { useToast } from '@/hooks/use-toast';
import { DuplicateVisitTicketError } from '@/types/property';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import "react-image-gallery/styles/image-gallery.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import Image from 'next/image';
import {
  MapPin,
  Bed,
  Square,
  Calendar,
  Building2,
  Phone,
  Heart,
  Share2,
  ArrowRight,
  Loader2,
  Home,
  Car,
  Warehouse,
  ArrowUpDown,
  CheckCircle2,
  FileText,
  Waves,
  Droplets,
  Zap,
  Shield,
  Users,
  Building,
  Radio,
  Wifi,
  XCircle,
  X,
  CheckCircle,

  Sparkles,
  ExternalLinkIcon
} from 'lucide-react';
import { FavoriteButtonLarge, FavoriteButtonSmall } from '@/components/favorites/FavoriteButton';
import { API_BASE_URL, GOOOYA_CONTACT_PHONE_DISPLAY, GOOOYA_CONTACT_PHONE_TEL } from '@/lib/constants';
import Link from 'next/link';
import { getMediaUrl } from '@/lib/utils';
import MyModal from "react-modal"







interface PropertyDetailClientProps {
  slug: string;
}

// فرمت قیمت
const formatPrice = (price?: number | null): string => {
  if (!price) return 'توافقی';

  if (price >= 1000000000) {
    return `${(price / 1000000000).toFixed(2)} میلیارد تومان`;
  } else if (price >= 1000000) {
    return `${(price / 1000000).toFixed(0)} میلیون تومان`;
  }
  return `${price.toLocaleString('fa-IR')} تومان`;
};

export default function PropertyDetailClient({ slug }: PropertyDetailClientProps) {
  const { data: property, isLoading, error } = useProperty(slug);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const {
    createVisitTicket,
    isCreating,
    createVisitTicketBySlug,
    isCreatingBySlug
  } = useVisitTickets();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showAgentPhoneDialog, setShowAgentPhoneDialog] = useState(false);
  const [ModalHandeler, setModalHandeler] = useState(false)
  const [visibliti, setvisibliti] = useState(false)
  const MAX_THUMBNAILS = 6;
  let remainig = property?.images.length - MAX_THUMBNAILS;




  // let sliderImage =[] ;
  //   property?.images.map((img) => {



  //     sliderImage.push({
  //       original: (img.image.startsWith('http://') || img.image.startsWith('https://')
  //         ? img.image
  //         : `${API_BASE_URL}${img.image.startsWith('/') ? img.image : `/${img.image}`}`)
  //       ,
  //       size: 100
  //     })


  //   })






  // هندل کردن درخواست بازدید (روش اول: با slug در body)

  console.log()
  const handleVisitRequest = async () => {
    if (!isAuthenticated) {
      router.push(`/login?from=${encodeURIComponent(`/properties/${slug}`)}`);
      return;
    }


    try {
      const result = await createVisitTicket.mutateAsync({
        property_slug: slug,
      });

      toast({
        title: "درخواست بازدید ثبت شد",
        description: result.message,
        variant: "default",
      });
    } catch (error: any) {
      // بررسی اینکه آیا خطای تیکت تکراری است
      if (error.existing_ticket) {
        const duplicateError = error as DuplicateVisitTicketError;
        const existingDate = new Date(duplicateError.existing_ticket.created_at);
        const formattedDate = existingDate.toLocaleDateString('fa-IR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        toast({
          title: "درخواست تکراری",
          description: `شما قبلاً در تاریخ ${formattedDate} برای این ملک درخواست بازدید ثبت کرده‌اید.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "خطا در ثبت درخواست",
          description: error.message || "خطای نامشخص رخ داده است",
          variant: "destructive",
        });
      }
    }
  };

  // هندل کردن درخواست بازدید (روش دوم: با slug در URL)
  const handleVisitRequestBySlug = async () => {
    if (!isAuthenticated) {
      router.push(`/login?from=${encodeURIComponent(`/properties/${slug}`)}`);
      return;
    }

    try {
      const result = await createVisitTicketBySlug.mutateAsync(slug);

      toast({
        title: "درخواست بازدید ثبت شد",
        description: result.message,
        variant: "default",
      });
    } catch (error: any) {
      // بررسی اینکه آیا خطای تیکت تکراری است
      if (error.existing_ticket) {
        const duplicateError = error as DuplicateVisitTicketError;
        const existingDate = new Date(duplicateError.existing_ticket.created_at);
        const formattedDate = existingDate.toLocaleDateString('fa-IR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        toast({
          title: "درخواست تکراری",
          description: `شما قبلاً در تاریخ ${formattedDate} برای این ملک درخواست بازدید ثبت کرده‌اید.`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "خطا در ثبت درخواست",
          description: error.message || "خطای نامشخص رخ داده است",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    const isAuthError = error?.message?.includes('احراز هویت') ||
      error?.message?.includes('وارد شوید') ||
      error?.message?.includes('نشست');

    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <Home className="h-16 w-16 mx-auto text-red-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">
            {isAuthError ? 'نیاز به ورود' : 'ملک یافت نشد'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {error?.message || 'ملک مورد نظر یافت نشد یا در حال حاضر قابل نمایش نیست'}
          </p>
          <div className="flex gap-4 justify-center">
            {isAuthError ? (
              <Link href={`/login?from=${encodeURIComponent(`/properties/${slug}`)}`}>
                <Button>
                  ورود به حساب کاربری
                </Button>
              </Link>
            ) : null}
            <Link href="/properties">
              <Button variant="outline">
                <ArrowRight className="h-4 w-4 mr-2" />
                بازگشت به لیست املاک
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const mainImage = property.images?.[selectedImageIndex];


  // ساخت URL تصویر - اگر URL کامل است (شروع با http/https)، از همان استفاده می‌کنیم
  let imageUrl = '/assets/property-placeholder.jpg';
  if (mainImage?.image) {
    if (mainImage.image.startsWith('http://') || mainImage.image.startsWith('https://')) {
      imageUrl = mainImage.image;
    } else {
      //const imagePath = mainImage.image.startsWith('/') ? mainImage.image : `/${mainImage.image}`;
      imageUrl = `${API_BASE_URL}${imageUrl}`;
    }
  }

  // محاسبه نوع شهر و منطقه با optional chaining (استفاده از any برای سازگاری با انواع مختلف backend)
  const anyProperty = property as any;
  const cityName = typeof anyProperty.city === 'string'
    ? anyProperty.city
    : (anyProperty.city && anyProperty.city.name
      ? anyProperty.city.name
      : '');
  const locationName = typeof anyProperty.location === 'string'
    ? anyProperty.location
    : (anyProperty.location && anyProperty.location.name
      ? anyProperty.location.name
      : '');
  const propertyTypeName = typeof anyProperty.property_type === 'string'
    ? anyProperty.property_type
    : (anyProperty.property_type && anyProperty.property_type.title
      ? anyProperty.property_type.title
      : '');

  const agentObj = typeof anyProperty.agent === 'object' && anyProperty.agent ? anyProperty.agent : null;
  const agentName =
    agentObj?.full_name ||
    (typeof anyProperty.agent === 'string' ? anyProperty.agent : '') ||
    'نامشخص';
  const isGoooyaProperty =
    (anyProperty as any)?.is_goooya_property === true ||
    (anyProperty as any)?.is_goooya_adviser === true ||
    (anyProperty as any)?.is_goooya === true ||
    agentObj?.is_goooya_adviser === true ||
    (typeof anyProperty.agent === 'string' &&
      (anyProperty.agent.toLowerCase().includes('گویا') ||
        anyProperty.agent.toLowerCase().includes('gooya') ||
        anyProperty.agent.toLowerCase().includes('goooya')));

  const agentProfileImage = agentObj?.profile_image || anyProperty.agent_image || null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/properties">
        <Button variant="ghost" className="mb-6">
          <ArrowRight className="h-4 w-4 mr-2" />
          بازگشت به لیست املاک
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ستون اصلی - تصاویر و جزئیات */}
        <div className="lg:col-span-2 space-y-6">
          {/* تصویر اصلی */}
          <Card className="overflow-hidden">
            <div className="relative h-96 md:h-[500px] bg-gray-100">
              <Image
                src={imageUrl}
                alt={property.title}
                fill
                className="object-contain bg-cover bg-center "
                priority
              />

              {/* بج‌ها */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <div className="flex gap-2">
                  <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-bold">
                    {property.transaction_type === 'sale' ? 'فروش' : 'اجاره'}
                  </div>
                  {isGoooyaProperty && (
                    <div className="bg-primary/90 text-white px-4 py-2 rounded-full text-sm font-bold">
                      گویا
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {isAuthenticated && (
                    <FavoriteButtonSmall
                      propertyId={property.id}
                      isFavorite={Boolean(property.is_favorite)}
                      className="bg-white/90 backdrop-blur-sm"
                    />
                  )}
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full bg-white/90 backdrop-blur-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (navigator.share) {
                        navigator.share({
                          title: property.title,
                          text: property.description || '',
                          url: window.location.href,
                        }).catch(() => {
                          // Fallback: copy to clipboard
                          navigator.clipboard.writeText(window.location.href);
                          toast({
                            title: "لینک کپی شد",
                            description: "لینک ملک در کلیپ‌بورد کپی شد",
                          });
                        });
                      } else {
                        // Fallback: copy to clipboard
                        navigator.clipboard.writeText(window.location.href);
                        toast({
                          title: "لینک کپی شد",
                          description: "لینک ملک در کلیپ‌بورد کپی شد",
                        });
                      }
                    }}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* گالری تصاویر */}
            {property.images && property.images.length > 1 && (
              <div className="p-4">
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {property.images.slice(0, MAX_THUMBNAILS).map((img, index) => {
                    let isLastVisible = index === MAX_THUMBNAILS - 1;


                    return <button
                      key={img.id}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${index === selectedImageIndex
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-transparent hover:border-gray-300'
                        }`}
                    >

                      <Image
                        src={
                          img.image.startsWith('http://') || img.image.startsWith('https://')
                            ? img.image
                            : `${API_BASE_URL}${img.image.startsWith('/') ? img.image : `/${img.image}`}`
                        }
                        alt={`تصویر ${index + 1}`}
                        fill
                        className="object-contain bg-gray-100"
                      />
                      {isLastVisible && remainig > 0 && (
                        <div onClick={() => {
                          if (isLastVisible && remainig > 0) {
                            // open modal with all images
                            setModalHandeler(true);
                          }

                        }

                        }
                          className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-medium">
                          +{remainig} more
                        </div>

                      )}

                    </button>
                  }
                  )
                  }

                </div>
              </div>
            )}

          </Card>


          <div className='fixed h-screen -z-50 '>
            <MyModal
              className={"fixed   justify-center items-center rounded-sm z-[100]  h-screen w-screen  text-white  "}
              isOpen={ModalHandeler}
              overlayClassName={"fixed flex   z-[1000]  h-screen w-screen   bg-black/90 bg-opacity-5  inset-0"}
              onRequestClose={() => { setModalHandeler(false) }}
            >

              <div className='relative '  >
                <button className='  border border-black top-[15px] right-[15px] absolute' onClick={() => { setModalHandeler(false) }} ><X  /></button>
              </div>



              <div className='flex flex-col h-full '>
                <div className=' flex items-center justify-center h-full   '>
                  <div className=' h-full md:w-3/6 w-full flex justify-center items-center     '>
                    <div className="relative h-full w-full">
                      <Image
                        src={imageUrl}
                        alt={property.title}
                        fill
                       
                        className="object-contain"

                        priority
                      />
                    </div>
                  </div>
                </div>



                {/* گالری تصاویر */}
                <div className=''>
                  {property.images && property.images.length > 1 && (
                    <div className="p-4 flex justify-center items-start">
                      <div className='flex justify-center items-start flex-wrap'>
                        {property.images.map((img, index) => {



                          return <button
                            key={img.id}
                            onClick={() => setSelectedImageIndex(index)}
                            className={`mx-1 relative aspect-square rounded-lg overflow-hidden border-2 transition-all \   h-20 ${index === selectedImageIndex
                              ? 'border-primary ring-1 ring-primary/70'
                              : 'border-transparent hover:border-gray-300'
                              }`}
                          >

                            <Image

                              src={
                                img.image.startsWith('http://') || img.image.startsWith('https://')
                                  ? img.image
                                  : `${API_BASE_URL}${img.image.startsWith('/') ? img.image : `/${img.image}`}`
                              }
                              alt={`تصویر ${index + 1}`}
                              width={100}
                              height={100}
                              className="object-contain bg-gray-100"
                            />


                          </button>

                        }
                        )
                        }

                      </div>
                    </div>
                  )}
                </div>
              </div>



            </MyModal>






          </div>










          {/* عنوان و موقعیت */}
          <Card>
            <CardContent className="p-6">
              <h1 className="text-3xl font-bold mb-4">{property.title}</h1>

              <div className="flex items-center gap-2 text-muted-foreground mb-6">
                <MapPin className="h-5 w-5" />
                <span>
                  {cityName}
                  {locationName && ` - ${locationName}`}
                </span>
              </div>

              {property.address && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm">{property.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* مشخصات کلی */}
          <Card>
            <CardHeader>
              <CardTitle>مشخصات کلی</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Square className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">متراژ</p>
                    <p className="font-bold">{property.measure} متر</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Bed className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">تعداد خواب</p>
                    <p className="font-bold">{property.rooms}</p>
                  </div>
                </div>

                {property.year_built && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">سال ساخت</p>
                      <p className="font-bold">{property.year_built}</p>
                    </div>
                  </div>
                )}

                {property.floor && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">طبقه</p>
                      <p className="font-bold">{property.floor}</p>
                    </div>
                  </div>
                )}

                {property.document_type && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">نوع سند</p>
                      <p className="font-bold">{property.document_type}</p>
                    </div>
                  </div>
                )}

                {property.price_per_meter && (
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Square className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">قیمت هر متر</p>
                      <p className="font-bold text-xs">
                        {formatPrice(property.price_per_meter)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* امکانات و تجهیزات */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                امکانات و تجهیزات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* فقط امکاناتی که ملک دارد */}
                {property.has_parking && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 border-green-200 text-green-700">
                    <Car className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="flex-1 text-sm font-medium">پارکینگ</span>
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  </div>
                )}

                {property.has_storage && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 border-green-200 text-green-700">
                    <Warehouse className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="flex-1 text-sm font-medium">انباری</span>
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  </div>
                )}

                {property.has_elevator && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 border-green-200 text-green-700">
                    <ArrowUpDown className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="flex-1 text-sm font-medium">آسانسور</span>
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  </div>
                )}

                {property.has_balcony && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 border-green-200 text-green-700">
                    <Home className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="flex-1 text-sm font-medium">بالکن</span>
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  </div>
                )}

                {/* امکانات تفریحی */}
                {(property as any).has_pool && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 border-green-200 text-green-700">
                    <Waves className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="flex-1 text-sm font-medium">استخر</span>
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  </div>
                )}

                {(property as any).has_jacuzzi && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 border-green-200 text-green-700">
                    <Droplets className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="flex-1 text-sm font-medium">جکوزی</span>
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  </div>
                )}

                {(property as any).has_sauna && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 border-green-200 text-green-700">
                    <Waves className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="flex-1 text-sm font-medium">سونا</span>
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  </div>
                )}

                {/* امکانات امنیتی */}
                {(property as any).has_security && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 border-green-200 text-green-700">
                    <Shield className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="flex-1 text-sm font-medium">نگهبانی</span>
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  </div>
                )}

                {(property as any).has_janitor && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 border-green-200 text-green-700">
                    <Users className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="flex-1 text-sm font-medium">سرایدار</span>
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  </div>
                )}

                {(property as any).has_conference_hall && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 border-green-200 text-green-700">
                    <Building className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="flex-1 text-sm font-medium">سالن کنفرانس</span>
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  </div>
                )}

                {/* امکانات زیرساختی */}
                {(property as any).has_gas && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 border-green-200 text-green-700">
                    <Zap className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="flex-1 text-sm font-medium">گاز</span>
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  </div>
                )}

                {(property as any).has_electricity && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 border-green-200 text-green-700">
                    <Zap className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="flex-1 text-sm font-medium">برق</span>
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  </div>
                )}

                {(property as any).has_water && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 border-green-200 text-green-700">
                    <Droplets className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="flex-1 text-sm font-medium">آب</span>
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  </div>
                )}

                {(property as any).has_phone && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 border-green-200 text-green-700">
                    <Phone className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="flex-1 text-sm font-medium">تلفن</span>
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  </div>
                )}

                {(property as any).has_wastewater && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 border-green-200 text-green-700">
                    <Droplets className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="flex-1 text-sm font-medium">فاضلاب</span>
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  </div>
                )}

                {(property as any).has_license && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 border-green-200 text-green-700">
                    <FileText className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="flex-1 text-sm font-medium">پروانه</span>
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  </div>
                )}

                {(property as any).has_well && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 border-green-200 text-green-700">
                    <Droplets className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="flex-1 text-sm font-medium">چاه</span>
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  </div>
                )}

                {/* ویژگی‌های خاص */}
                {(property as any).double_glazed_windows && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 border-green-200 text-green-700">
                    <Home className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="flex-1 text-sm font-medium">پنجره دوجداره</span>
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  </div>
                )}

                {(property as any).sound_insulation && (
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-green-50 border-green-200 text-green-700">
                    <Shield className="h-5 w-5 flex-shrink-0 text-green-600" />
                    <span className="flex-1 text-sm font-medium">عایق صوتی</span>
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* توضیحات */}
          {property.description && (
            <Card>
              <CardHeader>
                <CardTitle>توضیحات</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: property.description }}
                />
              </CardContent>
            </Card>
          )}
        </div>

        {/* ستون سمت چپ - قیمت و تماس */}
        <div className="space-y-6">
          {/* مالک / مشاور */}

          <Card className='my-2' >
            <CardHeader>
              <CardTitle>متعلق به</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isGoooyaProperty ? (
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                    <Image
                      src="/logo-gooya.svg"
                      alt="گویا"
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold">گویا</p>
                    <p className="text-sm text-muted-foreground">
                      این ملک برای خودِ گویاست
                    </p>
                  </div>
                  <Badge className="bg-primary/90 hover:bg-primary text-white">گویا</Badge>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={getMediaUrl(agentProfileImage)} />
                      <AvatarFallback className="font-bold">
                        {agentName?.charAt(0) || 'م'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold break-words">{agentName}</p>
                        {agentObj?.is_verified === true ? (
                          <Badge variant="default" className="text-xs">
                            تأیید شده
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            تأیید نشده
                          </Badge>
                        )}
                      </div>
                      {agentObj?.office_name && (
                        <p className="text-xs text-muted-foreground mt-1 break-words">
                          {agentObj.office_name}
                        </p>
                      )}
                      {typeof agentObj?.years_of_experience === 'number' && agentObj.years_of_experience > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {agentObj.years_of_experience} سال سابقه
                        </p>
                      )}
                    </div>
                  </div>

                  {agentObj?.specialties && (
                    <div className="flex flex-wrap gap-2">
                      {agentObj.specialties.split('،').slice(0, 4).map((sp: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {sp.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {(agentObj?.website || agentObj?.instagram) && (
                    <div className="flex flex-wrap gap-3 text-sm">
                      {agentObj.website && (
                        <a
                          href={agentObj.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline break-all"
                        >
                          وب‌سایت
                        </a>
                      )}
                      {agentObj.instagram && (
                        <a
                          href={agentObj.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline break-all"
                        >
                          اینستاگرام
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          <div className='sticky top-28'>

            {/* قیمت */}
            <Card className=" my-2 ">
              <CardHeader >
                <CardTitle>قیمت</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {property.transaction_type === 'sale' ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">قیمت کل</p>
                    <p className="text-3xl font-bold text-primary">
                      {formatPrice(property.price)}
                    </p>
                  </div>
                ) : (
                  <>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">رهن</p>
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(property.mortgage)}
                      </p>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">اجاره (ماهانه)</p>
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(property.rent)}
                      </p>
                    </div>
                  </>
                )}

                <Separator />

                <Button
                  className="w-full gap-2"
                  size="lg"
                  onClick={() => {
                    // برای ملک‌های گویا: شماره عمومی گویا نمایش داده می‌شود (بدون نیاز به لاگین)
                    if (isGoooyaProperty) {
                      setShowAgentPhoneDialog(true);
                      return;
                    }

                    if (isAuthenticated) {
                      // اگر لاگین بود، شماره agent را نمایش بده
                      const agentPhone = typeof property.agent === 'object' && property.agent?.phone
                        ? property.agent.phone
                        : null;

                      if (agentPhone) {
                        setShowAgentPhoneDialog(true);
                      } else {
                        // اگر شماره agent موجود نبود
                        alert('شماره تماس مشاور در دسترس نیست');
                      }
                    } else {
                      // اگر لاگین نبود، به صفحه login هدایت کن
                      router.push(`/login?from=${encodeURIComponent(`/properties/${slug}`)}`);
                    }
                  }}
                >
                  <Phone className="h-5 w-5" />
                  {isGoooyaProperty ? 'تماس با گویا' : 'تماس با مشاور'}
                </Button>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={handleVisitRequest}
                    disabled={isCreating || isCreatingBySlug}
                  >
                    {(isCreating || isCreatingBySlug) ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Calendar className="h-4 w-4" />
                    )}
                    {(isCreating || isCreatingBySlug) ? 'در حال ثبت...' : 'درخواست بازدید'}
                  </Button>

                  {isAuthenticated && (
                    <FavoriteButtonLarge
                      propertyId={property.id}
                      isFavorite={property.is_favorite}
                      className="w-full"
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* اطلاعات اضافی */}
            <Card className='my-2'>
              <CardHeader>
                <CardTitle className="text-sm">اطلاعات تکمیلی</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">شناسه ملک:</span>
                  <span className="font-mono">#{property.id}</span>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="text-muted-foreground">تاریخ ثبت:</span>
                  <span>
                    {new Date(property.created_at).toLocaleDateString('fa-IR')}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">آخرین به‌روزرسانی:</span>
                  <span>
                    {new Date(property.updated_at).toLocaleDateString('fa-IR')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div >

      {/* Dialog نمایش شماره تلفن agent */}
      < Dialog open={showAgentPhoneDialog} onOpenChange={setShowAgentPhoneDialog} >
        <DialogContent dir="rtl" className="text-right">
          <DialogHeader>
            <DialogTitle>{isGoooyaProperty ? 'شماره تماس گویا' : 'شماره تماس مشاور'}</DialogTitle>
            <DialogDescription>
              {isGoooyaProperty
                ? 'برای تماس با گویا، از شماره زیر استفاده کنید'
                : 'برای تماس با مشاور این ملک، از شماره زیر استفاده کنید'}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isGoooyaProperty || (typeof property.agent === 'object' && property.agent?.phone) ? (
              <div className="flex flex-col items-center gap-4">
                {/* اطلاعات مالک/مشاور */}
                {(isGoooyaProperty || (typeof property.agent === 'object' && property.agent?.full_name)) && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">
                      {isGoooyaProperty ? 'مالک' : 'مشاور'}
                    </p>
                    <p className="font-semibold">{isGoooyaProperty ? 'گویا' : (property as any).agent?.full_name}</p>
                  </div>
                )}

                {/* شماره تلفن */}
                <div className="text-3xl font-bold text-primary">
                  {isGoooyaProperty ? GOOOYA_CONTACT_PHONE_DISPLAY : (property as any).agent?.phone}
                </div>

                {/* شماره دفتر (اگر موجود باشد) */}
                {!isGoooyaProperty && typeof property.agent === 'object' && property.agent?.office_phone && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">دفتر</p>
                    <p className="font-medium">{property.agent.office_phone}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      const phoneToDial = isGoooyaProperty
                        ? GOOOYA_CONTACT_PHONE_TEL
                        : (typeof property.agent === 'object' ? property.agent?.phone : null);
                      if (phoneToDial) window.location.href = `tel:${phoneToDial}`;
                    }}
                    className="gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    تماس
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const phoneToCopy = isGoooyaProperty
                        ? GOOOYA_CONTACT_PHONE_TEL
                        : (typeof property.agent === 'object' ? property.agent?.phone : null);
                      if (phoneToCopy) {
                        navigator.clipboard.writeText(phoneToCopy);
                        alert('شماره تلفن کپی شد');
                      }
                    }}
                  >
                    کپی شماره
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                {isGoooyaProperty ? 'شماره تماس گویا در دسترس نیست' : 'شماره تماس مشاور در دسترس نیست'}
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog >
    </div >
  );
}

