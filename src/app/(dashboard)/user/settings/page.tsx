'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, Save, Loader2 } from 'lucide-react';
import { useUpdateProfile } from '@/hooks/useProfileMutations';
import { useAuth } from '@/contexts/AuthContext';

type ProfileFields = {
  phone: string;
  full_name: string;
  email: string;
  is_agent: boolean;
  is_active: boolean;
  date_joined?: string;
};

function resolveProfile(
  backendUser: ReturnType<typeof useAuth>['backendUser'],
  user: ReturnType<typeof useAuth>['user']
): ProfileFields | null {
  if (!backendUser && !user) return null;

  const backend = backendUser as (Record<string, unknown> & typeof backendUser) | null;

  return {
    phone: backendUser?.phone || user?.phone || '',
    full_name:
      (typeof backend?.full_name === 'string' ? backend.full_name : '') ||
      backendUser?.name ||
      user?.name ||
      '',
    email: backendUser?.email || user?.email || '',
    is_agent: Boolean(backendUser?.is_agent ?? user?.type === 'agent'),
    is_active: typeof backend?.is_active === 'boolean' ? backend.is_active : true,
    date_joined:
      typeof backend?.date_joined === 'string' ? backend.date_joined : undefined,
  };
}

export default function UserSettingsPage() {
  const { user, backendUser, isLoading: authLoading, refreshUser } = useAuth();
  const [profile, setProfile] = useState<ProfileFields | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const updateProfileMutation = useUpdateProfile();

  useEffect(() => {
    if (authLoading) return;

    const nextProfile = resolveProfile(backendUser, user);
    if (!nextProfile) return;

    setProfile(nextProfile);
    setFullName(nextProfile.full_name);
    setEmail(nextProfile.email);
  }, [authLoading, backendUser, user]);

  const validateEmail = (value: string): boolean => {
    if (!value) return true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError('فرمت ایمیل نامعتبر است');
      return false;
    }

    setEmailError('');
    return true;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !validateEmail(email)) return;

    const payload: { full_name?: string; email?: string } = {};

    if (fullName.trim() && fullName.trim() !== profile.full_name) {
      payload.full_name = fullName.trim();
    }

    if (email.trim() && email.trim() !== profile.email) {
      payload.email = email.trim();
    }

    if (Object.keys(payload).length === 0) return;

    updateProfileMutation.mutate(payload, {
      onSuccess: async (data) => {
        const updated = data.user;
        const nextProfile: ProfileFields = {
          phone: updated.phone || profile.phone,
          full_name: updated.full_name || fullName.trim(),
          email: updated.email || email.trim(),
          is_agent: updated.is_agent ?? profile.is_agent,
          is_active: updated.is_active ?? profile.is_active,
          date_joined: updated.date_joined || profile.date_joined,
        };

        setProfile(nextProfile);
        setFullName(nextProfile.full_name);
        setEmail(nextProfile.email || '');
        await refreshUser();
      },
    });
  };

  if (authLoading || !profile) {
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
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                شماره تلفن
              </Label>
              <Input
                id="phone"
                type="tel"
                value={profile.phone}
                disabled
                className="bg-muted"
                dir="ltr"
              />
              <p className="text-xs text-muted-foreground">
                شماره تلفن قابل تغییر نیست
              </p>
            </div>

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

            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-3">اطلاعات حساب</h3>
              <div className="grid gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">نوع کاربر:</span>
                  <span className="font-medium">
                    {profile.is_agent ? 'مشاور املاک' : 'کاربر عادی'}
                  </span>
                </div>
                {profile.date_joined && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">تاریخ عضویت:</span>
                    <span className="font-medium" dir="ltr">
                      {new Date(profile.date_joined).toLocaleDateString('fa-IR')}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">وضعیت حساب:</span>
                  <span
                    className={`font-medium ${
                      profile.is_active ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {profile.is_active ? 'فعال' : 'غیرفعال'}
                  </span>
                </div>
              </div>
            </div>

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
                  setFullName(profile.full_name || '');
                  setEmail(profile.email || '');
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
