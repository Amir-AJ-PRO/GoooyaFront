'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth, UserType } from '@/contexts/AuthContext';
import { Home, Phone, KeyRound, X } from 'lucide-react';
import { toast } from 'sonner';
import { useRequestOTP, useVerifyOTP } from '@/hooks/useAuthMutations';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** توضیح سفارشی بالای فرم */
  description?: string;
  /** بعد از ورود به پنل هدایت نشود (مثلاً برگشت به مدال داستان) */
  redirectOnSuccess?: boolean;
  onSuccess?: () => void;
}

export default function LoginModal({
  open,
  onOpenChange,
  description,
  redirectOnSuccess = true,
  onSuccess,
}: LoginModalProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const { login } = useAuth();
  const router = useRouter();

  // React Query mutations
  const requestOTPMutation = useRequestOTP();
  const verifyOTPMutation = useVerifyOTP();

  // تایمر شمارش معکوس برای ارسال مجدد OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setStep('phone');
        setPhoneNumber('');
        setOtpCode('');
        setCountdown(0);
      }, 200);
    }
  }, [open]);

  function persianDigitsToEnglish(s: string) {
    const map: Record<string, string> = {
      '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
      '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
    };
    return s.replace(/[۰-۹٠-٩]/g, (d) => map[d] ?? d);
  }

  function normalizeIranPhone(input: string): string | null {
    if (!input) return null;
    let s = input.trim();
    s = persianDigitsToEnglish(s);
    s = s.replace(/^\+/, "");
    s = s.replace(/[^0-9]/g, "");

    // تبدیل به فرمت 09xxxxxxxxx
    if (/^0?9\d{9}$/.test(s)) {
      if (s.length === 10 && s.startsWith("9")) return "0" + s;
      if (s.length === 11 && s.startsWith("0")) return s;
    }

    if (/^98?9\d{9}$/.test(s)) {
      if (s.length === 12 && s.startsWith("98")) return "0" + s.slice(2);
      if (s.length === 11 && s.startsWith("9")) return "0" + s;
    }

    return null;
  }

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const normalized = normalizeIranPhone(phoneNumber);
    if (!normalized) {
      toast.error("شماره تلفن نامعتبر", {
        description: "لطفا یک شماره تلفن معتبر وارد کنید (مثال: 09123456789)"
      });
      return;
    }

    requestOTPMutation.mutate(
      { phone: normalized },
      {
        onSuccess: () => {
          setPhoneNumber(normalized);
          setStep('otp');
          setCountdown(60); // 60 ثانیه تایمر
        }
      }
    );
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otpCode.length !== 6) {
      toast.error("کد تایید نامعتبر", {
        description: "لطفا کد 6 رقمی را وارد کنید"
      });
      return;
    }

    verifyOTPMutation.mutate(
      { phone: phoneNumber, code: otpCode },
      {
        onSuccess: (data) => {
          // Login (HttpOnly Cookie در server ذخیره شده)
          login(data.user);
          
          const welcomeMessage = data.created 
            ? "حساب کاربری شما ایجاد شد. خوش آمدید!"
            : `خوش آمدید${data.user.is_agent ? ' به پنل مشاور' : ''}!`;
          
          toast.success("ورود موفقیت‌آمیز", {
            description: welcomeMessage
          });
          
          onOpenChange(false);
          onSuccess?.();

          if (redirectOnSuccess) {
            const redirectPath = data.user.is_agent ? '/agent' : '/user';
            router.push(redirectPath);
          }
        }
      }
    );
  };

  const handleResendOTP = () => {
    if (countdown === 0) {
      requestOTPMutation.mutate(
        { phone: phoneNumber },
        {
          onSuccess: () => {
            setOtpCode('');
            setCountdown(60);
          }
        }
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" dir="rtl">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Home className="h-7 w-7" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            {step === 'phone' ? 'ورود / ثبت نام' : 'کد تایید'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === 'phone'
              ? description || 'شماره تلفن خود را وارد کنید'
              : `کد تایید به شماره ${phoneNumber} ارسال شد`}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {step === 'phone' ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div>
                <Label htmlFor="phone" className="text-right block mb-2">شماره تلفن</Label>
                <div className="relative">
                  <Phone className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="09123456789" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="text-right pr-10"
                    required 
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg" 
                disabled={requestOTPMutation.isPending}
              >
                {requestOTPMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    در حال ارسال...
                  </span>
                ) : (
                  "ارسال کد تایید"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <Label htmlFor="otp" className="text-right block mb-2">کد تایید 6 رقمی</Label>
                <div className="relative">
                  <KeyRound className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="otp" 
                    type="text" 
                    placeholder="123456" 
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="text-center text-2xl tracking-widest pr-10"
                    maxLength={6}
                    required 
                    autoFocus
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg" 
                disabled={verifyOTPMutation.isPending}
              >
                {verifyOTPMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    در حال تایید...
                  </span>
                ) : (
                  "تایید و ورود"
                )}
              </Button>

              {/* دکمه ارسال مجدد */}
              <div className="text-center text-sm">
                {countdown > 0 ? (
                  <p className="text-muted-foreground">
                    ارسال مجدد کد تا{' '}
                    <span className="font-bold text-primary">{countdown}</span>{' '}
                    ثانیه دیگر
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-primary hover:underline font-medium"
                    disabled={requestOTPMutation.isPending}
                  >
                    ارسال مجدد کد تایید
                  </button>
                )}
              </div>

              <Button 
                type="button" 
                variant="outline" 
                className="w-full" 
                onClick={() => {
                  setStep('phone');
                  setOtpCode('');
                  setCountdown(0);
                }}
                disabled={verifyOTPMutation.isPending}
              >
                ویرایش شماره تلفن
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

