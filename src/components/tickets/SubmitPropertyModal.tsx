'use client';

import { useState, useEffect } from 'react';
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

type FormType = 'simple' | 'full';

/**
 * مودال ثبت درخواست ملک
 * فرم‌ها بعد از اولین باز شدن unmount نمی‌شوند تا با بازگشت داده پاک نشود
 */
export default function SubmitPropertyModal({ open, onOpenChange }: SubmitPropertyModalProps) {
  const { isAuthenticated } = useAuth();
  const [selectedForm, setSelectedForm] = useState<FormType | null>(null);
  const [mountedForms, setMountedForms] = useState<Partial<Record<FormType, boolean>>>({});
  const [formKeys, setFormKeys] = useState({ simple: 0, full: 0 });
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  // اگر کاربر لاگین نبود و مودال باز شد، لاگین را نشان بده
  useEffect(() => {
    if (open && !isAuthenticated) {
      setLoginModalOpen(true);
      onOpenChange(false);
    }
  }, [open, isAuthenticated, onOpenChange]);

  const selectForm = (form: FormType) => {
    setSelectedForm(form);
    setMountedForms((prev) => ({ ...prev, [form]: true }));
  };

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
    if (!nextOpen) {
      // فقط هنگام بستن کامل مودال، state را ریست کن
      setTimeout(() => {
        setSelectedForm(null);
        setMountedForms({});
        setFormKeys((prev) => ({
          simple: prev.simple + 1,
          full: prev.full + 1,
        }));
      }, 200);
    }
  };

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
          onOpenChange={(loginOpen) => {
            setLoginModalOpen(loginOpen);
            if (!loginOpen && isAuthenticated) {
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
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-2xl">ثبت درخواست آگهی</DialogTitle>
            <DialogDescription>
              روش مناسب خود را انتخاب کنید
            </DialogDescription>
          </DialogHeader>

        <div className="space-y-6">
          <div className={selectedForm === null ? 'block' : 'hidden'}>
              {/* دکمه‌های انتخاب */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="rtl">
                <Button
                  variant="outline"
                  className="h-auto p-6 flex flex-col items-end justify-start gap-3 hover:bg-blue-50 hover:border-blue-300 transition-all text-right"
                  onClick={() => selectForm('simple')}
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
                  onClick={() => selectForm('full')}
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
              <Card className="bg-blue-50 border-blue-200 mt-6">
                <CardContent className="pt-6">
                  <p className="text-sm text-blue-900 text-center">
                    💡 کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت
                  </p>
                </CardContent>
              </Card>
          </div>

          {mountedForms.simple && (
            <div className={selectedForm === 'simple' ? 'block space-y-4' : 'hidden'} dir="rtl">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedForm(null)}
                className="mb-2"
              >
                بازگشت ←
              </Button>
              <SimpleTicketForm
                key={formKeys.simple}
                onSuccess={() => handleOpenChange(false)}
              />
            </div>
          )}

          {mountedForms.full && (
            <div className={selectedForm === 'full' ? 'block space-y-4' : 'hidden'} dir="rtl">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedForm(null)}
                className="mb-2"
              >
                بازگشت ←
              </Button>
              <FullTicketForm
                key={formKeys.full}
                onSuccess={() => handleOpenChange(false)}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
