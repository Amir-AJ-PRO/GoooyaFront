'use client';

import Link from "next/link";
import { Home, Phone, Mail, Instagram, Twitter, Key } from "lucide-react";
import { memo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Footer = memo(() => {
  const { login } = useAuth();

  const handleDevLogin = () => {
    const devUser = {
      id: '09191192668',
      name: 'توسعه‌دهنده',
      email: '',
      type: 'admin' as const,
      phone: '09191192668',
      company: 'گویا',
      licenseNumber: undefined,
    };
    
    login(devUser);
    
    toast.success("ورود موفق", {
      description: "شما با حساب مدیر وارد شدید"
    });
  };
  return (
    <footer className="border-t border-border bg-secondary/30 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Home className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold">گویا</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              پلتفرم مدرن املاک و مستغلات برای خرید، فروش و اجاره ملک
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">دسترسی سریع</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-smooth text-sm">
                  صفحه اصلی
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-muted-foreground hover:text-primary transition-smooth text-sm">
                  املاک
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-smooth text-sm">
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-muted-foreground hover:text-primary transition-smooth text-sm">
                  ورود / ثبت نام
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">خدمات</h3>
            <ul className="space-y-2 text-muted-foreground text-sm">
              <li>خرید ملک</li>
              <li>فروش ملک</li>
              <li>اجاره ملک</li>
              <li>مشاوره املاک</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">تماس با ما</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="h-4 w-4" />
                <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="h-4 w-4" />
                <span>info@gooya.com</span>
              </li>
              <li className="flex items-center gap-3 mt-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-smooth">
                  <Twitter className="h-5 w-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>© ۱۴۰۳ گویا. تمامی حقوق محفوظ است.</p>
          
          {/* Dev Login Button - فقط در Development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4">
              <button
                onClick={handleDevLogin}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
                title="ورود سریع به حساب مدیر (فقط در Development)"
              >
                <Key className="h-3 w-3" />
                <span>ورود سریع مدیر (Dev)</span>
              </button>
              <p className="text-xs text-muted-foreground mt-2">
                این دکمه فقط در حالت Development نمایش داده می‌شود
              </p>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;
