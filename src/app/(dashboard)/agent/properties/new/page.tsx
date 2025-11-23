'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ArrowRight, ArrowLeft, Save, Loader2, Home } from 'lucide-react';
import ImageUploader from '@/components/forms/ImageUploader';
import { 
  useCreateProperty, 
  usePropertyTypes, 
  useCities, 
  useLocations 
} from '@/hooks/usePropertyMutations';
import { generateSlug } from '@/services/propertyApi';
import { TransactionType, CreatePropertyPayload } from '@/types/property';

export default function NewPropertyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: اطلاعات اصلی (اجباری)
  const [step1Data, setStep1Data] = useState({
    title: '',
    slug: '',
    property_type: 0,
    city: 0,
    measure: '',
    rooms: 1,
    transaction_type: 'sale' as TransactionType,
    price: '',
    mortgage: '',
    rent: '',
    uploaded_images: [] as File[],
    main_image_index: -1,
  });
  
  // Step 2: اطلاعات تکمیلی (اختیاری)
  const [step2Data, setStep2Data] = useState({
    location: 0,
    address: '',
    description: '',
    year_built: '',
    floor: '',
    document_type: '',
  });
  
  // Step 3: امکانات (اختیاری)
  const [step3Data, setStep3Data] = useState({
    has_parking: false,
    has_storage: false,
    has_elevator: false,
  });
  
  // React Query hooks (بعد از تعریف state ها)
  const createPropertyMutation = useCreateProperty();
  const { data: propertyTypes, isLoading: loadingTypes } = usePropertyTypes();
  const { data: cities, isLoading: loadingCities } = useCities();
  const { data: locations, isLoading: loadingLocations } = useLocations(
    step1Data.city || undefined
  );
  
  // Auto-generate slug from title
  useEffect(() => {
    if (step1Data.title && !step1Data.slug) {
      setStep1Data(prev => ({
        ...prev,
        slug: generateSlug(prev.title)
      }));
    }
  }, [step1Data.title]);
  
  // Validation Step 1
  const validateStep1 = (): boolean => {
    if (!step1Data.title.trim()) {
      alert('عنوان ملک الزامی است');
      return false;
    }
    if (!step1Data.slug.trim()) {
      alert('اسلاگ الزامی است');
      return false;
    }
    if (!step1Data.property_type) {
      alert('نوع ملک الزامی است');
      return false;
    }
    if (!step1Data.city) {
      alert('شهر الزامی است');
      return false;
    }
    if (!step1Data.measure || parseFloat(step1Data.measure) <= 0) {
      alert('متراژ معتبر الزامی است');
      return false;
    }
    if (step1Data.rooms < 0) {
      alert('تعداد خواب نامعتبر است');
      return false;
    }
    if (step1Data.transaction_type === 'sale' && !step1Data.price) {
      alert('قیمت برای فروش الزامی است');
      return false;
    }
    if (step1Data.transaction_type === 'rent' && (!step1Data.mortgage || !step1Data.rent)) {
      alert('رهن و اجاره برای اجاره الزامی است');
      return false;
    }
    if (step1Data.uploaded_images.length === 0) {
      alert('حداقل یک تصویر الزامی است');
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
      rooms: step1Data.rooms,
      transaction_type: step1Data.transaction_type,
      uploaded_images: step1Data.uploaded_images,
      main_image_index: step1Data.main_image_index,
      
      // Step 2
      ...(step2Data.location && { location: step2Data.location }),
      ...(step2Data.address && { address: step2Data.address }),
      ...(step2Data.description && { description: step2Data.description }),
      ...(step2Data.year_built && { year_built: parseInt(step2Data.year_built) }),
      ...(step2Data.floor && { floor: step2Data.floor }),
      ...(step2Data.document_type && { document_type: step2Data.document_type }),
      
      // Step 3
      has_parking: step3Data.has_parking,
      has_storage: step3Data.has_storage,
      has_elevator: step3Data.has_elevator,
    };
    
    // اضافه کردن قیمت بر اساس نوع معامله
    if (step1Data.transaction_type === 'sale' && step1Data.price) {
      payload.price = parseInt(step1Data.price);
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
    <div className="space-y-6">
      {/* عنوان و اسلاگ */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">عنوان ملک *</Label>
          <Input
            id="title"
            value={step1Data.title}
            onChange={(e) => setStep1Data({ ...step1Data, title: e.target.value })}
            placeholder="مثال: آپارتمان 120 متری در تهران"
            maxLength={200}
          />
          <p className="text-xs text-muted-foreground">
            {step1Data.title.length}/200 کاراکتر
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slug">اسلاگ (URL) *</Label>
          <Input
            id="slug"
            value={step1Data.slug}
            onChange={(e) => setStep1Data({ ...step1Data, slug: e.target.value })}
            placeholder="apartment-120-meter-tehran"
            maxLength={250}
            dir="ltr"
          />
        </div>
      </div>
      
      {/* نوع ملک و شهر */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="property_type">نوع ملک *</Label>
          <Select
            value={step1Data.property_type.toString()}
            onValueChange={(value) => setStep1Data({ ...step1Data, property_type: parseInt(value) })}
          >
            <SelectTrigger>
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
          <Label htmlFor="city">شهر *</Label>
          <Select
            value={step1Data.city.toString()}
            onValueChange={(value) => setStep1Data({ ...step1Data, city: parseInt(value) })}
          >
            <SelectTrigger>
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
      </div>
      
      {/* متراژ و تعداد خواب */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="measure">متراژ (متر مربع) *</Label>
          <Input
            id="measure"
            type="number"
            step="0.01"
            min="0"
            value={step1Data.measure}
            onChange={(e) => setStep1Data({ ...step1Data, measure: e.target.value })}
            placeholder="120"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="rooms">تعداد خواب *</Label>
          <Input
            id="rooms"
            type="number"
            min="0"
            value={step1Data.rooms}
            onChange={(e) => setStep1Data({ ...step1Data, rooms: parseInt(e.target.value) })}
          />
        </div>
      </div>
      
      {/* نوع معامله */}
      <div className="space-y-2">
        <Label htmlFor="transaction_type">نوع معامله *</Label>
        <Select
          value={step1Data.transaction_type}
          onValueChange={(value) => setStep1Data({ 
            ...step1Data, 
            transaction_type: value as TransactionType 
          })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sale">فروش</SelectItem>
            <SelectItem value="rent">رهن و اجاره</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* قیمت بر اساس نوع معامله */}
      {step1Data.transaction_type === 'sale' ? (
        <div className="space-y-2">
          <Label htmlFor="price">قیمت (تومان) *</Label>
          <Input
            id="price"
            type="number"
            min="0"
            value={step1Data.price}
            onChange={(e) => setStep1Data({ ...step1Data, price: e.target.value })}
            placeholder="5000000000"
            dir="ltr"
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mortgage">رهن (تومان) *</Label>
            <Input
              id="mortgage"
              type="number"
              min="0"
              value={step1Data.mortgage}
              onChange={(e) => setStep1Data({ ...step1Data, mortgage: e.target.value })}
              placeholder="500000000"
              dir="ltr"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="rent">اجاره (تومان) *</Label>
            <Input
              id="rent"
              type="number"
              min="0"
              value={step1Data.rent}
              onChange={(e) => setStep1Data({ ...step1Data, rent: e.target.value })}
              placeholder="10000000"
              dir="ltr"
            />
          </div>
        </div>
      )}
      
      <Separator />
      
      {/* آپلود تصاویر */}
      <div className="space-y-2">
        <Label>تصاویر ملک *</Label>
        <ImageUploader
          images={step1Data.uploaded_images}
          mainImageIndex={step1Data.main_image_index}
          onChange={(images, mainIndex) => setStep1Data({
            ...step1Data,
            uploaded_images: images,
            main_image_index: mainIndex
          })}
        />
      </div>
    </div>
  );
  
  const renderStep2 = () => (
    <div className="space-y-6">
      {/* منطقه */}
      <div className="space-y-2">
        <Label htmlFor="location">منطقه/محله</Label>
        <Select
          value={step2Data.location.toString()}
          onValueChange={(value) => setStep2Data({ ...step2Data, location: parseInt(value) })}
          disabled={!step1Data.city || loadingLocations}
        >
          <SelectTrigger>
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
      
      {/* آدرس */}
      <div className="space-y-2">
        <Label htmlFor="address">آدرس کامل</Label>
        <Textarea
          id="address"
          value={step2Data.address}
          onChange={(e) => setStep2Data({ ...step2Data, address: e.target.value })}
          placeholder="آدرس دقیق ملک را وارد کنید"
          rows={3}
        />
      </div>
      
      {/* توضیحات */}
      <div className="space-y-2">
        <Label htmlFor="description">توضیحات</Label>
        <Textarea
          id="description"
          value={step2Data.description}
          onChange={(e) => setStep2Data({ ...step2Data, description: e.target.value })}
          placeholder="توضیحات تکمیلی درباره ملک..."
          rows={6}
        />
      </div>
      
      {/* سال ساخت و طبقه */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year_built">سال ساخت</Label>
          <Input
            id="year_built"
            type="number"
            min="1300"
            max="1450"
            value={step2Data.year_built}
            onChange={(e) => setStep2Data({ ...step2Data, year_built: e.target.value })}
            placeholder="1400"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="floor">طبقه</Label>
          <Input
            id="floor"
            value={step2Data.floor}
            onChange={(e) => setStep2Data({ ...step2Data, floor: e.target.value })}
            placeholder="مثال: 3"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="document_type">نوع سند</Label>
          <Select
            value={step2Data.document_type}
            onValueChange={(value) => setStep2Data({ ...step2Data, document_type: value })}
          >
            <SelectTrigger>
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
    </div>
  );
  
  const renderStep3 = () => (
    <div className="space-y-6">
      <p className="text-muted-foreground">امکانات و ویژگی‌های ملک را مشخص کنید:</p>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2 space-x-reverse">
          <Checkbox
            id="has_parking"
            checked={step3Data.has_parking}
            onCheckedChange={(checked) => setStep3Data({ 
              ...step3Data, 
              has_parking: checked as boolean 
            })}
          />
          <Label htmlFor="has_parking" className="cursor-pointer">
            پارکینگ
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 space-x-reverse">
          <Checkbox
            id="has_storage"
            checked={step3Data.has_storage}
            onCheckedChange={(checked) => setStep3Data({ 
              ...step3Data, 
              has_storage: checked as boolean 
            })}
          />
          <Label htmlFor="has_storage" className="cursor-pointer">
            انباری
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 space-x-reverse">
          <Checkbox
            id="has_elevator"
            checked={step3Data.has_elevator}
            onCheckedChange={(checked) => setStep3Data({ 
              ...step3Data, 
              has_elevator: checked as boolean 
            })}
          />
          <Label htmlFor="has_elevator" className="cursor-pointer">
            آسانسور
          </Label>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Home className="h-8 w-8" />
            ثبت ملک جدید
          </h1>
          <p className="text-muted-foreground mt-1">
            اطلاعات ملک خود را وارد کنید
          </p>
        </div>
      </div>
      
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step === currentStep
                  ? 'bg-primary text-white'
                  : step < currentStep
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step}
            </div>
            {step < 3 && (
              <div
                className={`w-20 h-1 ${
                  step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
      
      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 1 && 'مرحله 1: اطلاعات اصلی (اجباری)'}
            {currentStep === 2 && 'مرحله 2: اطلاعات تکمیلی (اختیاری)'}
            {currentStep === 3 && 'مرحله 3: امکانات (اختیاری)'}
          </CardTitle>
          <CardDescription>
            {currentStep === 1 && 'لطفاً تمام فیلدهای ستاره‌دار را پر کنید'}
            {currentStep === 2 && 'می‌توانید این مرحله را رد کنید'}
            {currentStep === 3 && 'می‌توانید این مرحله را رد کنید'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <ArrowRight className="h-4 w-4" />
              مرحله قبل
            </Button>
            
            <div className="flex gap-2">
              {currentStep < 3 ? (
                <>
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      onClick={handleSubmit}
                      disabled={createPropertyMutation.isPending}
                    >
                      ثبت سریع
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      if (currentStep === 1 && !validateStep1()) return;
                      setCurrentStep(currentStep + 1);
                    }}
                    className="gap-2"
                  >
                    مرحله بعد
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={createPropertyMutation.isPending}
                  className="gap-2"
                >
                  {createPropertyMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      در حال ثبت...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      ثبت ملک
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
