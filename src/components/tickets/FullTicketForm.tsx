'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubmitFullTicket } from '@/hooks/useTickets';
import { usePropertyTypes, useCities, useLocations } from '@/hooks/usePropertyMutations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Send, CheckCircle } from 'lucide-react';
import ImageUploader from '@/components/forms/ImageUploader';
import {
  FullTicketPayload,
  normalizeMeasureValue,
  parseOptionalIntField,
} from '@/services/ticketService';
import { toast } from 'sonner';

interface FullTicketFormProps {
  onSuccess?: () => void;
}

/**
 * فرم ثبت تیکت کامل
 */
export default function FullTicketForm({ onSuccess }: FullTicketFormProps) {
  const { user, backendUser } = useAuth();
  const submitMutation = useSubmitFullTicket();
  
  // استفاده از اطلاعات کاربر لاگین‌شده (اگر موجود باشد)
  const userPhone = user?.phone || backendUser?.phone || '';
  const userName = backendUser?.name || user?.name || '';
  
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<Partial<FullTicketPayload>>({
    transaction_type: 'sale',
    rooms: 0,
    full_name: userName,
    phone: userPhone,
  });
  const [images, setImages] = useState<File[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  
  // دریافت داده‌ها از API
  const { data: propertyTypes, isLoading: loadingTypes } = usePropertyTypes();
  const { data: cities, isLoading: loadingCities } = useCities();
  const { data: locations, isLoading: loadingLocations } = useLocations(
    formData.city || undefined
  );

  const handleChange = (field: keyof FullTicketPayload, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast.error('لطفاً حداقل یک تصویر برای ملک آپلود کنید');
      return;
    }

    if (!formData.title?.trim() || !formData.property_type || !formData.city) {
      toast.error('عنوان، نوع ملک و شهر الزامی هستند');
      return;
    }

    const measureResult = normalizeMeasureValue(formData.measure);
    if (!measureResult.ok) {
      toast.error(measureResult.error);
      return;
    }
    
    // مطابق مستندات API: title, property_type, city, measure, transaction_type الزامی‌اند
    const payload: FullTicketPayload = {
      title: formData.title.trim(),
      property_type: formData.property_type,
      city: formData.city,
      measure: measureResult.value,
      transaction_type: formData.transaction_type || 'sale',
      location: formData.location,
      address: formData.address,
      rooms: parseOptionalIntField(formData.rooms) ?? 0,
      price: parseOptionalIntField(formData.price),
      mortgage: parseOptionalIntField(formData.mortgage),
      rent: parseOptionalIntField(formData.rent),
      description: formData.description,
      has_parking: formData.has_parking,
      has_storage: formData.has_storage,
      has_elevator: formData.has_elevator,
      has_balcony: formData.has_balcony,
      has_pool: formData.has_pool,
      has_security: formData.has_security,
      has_gas: formData.has_gas,
      has_electricity: formData.has_electricity,
      uploaded_images: images,
      main_image_index: mainImageIndex,
    };

    try {
      await submitMutation.mutateAsync(payload);
      setSubmitted(true);
      
      // Reset form و بستن modal بعد از 3 ثانیه
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ 
          transaction_type: 'sale', 
          rooms: 0,
          full_name: userName,
          phone: userPhone,
        });
        setImages([]);
        setMainImageIndex(0);
        onSuccess?.();
      }, 3000);
    } catch (error) {
      // خطا توسط mutation handle میشه
    }
  };

  if (submitted) {
    return (
      <Card dir="rtl">
        <CardContent className="pt-12 pb-12 text-center">
          <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">درخواست شما ثبت شد</h3>
          <p className="text-muted-foreground mb-4">
            درخواست شما به مشاور اختصاص یافته و به زودی با شما تماس خواهد گرفت
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 [&_input]:text-right [&_input]:dir-rtl [&_textarea]:text-right [&_textarea]:dir-rtl" dir="rtl">
      {/* اطلاعات تماس */}
      <Card dir="rtl">
        <CardHeader>
          <CardTitle>اطلاعات تماس</CardTitle>
          {user && (
            <CardDescription className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              اطلاعات شما از پروفایل کاربری بارگذاری شده است
            </CardDescription>
          )}
          {!user && (
            <CardDescription className="text-amber-600">
              برای تسهیل در ثبت آگهی، می‌توانید ابتدا وارد حساب کاربری خود شوید
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4 text-right">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">نام و نام خانوادگی *</Label>
              <Input
                id="full_name"
                value={formData.full_name || ''}
                onChange={(e) => handleChange('full_name', e.target.value)}
                placeholder="علی احمدی"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">شماره تماس *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="09123456789"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* اطلاعات پایه */}
      <Card dir="rtl">
        <CardHeader>
          <CardTitle>اطلاعات پایه</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-right">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="title">عنوان ملک *</Label>
              <Input
                id="title"
                value={formData.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="آپارتمان 120 متری در منطقه 1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="property_type">نوع ملک *</Label>
              <Select
                value={formData.property_type?.toString() || ''}
                onValueChange={(value) => handleChange('property_type', parseInt(value))}
              >
                <SelectTrigger id="property_type">
                  <SelectValue placeholder="انتخاب نوع ملک" />
                </SelectTrigger>
                <SelectContent>
                  {loadingTypes ? (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      در حال بارگذاری...
                    </div>
                  ) : propertyTypes && propertyTypes.length > 0 ? (
                    propertyTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.title}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      موردی یافت نشد
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">شهر *</Label>
              <Select
                value={formData.city?.toString() || ''}
                onValueChange={(value) => {
                  handleChange('city', parseInt(value));
                  // ریست کردن منطقه وقتی شهر عوض می‌شه
                  handleChange('location', undefined);
                }}
              >
                <SelectTrigger id="city">
                  <SelectValue placeholder="انتخاب شهر" />
                </SelectTrigger>
                <SelectContent>
                  {loadingCities ? (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      در حال بارگذاری...
                    </div>
                  ) : cities && cities.length > 0 ? (
                    cities.map((city) => (
                      <SelectItem key={city.id} value={city.id.toString()}>
                        {city.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      موردی یافت نشد
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">منطقه</Label>
              <Select
                value={formData.location?.toString() || ''}
                onValueChange={(value) => handleChange('location', parseInt(value))}
                disabled={!formData.city}
              >
                <SelectTrigger id="location">
                  <SelectValue placeholder={!formData.city ? "ابتدا شهر را انتخاب کنید" : "انتخاب منطقه"} />
                </SelectTrigger>
                <SelectContent>
                  {loadingLocations ? (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      در حال بارگذاری...
                    </div>
                  ) : locations && locations.length > 0 ? (
                    locations.map((location) => (
                      <SelectItem key={location.id} value={location.id.toString()}>
                        {location.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-center text-sm text-muted-foreground">
                      منطقه‌ای یافت نشد
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">آدرس کامل</Label>
              <Input
                id="address"
                value={formData.address || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="تهران، منطقه 1، خیابان ولیعصر"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="measure">متراژ (متر) *</Label>
              <Input
                id="measure"
                type="text"
                inputMode="decimal"
                value={
                  formData.measure === undefined || formData.measure === null
                    ? ''
                    : String(formData.measure)
                }
                onChange={(e) => {
                  const next = e.target.value.replace(/[^\d.]/g, '');
                  const dotCount = (next.match(/\./g) || []).length;
                  handleChange('measure', dotCount > 1 ? formData.measure ?? '' : next);
                }}
                placeholder="120"
                required
              />
              <p className="text-xs text-muted-foreground">
                متراژ ملک به متر (حداکثر ۸ رقم، مثلاً 120 یا 85.5)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rooms">تعداد خواب</Label>
              <Input
                id="rooms"
                type="number"
                min="0"
                value={formData.rooms ?? ''}
                onChange={(e) => {
                  const raw = e.target.value;
                  handleChange('rooms', raw === '' ? undefined : parseInt(raw, 10));
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* نوع معامله و قیمت */}
      <Card dir="rtl">
        <CardHeader>
          <CardTitle>قیمت و معامله</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-right">
          <div className="space-y-2">
            <Label>نوع معامله *</Label>
            <RadioGroup
              value={formData.transaction_type}
              onValueChange={(value) => handleChange('transaction_type', value)}
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="sale" id="sale" />
                <Label htmlFor="sale">فروش</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="rent" id="rent" />
                <Label htmlFor="rent">رهن/اجاره</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.transaction_type === 'sale' ? (
            <div className="space-y-2">
              <Label htmlFor="price">قیمت (تومان)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price ?? ''}
                onChange={(e) => {
                  const raw = e.target.value;
                  handleChange('price', raw === '' ? undefined : parseInt(raw, 10));
                }}
                placeholder="5000000000"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="mortgage">رهن (تومان)</Label>
                <Input
                  id="mortgage"
                  type="number"
                  value={formData.mortgage ?? ''}
                  onChange={(e) => {
                    const raw = e.target.value;
                    handleChange('mortgage', raw === '' ? undefined : parseInt(raw, 10));
                  }}
                  placeholder="500000000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rent">اجاره (تومان)</Label>
                <Input
                  id="rent"
                  type="number"
                  value={formData.rent ?? ''}
                  onChange={(e) => {
                    const raw = e.target.value;
                    handleChange('rent', raw === '' ? undefined : parseInt(raw, 10));
                  }}
                  placeholder="10000000"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* امکانات */}
      <Card dir="rtl">
        <CardHeader>
          <CardTitle>امکانات</CardTitle>
        </CardHeader>
        <CardContent className="text-right">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { key: 'has_parking', label: 'پارکینگ' },
              { key: 'has_storage', label: 'انباری' },
              { key: 'has_elevator', label: 'آسانسور' },
              { key: 'has_balcony', label: 'بالکن' },
              { key: 'has_pool', label: 'استخر' },
              { key: 'has_security', label: 'نگهبانی' },
              { key: 'has_gas', label: 'گاز' },
              { key: 'has_electricity', label: 'برق' },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2 space-x-reverse">
                <Checkbox
                  id={key}
                  checked={formData[key as keyof FullTicketPayload] as boolean || false}
                  onCheckedChange={(checked) => handleChange(key as keyof FullTicketPayload, checked)}
                />
                <Label htmlFor={key} className="cursor-pointer">{label}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* توضیحات */}
      <Card dir="rtl">
        <CardHeader>
          <CardTitle>توضیحات</CardTitle>
        </CardHeader>
        <CardContent className="text-right">
          <Textarea
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={5}
            placeholder="توضیحات کامل درباره ملک..."
            className="text-right"
            dir="rtl"
          />
        </CardContent>
      </Card>

      {/* تصاویر — پیش‌نمایش با data URL (سازگار با CSP، بدون blob:) */}
      <Card dir="rtl">
        <CardHeader>
          <CardTitle>تصاویر *</CardTitle>
          <CardDescription className="text-amber-600">
            آپلود حداقل یک تصویر الزامی است
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-right">
          <ImageUploader
            images={images}
            mainImageIndex={mainImageIndex}
            onChange={(nextImages, nextMain) => {
              setImages(nextImages);
              setMainImageIndex(nextMain);
            }}
            maxImages={10}
            required
          />
        </CardContent>
      </Card>

      {/* دکمه ارسال */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={submitMutation.isPending}
      >
        {submitMutation.isPending ? (
          <>
            <Loader2 className="w-5 h-5 ml-2 animate-spin" />
            در حال ارسال درخواست...
          </>
        ) : (
          <>
            <Send className="w-5 h-5 ml-2" />
            ارسال درخواست ثبت ملک
          </>
        )}
      </Button>
    </form>
  );
}

