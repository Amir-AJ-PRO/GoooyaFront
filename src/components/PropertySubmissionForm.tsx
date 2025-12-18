'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  MapPin, 
  Upload, 
  X, 
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Home
} from 'lucide-react';
import Image from 'next/image';

interface PropertyFormData {
  city: string;
  district: string;
  address: string;
  transactionType: 'sale' | 'rent' | 'mortgage' | '';
  propertyType: string;
  isExchange: boolean;
  isNegotiable: boolean;
  area: string;
  totalPrice: string;
  pricePerMeter: string;
  documentStatus: string;
  documentOwnership: string;
  documentType: string;
  introducerType: 'owner' | 'introducer' | '';
  ownerPhone: string;
  ownerName: string;
  introducerPhone: string;
  introducerName: string;
  description: string;
  images: File[];
  
  // اطلاعات تکمیلی (اختیاری)
  buildingAge?: string;
  totalFloors?: string;
  floor?: string;
  unitsPerFloor?: string;
  bedrooms?: string;
  bathrooms?: string;
  parkingSpaces?: string;
  storageRoom?: boolean;
  elevator?: boolean;
  balcony?: boolean;
  heatingSystem?: string;
  coolingSystem?: string;
  furnishing?: string;
  hasWifi?: boolean;
  hasSecuritySystem?: boolean;
  hasCCTV?: boolean;
  hasPool?: boolean;
  hasGym?: boolean;
  hasLobby?: boolean;
  hasSauna?: boolean;
  hasJacuzzi?: boolean;
  hasGarden?: boolean;
  additionalFeatures?: string;
}

const PROPERTY_TYPES = [
  { value: 'apartment', label: 'آپارتمان' },
  { value: 'house', label: 'خانه ویلایی' },
  { value: 'villa', label: 'ویلا' },
  { value: 'land', label: 'زمین' },
  { value: 'garden', label: 'باغ' },
  { value: 'commercial', label: 'تجاری' },
  { value: 'office', label: 'اداری' },
];

const CITIES = [
  'تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز', 'کرج', 'قم', 'اهواز'
];

const DOCUMENT_STATUS = [
  { value: 'has-document', label: 'دارای سند' },
  { value: 'in-process', label: 'در حال استخراج' },
  { value: 'no-document', label: 'بدون سند' },
];

const DOCUMENT_OWNERSHIP = [
  { value: 'personal', label: 'شخصی' },
  { value: 'cooperative', label: 'تعاونی' },
  { value: 'endowment', label: 'وقفی' },
];

const DOCUMENT_TYPE = [
  { value: 'ownership', label: 'ملکی' },
  { value: 'official', label: 'سند رسمی' },
  { value: 'six-dang', label: 'ششدانگ' },
  { value: 'contract', label: 'قولنامه‌ای' },
];

const HEATING_SYSTEMS = [
  { value: 'radiator', label: 'رادیاتور' },
  { value: 'floor', label: 'کف‌گرم' },
  { value: 'fan-coil', label: 'فن کویل' },
  { value: 'package', label: 'پکیج' },
  { value: 'split', label: 'اسپلیت' },
  { value: 'none', label: 'ندارد' },
];

const COOLING_SYSTEMS = [
  { value: 'split', label: 'کولر اسپلیت' },
  { value: 'duct', label: 'داکت اسپلیت' },
  { value: 'chiller', label: 'چیلر' },
  { value: 'evaporative', label: 'کولر آبی' },
  { value: 'fan-coil', label: 'فن کویل' },
  { value: 'none', label: 'ندارد' },
];

const FURNISHING_OPTIONS = [
  { value: 'fully', label: 'کامل' },
  { value: 'partial', label: 'نیمه' },
  { value: 'none', label: 'بدون مبلمان' },
];

interface PropertySubmissionFormProps {
  onSuccess?: () => void;
}

