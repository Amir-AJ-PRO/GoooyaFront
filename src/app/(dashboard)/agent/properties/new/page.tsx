'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowRight, 
  ArrowLeft, 
  Save, 
  Loader2, 
  Home,
  Building2,
  MapPin,
  DollarSign,
  Image as ImageIcon,
  FileText,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import ImageUploader from '@/components/forms/ImageUploader';
import RichTextEditor from '@/components/forms/RichTextEditor';
import { 
  useCreateProperty, 
  usePropertyTypes, 
  useCities, 
  useLocations 
} from '@/hooks/usePropertyMutations';
import { generateSlug } from '@/services/propertyApi';
import { TransactionType, CreatePropertyPayload } from '@/types/property';
import { amountToWords } from '@/lib/numberToWords';
import { toast } from 'sonner';

export default function NewPropertyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: اطلاعات اصلی (اجباری)
  const [step1Data, setStep1Data] = useState({
    title: '',
    slug: '',
    property_type: 0,
    city: 0,
    location: 0, // منطقه حالا در step1 است
    measure: '',
    transaction_type: 'sale' as TransactionType,
    price: '',
    mortgage: '',
    rent: '',
    is_negotiable: false, // قیمت توافقی
    description: '', // توضیحات حالا اجباری است
    uploaded_images: [] as File[],
    main_image_index: -1,
  });
  
  // Step 2: اطلاعات تکمیلی و امکانات (اختیاری)
  const [step2Data, setStep2Data] = useState({
    rooms: 0, // تعداد خواب حالا در step2 است (اختیاری)
    address: '',
    year_built: '',
    floor: '',
    document_type: '',
    // امکانات
    has_parking: false,
    has_storage: false,
    has_elevator: false,
  });
  
  // React Query hooks
  const createPropertyMutation = useCreateProperty();
  const { data: propertyTypes, isLoading: loadingTypes } = usePropertyTypes();
  const { data: cities, isLoading: loadingCities } = useCities();
  const { data: locations, isLoading: loadingLocations } = useLocations(
    step1Data.city || undefined
  );
  
  // Auto-generate slug from title (همیشه خودکار از عنوان ساخته میشه)
  useEffect(() => {
    setStep1Data(prev => ({
      ...prev,
      slug: prev.title ? generateSlug(prev.title) : ''
    }));
  }, [step1Data.title]);
  
  // Validation Step 1
  const validateStep1 = (): boolean => {
    if (!step1Data.title.trim()) {
      toast.error('خطا در اعتبارسنجی', {
        description: 'عنوان ملک الزامی است'
      });
      return false;
    }
    if (!step1Data.slug.trim()) {
      toast.error('خطا در اعتبارسنجی', {
        description: 'اسلاگ الزامی است'
      });
      return false;
    }
    if (!step1Data.property_type) {
      toast.error('خطا در اعتبارسنجی', {
        description: 'نوع ملک الزامی است'
      });
      return false;
    }
    if (!step1Data.city) {
      toast.error('خطا در اعتبارسنجی', {
        description: 'شهر الزامی است'
      });
      return false;
    }
    if (!step1Data.measure || parseFloat(step1Data.measure) <= 0) {
      toast.error('خطا در اعتبارسنجی', {
        description: 'متراژ معتبر الزامی است'
      });
      return false;
    }
    if (!step1Data.description || step1Data.description.trim() === '' || step1Data.description === '<p><br></p>') {
      toast.error('خطا در اعتبارسنجی', {
        description: 'توضیحات ملک الزامی است'
      });
      return false;
    }
    if (step1Data.transaction_type === 'sale' && !step1Data.is_negotiable && !step1Data.price) {
      toast.error('خطا در اعتبارسنجی', {
        description: 'قیمت برای فروش الزامی است (یا گزینه قیمت توافقی را فعال کنید)'
      });
      return false;
    }
    if (step1Data.transaction_type === 'rent' && (!step1Data.mortgage || !step1Data.rent)) {
      toast.error('خطا در اعتبارسنجی', {
        description: 'رهن و اجاره برای اجاره الزامی است'
      });
      return false;
    }
    if (step1Data.uploaded_images.length === 0) {
      toast.error('خطا در اعتبارسنجی', {
        description: 'حداقل یک تصویر الزامی است'
      });
      return false;
    }
    return true;
  };
  
  // Handle Submit
  const handleSubmit = async () => {
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }
    
    const payload: CreatePropertyPayload = {
      title: step1Data.title,
      slug: step1Data.slug,
      property_type: step1Data.property_type,
      city: step1Data.city,
      measure: step1Data.measure,
      rooms: step2Data.rooms || 0, // حالا از step2 می‌آید
      transaction_type: step1Data.transaction_type,
      uploaded_images: step1Data.uploaded_images,
      main_image_index: step1Data.main_image_index,
      description: step1Data.description, // توضیحات از step1 می‌آید
      
      // Step 1 - منطقه
      ...(step1Data.location && { location: step1Data.location }),
      
      // Step 2
      ...(step2Data.address && { address: step2Data.address }),
      ...(step2Data.year_built && { year_built: parseInt(step2Data.year_built) }),
      ...(step2Data.floor && { floor: step2Data.floor }),
      ...(step2Data.document_type && { document_type: step2Data.document_type }),
      
      // امکانات
      has_parking: step2Data.has_parking,
      has_storage: step2Data.has_storage,
      has_elevator: step2Data.has_elevator,
    };
    
    // اضافه کردن قیمت بر اساس نوع معامله
    if (step1Data.transaction_type === 'sale') {
      if (step1Data.is_negotiable) {
        // قیمت توافقی - price رو null میفرستیم
        payload.price = null;
      } else if (step1Data.price) {
        payload.price = parseInt(step1Data.price);
      }
    } else if (step1Data.transaction_type === 'rent') {
      if (step1Data.mortgage) payload.mortgage = parseInt(step1Data.mortgage);
      if (step1Data.rent) payload.rent = parseInt(step1Data.rent);
    }
    
    createPropertyMutation.mutate(payload, {
      onSuccess: () => {
        router.push('/agent/properties');
      }
    });
  };
  
  const renderStep1 = () => (
    <div className="space-y-8">
      {/* عنوان و اسلاگ */}
      <Card className="border-2 border-blue-100 hover:border-blue-300 transition-all">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>اطلاعات شناسایی</CardTitle>
              <CardDescription>عنوان و شناسه ملک</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                عنوان ملک *
              </Label>
              <Input
                id="title"
                value={step1Data.title}
                onChange={(e) => setStep1Data({ ...step1Data, title: e.target.value })}
                placeholder="مثال: آپارتمان 120 متری در تهران"
                maxLength={200}
                className="h-12 border-2 focus:border-blue-400"
              />
              <p className="text-xs text-muted-foreground">
                {step1Data.title.length}/200 کاراکتر
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-base flex items-center gap-2">
                <span className="text-gray-400">🔒</span>
                اسلاگ (URL) *
                <span className="text-xs font-normal text-muted-foreground">(خودکار)</span>
              </Label>
              <Input
                id="slug"
                value={step1Data.slug}
                readOnly
                placeholder="خودکار از عنوان ساخته می‌شود..."
                dir="ltr"
                className="h-12 border-2 bg-gray-50 text-gray-600 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span>💡</span>
                <span>اسلاگ به صورت خودکار از عنوان ملک ساخته می‌شود و قابل ویرایش نیست</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* نوع ملک و موقعیت */}
      <Card className="border-2 border-purple-100 hover:border-purple-300 transition-all">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Building2 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle>نوع و موقعیت ملک</CardTitle>
              <CardDescription>مشخصات اصلی ملک</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="property_type" className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-purple-600" />
                نوع ملک *
              </Label>
              <Select
                value={step1Data.property_type.toString()}
                onValueChange={(value) => setStep1Data({ ...step1Data, property_type: parseInt(value) })}
              >
                <SelectTrigger className="h-12 border-2 focus:border-purple-400">
                  <SelectValue placeholder="انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  {loadingTypes ? (
                    <SelectItem value="0" disabled>در حال بارگذاری...</SelectItem>
                  ) : (
                    propertyTypes?.map((type) => (
                      <SelectItem key={type.id} value={type.id.toString()}>
                        {type.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city" className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-600" />
                شهر *
              </Label>
              <Select
                value={step1Data.city.toString()}
                onValueChange={(value) => {
                  setStep1Data({ ...step1Data, city: parseInt(value), location: 0 });
                }}
              >
                <SelectTrigger className="h-12 border-2 focus:border-purple-400">
                  <SelectValue placeholder="انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  {loadingCities ? (
                    <SelectItem value="0" disabled>در حال بارگذاری...</SelectItem>
                  ) : (
                    cities?.map((city) => (
                      <SelectItem key={city.id} value={city.id.toString()}>
                        {city.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-base flex items-center gap-2">
                <MapPin className="w-4 h-4 text-purple-600" />
                منطقه/محله
              </Label>
              <Select
                value={step1Data.location.toString()}
                onValueChange={(value) => setStep1Data({ ...step1Data, location: parseInt(value) })}
                disabled={!step1Data.city || loadingLocations}
              >
                <SelectTrigger className="h-12 border-2 focus:border-purple-400">
                  <SelectValue placeholder={!step1Data.city ? 'ابتدا شهر را انتخاب کنید' : 'انتخاب کنید (اختیاری)'} />
                </SelectTrigger>
                <SelectContent>
                  {locations?.map((location) => (
                    <SelectItem key={location.id} value={location.id.toString()}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="measure" className="text-base">متراژ (متر مربع) *</Label>
            <Input
              id="measure"
              type="number"
              step="0.01"
              min="0"
              value={step1Data.measure}
              onChange={(e) => setStep1Data({ ...step1Data, measure: e.target.value })}
              placeholder="120"
              className="h-12 border-2 focus:border-purple-400"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* نوع معامله و قیمت */}
      <Card className="border-2 border-green-100 hover:border-green-300 transition-all">
        <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <CardTitle>اطلاعات مالی</CardTitle>
              <CardDescription>نوع معامله و قیمت</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="transaction_type" className="text-base flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              نوع معامله *
            </Label>
            <Select
              value={step1Data.transaction_type}
              onValueChange={(value) => setStep1Data({ 
                ...step1Data, 
                transaction_type: value as TransactionType 
              })}
            >
              <SelectTrigger className="h-12 border-2 focus:border-green-400">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">💰 فروش</SelectItem>
                <SelectItem value="rent">🏠 رهن و اجاره</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {step1Data.transaction_type === 'sale' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-base">
                  قیمت (تومان) {!step1Data.is_negotiable && '*'}
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  value={step1Data.price}
                  onChange={(e) => setStep1Data({ ...step1Data, price: e.target.value })}
                  placeholder="5,000,000,000"
                  dir="ltr"
                  disabled={step1Data.is_negotiable}
                  className={`h-12 border-2 focus:border-green-400 text-lg font-semibold ${
                    step1Data.is_negotiable ? 'bg-gray-100 cursor-not-allowed opacity-60' : ''
                  }`}
                />
                {step1Data.price && !step1Data.is_negotiable && (
                  <p className="text-sm font-medium text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200 mt-2">
                    💰 {amountToWords(step1Data.price)}
                  </p>
                )}
              </div>
              
              {/* چک‌باکس قیمت توافقی */}
              <div className="flex items-center space-x-3 space-x-reverse p-4 rounded-lg border-2 border-green-100 bg-green-50/50 hover:bg-green-50 transition-all">
                <Checkbox
                  id="is_negotiable"
                  checked={step1Data.is_negotiable}
                  onCheckedChange={(checked) => {
                    setStep1Data({ 
                      ...step1Data, 
                      is_negotiable: checked as boolean,
                      price: checked ? '' : step1Data.price // وقتی توافقی فعال میشه، قیمت رو خالی میکنیم
                    });
                  }}
                  className="w-5 h-5"
                />
                <Label htmlFor="is_negotiable" className="cursor-pointer text-base font-medium flex-1 flex items-center gap-2">
                  <span>🤝</span>
                  <span>قیمت توافقی</span>
                  <span className="text-xs text-muted-foreground font-normal">(قیمت بعداً با خریدار تعیین می‌شود)</span>
                </Label>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="mortgage" className="text-base">رهن (تومان) *</Label>
                <Input
                  id="mortgage"
                  type="number"
                  min="0"
                  value={step1Data.mortgage}
                  onChange={(e) => setStep1Data({ ...step1Data, mortgage: e.target.value })}
                  placeholder="500,000,000"
                  dir="ltr"
                  className="h-12 border-2 focus:border-green-400"
                />
                {step1Data.mortgage && (
                  <p className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                    🏦 {amountToWords(step1Data.mortgage)}
                  </p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rent" className="text-base">اجاره (تومان) *</Label>
                <Input
                  id="rent"
                  type="number"
                  min="0"
                  value={step1Data.rent}
                  onChange={(e) => setStep1Data({ ...step1Data, rent: e.target.value })}
                  placeholder="10,000,000"
                  dir="ltr"
                  className="h-12 border-2 focus:border-green-400"
                />
                {step1Data.rent && (
                  <p className="text-sm font-medium text-purple-700 bg-purple-50 px-3 py-2 rounded-lg border border-purple-200">
                    🏘️ {amountToWords(step1Data.rent)}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* توضیحات */}
      <Card className="border-2 border-amber-100 hover:border-amber-300 transition-all">
        <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50">
          <div className="flex items-center gap-3">
            <div className="bg-amber-100 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <CardTitle>توضیحات ملک *</CardTitle>
              <CardDescription>توضیحات کامل و جذاب درباره ملک بنویسید</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <RichTextEditor
            value={step1Data.description}
            onChange={(value) => setStep1Data({ ...step1Data, description: value })}
            placeholder="توضیحات کامل درباره ملک، امکانات، موقعیت جغرافیایی، دسترسی به مراکز خرید و... را بنویسید"
            minHeight="250px"
          />
          <p className="text-xs text-muted-foreground mt-2">
            💡 نکته: توضیحات جذاب و کامل باعث جلب توجه بیشتر خریداران می‌شود
          </p>
        </CardContent>
      </Card>

      {/* آپلود تصاویر */}
      <Card className="border-2 border-orange-100 hover:border-orange-300 transition-all">
        <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <ImageIcon className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <CardTitle>تصاویر ملک</CardTitle>
              <CardDescription>حداقل یک تصویر الزامی است</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <ImageUploader
            images={step1Data.uploaded_images}
            mainImageIndex={step1Data.main_image_index}
            onChange={(images, mainIndex) => setStep1Data({
              ...step1Data,
              uploaded_images: images,
              main_image_index: mainIndex
            })}
          />
        </CardContent>
      </Card>
    </div>
  );
  
  const renderStep2 = () => (
    <div className="space-y-8">
      {/* اطلاعات تکمیلی */}
      <Card className="border-2 border-indigo-100 hover:border-indigo-300 transition-all">
        <CardHeader className="bg-gradient-to-r from-indigo-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <CardTitle>اطلاعات تکمیلی</CardTitle>
              <CardDescription>جزئیات بیشتر درباره ملک</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          {/* تعداد خواب */}
          <div className="space-y-2">
            <Label htmlFor="rooms" className="text-base">تعداد اتاق خواب</Label>
            <Input
              id="rooms"
              type="number"
              min="0"
              value={step2Data.rooms}
              onChange={(e) => setStep2Data({ ...step2Data, rooms: parseInt(e.target.value) || 0 })}
              placeholder="2"
              className="h-12 border-2 focus:border-indigo-400"
            />
          </div>

          {/* آدرس */}
          <div className="space-y-2">
            <Label htmlFor="address" className="text-base">آدرس کامل</Label>
            <Textarea
              id="address"
              value={step2Data.address}
              onChange={(e) => setStep2Data({ ...step2Data, address: e.target.value })}
              placeholder="آدرس دقیق ملک را وارد کنید"
              rows={3}
              className="border-2 focus:border-indigo-400 resize-none"
            />
          </div>
          
          {/* سال ساخت، طبقه و نوع سند */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="year_built" className="text-base">سال ساخت</Label>
              <Input
                id="year_built"
                type="number"
                min="1300"
                max="1450"
                value={step2Data.year_built}
                onChange={(e) => setStep2Data({ ...step2Data, year_built: e.target.value })}
                placeholder="1400"
                className="h-12 border-2 focus:border-indigo-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="floor" className="text-base">طبقه</Label>
              <Input
                id="floor"
                value={step2Data.floor}
                onChange={(e) => setStep2Data({ ...step2Data, floor: e.target.value })}
                placeholder="مثال: 3"
                className="h-12 border-2 focus:border-indigo-400"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="document_type" className="text-base">نوع سند</Label>
              <Select
                value={step2Data.document_type}
                onValueChange={(value) => setStep2Data({ ...step2Data, document_type: value })}
              >
                <SelectTrigger className="h-12 border-2 focus:border-indigo-400">
                  <SelectValue placeholder="انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ملکی">ملکی</SelectItem>
                  <SelectItem value="اداری">اداری</SelectItem>
                  <SelectItem value="وقفی">وقفی</SelectItem>
                  <SelectItem value="قولنامه‌ای">قولنامه‌ای</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* امکانات */}
      <Card className="border-2 border-teal-100 hover:border-teal-300 transition-all">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-cyan-50">
          <div className="flex items-center gap-3">
            <div className="bg-teal-100 p-2 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <CardTitle>امکانات و ویژگی‌ها</CardTitle>
              <CardDescription>امکانات موجود در ملک را مشخص کنید</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3 space-x-reverse p-4 rounded-lg border-2 border-gray-100 hover:border-teal-300 hover:bg-teal-50 transition-all">
              <Checkbox
                id="has_parking"
                checked={step2Data.has_parking}
                onCheckedChange={(checked) => setStep2Data({ 
                  ...step2Data, 
                  has_parking: checked as boolean 
                })}
                className="w-5 h-5"
              />
              <Label htmlFor="has_parking" className="cursor-pointer text-base font-medium flex-1">
                🚗 پارکینگ
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 space-x-reverse p-4 rounded-lg border-2 border-gray-100 hover:border-teal-300 hover:bg-teal-50 transition-all">
              <Checkbox
                id="has_storage"
                checked={step2Data.has_storage}
                onCheckedChange={(checked) => setStep2Data({ 
                  ...step2Data, 
                  has_storage: checked as boolean 
                })}
                className="w-5 h-5"
              />
              <Label htmlFor="has_storage" className="cursor-pointer text-base font-medium flex-1">
                📦 انباری
              </Label>
            </div>
            
            <div className="flex items-center space-x-3 space-x-reverse p-4 rounded-lg border-2 border-gray-100 hover:border-teal-300 hover:bg-teal-50 transition-all">
              <Checkbox
                id="has_elevator"
                checked={step2Data.has_elevator}
                onCheckedChange={(checked) => setStep2Data({ 
                  ...step2Data, 
                  has_elevator: checked as boolean 
                })}
                className="w-5 h-5"
              />
              <Label htmlFor="has_elevator" className="cursor-pointer text-base font-medium flex-1">
                🛗 آسانسور
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  
  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      {/* Header با Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-white hover:bg-white/20"
            >
              <ArrowRight className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <Sparkles className="h-8 w-8" />
                ثبت ملک جدید
              </h1>
              <p className="text-blue-100 mt-2 text-lg">
                اطلاعات ملک خود را با دقت وارد کنید
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-3">
        {[1, 2].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`relative w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold shadow-lg transition-all ${
                step === currentStep
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white scale-110'
                  : step < currentStep
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <span className="text-2xl">{step}</span>
              {step < currentStep && (
                <CheckCircle2 className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full text-green-600" />
              )}
            </div>
            {step < 2 && (
              <div
                className={`w-24 h-2 rounded-full mx-2 transition-all ${
                  step < currentStep ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      
      {/* عنوان مرحله */}
      <div className="text-center">
        <Badge className="text-lg px-6 py-2" variant={currentStep === 1 ? "default" : "secondary"}>
          {currentStep === 1 ? '📋 مرحله 1: اطلاعات اصلی (اجباری)' : '✨ مرحله 2: اطلاعات تکمیلی (اختیاری)'}
        </Badge>
        <p className="text-muted-foreground mt-3">
          {currentStep === 1 ? 'لطفاً تمام فیلدهای ستاره‌دار را پر کنید' : 'می‌توانید این مرحله را رد کنید یا تکمیل کنید'}
        </p>
      </div>
      
      {/* Form Content */}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      
      {/* Navigation Buttons */}
      <Card className="border-2 shadow-xl">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="gap-2 h-12 hover:bg-gray-100 transition-all"
            >
              <ArrowRight className="h-5 w-5" />
              مرحله قبل
            </Button>
            
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              {currentStep === 1 ? (
                <Button
                  onClick={() => {
                    if (!validateStep1()) return;
                    setCurrentStep(2);
                  }}
                  className="gap-2 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
                >
                  مرحله بعد
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleSubmit}
                    disabled={createPropertyMutation.isPending}
                    className="gap-2 h-12"
                  >
                    ثبت سریع (بدون تکمیل)
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={createPropertyMutation.isPending}
                    className="gap-2 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all"
                  >
                    {createPropertyMutation.isPending ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        در حال ثبت...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        ثبت نهایی ملک
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
