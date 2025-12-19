import Link from "next/link";
import { Home, Phone, Mail, Instagram, Twitter, Briefcase } from "lucide-react";
import { GOOOYA_CONTACT_EMAIL, GOOOYA_CONTACT_PHONE_DISPLAY } from "@/lib/constants";

export default function Footer() {
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
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-smooth text-sm">
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">خدمات</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/properties" className="text-muted-foreground hover:text-primary transition-smooth">
                  خرید ملک
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-muted-foreground hover:text-primary transition-smooth">
                  فروش ملک
                </Link>
              </li>
              <li>
                <Link href="/properties" className="text-muted-foreground hover:text-primary transition-smooth">
                  اجاره ملک
                </Link>
              </li>
              <li>
                <Link href="/become-agent" className="text-muted-foreground hover:text-primary transition-smooth flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  تبدیل به مشاور
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">تماس با ما</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Phone className="h-4 w-4" />
                <span>{GOOOYA_CONTACT_PHONE_DISPLAY}</span>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground text-sm">
                <Mail className="h-4 w-4" />
                <span>{GOOOYA_CONTACT_EMAIL}</span>
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
        </div>
      </div>
    </footer>
  );
}

