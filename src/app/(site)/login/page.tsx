'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth, UserType } from "@/contexts/AuthContext";
import { Home, Phone, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { useRequestOTP, useVerifyOTP } from "@/hooks/useAuthMutations";

export default function Login() {
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

  function persianDigitsToEnglish(s: string) {
    const map: Record<string, string> = {
      '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
      '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
    };
    return s.replace(/[۰-۹٠-٩]/g, (d) => map[d] ?? d);
  }

  /**
   * نرمال‌سازی شماره تلفن ایران به فرمت 09xxxxxxxxx
   * Backend فرمت 09xxxxxxxxx را قبول می‌کند
   */
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

  /**
   * ارسال درخواست OTP
   */
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

  /**
   * تایید کد OTP
   */
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
          // تشخیص نوع کاربر بر اساس is_agent
          const userType: UserType = data.user.is_agent ? 'agent' : 'user';
          
          // ساخت آبجکت User برای AuthContext
          const mockUser = {
            id: data.user.phone,
            name: '',
            email: '',
            type: userType,
            phone: data.user.phone,
            company: (data.user.agent_profile as any)?.company_name,
            licenseNumber: (data.user.agent_profile as any)?.license_number,
          };
          
          login(mockUser);
          
          const welcomeMessage = data.created 
            ? "حساب کاربری شما ایجاد شد. خوش آمدید!"
            : `خوش آمدید${data.user.is_agent ? ' به پنل مشاور' : ''}!`;
          
          toast.success("ورود موفقیت‌آمیز", {
            description: welcomeMessage
          });
          
          // هدایت به پنل مناسب بر اساس نوع کاربر
          const redirectPath = data.user.is_agent ? '/agent' : '/user';
          router.push(redirectPath);
        }
      }
    );
  };

  /**
   * ارسال مجدد کد OTP
   */
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-primary/5 to-background p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Home className="h-7 w-7" />
          </div>
          <span className="text-3xl font-bold">گویا</span>
        </Link>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              {step === 'phone' ? 'ورود / ثبت نام' : 'کد تایید'}
            </CardTitle>
            <CardDescription>
              {step === 'phone' 
                ? 'شماره تلفن خود را وارد کنید' 
                : `کد تایید به شماره ${phoneNumber} ارسال شد`
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6" dir="rtl">
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
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-smooth text-sm">
            بازگشت به صفحه اصلی
          </Link>
        </div>
      </div>
    </div>
  );
}

