'use client';

import { useState, useRef, useEffect } from 'react';
import { useAgentProfile, useUpdateAgentProfile } from '@/hooks/useAgentProfile';
import { useCities, useLocations } from '@/hooks/usePropertyMutations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Save, 
  Loader2, 
  Trash2, 
  AlertCircle,
  User,
  Building2,
  MapPin,
  Phone,
  Award,
  Briefcase,
  FileText,
  Globe,
  Instagram,
  CheckCircle2,
  RefreshCcw,
  Sparkles,
  Upload
} from 'lucide-react';
import { UpdateAgentProfilePayload } from '@/services/agentService';
import { getMediaUrl } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

/**
 * کامپوننت تنظیمات و ویرایش پروفایل agent
 */
export default function AgentProfileSettings() {
  const { data: profile, isLoading } = useAgentProfile();
  const updateProfileMutation = useUpdateAgentProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<UpdateAgentProfilePayload>({});
  const [selectedCityId, setSelectedCityId] = useState<number | undefined>(undefined);
  const [selectedRegionId, setSelectedRegionId] = useState<number | undefined>(undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [shouldDeleteImage, setShouldDeleteImage] = useState(false);

  // دریافت شهرها و مناطق
  const { data: cities, isLoading: loadingCities } = useCities();
  const { data: locations, isLoading: loadingLocations } = useLocations(selectedCityId);

  // بارگذاری داده‌های اولیه
  useEffect(() => {
    if (profile && Object.keys(formData).length === 0) {
      setFormData({
        full_name: profile.full_name,
        office_name: profile.office_name || '',
        office_address: profile.office_address || '',
        office_phone: profile.office_phone || '',
        years_of_experience: profile.years_of_experience || 0,
        specialties: profile.specialties || '',
        bio: profile.bio || '',
        website: profile.website || '',
        instagram: profile.instagram || '',
      });
      
      // اگر شهر موجود بود، ID شهر رو پیدا کن و تنظیم کن
      if (profile.city && cities) {
        const city = cities.find(c => c.name === profile.city);
        if (city) {
          setSelectedCityId(city.id);
        }
      }
    }
  }, [profile, formData, cities]);
  
  // وقتی شهر و مناطق لود شدن، ID منطقه رو پیدا کن
  useEffect(() => {
    if (profile && profile.region && locations && !selectedRegionId) {
      const location = locations.find(l => l.name === profile.region);
      if (location) {
        setSelectedRegionId(location.id);
      }
    }
  }, [profile, locations, selectedRegionId]);

  // Handle تغییرات فرم
  const handleChange = (field: keyof UpdateAgentProfilePayload, value: string | number | undefined) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle تغییر شهر
  const handleCityChange = (cityId: string) => {
    const city = cities?.find(c => c.id === parseInt(cityId));
    if (city) {
      setSelectedCityId(city.id);
      setSelectedRegionId(undefined);
      handleChange('city', city.id);
      handleChange('region', undefined);
    }
  };

  // Handle تغییر منطقه
  const handleLocationChange = (locationId: string) => {
    const location = locations?.find(l => l.id === parseInt(locationId));
    if (location) {
      setSelectedRegionId(location.id);
      handleChange('region', location.id);
    }
  };

  // Handle انتخاب فایل
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // بررسی نوع فایل
    if (!file.type.startsWith('image/')) {
      alert('لطفاً یک تصویر انتخاب کنید');
      return;
    }

    // بررسی حجم فایل (حداکثر 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم تصویر نباید بیشتر از 5 مگابایت باشد');
      return;
    }

    setSelectedFile(file);
    setShouldDeleteImage(false);
    
    // ایجاد preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle حذف عکس
  const handleDeleteImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setShouldDeleteImage(true);
  };

  // ذخیره تغییرات
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload: UpdateAgentProfilePayload = {};
    
    // اضافه کردن فقط فیلدهایی که مقدار معتبر دارند
    Object.keys(formData).forEach((key) => {
      const k = key as keyof UpdateAgentProfilePayload;
      const value = formData[k];
      
      // برای string ها: فقط اگر خالی نباشد
      if (typeof value === 'string' && value.trim() !== '') {
        payload[k] = value as any;
      }
      // برای number ها: فقط اگر undefined نباشد
      else if (typeof value === 'number') {
        payload[k] = value as any;
      }
    });

    // اگر فایل جدید انتخاب شده
    if (selectedFile) {
      payload.profile_image = selectedFile;
    }

    // اگر قصد حذف عکس داریم
    if (shouldDeleteImage && !selectedFile) {
      payload.delete_profile_image = true;
    }

    console.log('Payload to send:', payload); // برای debug

    try {
      await updateProfileMutation.mutateAsync(payload);
      // ریست کردن state های مربوط به عکس
      setSelectedFile(null);
      setPreviewUrl(null);
      setShouldDeleteImage(false);
    } catch (error) {
      console.error('Update error:', error);
      // خطا توسط mutation handle میشه
    }
  };

  // Handle بازگشت به حالت اولیه
  const handleReset = () => {
    if (profile) {
      setFormData({
        full_name: profile.full_name,
        office_name: profile.office_name || '',
        office_address: profile.office_address || '',
        office_phone: profile.office_phone || '',
        years_of_experience: profile.years_of_experience || 0,
        specialties: profile.specialties || '',
        bio: profile.bio || '',
        website: profile.website || '',
        instagram: profile.instagram || '',
      });
      
      // ریست عکس
      setSelectedFile(null);
      setPreviewUrl(null);
      setShouldDeleteImage(false);
      
      // ریست شهر و منطقه
      if (profile.city && cities) {
        const city = cities.find(c => c.name === profile.city);
        if (city) {
          setSelectedCityId(city.id);
        }
      }
      
      if (profile.region && locations) {
        const location = locations.find(l => l.name === profile.region);
        if (location) {
          setSelectedRegionId(location.id);
        }
      }
    }
  };

  if (isLoading) {
    return <SettingsSkeleton />;
  }

  if (!profile) {
    return null;
  }

  // تعیین URL نمایش عکس
  const displayImageUrl = previewUrl || (shouldDeleteImage ? null : getMediaUrl(profile.profile_image));

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 p-3 sm:p-4 md:p-6">
      {/* Header با Gradient */}
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 p-4 sm:p-6 md:p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
        <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="relative group">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 border-4 border-white/20 shadow-2xl transition-transform group-hover:scale-105">
              <AvatarImage src={displayImageUrl || undefined} />
              <AvatarFallback className="text-2xl sm:text-3xl md:text-4xl bg-gradient-to-br from-blue-400 to-indigo-600">
                {profile.full_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            {profile.is_verified && (
              <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1 sm:p-1.5 border-2 border-white shadow-lg">
                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 text-center sm:text-right">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-2 sm:gap-3">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
              ویرایش پروفایل مشاور
            </h1>
            <p className="text-blue-100 text-sm sm:text-base md:text-lg">
              {profile.full_name}
            </p>
            {profile.license_number && (
              <Badge className="mt-2 bg-white/20 text-white border-white/30 text-xs sm:text-sm">
                پروانه کسب: {profile.license_number}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* هشدار فیلدهای غیرقابل ویرایش */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-5 w-5 text-blue-600" />
        <AlertDescription className="text-blue-900">
          برخی اطلاعات مانند شماره تماس، کد ملی و شماره پروانه کسب فقط توسط مدیریت قابل تغییر هستند.
        </AlertDescription>
      </Alert>

      {/* تصویر پروفایل */}
      <Card className="border-2 hover:border-blue-300 transition-all shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Camera className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>تصویر پروفایل</CardTitle>
              <CardDescription>تصویر پروفایل خود را بروزرسانی یا حذف کنید</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8">
            <div className="relative group">
              <Avatar className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 border-4 border-blue-100 shadow-xl transition-all group-hover:border-blue-300 group-hover:scale-105">
                <AvatarImage src={displayImageUrl || undefined} />
                <AvatarFallback className="text-2xl sm:text-3xl md:text-4xl bg-gradient-to-br from-blue-400 to-indigo-600 text-white">
                  {profile.full_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
            </div>
            <div className="flex-1 w-full space-y-3 sm:space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={updateProfileMutation.isPending}
                  className="gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all text-xs sm:text-sm flex-1 sm:flex-none"
                >
                  <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{selectedFile ? 'تغییر تصویر' : 'انتخاب تصویر جدید'}</span>
                  <span className="sm:hidden">{selectedFile ? 'تغییر' : 'انتخاب'}</span>
                </Button>
                {(profile.profile_image || selectedFile) && !shouldDeleteImage && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDeleteImage}
                    disabled={updateProfileMutation.isPending}
                    className="gap-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all text-xs sm:text-sm flex-1 sm:flex-none"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">حذف تصویر</span>
                    <span className="sm:hidden">حذف</span>
                  </Button>
                )}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                <p>• حداکثر حجم: 5 مگابایت</p>
                <p>• فرمت‌های مجاز: JPG, PNG</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* فرم اطلاعات */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* اطلاعات پایه */}
        <Card className="border-2 hover:border-green-300 transition-all shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <User className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle>اطلاعات پایه</CardTitle>
                <CardDescription>اطلاعات شخصی و حرفه‌ای خود را وارد کنید</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="flex items-center gap-2 text-base">
                  <User className="w-4 h-4 text-green-600" />
                  نام و نام خانوادگی *
                </Label>
                <Input
                  id="full_name"
                  value={formData.full_name || ''}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  required
                  maxLength={100}
                  className="h-12 border-2 focus:border-green-400 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="years_of_experience" className="flex items-center gap-2 text-base">
                  <Award className="w-4 h-4 text-green-600" />
                  سابقه کار (سال)
                </Label>
                <Input
                  id="years_of_experience"
                  type="number"
                  min="0"
                  value={formData.years_of_experience || 0}
                  onChange={(e) => handleChange('years_of_experience', parseInt(e.target.value) || 0)}
                  className="h-12 border-2 focus:border-green-400 transition-all"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="specialties" className="flex items-center gap-2 text-base">
                  <Briefcase className="w-4 h-4 text-green-600" />
                  تخصص‌ها
                </Label>
                <Input
                  id="specialties"
                  value={formData.specialties || ''}
                  onChange={(e) => handleChange('specialties', e.target.value)}
                  placeholder="خرید، فروش، رهن، زمین"
                  maxLength={200}
                  className="h-12 border-2 focus:border-green-400 transition-all"
                />
                <p className="text-xs text-muted-foreground">تخصص‌های خود را با کاما (،) از هم جدا کنید</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* اطلاعات دفتر */}
        <Card className="border-2 hover:border-purple-300 transition-all shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Building2 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle>اطلاعات دفتر</CardTitle>
                <CardDescription>مشخصات دفتر املاک خود را وارد کنید</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="office_name" className="flex items-center gap-2 text-base">
                  <Building2 className="w-4 h-4 text-purple-600" />
                  نام دفتر املاک
                </Label>
                <Input
                  id="office_name"
                  value={formData.office_name || ''}
                  onChange={(e) => handleChange('office_name', e.target.value)}
                  maxLength={100}
                  className="h-12 border-2 focus:border-purple-400 transition-all"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="office_phone" className="flex items-center gap-2 text-base">
                  <Phone className="w-4 h-4 text-purple-600" />
                  تلفن دفتر
                </Label>
                <Input
                  id="office_phone"
                  type="tel"
                  value={formData.office_phone || ''}
                  onChange={(e) => handleChange('office_phone', e.target.value)}
                  maxLength={20}
                  placeholder="021-12345678"
                  className="h-12 border-2 focus:border-purple-400 transition-all"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center gap-2 text-base">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  شهر
                </Label>
                <Select
                  value={selectedCityId?.toString() || ''}
                  onValueChange={handleCityChange}
                >
                  <SelectTrigger id="city" className="h-12 border-2 focus:border-purple-400">
                    <SelectValue placeholder="انتخاب شهر" />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingCities ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
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
                <Label htmlFor="region" className="flex items-center gap-2 text-base">
                  <MapPin className="w-4 h-4 text-purple-600" />
                  منطقه
                </Label>
                <Select
                  value={selectedRegionId?.toString() || ''}
                  onValueChange={handleLocationChange}
                  disabled={!selectedCityId}
                >
                  <SelectTrigger id="region" className="h-12 border-2 focus:border-purple-400">
                    <SelectValue placeholder={!selectedCityId ? "ابتدا شهر را انتخاب کنید" : "انتخاب منطقه"} />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingLocations ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" />
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="office_address" className="flex items-center gap-2 text-base">
                <MapPin className="w-4 h-4 text-purple-600" />
                آدرس دفتر
              </Label>
              <Textarea
                id="office_address"
                value={formData.office_address || ''}
                onChange={(e) => handleChange('office_address', e.target.value)}
                rows={3}
                className="border-2 focus:border-purple-400 transition-all resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* اطلاعات تکمیلی */}
        <Card className="border-2 hover:border-orange-300 transition-all shadow-lg overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <CardTitle>اطلاعات تکمیلی</CardTitle>
                <CardDescription>درباره خود و شبکه‌های اجتماعی</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bio" className="flex items-center gap-2 text-base">
                <FileText className="w-4 h-4 text-orange-600" />
                درباره من
              </Label>
              <Textarea
                id="bio"
                value={formData.bio || ''}
                onChange={(e) => handleChange('bio', e.target.value)}
                rows={5}
                placeholder="توضیحات کوتاهی درباره خودتان و فعالیت‌هایتان..."
                className="border-2 focus:border-orange-400 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="website" className="flex items-center gap-2 text-base">
                  <Globe className="w-4 h-4 text-orange-600" />
                  وب‌سایت
                </Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website || ''}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://example.com"
                  className="h-12 border-2 focus:border-orange-400 transition-all"
                  dir="ltr"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center gap-2 text-base">
                  <Instagram className="w-4 h-4 text-orange-600" />
                  اینستاگرام
                </Label>
                <Input
                  id="instagram"
                  type="url"
                  value={formData.instagram || ''}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/username"
                  className="h-12 border-2 focus:border-orange-400 transition-all"
                  dir="ltr"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* دکمه‌های عملیات */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 pb-2 sm:pb-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={updateProfileMutation.isPending}
            className="gap-2 h-10 sm:h-12 hover:bg-gray-100 transition-all text-xs sm:text-sm w-full sm:w-auto"
          >
            <RefreshCcw className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">بازگشت به حالت اولیه</span>
            <span className="sm:hidden">بازگشت</span>
          </Button>
          <Button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="gap-2 h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all text-xs sm:text-sm w-full sm:w-auto"
          >
            {updateProfileMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                <span className="hidden sm:inline">در حال ذخیره...</span>
                <span className="sm:hidden">ذخیره...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">ذخیره تغییرات</span>
                <span className="sm:hidden">ذخیره</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

/**
 * Skeleton برای حالت loading
 */
function SettingsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <div className="rounded-2xl bg-gradient-to-r from-gray-200 to-gray-300 p-8 h-48 animate-pulse"></div>
      
      <Skeleton className="h-12 w-full" />
      
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <Skeleton className="w-32 h-32 rounded-full" />
            <Skeleton className="h-10 w-48" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
