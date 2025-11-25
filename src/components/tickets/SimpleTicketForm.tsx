'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubmitSimpleTicket } from '@/hooks/useTickets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Send, CheckCircle } from 'lucide-react';

interface SimpleTicketFormProps {
  onSuccess?: () => void;
}

/**
 * فرم ثبت تیکت ساده
 */
export default function SimpleTicketForm({ onSuccess }: SimpleTicketFormProps) {
  const { user, backendUser } = useAuth();
  const submitMutation = useSubmitSimpleTicket();
  
  const [fullName, setFullName] = useState(backendUser?.full_name || '');
  const [phone, setPhone] = useState(backendUser?.phone || '');
  const [isReferral, setIsReferral] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await submitMutation.mutateAsync({
        full_name: fullName,
        phone: phone || undefined,
        is_referral: isReferral,
      });
      
      setSubmitted(true);
      
      // Reset form و بستن modal بعد از 2 ثانیه
      setTimeout(() => {
        setSubmitted(false);
        if (!backendUser?.full_name) {
          setFullName('');
        }
        if (!backendUser?.phone) {
          setPhone('');
        }
        setIsReferral(false);
        onSuccess?.();
      }, 2000);
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
          <p className="text-muted-foreground">
            به زودی کارشناسان ما با شما تماس خواهند گرفت
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card dir="rtl">
      <CardContent className="pt-6">
        {user && backendUser?.full_name && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              اطلاعات شما از پروفایل کاربری بارگذاری شده است
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
          {/* نام و نام خانوادگی */}
          <div className="space-y-2">
            <Label htmlFor="full_name">
              نام و نام خانوادگی *
            </Label>
            <Input
              id="full_name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="علی احمدی"
              required
              disabled={submitMutation.isPending}
              className="text-right"
              dir="rtl"
            />
          </div>

          {/* شماره تماس */}
          <div className="space-y-2">
            <Label htmlFor="phone">
              شماره تماس *
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09123456789"
              required
              disabled={submitMutation.isPending || (user && !!backendUser?.phone)}
              className={`text-right ${user && backendUser?.phone ? 'bg-muted' : ''}`}
              dir="ltr"
            />
            {user && backendUser?.phone && (
              <p className="text-xs text-muted-foreground text-right">
                از اطلاعات حساب کاربری شما استفاده می‌شود
              </p>
            )}
          </div>

          {/* معرف هستم */}
          <div className="flex items-center space-x-2 space-x-reverse">
            <Checkbox
              id="is_referral"
              checked={isReferral}
              onCheckedChange={(checked) => setIsReferral(checked as boolean)}
              disabled={submitMutation.isPending}
            />
            <Label
              htmlFor="is_referral"
              className="text-sm font-normal cursor-pointer"
            >
              مایل به دریافت کد معرف هستم
            </Label>
          </div>

          {isReferral && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-right">
              <p className="text-sm text-blue-800 leading-relaxed">
                💰 با دریافت کد معرف، می‌توانید از تخفیف‌های ویژه برخوردار شوید و با معرفی دوستان خود، پورسانت دریافت کنید.
              </p>
            </div>
          )}

          {/* دکمه ارسال */}
          <Button
            type="submit"
            className="w-full"
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                در حال ارسال...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 ml-2" />
                ارسال درخواست
              </>
            )}
          </Button>

          {!user && (
            <p className="text-xs text-center text-muted-foreground">
              با ورود به حساب کاربری، اطلاعات شما به صورت خودکار تکمیل می‌شود
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

