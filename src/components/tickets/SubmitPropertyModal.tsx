'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SimpleTicketForm from '@/components/tickets/SimpleTicketForm';
import FullTicketForm from '@/components/tickets/FullTicketForm';
import { Zap, FileText, LogIn } from 'lucide-react';
import LoginModal from '@/components/LoginModal';

interface SubmitPropertyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * مودال ثبت درخواست ملک
 */
export default function SubmitPropertyModal({ open, onOpenChange }: SubmitPropertyModalProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [selectedForm, setSelectedForm] = useState<'simple' | 'full' | null>(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // اگر کاربر لاگین نبود و مودال باز شد، لاگین را نشان بده
  useEffect(() => {
    if (open && !isAuthenticated) {
      setLoginModalOpen(true);
      onOpenChange(false);
    }
  }, [open, isAuthenticated, onOpenChange]);

  // اگر کاربر لاگین نبود، مودال لاگین را نشان بده
  if (!isAuthenticated) {
    return (
      <>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="max-w-md" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-2xl">ورود به حساب کاربری</DialogTitle>
              <DialogDescription>
                برای ثبت درخواست آگهی، ابتدا باید وارد حساب کاربری خود شوید
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Button 
                className="w-full gap-2" 
                onClick={() => {
                  onOpenChange(false);
                  setLoginModalOpen(true);
                }}
              >
                <LogIn className="h-4 w-4" />
                ورود / ثبت نام
              </Button>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => onOpenChange(false)}
              >
                انصراف
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <LoginModal 
          open={loginModalOpen} 
          onOpenChange={(open) => {
            setLoginModalOpen(open);
            if (!open && isAuthenticated) {
              // بعد از لاگین موفق، مودال ثبت ملک را دوباره باز کن
              onOpenChange(true);
            }
          }} 
        />
      </>
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          // Reset form selection when modal closes
          setTimeout(() => setSelectedForm(null), 200);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl">ثبت درخواست آگهی</DialogTitle>
            <DialogDescription>
              روش مناسب خود را انتخاب کنید
            </DialogDescription>
          </DialogHeader>

        <div className="space-y-6">
          {!selectedForm ? (
            <>
              {/* دکمه‌های انتخاب */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="rtl">
                <Button
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-end justify-start gap-3 hover:bg-blue-50 hover:border-blue-300 transition-all text-right"
                  onClick={() => setSelectedForm('simple')}
                >
                  <div className="flex items-center gap-2 w-full justify-end flex-wrap">
                    <h4 className="font-semibold text-lg text-blue-900">درخواست سریع</h4>
                    <Zap className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-muted-foreground text-right leading-relaxed w-full">
                    فقط نام و شماره تلفن خود را وارد کنید.<br />
                    ما با شما تماس می‌گیریم و اطلاعات را دریافت می‌کنیم.
                  </p>
                </Button>

                <Button
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-end justify-start gap-3 hover:bg-green-50 hover:border-green-300 transition-all text-right"
                  onClick={() => setSelectedForm('full')}
                >
                  <div className="flex items-center gap-2 w-full justify-end flex-wrap">
                    <h4 className="font-semibold text-lg text-green-900">درخواست کامل</h4>
                    <FileText className="w-6 h-6 text-green-600 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-muted-foreground text-right leading-relaxed w-full">
                    تمام اطلاعات ملک را وارد کنید.<br />
                    درخواست شما فوراً به مشاور اختصاص می‌یابد.
                  </p>
                </Button>
              </div>

              {/* نکته مهم */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <p className="text-sm text-blue-900 text-center">
                    💡 کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت
                  </p>
                </CardContent>
              </Card>
            </>
          ) : selectedForm === 'simple' ? (
            <div className="space-y-4" dir="rtl">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedForm(null)}
                className="mb-2"
              >
                بازگشت ←
              </Button>
              <SimpleTicketForm onSuccess={() => onOpenChange(false)} />
            </div>
          ) : (
            <div className="space-y-4" dir="rtl">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedForm(null)}
                className="mb-2"
              >
                بازگشت ←
              </Button>
              <FullTicketForm onSuccess={() => onOpenChange(false)} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}

