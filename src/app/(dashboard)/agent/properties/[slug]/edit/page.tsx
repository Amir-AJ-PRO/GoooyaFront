'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAgentProperties, useUpdateProperty } from '@/hooks/useAgentProfile';
import { useCities, useLocations, usePropertyTypes } from '@/hooks/usePropertyMutations';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Loader2, 
  ArrowLeft, 
  ArrowRight,
  X, 
  Image as ImageIcon,
  Home,
  MapPin,
  Layers,
  DollarSign,
  FileText,
  CheckCircle2,
  Building2
} from 'lucide-react';
import Image from 'next/image';
import { getMediaUrl } from '@/lib/utils';
import { UpdatePropertyPayload, AgentProperty } from '@/services/agentService';
import { toast } from 'sonner';
import RichTextEditor from '@/components/forms/RichTextEditor';

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();
  // Decode کردن slug برای فارسی
  const slug = decodeURIComponent(params.slug as string);
  
  const { data: properties, isLoading } = useAgentProperties();
  const updateMutation = useUpdateProperty();
  
  // Fetch dropdown data
  const { data: cities, isLoading: citiesLoading } = useCities();
  const { data: propertyTypes, isLoading: propertyTypesLoading } = usePropertyTypes();
  
  const [property, setProperty] = useState<AgentProperty | null>(null);
  const [formData, setFormData] = useState<UpdatePropertyPayload>({});
  const [newImages, setNewImages] = useState<File[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState<number>(0);
  const [setMainImageId, setSetMainImageId] = useState<number | undefined>(undefined);
  
  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 2;
  
  // City and Location state for dropdowns
  const [selectedCityId, setSelectedCityId] = useState<number | undefined>(undefined);
  const { data: locations, isLoading: locationsLoading } = useLocations(selectedCityId);

  // بارگذاری ملک
  useEffect(() => {
    if (properties && properties.length > 0) {
      // جستجو با slug
      let foundProperty = properties.find(p => p.slug === slug);
      
      // اگر با slug پیدا نشد، شاید slug در واقع id باشه (fallback)
      if (!foundProperty && !isNaN(Number(slug))) {
        foundProperty = properties.find(p => p.id.toString() === slug);
      }
      
      if (foundProperty) {
        setProperty(foundProperty);
        
        // استخراج ID های عددی
        let propertyTypeId: number | undefined;
        let cityId: number | undefined;
        let locationId: number | undefined;
        
        // Property Type - می‌تونه object یا number یا string باشه
        if (typeof foundProperty.property_type === 'object' && foundProperty.property_type !== null) {
          propertyTypeId = (foundProperty.property_type as any).id;
        } else if (typeof foundProperty.property_type === 'number') {
          propertyTypeId = foundProperty.property_type;
        } else if (typeof foundProperty.property_type === 'string' && propertyTypes) {
          // اگر string هست، از روی title پیدا کن
          const found = propertyTypes.find(t => (t as any).title === foundProperty.property_type);
          propertyTypeId = found?.id;
        }
        
        // City - می‌تونه object یا number یا string (name) باشه
        if (typeof foundProperty.city === 'object' && foundProperty.city !== null) {
          cityId = (foundProperty.city as any).id;
        } else if (typeof foundProperty.city === 'number') {
          cityId = foundProperty.city;
        } else if (typeof foundProperty.city === 'string' && cities) {
          // اگر string (name شهر) هست، از روی name پیدا کن
          const found = cities.find(c => (c as any).name === foundProperty.city);
          cityId = found?.id;
        }
        
        // Location - بعداً از روی name پیدا می‌کنیم (چون باید اول city مشخص بشه)
        if (typeof foundProperty.location === 'object' && foundProperty.location !== null) {
          locationId = (foundProperty.location as any).id;
        } else if (typeof foundProperty.location === 'number') {
          locationId = foundProperty.location;
        }
        // اگر location یک string هست، بعداً وقتی locations لود شد، از روی name پیداش می‌کنیم
        
        // Set city ID for locations dropdown
        if (cityId && typeof cityId === 'number') {
          setSelectedCityId(cityId);
        }
        
        // مقداردهی اولیه فرم با ID های صحیح و features
        setFormData({
          title: foundProperty.title,
          slug: foundProperty.slug,
          address: foundProperty.address,
          measure: parseFloat(foundProperty.measure),
          rooms: foundProperty.rooms,
          price: foundProperty.price,
          transaction_type: foundProperty.transaction_type as 'sale' | 'rent',
          city: cityId,
          location: locationId,
          property_type: propertyTypeId,
          description: foundProperty.description || '',
          goooya_description: foundProperty.goooya_description || '',
          // Features - فقط features موجود رو اضافه کن
          has_parking: foundProperty.has_parking,
          has_storage: foundProperty.has_storage,
          has_elevator: foundProperty.has_elevator,
          has_balcony: foundProperty.has_balcony,
          has_pool: foundProperty.has_pool,
          has_security: foundProperty.has_security,
          has_gas: foundProperty.has_gas,
          has_electricity: foundProperty.has_electricity,
        });
      } else {
        console.error('Property not found with slug:', slug);
        console.error('Available slugs:', properties.map(p => p.slug));
        toast.error('ملک یافت نشد. در حال بازگشت به لیست املاک...');
        setTimeout(() => {
          router.push('/agent');
        }, 2000);
      }
    }
  }, [properties, slug, router, cities]);

  // اطمینان از اینکه selectedCityId set شده (برای لود کردن locations)
  useEffect(() => {
    if (property && formData.city && !selectedCityId) {
      setSelectedCityId(formData.city);
    }
  }, [property, formData.city, selectedCityId]);

  // اگر city یک string (name) بود و cities بعداً لود شدن، دوباره ID رو پیدا کن
  useEffect(() => {
    if (property && cities && cities.length > 0 && formData.city && typeof formData.city === 'string') {
      const cityValue = formData.city as any;
      const found = cities.find(c => c.name === cityValue);
      
      if (found && typeof found.id === 'number') {
        setFormData(prev => ({
          ...prev,
          city: found.id,
        }));
        setSelectedCityId(found.id);
      }
    }
  }, [property, cities, formData.city]);

  // پیدا کردن property_type ID از روی title (وقتی propertyTypes لود شدن)
  useEffect(() => {
    if (property && propertyTypes && propertyTypes.length > 0) {
      const propertyTypeValue = (property as any).property_type;
      
      // اگر formData.property_type یک string هست یا هنوز set نشده
      if (typeof propertyTypeValue === 'string' && (!formData.property_type || typeof formData.property_type === 'string')) {
        // اگر property_type یک string (title) هست، از روی title پیداش کن
        const found = propertyTypes.find(pt => pt.title === propertyTypeValue);
        
        if (found && typeof found.id === 'number') {
          setFormData(prev => ({
            ...prev,
            property_type: found.id,
          }));
        }
      }
    }
  }, [property, propertyTypes, formData.property_type]);

  // پیدا کردن location ID از روی name (وقتی locations لود شدن)
  useEffect(() => {
    if (property && locations && locations.length > 0) {
      const locationValue = (property as any).location;
      
      // اگر formData.location یک string هست یا هنوز set نشده
      if (typeof locationValue === 'string' && (!formData.location || typeof formData.location === 'string')) {
        // اگر location یک string (name) هست، از روی name پیداش کن
        const found = locations.find(l => l.name === locationValue);
        
        if (found && typeof found.id === 'number') {
          setFormData(prev => ({
            ...prev,
            location: found.id,
          }));
        }
      }
    }
  }, [property, locations, formData.location]);

  const handleChange = (field: keyof UpdatePropertyPayload, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Reset location when city changes
    if (field === 'city') {
      setSelectedCityId(value);
      setFormData(prev => ({
        ...prev,
        location: undefined,
      }));
    }
  };

  const handleImageAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages(prev => [...prev, ...files]);
  };

  const handleImageRemove = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleExistingImageDelete = (imageId: number) => {
    setDeletedImageIds(prev => [...prev, imageId]);
    // اگر این تصویر اصلی بود، unset کن
    if (setMainImageId === imageId) {
      setSetMainImageId(undefined);
    }
  };

  const handleSetAsMainImage = (imageId: number) => {
    setSetMainImageId(imageId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // فقط فیلدهایی که تغییر کرده‌اند رو بفرست
    const payload: UpdatePropertyPayload = {};
    
    // اضافه کردن فیلدهای تغییر یافته با validation بهتر
    Object.keys(formData).forEach((key) => {
      const value = formData[key as keyof UpdatePropertyPayload];
      
      // Skip undefined و null
      if (value === undefined || value === null) {
        return;
      }
      
      // برای رشته‌ها، فقط اگر خالی نباشن
      if (typeof value === 'string' && value.trim() === '') {
        return;
      }
      
      // برای اعداد، باید معتبر باشن (نه NaN)
      if (typeof value === 'number' && isNaN(value)) {
        return;
      }
      
      // اضافه کردن به payload
      payload[key as keyof UpdatePropertyPayload] = value as any;
    });

    // اضافه کردن تصاویر جدید
    if (newImages.length > 0) {
      payload.uploaded_images = newImages;
      payload.main_image_index = mainImageIndex;
    }

    // اضافه کردن ID های حذف شده
    if (deletedImageIds.length > 0) {
      payload.deleted_image_ids = deletedImageIds;
    }

    // تنظیم تصویر اصلی از بین تصاویر موجود
    if (setMainImageId !== undefined) {
      payload.set_main_image_id = setMainImageId;
    }

    try {
      await updateMutation.mutateAsync({ slug: property!.slug, payload });
      toast.success('ملک با موفقیت بروزرسانی شد');
      router.push('/agent');
    } catch (error: any) {
      console.error('خطا در بروزرسانی ملک:', error?.response?.data || error?.message);
      
      toast.error('خطا در بروزرسانی ملک', {
        description: error?.response?.data?.message || error?.response?.data?.detail || error?.message || 'لطفاً دوباره تلاش کنید'
      });
    }
  };


  if (isLoading || citiesLoading || propertyTypesLoading) {
    return <EditPropertySkeleton />;
  }

  if (!property) {
    return null;
  }

  const existingImages = property.images.filter(
    img => !deletedImageIds.includes(img.id)
  );

  // Progress calculation
  const progress = (currentStep / totalSteps) * 100;

  // Step navigation functions
  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-10">
      <div className="max-w-5xl mx-auto space-y-6 px-4 py-8">
        {/* Header با طراحی بهتر */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-5 md:p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg sm:rounded-xl p-2 sm:p-3">
                <Building2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">ویرایش ملک</h1>
                <p className="text-white/90 text-xs sm:text-sm md:text-base mt-1 line-clamp-2">{property.title}</p>
              </div>
            </div>
            <Button 
              variant="secondary" 
              onClick={() => router.back()}
              className="self-start md:self-auto text-xs sm:text-sm h-8 sm:h-9 md:h-10"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
              <span className="hidden sm:inline">بازگشت</span>
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">پیشرفت فرم</span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between mt-3">
              {[1, 2].map((step) => (
                <div
                  key={step}
                  className={`flex items-center gap-2 ${
                    step === currentStep
                      ? 'text-white'
                      : step < currentStep
                      ? 'text-white/80'
                      : 'text-white/40'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      step === currentStep
                        ? 'bg-white text-blue-600 scale-110'
                        : step < currentStep
                        ? 'bg-white/80 text-blue-600'
                        : 'bg-white/20'
                    }`}
                  >
                    {step < currentStep ? <CheckCircle2 className="w-5 h-5" /> : step}
                  </div>
                  <span className="text-xs md:text-sm font-medium hidden md:inline">
                    {step === 1 ? 'اطلاعات اصلی' : 'جزئیات و امکانات'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* مرحله 1: اطلاعات اصلی */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* اطلاعات پایه */}
              <Card className="border-2 border-blue-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2 border-blue-100">
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Home className="w-6 h-6 text-blue-600" />
                    اطلاعات پایه ملک
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-base font-semibold flex items-center gap-2">
                        <span className="text-red-500">*</span>
                        عنوان ملک
                      </Label>
                      <Input
                        id="title"
                        value={formData.title || ''}
                        onChange={(e) => handleChange('title', e.target.value)}
                        className="h-12 border-2 focus:border-blue-500 transition-colors"
                        placeholder="مثال: آپارتمان ۱۲۰ متری در منطقه ۱"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug" className="text-base font-semibold flex items-center gap-2">
                        اسلاگ (URL)
                      </Label>
                      <Input
                        id="slug"
                        value={formData.slug || property.slug}
                        onChange={(e) => handleChange('slug', e.target.value)}
                        className="h-12 border-2 focus:border-blue-500 transition-colors"
                        placeholder="apartment-120-meter-region-1"
                      />
                      <p className="text-xs text-muted-foreground">
                        💡 اسلاگ به صورت خودکار از عنوان ساخته می‌شود
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="measure" className="text-base font-semibold flex items-center gap-2">
                        <span className="text-red-500">*</span>
                        متراژ (متر مربع)
                      </Label>
                      <Input
                        id="measure"
                        type="number"
                        step="0.01"
                        value={formData.measure || ''}
                        onChange={(e) => handleChange('measure', parseFloat(e.target.value))}
                        className="h-12 border-2 focus:border-blue-500 transition-colors"
                        placeholder="۱۲۰"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="property_type" className="text-base font-semibold flex items-center gap-2">
                        <Layers className="w-4 h-4 text-purple-600" />
                        نوع ملک
                      </Label>
                      <Select
                        value={formData.property_type?.toString() || ""}
                        onValueChange={(value) => handleChange('property_type', parseInt(value))}
                      >
                        <SelectTrigger className="h-12 border-2 focus:border-purple-500">
                          <SelectValue placeholder="انتخاب کنید" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes?.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>
                              {type.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* موقعیت مکانی */}
              <Card className="border-2 border-green-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-100">
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <MapPin className="w-6 h-6 text-green-600" />
                    موقعیت مکانی
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-base font-semibold flex items-center gap-2">
                        <span className="text-red-500">*</span>
                        شهر
                      </Label>
                      <Select
                        value={formData.city ? formData.city.toString() : ""}
                        onValueChange={(value) => handleChange('city', parseInt(value))}
                      >
                        <SelectTrigger className="h-12 border-2 focus:border-green-500">
                          <SelectValue placeholder="انتخاب کنید" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities?.map((city) => (
                            <SelectItem key={city.id} value={city.id.toString()}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-base font-semibold flex items-center gap-2">
                        <span className="text-red-500">*</span>
                        محله / منطقه
                      </Label>
                      <Select
                        value={formData.location ? formData.location.toString() : ""}
                        onValueChange={(value) => handleChange('location', parseInt(value))}
                        disabled={!selectedCityId || locationsLoading}
                      >
                        <SelectTrigger className="h-12 border-2 focus:border-green-500">
                          <SelectValue placeholder={
                            !selectedCityId 
                              ? "ابتدا شهر را انتخاب کنید"
                              : locationsLoading
                              ? "در حال بارگذاری..."
                              : "انتخاب کنید"
                          } />
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

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className="text-base font-semibold">
                        آدرس دقیق
                      </Label>
                      <Input
                        id="address"
                        value={formData.address || ''}
                        onChange={(e) => handleChange('address', e.target.value)}
                        className="h-12 border-2 focus:border-green-500 transition-colors"
                        placeholder="خیابان، کوچه، پلاک و ..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* نوع معامله و قیمت */}
              <Card className="border-2 border-amber-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b-2 border-amber-100">
                  <CardTitle className="flex items-center gap-2 text-amber-900">
                    <DollarSign className="w-6 h-6 text-amber-600" />
                    اطلاعات معامله
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                  <div className="space-y-3">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <span className="text-red-500">*</span>
                      نوع معامله
                    </Label>
                    <RadioGroup
                      value={formData.transaction_type || property.transaction_type}
                      onValueChange={(value) => handleChange('transaction_type', value)}
                      className="grid grid-cols-2 gap-3 sm:gap-4"
                    >
                      <Label
                        htmlFor="sale"
                        className={`flex items-center justify-center space-x-2 space-x-reverse p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all ${
                          (formData.transaction_type || property.transaction_type) === 'sale'
                            ? 'border-amber-500 bg-amber-50 shadow-md'
                            : 'border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        <RadioGroupItem value="sale" id="sale" className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="font-semibold text-sm sm:text-base">فروش</span>
                      </Label>
                      <Label
                        htmlFor="rent"
                        className={`flex items-center justify-center space-x-2 space-x-reverse p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all ${
                          (formData.transaction_type || property.transaction_type) === 'rent'
                            ? 'border-amber-500 bg-amber-50 shadow-md'
                            : 'border-gray-200 hover:border-amber-300'
                        }`}
                      >
                        <RadioGroupItem value="rent" id="rent" className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="font-semibold text-sm sm:text-base">رهن / اجاره</span>
                      </Label>
                    </RadioGroup>
                  </div>

                  {(formData.transaction_type || property.transaction_type) === 'sale' ? (
                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-base font-semibold">
                        قیمت (تومان)
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price || ''}
                        onChange={(e) => handleChange('price', parseInt(e.target.value))}
                        className="h-12 border-2 focus:border-amber-500 transition-colors"
                        placeholder="۵۰۰۰۰۰۰۰۰۰"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="mortgage" className="text-base font-semibold">
                          رهن (تومان)
                        </Label>
                        <Input
                          id="mortgage"
                          type="number"
                          value={formData.mortgage || ''}
                          onChange={(e) => handleChange('mortgage', parseInt(e.target.value))}
                          className="h-12 border-2 focus:border-amber-500 transition-colors"
                          placeholder="۲۰۰۰۰۰۰۰۰"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rent" className="text-base font-semibold">
                          اجاره (تومان)
                        </Label>
                        <Input
                          id="rent"
                          type="number"
                          value={formData.rent || ''}
                          onChange={(e) => handleChange('rent', parseInt(e.target.value))}
                          className="h-12 border-2 focus:border-amber-500 transition-colors"
                          placeholder="۵۰۰۰۰۰۰"
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* دکمه بعدی */}
              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleNext}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all px-8"
                >
                  مرحله بعد
                  <ArrowRight className="w-5 h-5 mr-2" />
                </Button>
              </div>
            </div>
          )}

          {/* مرحله 2: جزئیات و امکانات */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* جزئیات بیشتر */}
              <Card className="border-2 border-indigo-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2 border-indigo-100">
                  <CardTitle className="flex items-center gap-2 text-indigo-900">
                    <FileText className="w-6 h-6 text-indigo-600" />
                    جزئیات بیشتر
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5 pt-6">
                  <div className="space-y-2">
                    <Label htmlFor="rooms" className="text-base font-semibold">
                      تعداد اتاق خواب (اختیاری)
                    </Label>
                    <Input
                      id="rooms"
                      type="number"
                      min="0"
                      value={formData.rooms || ''}
                      onChange={(e) => handleChange('rooms', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="h-12 border-2 focus:border-indigo-500 transition-colors"
                      placeholder="۳"
                    />
                    <p className="text-xs text-muted-foreground">
                      💡 اگر ملک شما اتاق خواب ندارد، می‌توانید این فیلد را خالی بگذارید
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm sm:text-base font-semibold">
                      توضیحات کامل
                    </Label>
                    <Textarea
                      id="description"
                      rows={6}
                      value={formData.description || ''}
                      onChange={(e) => handleChange('description', e.target.value)}
                      className="border-2 focus:border-indigo-500 transition-colors resize-none text-sm sm:text-base"
                      placeholder="توضیحات کامل در مورد ملک، موقعیت، امکانات و ..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="goooya_description" className="text-sm sm:text-base font-semibold">
                      توضیحات گویا (Rich Text)
                    </Label>
                    <div className="w-full">
                      <RichTextEditor
                        value={formData.goooya_description || ''}
                        onChange={(value) => handleChange('goooya_description', value)}
                        placeholder="توضیحات کامل با قابلیت فرمت‌دهی..."
                        minHeight="200px"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* امکانات */}
              <Card className="border-2 border-emerald-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b-2 border-emerald-100">
                  <CardTitle className="flex items-center gap-2 text-emerald-900">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    امکانات و ویژگی‌ها
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 sm:pt-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4">
                    {[
                      { key: 'has_parking', label: 'پارکینگ', emoji: '🚗' },
                      { key: 'has_storage', label: 'انباری', emoji: '📦' },
                      { key: 'has_elevator', label: 'آسانسور', emoji: '🛗' },
                      { key: 'has_balcony', label: 'بالکن', emoji: '🪴' },
                      { key: 'has_pool', label: 'استخر', emoji: '🏊' },
                      { key: 'has_security', label: 'نگهبانی', emoji: '👮' },
                      { key: 'has_gas', label: 'گاز', emoji: '🔥' },
                      { key: 'has_electricity', label: 'برق', emoji: '⚡' },
                    ].map(({ key, label, emoji }) => (
                      <Label
                        key={key}
                        htmlFor={key}
                        className={`flex items-center gap-2 sm:gap-3 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl border-2 cursor-pointer transition-all ${
                          formData[key as keyof UpdatePropertyPayload]
                            ? 'border-emerald-500 bg-emerald-50 shadow-md'
                            : 'border-gray-200 hover:border-emerald-300'
                        }`}
                      >
                        <Checkbox
                          id={key}
                          checked={formData[key as keyof UpdatePropertyPayload] as boolean || false}
                          onCheckedChange={(checked) => handleChange(key as keyof UpdatePropertyPayload, checked)}
                          className="h-4 w-4 sm:h-5 sm:w-5"
                        />
                        <span className="text-base sm:text-xl">{emoji}</span>
                        <span className="font-medium text-xs sm:text-sm md:text-base">{label}</span>
                      </Label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* تصاویر */}
              <Card className="border-2 border-rose-100 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-rose-50 to-pink-50 border-b-2 border-rose-100">
                  <CardTitle className="flex items-center gap-2 text-rose-900">
                    <ImageIcon className="w-6 h-6 text-rose-600" />
                    تصاویر ملک
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  {/* تصاویر موجود */}
                  {existingImages.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-sm sm:text-base font-semibold">تصاویر موجود</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                        {existingImages.map((img) => (
                          <div key={img.id} className="relative group">
                            <div 
                              className={`rounded-xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-105 ${
                                setMainImageId === img.id || (setMainImageId === undefined && img.is_main)
                                  ? 'border-emerald-500 shadow-lg'
                                  : 'border-gray-200 hover:border-emerald-300'
                              }`}
                              onClick={() => handleSetAsMainImage(img.id)}
                            >
                              <Image
                                src={getMediaUrl(img.image)!}
                                alt="تصویر ملک"
                                width={200}
                                height={150}
                                className="object-cover w-full h-24 sm:h-28 md:h-32"
                                unoptimized
                              />
                            </div>
                            {(setMainImageId === img.id || (setMainImageId === undefined && img.is_main)) && (
                              <Badge className="absolute top-2 right-2 bg-emerald-600 text-white shadow-lg">
                                تصویر اصلی
                              </Badge>
                            )}
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleExistingImageDelete(img.id);
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                        💡 روی تصویر کلیک کنید تا به عنوان تصویر اصلی انتخاب شود
                      </p>
                    </div>
                  )}

                  {/* تصاویر جدید */}
                  {newImages.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">تصاویر جدید</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {newImages.map((file, index) => (
                          <div key={index} className="relative group">
                            <div 
                              className={`rounded-xl overflow-hidden border-2 cursor-pointer transition-all hover:scale-105 ${
                                mainImageIndex === index
                                  ? 'border-blue-500 shadow-lg'
                                  : 'border-gray-200 hover:border-blue-300'
                              }`}
                              onClick={() => setMainImageIndex(index)}
                            >
                              <Image
                                src={URL.createObjectURL(file)}
                                alt="تصویر جدید"
                                width={200}
                                height={150}
                                className="object-cover w-full h-32"
                              />
                            </div>
                            {mainImageIndex === index && (
                              <Badge className="absolute top-2 right-2 bg-blue-600 text-white shadow-lg">
                                اصلی جدید
                              </Badge>
                            )}
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleImageRemove(index);
                                if (mainImageIndex === index) {
                                  setMainImageIndex(0);
                                } else if (mainImageIndex > index) {
                                  setMainImageIndex(prev => prev - 1);
                                }
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
                        💡 روی تصویر جدید کلیک کنید تا به عنوان تصویر اصلی انتخاب شود
                      </p>
                    </div>
                  )}

                  {/* آپلود تصویر */}
                  <div className="space-y-2">
                    <Label htmlFor="images" className="text-sm sm:text-base font-semibold">
                      افزودن تصاویر جدید
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-rose-400 transition-colors bg-gray-50">
                      <Input
                        id="images"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageAdd}
                        className="cursor-pointer text-xs sm:text-sm"
                      />
                      <p className="text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3 text-center">
                        📸 می‌توانید چند تصویر به صورت همزمان انتخاب کنید
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* دکمه‌های ناوبری */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  className="w-full sm:w-auto h-10 sm:h-11 md:h-12 text-xs sm:text-sm md:text-base px-4 sm:px-6 md:px-8"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" />
                  <span className="hidden sm:inline">مرحله قبل</span>
                  <span className="sm:hidden">قبل</span>
                </Button>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="w-full sm:w-auto h-10 sm:h-11 md:h-12 text-xs sm:text-sm md:text-base"
                  >
                    انصراف
                  </Button>
                  <Button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="w-full sm:w-auto h-10 sm:h-11 md:h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all text-xs sm:text-sm md:text-base px-4 sm:px-6 md:px-8"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2 animate-spin" />
                        <span className="hidden sm:inline">در حال ذخیره...</span>
                        <span className="sm:hidden">ذخیره...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" />
                        <span className="hidden sm:inline">ذخیره تغییرات</span>
                        <span className="sm:hidden">ذخیره</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function EditPropertySkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-10">
      <div className="max-w-5xl mx-auto space-y-6 px-4 py-8">
        {/* Header Skeleton */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-14 h-14 rounded-xl bg-white/20" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-48 bg-white/20" />
              <Skeleton className="h-4 w-64 bg-white/20" />
            </div>
          </div>
          <div className="mt-6 space-y-2">
            <Skeleton className="h-4 w-full bg-white/20" />
            <Skeleton className="h-2 w-full rounded-full bg-white/20" />
          </div>
        </div>

        {/* Form Skeleton */}
        <Card className="border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b-2">
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2">
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Skeleton className="h-12 w-32" />
        </div>
      </div>
    </div>
  );
}