export default function PropertySubmissionForm({ onSuccess }: PropertySubmissionFormProps) {
  const router = useRouter();
  const { user, backendUser } = useAuth();
  
  // استفاده از اطلاعات کاربر لاگین‌شده (اگر موجود باشد)
  const userPhone = user?.phone || backendUser?.phone || '';
  const userName = backendUser?.name || user?.name || '';
  
  const [currentStep, setCurrentStep] = useState(1); // 1 or 2
  const [formData, setFormData] = useState<PropertyFormData>({
    city: '',
    district: '',
    address: '',
    transactionType: '',
    propertyType: '',
    isExchange: false,
    isNegotiable: false,
    area: '',
    totalPrice: '',
    pricePerMeter: '',
    documentStatus: '',
    documentOwnership: '',
    documentType: '',
    introducerType: '',
    ownerPhone: userPhone,
    ownerName: userName,
    introducerPhone: '',
    introducerName: '',
    description: '',
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // محاسبه خودکار قیمت به متر
  useEffect(() => {
    if (formData.totalPrice && formData.area && !formData.isNegotiable && !formData.isExchange) {
      const total = parseFloat(formData.totalPrice.replace(/,/g, ''));
      const area = parseFloat(formData.area);
      if (!isNaN(total) && !isNaN(area) && area > 0) {
        const pricePerMeter = Math.round(total / area);
        setFormData(prev => ({
          ...prev,
          pricePerMeter: pricePerMeter.toLocaleString('en-US')
        }));
      }
    }
  }, [formData.totalPrice, formData.area, formData.isNegotiable, formData.isExchange]);

  const handleInputChange = (field: keyof PropertyFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (formData.images.length + files.length > 5) {
      toast.error('حداکثر 5 عکس می‌توانید آپلود کنید');
      return;
    }

    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('حجم هر عکس باید کمتر از 5 مگابایت باشد');
      return;
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 5)
    }));

    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string].slice(0, 5));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.city) newErrors.city = 'انتخاب شهر الزامی است';
    if (!formData.district) newErrors.district = 'وارد کردن منطقه الزامی است';
    if (!formData.transactionType) newErrors.transactionType = 'انتخاب نوع معامله الزامی است';
    if (!formData.propertyType) newErrors.propertyType = 'انتخاب نوع ملک الزامی است';
    if (!formData.area) newErrors.area = 'وارد کردن متراژ الزامی است';
    if (!formData.isNegotiable && !formData.isExchange && !formData.totalPrice) {
      newErrors.totalPrice = 'وارد کردن قیمت الزامی است';
    }
    if (!formData.documentStatus) newErrors.documentStatus = 'انتخاب وضعیت سند الزامی است';
    if (!formData.documentOwnership) newErrors.documentOwnership = 'انتخاب مالکیت سند الزامی است';
    if (!formData.documentType) newErrors.documentType = 'انتخاب نوع سند الزامی است';
    if (!formData.introducerType) newErrors.introducerType = 'انتخاب طریقه معرفی الزامی است';
    if (!formData.ownerPhone) newErrors.ownerPhone = 'وارد کردن شماره مالک الزامی است';
    if (!formData.ownerName) newErrors.ownerName = 'وارد کردن نام مالک الزامی است';
    
    if (formData.introducerType === 'introducer') {
      if (!formData.introducerPhone) newErrors.introducerPhone = 'وارد کردن شماره معرف الزامی است';
      if (!formData.introducerName) newErrors.introducerName = 'وارد کردن نام معرف الزامی است';
    }
    
    if (!formData.address) newErrors.address = 'وارد کردن آدرس الزامی است';
    if (formData.images.length === 0) newErrors.images = 'آپلود حداقل یک عکس الزامی است';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep1()) {
      toast.error('لطفا تمام فیلدهای الزامی را پر کنید');
      return;
    }

    const isLandOrGarden = formData.propertyType === 'land' || formData.propertyType === 'garden';

    if (isLandOrGarden) {
      submitProperty();
    } else {
      setCurrentStep(2);
    }
  };

  const submitProperty = async () => {
    setIsSubmitting(true);
    try {
      // TODO: ارسال به APItoast.success('ملک شما با موفقیت ثبت شد و در انتظار تایید کارشناسان است');
      
      // Reset form
      setFormData({
        city: '',
        district: '',
        address: '',
        transactionType: '',
        propertyType: '',
        isExchange: false,
        isNegotiable: false,
        area: '',
        totalPrice: '',
        pricePerMeter: '',
        documentStatus: '',
        documentOwnership: '',
        documentType: '',
        introducerType: '',
        ownerPhone: userPhone,
        ownerName: userName,
        introducerPhone: '',
        introducerName: '',
        description: '',
        images: [],
      });
      setImagePreviews([]);
      setCurrentStep(1);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error('خطایی در ثبت ملک رخ داد. لطفا دوباره تلاش کنید');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPriceDisabled = formData.isNegotiable || formData.isExchange;

  if (currentStep === 2) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">اطلاعات تکمیلی ملک</h3>
            <p className="text-sm text-muted-foreground">مشخصات دقیق‌تر ملک را وارد کنید (اختیاری)</p>
          </div>
          <Button variant="outline" onClick={() => setCurrentStep(1)}>
            بازگشت
          </Button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); submitProperty(); }} className="space-y-6">
          {/* مشخصات ساختمان */}
          <Card>
            <CardHeader>
              <CardTitle>مشخصات ساختمان</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>سن بنا (سال)</Label>
                  <Input type="number" value={formData.buildingAge || ''} onChange={(e) => handleInputChange('buildingAge', e.target.value)} placeholder="5" />
                </div>
                <div>
                  <Label>تعداد طبقات</Label>
                  <Input type="number" value={formData.totalFloors || ''} onChange={(e) => handleInputChange('totalFloors', e.target.value)} placeholder="4" />
                </div>
                <div>
                  <Label>طبقه واحد</Label>
                  <Input type="number" value={formData.floor || ''} onChange={(e) => handleInputChange('floor', e.target.value)} placeholder="2" />
                </div>
                <div>
                  <Label>تعداد واحد در طبقه</Label>
                  <Input type="number" value={formData.unitsPerFloor || ''} onChange={(e) => handleInputChange('unitsPerFloor', e.target.value)} placeholder="2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* اتاق‌ها */}
          <Card>
            <CardHeader>
              <CardTitle>اتاق‌ها و فضاها</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>تعداد اتاق خواب</Label>
                  <Input type="number" value={formData.bedrooms || ''} onChange={(e) => handleInputChange('bedrooms', e.target.value)} placeholder="2" />
                </div>
                <div>
                  <Label>تعداد سرویس</Label>
                  <Input type="number" value={formData.bathrooms || ''} onChange={(e) => handleInputChange('bathrooms', e.target.value)} placeholder="1" />
                </div>
                <div>
                  <Label>تعداد پارکینگ</Label>
                  <Input type="number" value={formData.parkingSpaces || ''} onChange={(e) => handleInputChange('parkingSpaces', e.target.value)} placeholder="1" />
                </div>
              </div>
              <div className="flex gap-4 flex-wrap">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox checked={formData.storageRoom || false} onCheckedChange={(c) => handleInputChange('storageRoom', c as boolean)} id="storageRoom" />
                  <Label htmlFor="storageRoom" className="cursor-pointer">انباری</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox checked={formData.elevator || false} onCheckedChange={(c) => handleInputChange('elevator', c as boolean)} id="elevator" />
                  <Label htmlFor="elevator" className="cursor-pointer">آسانسور</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Checkbox checked={formData.balcony || false} onCheckedChange={(c) => handleInputChange('balcony', c as boolean)} id="balcony" />
                  <Label htmlFor="balcony" className="cursor-pointer">بالکن</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* سیستم‌ها */}
          <Card>
            <CardHeader>
              <CardTitle>سیستم‌های گرمایش و سرمایش</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>سیستم گرمایش</Label>
                  <Select value={formData.heatingSystem || ''} onValueChange={(v) => handleInputChange('heatingSystem', v)}>
                    <SelectTrigger><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                    <SelectContent>
                      {HEATING_SYSTEMS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>سیستم سرمایش</Label>
                  <Select value={formData.coolingSystem || ''} onValueChange={(v) => handleInputChange('coolingSystem', v)}>
                    <SelectTrigger><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                    <SelectContent>
                      {COOLING_SYSTEMS.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* امکانات */}
          <Card>
            <CardHeader>
              <CardTitle>امکانات رفاهی</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { key: 'hasWifi', label: 'اینترنت' },
                  { key: 'hasSecuritySystem', label: 'سیستم امنیتی' },
                  { key: 'hasCCTV', label: 'دوربین' },
                  { key: 'hasPool', label: 'استخر' },
                  { key: 'hasGym', label: 'باشگاه' },
                  { key: 'hasLobby', label: 'لابی' },
                  { key: 'hasSauna', label: 'سونا' },
                  { key: 'hasJacuzzi', label: 'جکوزی' },
                  { key: 'hasGarden', label: 'باغچه' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox 
                      id={key}
                      checked={(formData as any)[key] || false} 
                      onCheckedChange={(c) => handleInputChange(key as any, c as boolean)} 
                    />
                    <Label htmlFor={key} className="cursor-pointer">{label}</Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => setCurrentStep(1)}>بازگشت</Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'در حال ثبت...' : 'ثبت نهایی ملک'}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // Step 1 - اطلاعات اجباری
  return (
    <form onSubmit={handleStep1Submit} className="space-y-6">
      {/* هشدار */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">توجه</h4>
              <p className="text-sm text-blue-800">
                ملک شما پس از ثبت توسط کارشناسان بررسی و تایید می‌شود (معمولاً تا 24 ساعت).
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* اطلاعات مکانی */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            اطلاعات مکانی
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>شهر *</Label>
              <Select value={formData.city} onValueChange={(v) => handleInputChange('city', v)}>
                <SelectTrigger className={errors.city ? 'border-red-500' : ''}><SelectValue placeholder="انتخاب شهر" /></SelectTrigger>
                <SelectContent>{CITIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
            </div>
            <div>
              <Label>منطقه *</Label>
              <Input value={formData.district} onChange={(e) => handleInputChange('district', e.target.value)} placeholder="منطقه 1" className={errors.district ? 'border-red-500' : ''} />
              {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district}</p>}
            </div>
          </div>
          <div>
            <Label>آدرس کامل *</Label>
            <Textarea value={formData.address} onChange={(e) => handleInputChange('address', e.target.value)} placeholder="آدرس دقیق" rows={2} className={errors.address ? 'border-red-500' : ''} />
            {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
          </div>
        </CardContent>
      </Card>

      {/* اطلاعات معامله */}
      <Card>
        <CardHeader><CardTitle>اطلاعات معامله</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>نوع معامله *</Label>
              <Select value={formData.transactionType} onValueChange={(v: any) => handleInputChange('transactionType', v)}>
                <SelectTrigger className={errors.transactionType ? 'border-red-500' : ''}><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">فروش</SelectItem>
                  <SelectItem value="rent">اجاره</SelectItem>
                  <SelectItem value="mortgage">رهن و اجاره</SelectItem>
                </SelectContent>
              </Select>
              {errors.transactionType && <p className="text-xs text-red-500 mt-1">{errors.transactionType}</p>}
            </div>
            <div>
              <Label>نوع ملک *</Label>
              <Select value={formData.propertyType} onValueChange={(v) => handleInputChange('propertyType', v)}>
                <SelectTrigger className={errors.propertyType ? 'border-red-500' : ''}><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                <SelectContent>{PROPERTY_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
              </Select>
              {errors.propertyType && <p className="text-xs text-red-500 mt-1">{errors.propertyType}</p>}
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox id="isExchange" checked={formData.isExchange} onCheckedChange={(c) => handleInputChange('isExchange', c as boolean)} />
              <Label htmlFor="isExchange" className="cursor-pointer">معاوضه</Label>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox id="isNegotiable" checked={formData.isNegotiable} onCheckedChange={(c) => handleInputChange('isNegotiable', c as boolean)} />
              <Label htmlFor="isNegotiable" className="cursor-pointer">قیمت توافقی</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* اطلاعات مالی */}
      <Card>
        <CardHeader><CardTitle>اطلاعات مالی و متراژ</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>متراژ (متر) *</Label>
              <Input type="number" value={formData.area} onChange={(e) => handleInputChange('area', e.target.value)} placeholder="120" className={errors.area ? 'border-red-500' : ''} />
              {errors.area && <p className="text-xs text-red-500 mt-1">{errors.area}</p>}
            </div>
            <div>
              <Label>قیمت کل (تومان) {isPriceDisabled ? '' : '*'}</Label>
              <Input 
                type="text" 
                value={formData.totalPrice} 
                onChange={(e) => {
                  const v = e.target.value.replace(/,/g, '');
                  if (/^\d*$/.test(v)) handleInputChange('totalPrice', parseInt(v || '0').toLocaleString('en-US'));
                }} 
                placeholder="800000000" 
                disabled={isPriceDisabled} 
                className={errors.totalPrice ? 'border-red-500' : ''} 
              />
              {errors.totalPrice && <p className="text-xs text-red-500 mt-1">{errors.totalPrice}</p>}
            </div>
            <div>
              <Label>قیمت به متر</Label>
              <Input type="text" value={formData.pricePerMeter} disabled placeholder="محاسبه خودکار" className="bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* اطلاعات سند */}
      <Card>
        <CardHeader><CardTitle>اطلاعات سند</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>وضعیت سند *</Label>
              <Select value={formData.documentStatus} onValueChange={(v) => handleInputChange('documentStatus', v)}>
                <SelectTrigger className={errors.documentStatus ? 'border-red-500' : ''}><SelectValue placeholder="انتخاب" /></SelectTrigger>
                <SelectContent>{DOCUMENT_STATUS.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
              </Select>
              {errors.documentStatus && <p className="text-xs text-red-500 mt-1">{errors.documentStatus}</p>}
            </div>
            <div>
              <Label>مالکیت سند *</Label>
              <Select value={formData.documentOwnership} onValueChange={(v) => handleInputChange('documentOwnership', v)}>
                <SelectTrigger className={errors.documentOwnership ? 'border-red-500' : ''}><SelectValue placeholder="انتخاب" /></SelectTrigger>
                <SelectContent>{DOCUMENT_OWNERSHIP.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
              </Select>
              {errors.documentOwnership && <p className="text-xs text-red-500 mt-1">{errors.documentOwnership}</p>}
            </div>
            <div>
              <Label>نوع سند *</Label>
              <Select value={formData.documentType} onValueChange={(v) => handleInputChange('documentType', v)}>
                <SelectTrigger className={errors.documentType ? 'border-red-500' : ''}><SelectValue placeholder="انتخاب" /></SelectTrigger>
                <SelectContent>{DOCUMENT_TYPE.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent>
              </Select>
              {errors.documentType && <p className="text-xs text-red-500 mt-1">{errors.documentType}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* اطلاعات مالک */}
      <Card>
        <CardHeader>
          <CardTitle>اطلاعات مالک</CardTitle>
          {user && (
            <CardDescription className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              اطلاعات شما از پروفایل کاربری بارگذاری شده است
            </CardDescription>
          )}
          {!user && (
            <CardDescription className="text-amber-600">
              برای تسهیل در ثبت آگهی، می‌توانید ابتدا وارد حساب کاربری خود شوید
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>طریقه معرفی *</Label>
            <Select value={formData.introducerType} onValueChange={(v: any) => handleInputChange('introducerType', v)}>
              <SelectTrigger className={errors.introducerType ? 'border-red-500' : ''}><SelectValue placeholder="انتخاب" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">مالک هستم</SelectItem>
                <SelectItem value="introducer">معرف هستم</SelectItem>
              </SelectContent>
            </Select>
            {errors.introducerType && <p className="text-xs text-red-500 mt-1">{errors.introducerType}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>نام و نام خانوادگی مالک *</Label>
              <Input 
                value={formData.ownerName} 
                onChange={(e) => handleInputChange('ownerName', e.target.value)} 
                placeholder="نام و نام خانوادگی" 
                className={errors.ownerName ? 'border-red-500' : ''}
              />
              {errors.ownerName && <p className="text-xs text-red-500 mt-1">{errors.ownerName}</p>}
            </div>
            <div>
              <Label>شماره تماس مالک *</Label>
              <Input 
                type="tel" 
                value={formData.ownerPhone} 
                onChange={(e) => handleInputChange('ownerPhone', e.target.value)} 
                placeholder="09123456789" 
                className={errors.ownerPhone ? 'border-red-500' : ''}
              />
              {errors.ownerPhone && <p className="text-xs text-red-500 mt-1">{errors.ownerPhone}</p>}
            </div>
          </div>
          {formData.introducerType === 'introducer' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-primary/5 rounded-lg">
              <div>
                <Label>نام معرف *</Label>
                <Input value={formData.introducerName} onChange={(e) => handleInputChange('introducerName', e.target.value)} placeholder="نام شما" className={errors.introducerName ? 'border-red-500' : ''} />
                {errors.introducerName && <p className="text-xs text-red-500 mt-1">{errors.introducerName}</p>}
              </div>
              <div>
                <Label>شماره معرف *</Label>
                <Input type="tel" value={formData.introducerPhone} onChange={(e) => handleInputChange('introducerPhone', e.target.value)} placeholder="09123456789" className={errors.introducerPhone ? 'border-red-500' : ''} />
                {errors.introducerPhone && <p className="text-xs text-red-500 mt-1">{errors.introducerPhone}</p>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* توضیحات و عکس */}
      <Card>
        <CardHeader><CardTitle>توضیحات و تصاویر</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>توضیحات</Label>
            <Textarea value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} placeholder="توضیحات اضافی..." rows={3} />
          </div>
          <div>
            <Label>تصاویر (حداکثر 5) *</Label>
            <label htmlFor="images" className="cursor-pointer block mt-2">
              <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors ${errors.images ? 'border-red-500' : ''}`}>
                <ImageIcon className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">کلیک کنید تا عکس انتخاب کنید</p>
              </div>
              <input id="images" type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
            </label>
            {errors.images && <p className="text-xs text-red-500 mt-1">{errors.images}</p>}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-4">
                {imagePreviews.map((preview, i) => (
                  <div key={i} className="relative group">
                    <div className="relative h-20 rounded border overflow-hidden">
                      <Image src={preview} alt={`پیش‌نمایش ${i + 1}`} fill className="object-cover" />
                    </div>
                    <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">
                      <X className="h-3 w-3" />
                    </button>
                    {i === 0 && <Badge className="absolute bottom-1 left-1 text-xs">اصلی</Badge>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {formData.propertyType === 'land' || formData.propertyType === 'garden' ? (
          <>
            <CheckCircle2 className="h-5 w-5 ml-2" />
            {isSubmitting ? 'در حال ثبت...' : 'ثبت نهایی ملک'}
          </>
        ) : (
          <>مرحله بعد: اطلاعات تکمیلی</>
        )}
      </Button>
    </form>
  );
}

