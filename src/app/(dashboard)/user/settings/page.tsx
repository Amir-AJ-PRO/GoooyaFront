'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, Save, Loader2 } from 'lucide-react';
import { useUpdateProfile } from '@/hooks/useProfileMutations';
import { UserData } from '@/services/authApi';

export default function UserSettingsPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  
  const updateProfileMutation = useUpdateProfile();

  // بارگذاری اطلاعات کاربر از localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user_data');
      if (storedUser) {
        const user: UserData = JSON.parse(storedUser);
        setUserData(user);
        setFullName(user.full_name || '');
        setEmail(user.email || '');
      }
    } catch (error) {
      console.error('خطا در بارگذاری اطلاعات کاربر:', error);
    }
  }, []);

  // Validation ایمیل
  const validateEmail = (email: string): boolean => {
    if (!email) return true; // ایمیل اختیاری است
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      setEmailError('فرمت ایمیل نامعتبر است');
      return false;
    }
    
    setEmailError('');
    return true;
  };

  // ذخیره تغییرات
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!validateEmail(email)) {
      return;
    }

    // فقط فیلدهای تغییر یافته را ارسال کن
    const payload: { full_name?: string; email?: string } = {};
    
    if (fullName.trim() && fullName !== userData?.full_name) {
      payload.full_name = fullName.trim();
    }
    
    if (email.trim() && email !== userData?.email) {
      payload.email = email.trim();
    }

    // اگر هیچ تغییری نداشت
    if (Object.keys(payload).length === 0) {
      return;
    }

    updateProfileMutation.mutate(payload, {
      onSuccess: (data) => {
        setUserData(data.user);
      }
    });
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">تنظیمات پروفایل</h1>
        <p className="text-muted-foreground mt-2">
          اطلاعات حساب کاربری خود را مدیریت کنید
        </p>
      </div>

      <Separator />

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات شخصی</CardTitle>
            <CardDescription>
              نام، ایمیل و سایر اطلاعات خود را ویرایش کنید
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* شماره تلفن (فقط نمایش) */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                شماره تلفن
              </Label>
              <Input
                id="phone"
                type="tel"
                value={userData.phone}
                disabled
                className="bg-muted"
                dir="ltr"
              />
              <p className="text-xs text-muted-foreground">
                شماره تلفن قابل تغییر نیست
              </p>
            </div>

            {/* نام و نام خانوادگی */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                نام و نام خانوادگی
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="مثال: علی احمدی"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground">
                {fullName.length}/100 کاراکتر
              </p>
            </div>

            {/* ایمیل */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                ایمیل
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                }}
                onBlur={() => validateEmail(email)}
                className={emailError ? 'border-red-500' : ''}
                dir="ltr"
              />
              {emailError && (
                <p className="text-xs text-red-500">{emailError}</p>
              )}
              <p className="text-xs text-muted-foreground">
                ایمیل باید یکتا و معتبر باشد
              </p>
            </div>

            {/* اطلاعات حساب */}
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-3">اطلاعات حساب</h3>
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">نوع کاربر:</span>
                  <span className="font-medium">
                    {userData.is_agent ? 'مشاور املاک' : 'کاربر عادی'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">تاریخ عضویت:</span>
                  <span className="font-medium" dir="ltr">
                    {new Date(userData.date_joined).toLocaleDateString('fa-IR')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">وضعیت حساب:</span>
                  <span className={`font-medium ${userData.is_active ? 'text-green-600' : 'text-red-600'}`}>
                    {userData.is_active ? 'فعال' : 'غیرفعال'}
                  </span>
                </div>
              </div>
            </div>

            {/* دکمه ذخیره */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={updateProfileMutation.isPending || !!emailError}
                className="gap-2"
              >
                {updateProfileMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    در حال ذخیره...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    ذخیره تغییرات
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setFullName(userData?.full_name || '');
                  setEmail(userData?.email || '');
                  setEmailError('');
                }}
                disabled={updateProfileMutation.isPending}
              >
                لغو
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

