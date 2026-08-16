'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useAgentRequest } from '@/hooks/useAgentRequest';
import { hasPendingAgentRequest } from '@/services/agentRequestApi';
import { useCities, useLocations } from '@/hooks/usePropertyMutations';
import { Card } from '@/components/ui/card';
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
import { 
  User, 
  Phone, 
  Mail, 
  IdCard, 
  Briefcase, 
  Building2, 
  MapPin, 
  Award, 
  FileText,
  CheckCircle2,
  Loader2,
  Clock3,
} from 'lucide-react';

/**
 * کامپوننت صفحه درخواست تبدیل به agent
 */
export default function BecomeAgentClient() {
  const router = useRouter();
  const { isAuthenticated, user, backendUser } = useAuth();
  const { mutate: submitRequest, isPending, isSuccess } = useAgentRequest();
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  
  // دریافت لیست شهرها و مناطق
  const { data: cities = [] } = useCities();
  const [selectedCityId, setSelectedCityId] = useState<string>('');
  const { data: locations = [] } = useLocations(
    selectedCityId ? parseInt(selectedCityId, 10) : undefined
  );

  // State برای فرم
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    national_id: '',
    license_number: '',
    office_name: '',
    office_address: '',
    office_phone: '',
    city: '',
    region: '',
    years_of_experience: '',
    specialties: '',
    bio: '',
  });

  // State برای validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // پر کردن فیلدها از اطلاعات کاربر (اگر لاگین باشد)
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        full_name: user.name || prev.full_name,
        phone: user.phone || prev.phone,
        email: user.email || prev.email,
      }));
    }
  }, [isAuthenticated, user]);

  // اگر قبلاً درخواست ثبت شده، فرم را نشان نده
  useEffect(() => {
    if (user?.phone && hasPendingAgentRequest(user.phone)) {
      setHasPendingRequest(true);
    }
  }, [user?.phone]);

  // بررسی اینکه آیا کاربر قبلاً agent است
  useEffect(() => {
    if (backendUser?.agent_profile) {
      router.push('/agent');
    }
  }, [backendUser, router]);

  // اگر کاربر لاگین نباشد، به صفحه login هدایت کن
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?from=/become-agent');
    }
  }, [isAuthenticated, router]);

  // Validation
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'نام و نام خانوادگی الزامی است';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'شماره تماس الزامی است';
    } else if (!/^09\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'شماره تماس معتبر نیست (باید با 09 شروع شود و 11 رقم باشد)';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'ایمیل معتبر نیست';
    }

    if (formData.national_id && !/^\d{10}$/.test(formData.national_id)) {
      newErrors.national_id = 'کد ملی باید 10 رقم باشد';
    }

    if (formData.years_of_experience) {
      const years = parseInt(formData.years_of_experience, 10);
      if (isNaN(years) || years < 0 || years > 100) {
        newErrors.years_of_experience = 'سال سابقه کار باید عددی بین 0 تا 100 باشد';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // آماده‌سازی داده‌ها برای ارسال
    const payload = {
      full_name: formData.full_name.trim(),
      phone: formData.phone.trim().replace(/\s/g, ''),
      email: formData.email.trim() || undefined,
      national_id: formData.national_id.trim() || undefined,
      license_number: formData.license_number.trim() || undefined,
      office_name: formData.office_name.trim() || undefined,
      office_address: formData.office_address.trim() || undefined,
      office_phone: formData.office_phone.trim() || undefined,
      city: formData.city || undefined,
      region: formData.region || undefined,
      years_of_experience: formData.years_of_experience 
        ? parseInt(formData.years_of_experience, 10) 
        : undefined,
      specialties: formData.specialties.trim() || undefined,
      bio: formData.bio.trim() || undefined,
    };

    submitRequest(payload, {
      onSuccess: () => {
        setHasPendingRequest(true);
      },
    });
  };

  // Reset region وقتی city تغییر می‌کند
  const handleCityChange = (value: string) => {
    setFormData((prev) => ({ ...prev, city: value, region: '' }));
    setSelectedCityId(value);
  };

  if (!isAuthenticated) {
    return null; // در حال redirect است
  }

  if (hasPendingRequest || isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card className="p-8 md:p-10 text-center shadow-lg">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Clock3 className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              درخواست شما ثبت شد
            </h1>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              درخواست تبدیل به مشاور با موفقیت ثبت شده و در وضعیت «در انتظار بررسی» است.
              پس از بررسی تیم گویا، نتیجه از طریق حساب کاربری شما اطلاع‌رسانی می‌شود.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild size="lg">
                <Link href="/user">بازگشت به داشبورد</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/properties">مشاهده املاک</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
            <Briefcase className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">درخواست تبدیل به مشاور</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            تبدیل به مشاور املاک گویا
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            با پر کردن فرم زیر، درخواست خود را برای تبدیل به مشاور املاک ثبت کنید. 
            پس از بررسی و تایید درخواست، پروفایل مشاور برای شما ایجاد خواهد شد.
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">بررسی سریع</p>
                <p className="text-xs text-muted-foreground">درخواست شما به سرعت بررسی می‌شود</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">پشتیبانی کامل</p>
                <p className="text-xs text-muted-foreground">همراهی تیم گویا در تمام مراحل</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-primary/20 bg-primary/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold text-sm">دسترسی کامل</p>
                <p className="text-xs text-muted-foreground">به تمام امکانات پلتفرم</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Form Card */}
        <Card className="p-6 md:p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* اطلاعات شخصی */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">اطلاعات شخصی</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* نام و نام خانوادگی */}
                <div className="space-y-2">
                  <Label htmlFor="full_name">
                    نام و نام خانوادگی <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="full_name"
                      type="text"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      className={`pr-10 ${errors.full_name ? 'border-red-500' : ''}`}
                      placeholder="مثال: محمد رضایی"
                      required
                    />
                  </div>
                  {errors.full_name && (
                    <p className="text-sm text-red-500">{errors.full_name}</p>
                  )}
                </div>

                {/* شماره تماس */}
                <div className="space-y-2">
                  <Label htmlFor="phone">
                    شماره تماس <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`pr-10 ${errors.phone ? 'border-red-500' : ''}`}
                      placeholder="09123456789"
                      required
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                {/* ایمیل */}
                <div className="space-y-2">
                  <Label htmlFor="email">ایمیل</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`pr-10 ${errors.email ? 'border-red-500' : ''}`}
                      placeholder="example@email.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* کد ملی */}
                <div className="space-y-2">
                  <Label htmlFor="national_id">کد ملی</Label>
                  <div className="relative">
                    <IdCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="national_id"
                      type="text"
                      value={formData.national_id}
                      onChange={(e) => setFormData({ ...formData, national_id: e.target.value.replace(/\D/g, '') })}
                      className={`pr-10 ${errors.national_id ? 'border-red-500' : ''}`}
                      placeholder="1234567890"
                      maxLength={10}
                    />
                  </div>
                  {errors.national_id && (
                    <p className="text-sm text-red-500">{errors.national_id}</p>
                  )}
                </div>
              </div>
            </div>

            {/* اطلاعات حرفه‌ای */}
            <div className="space-y-4 pt-6 border-t">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">اطلاعات حرفه‌ای</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* شماره پروانه کسب */}
                <div className="space-y-2">
                  <Label htmlFor="license_number">شماره پروانه کسب</Label>
                  <Input
                    id="license_number"
                    type="text"
                    value={formData.license_number}
                    onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                    placeholder="شماره پروانه کسب"
                  />
                </div>

                {/* سال سابقه کار */}
                <div className="space-y-2">
                  <Label htmlFor="years_of_experience">سال سابقه کار</Label>
                  <Input
                    id="years_of_experience"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.years_of_experience}
                    onChange={(e) => setFormData({ ...formData, years_of_experience: e.target.value })}
                    className={errors.years_of_experience ? 'border-red-500' : ''}
                    placeholder="0"
                  />
                  {errors.years_of_experience && (
                    <p className="text-sm text-red-500">{errors.years_of_experience}</p>
                  )}
                </div>

                {/* تخصص‌ها */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="specialties">تخصص‌ها</Label>
                  <Input
                    id="specialties"
                    type="text"
                    value={formData.specialties}
                    onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                    placeholder="مثال: خرید، فروش، رهن، زمین"
                  />
                  <p className="text-xs text-muted-foreground">
                    تخصص‌های خود را با کاما جدا کنید
                  </p>
                </div>
              </div>
            </div>

            {/* اطلاعات دفتر */}
            <div className="space-y-4 pt-6 border-t">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">اطلاعات دفتر املاک</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* نام دفتر */}
                <div className="space-y-2">
                  <Label htmlFor="office_name">نام دفتر املاک</Label>
                  <Input
                    id="office_name"
                    type="text"
                    value={formData.office_name}
                    onChange={(e) => setFormData({ ...formData, office_name: e.target.value })}
                    placeholder="نام دفتر املاک"
                  />
                </div>

                {/* تلفن دفتر */}
                <div className="space-y-2">
                  <Label htmlFor="office_phone">تلفن دفتر</Label>
                  <Input
                    id="office_phone"
                    type="tel"
                    value={formData.office_phone}
                    onChange={(e) => setFormData({ ...formData, office_phone: e.target.value })}
                    placeholder="02112345678"
                  />
                </div>

                {/* آدرس دفتر */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="office_address">آدرس دفتر</Label>
                  <Textarea
                    id="office_address"
                    value={formData.office_address}
                    onChange={(e) => setFormData({ ...formData, office_address: e.target.value })}
                    placeholder="آدرس کامل دفتر املاک"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* موقعیت جغرافیایی */}
            <div className="space-y-4 pt-6 border-t">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">موقعیت جغرافیایی</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* شهر */}
                <div className="space-y-2">
                  <Label htmlFor="city">شهر</Label>
                  <Select value={formData.city} onValueChange={handleCityChange}>
                    <SelectTrigger id="city">
                      <SelectValue placeholder="انتخاب شهر" />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* منطقه */}
                <div className="space-y-2">
                  <Label htmlFor="region">منطقه</Label>
                  <Select 
                    value={formData.region} 
                    onValueChange={(value) => setFormData({ ...formData, region: value })}
                    disabled={!formData.city}
                  >
                    <SelectTrigger id="region">
                      <SelectValue placeholder={formData.city ? "انتخاب منطقه" : "ابتدا شهر را انتخاب کنید"} />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id.toString()}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* توضیحات */}
            <div className="space-y-4 pt-6 border-t">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">توضیحات</h2>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">درباره خود</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="توضیحات درباره خود، تجربیات و مهارت‌هایتان..."
                  rows={5}
                />
                <p className="text-xs text-muted-foreground">
                  این توضیحات در پروفایل شما نمایش داده می‌شود
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t">
              <Button
                type="submit"
                className="w-full md:w-auto min-w-[200px]"
                size="lg"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 ml-2" />
                    ثبت درخواست
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}





