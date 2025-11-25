'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useAdviserTicketDetail, useReviewTicket } from '@/hooks/useTicketAdviser';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
import { Loader2, CheckCircle, XCircle, ArrowRight, MapPin, Home, Bed, Maximize, ShieldAlert, Image as ImageIcon, Star, Eye } from 'lucide-react';
import { formatPrice, formatDate, getMediaUrl } from '@/lib/utils';
import Image from 'next/image';

/**
 * صفحه جزئیات و بررسی تیکت
 */
export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = parseInt(params.id as string);
  
  const { backendUser, isLoading: authLoading } = useAuth();
  const { data: ticket, isLoading } = useAdviserTicketDetail(ticketId);
  const reviewMutation = useReviewTicket();
  
  const [agentNotes, setAgentNotes] = useState('');
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  
  // بررسی دسترسی
  const isGooyaAdviser = backendUser?.agent_profile?.is_goooya_adviser === true;
  
  useEffect(() => {
    if (!authLoading && !isGooyaAdviser) {
      router.replace('/admin');
    }
  }, [authLoading, isGooyaAdviser, router]);

  /**
   * تایید تیکت و ایجاد ملک
   * مطابق API: PATCH /api/tickets/adviser/<ticket_id>/review/
   * با action: "approve"
   */
  const handleApprove = async () => {
    try {
      await reviewMutation.mutateAsync({
        ticketId,
        payload: {
          action: 'approve',
          agent_notes: agentNotes.trim() || undefined,
        },
      });
      
      // بستن دیالوگ
      setShowApproveDialog(false);
      
      // بازگشت به لیست تیکت‌ها
      setTimeout(() => {
        router.push('/admin/tickets');
      }, 1000);
    } catch (error) {
      // خطا در hook مدیریت می‌شود
      setShowApproveDialog(false);
    }
  };

  /**
   * رد تیکت
   * مطابق API: PATCH /api/tickets/adviser/<ticket_id>/review/
   * با action: "reject"
   */
  const handleReject = async () => {
    try {
      await reviewMutation.mutateAsync({
        ticketId,
        payload: {
          action: 'reject',
          agent_notes: agentNotes.trim() || undefined,
        },
      });
      
      // بستن دیالوگ
      setShowRejectDialog(false);
      
      // بازگشت به لیست تیکت‌ها
      setTimeout(() => {
        router.push('/admin/tickets');
      }, 1000);
    } catch (error) {
      // خطا در hook مدیریت می‌شود
      setShowRejectDialog(false);
    }
  };

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

  if (!ticket) {
    return (
      <div className="container mx-auto py-8 px-4 text-center" dir="rtl">
        <h1 className="text-2xl font-bold mb-4">تیکت یافت نشد</h1>
        <Button onClick={() => router.push('/admin/tickets')}>
          بازگشت به لیست
        </Button>
      </div>
    );
  }

  const canReview = ticket.status === 'assigned' || ticket.status === 'reviewing';

  return (
    <div className="container mx-auto py-8 px-4">
      {/* هدر */}
      <div className="flex items-center justify-between mb-6" dir="rtl">
        <div>
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/tickets')}
            className="mb-2"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            بازگشت به لیست
          </Button>
          <h1 className="text-3xl font-bold">{ticket.title}</h1>
          <p className="text-muted-foreground mt-1">
            تاریخ ثبت: {formatDate(ticket.created_at)}
          </p>
        </div>
        <Badge className={ticket.status === 'assigned' ? 'bg-blue-500' : 'bg-gray-500'}>
          {ticket.status === 'assigned' ? 'اختصاص یافته' : ticket.status}
        </Badge>
      </div>

      {/* تصاویر ملک - بخش اصلی و برجسته */}
      {ticket.images && ticket.images.length > 0 ? (
        <Card className="mb-6 border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-white" dir="rtl">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-b-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <ImageIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">📸 تصاویر ملک</CardTitle>
                  <p className="text-blue-100 text-sm mt-1">
                    لطفاً تمام تصاویر را بررسی کنید
                  </p>
                </div>
              </div>
              <Badge className="bg-white text-blue-600 text-lg px-4 py-2 shadow-lg">
                {ticket.images.length} عکس
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-8 pb-8">
            {/* تصویر اصلی - بزرگ */}
            {ticket.images.find(img => img.is_main) && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                  <h3 className="text-lg font-bold">تصویر اصلی</h3>
                </div>
                <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
                  <Image
                    src={getMediaUrl(ticket.images.find(img => img.is_main)!.image)}
                    alt="تصویر اصلی ملک"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <Badge className="absolute top-4 right-4 bg-yellow-500 text-white shadow-lg px-4 py-2">
                    <Star className="w-4 h-4 ml-1 fill-white" />
                    تصویر شاخص
                  </Badge>
                </div>
              </div>
            )}

            {/* سایر تصاویر */}
            {ticket.images.filter(img => !img.is_main).length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon className="h-5 w-5 text-gray-700" />
                  <h3 className="text-lg font-bold">سایر تصاویر ({ticket.images.filter(img => !img.is_main).length} عکس)</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {ticket.images.filter(img => !img.is_main).map((image, index) => (
                    <div key={image.id} className="relative group">
                      <div className="relative w-full h-72 rounded-xl overflow-hidden shadow-lg border-2 border-gray-100">
                        <Image
                          src={getMediaUrl(image.image)}
                          alt={`تصویر ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                              <Eye className="h-6 w-6 text-gray-800" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <Badge className="w-full justify-center bg-white/95 text-gray-800 backdrop-blur-sm shadow-lg py-2">
                          عکس {index + 1}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* پیام هشدار برای مشاور */}
            <div className="mt-6 p-4 bg-blue-50 border-r-4 border-blue-500 rounded-lg">
              <div className="flex items-start gap-3">
                <ImageIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-blue-900">نکته مهم:</p>
                  <p className="text-sm text-blue-700 mt-1">
                    لطفاً تمام تصاویر را به دقت بررسی کنید و از کیفیت و صحت اطلاعات آن‌ها اطمینان حاصل نمایید.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6 border-0 shadow-lg bg-yellow-50 border-l-4 border-yellow-500" dir="rtl">
          <CardContent className="pt-6 pb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <ImageIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-yellow-900">⚠️ عکسی یافت نشد</h3>
                <p className="text-yellow-700 text-sm mt-1">
                  کاربر هیچ تصویری برای این ملک آپلود نکرده است.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" dir="rtl">
        {/* اطلاعات اصلی */}
        <div className="lg:col-span-2 space-y-6">

          {/* اطلاعات پایه */}
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات پایه</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">نوع ملک</p>
                    <p className="font-medium">{ticket.property_type_title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">شهر</p>
                    <p className="font-medium">{ticket.city_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Maximize className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">متراژ</p>
                    <p className="font-medium">{ticket.measure} متر</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">تعداد خواب</p>
                    <p className="font-medium">{ticket.rooms}</p>
                  </div>
                </div>
              </div>

              {ticket.location_name && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">منطقه</p>
                  <p className="font-medium">{ticket.location_name}</p>
                </div>
              )}

              {ticket.address && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">آدرس</p>
                  <p className="font-medium">{ticket.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* قیمت */}
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات مالی</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">نوع معامله:</span>
                  <Badge variant="outline">
                    {ticket.transaction_type === 'sale' ? 'فروش' : 'رهن و اجاره'}
                  </Badge>
                </div>

                {ticket.price && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">قیمت:</span>
                    <span className="font-bold text-green-600 text-lg">
                      {formatPrice(ticket.price)}
                    </span>
                  </div>
                )}

                {ticket.mortgage && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">رهن:</span>
                    <span className="font-medium">{formatPrice(ticket.mortgage)}</span>
                  </div>
                )}

                {ticket.rent && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">اجاره:</span>
                    <span className="font-medium">{formatPrice(ticket.rent)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* امکانات */}
          {(ticket.has_parking || ticket.has_storage || ticket.has_elevator || 
            ticket.has_balcony || ticket.has_pool || ticket.has_security || 
            ticket.has_gas || ticket.has_electricity) && (
            <Card>
              <CardHeader>
                <CardTitle>امکانات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {ticket.has_parking && <Badge variant="secondary">پارکینگ</Badge>}
                  {ticket.has_storage && <Badge variant="secondary">انباری</Badge>}
                  {ticket.has_elevator && <Badge variant="secondary">آسانسور</Badge>}
                  {ticket.has_balcony && <Badge variant="secondary">بالکن</Badge>}
                  {ticket.has_pool && <Badge variant="secondary">استخر</Badge>}
                  {ticket.has_security && <Badge variant="secondary">نگهبانی</Badge>}
                  {ticket.has_gas && <Badge variant="secondary">گاز</Badge>}
                  {ticket.has_electricity && <Badge variant="secondary">برق</Badge>}
                </div>
              </CardContent>
            </Card>
          )}

          {/* توضیحات */}
          {ticket.description && (
            <Card>
              <CardHeader>
                <CardTitle>توضیحات</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-right leading-relaxed whitespace-pre-wrap">
                  {ticket.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* اطلاعات تماس و بررسی */}
        <div className="space-y-6">
          {/* اطلاعات کاربر */}
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات کاربر</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {ticket.user_phone && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">شماره تماس</p>
                  <p className="font-mono font-medium text-lg">{ticket.user_phone}</p>
                </div>
              )}
              {ticket.assigned_at && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">تاریخ اختصاص</p>
                  <p className="text-sm">{formatDate(ticket.assigned_at)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* بررسی تیکت */}
          {canReview && (
            <Card className="border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-b-0">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                    <ShieldAlert className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">🔍 بررسی و تصمیم‌گیری</CardTitle>
                    <p className="text-blue-100 text-sm mt-1">
                      لطفاً با دقت بررسی کنید و تصمیم نهایی را بگیرید
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="notes" className="text-base font-semibold flex items-center gap-2">
                    📝 یادداشت مشاور (اختیاری)
                  </Label>
                  <Textarea
                    id="notes"
                    value={agentNotes}
                    onChange={(e) => setAgentNotes(e.target.value)}
                    placeholder="توضیحات خود درباره این تیکت را وارد کنید... (مثلاً: ملک در شرایط خوبی است / اطلاعات ناقص است)"
                    rows={4}
                    className="text-right border-2 focus:border-blue-500 transition-all"
                    dir="rtl"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    size="lg"
                    className="w-full gap-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 h-14 text-base font-bold"
                    onClick={() => setShowApproveDialog(true)}
                    disabled={reviewMutation.isPending}
                  >
                    {reviewMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        ✅ تایید و انتشار ملک
                      </>
                    )}
                  </Button>

                  <Button
                    size="lg"
                    variant="destructive"
                    className="w-full gap-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 h-14 text-base font-bold"
                    onClick={() => setShowRejectDialog(true)}
                    disabled={reviewMutation.isPending}
                  >
                    {reviewMutation.isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <XCircle className="w-5 h-5" />
                        ❌ رد تیکت
                      </>
                    )}
                  </Button>
                </div>

                {/* راهنما */}
                <div className="bg-blue-50 border-r-4 border-blue-500 rounded-lg p-4">
                  <p className="text-blue-800 text-sm leading-relaxed">
                    <span className="font-bold">💡 نکته:</span> در صورت تایید، ملک به صورت خودکار در سیستم ایجاد و منتشر می‌شود. در صورت رد، تیکت بسته می‌شود و کاربر می‌تواند تیکت جدیدی ایجاد کند.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* یادداشت قبلی */}
          {ticket.agent_notes && (
            <Card>
              <CardHeader>
                <CardTitle>یادداشت مشاور</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-right leading-relaxed">
                  {ticket.agent_notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* دیالوگ تایید */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent dir="rtl" className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <AlertDialogTitle className="text-2xl">✅ تایید و انتشار تیکت</AlertDialogTitle>
            </div>
            <AlertDialogDescription asChild className="text-right text-base leading-relaxed">
              <div className="space-y-3">
                <div className="font-semibold text-gray-700">
                  آیا مطمئن هستید که می‌خواهید این تیکت را تایید کنید؟
                </div>
                <div className="bg-green-50 border-r-4 border-green-500 p-3 rounded">
                  <div className="text-green-800 text-sm">
                    <strong>توجه:</strong> پس از تایید، ملک به صورت خودکار در سیستم ایجاد و منتشر می‌شود.
                  </div>
                </div>
                {agentNotes && (
                  <div className="bg-gray-50 p-3 rounded border">
                    <div className="text-xs text-gray-500 mb-1">یادداشت شما:</div>
                    <div className="text-sm text-gray-700">{agentNotes}</div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="text-base">❌ لغو</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleApprove}
              disabled={reviewMutation.isPending}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-base gap-2"
            >
              {reviewMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  در حال انتشار...
                </>
              ) : (
                '✅ تایید و انتشار'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* دیالوگ رد */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent dir="rtl" className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <AlertDialogTitle className="text-2xl">❌ رد تیکت</AlertDialogTitle>
            </div>
            <AlertDialogDescription asChild className="text-right text-base leading-relaxed">
              <div className="space-y-3">
                <div className="font-semibold text-gray-700">
                  آیا مطمئن هستید که می‌خواهید این تیکت را رد کنید؟
                </div>
                <div className="bg-red-50 border-r-4 border-red-500 p-3 rounded">
                  <div className="text-red-800 text-sm">
                    <strong>توجه:</strong> این عملیات قابل بازگشت نیست. تیکت بسته شده و کاربر باید تیکت جدیدی ایجاد کند.
                  </div>
                </div>
                {agentNotes && (
                  <div className="bg-gray-50 p-3 rounded border">
                    <div className="text-xs text-gray-500 mb-1">دلیل رد:</div>
                    <div className="text-sm text-gray-700">{agentNotes}</div>
                  </div>
                )}
                {!agentNotes && (
                  <div className="bg-yellow-50 border-r-4 border-yellow-500 p-3 rounded">
                    <div className="text-yellow-800 text-sm">
                      <strong>توصیه:</strong> بهتر است در قسمت "یادداشت مشاور" دلیل رد را ذکر کنید.
                    </div>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="text-base">🔙 بازگشت</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={reviewMutation.isPending}
              className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-base gap-2"
            >
              {reviewMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  در حال رد...
                </>
              ) : (
                '❌ رد تیکت'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

