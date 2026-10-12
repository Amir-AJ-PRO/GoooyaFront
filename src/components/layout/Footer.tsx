import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { GOOOYA_CONTACT_EMAIL, GOOOYA_CONTACT_PHONE_DISPLAY } from "@/lib/constants";

const linkClass =
  "text-[14px] font-normal text-[#444444] transition-colors hover:text-[#111111]";

export default function Footer() {
  return (
    <footer className="border-y border-[#BCE0F0] bg-white">
      <div className="container mx-auto px-4 py-12 md:py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4 md:gap-8">
          <div>
            <Link href="/" className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                <img
                  src="/logo-gooya.svg"
                  alt="گویا"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="text-[22px] font-bold text-[#111111]">گویا</span>
            </Link>
            <p className="text-[14px] leading-7 text-[#666666]">
              پلتفرم مدرن املاک و مستغلات
              <br />
              برای خرید، فروش و اجاره
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-[15px] font-bold text-[#111111]">دسترسی سریع</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className={linkClass}>
                  صفحه اصلی
                </Link>
              </li>
              <li>
                <Link href="/properties" className={linkClass}>
                  املاک
                </Link>
              </li>
              <li>
                <Link href="/about" className={linkClass}>
                  درباره ما
                </Link>
              </li>
              <li>
                <Link href="/contact" className={linkClass}>
                  تماس با ما
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[15px] font-bold text-[#111111]">خدمات ما</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/properties" className={linkClass}>
                  خرید ملک
                </Link>
              </li>
              <li>
                <Link href="/properties" className={linkClass}>
                  اجاره ملک
                </Link>
              </li>
              <li>
                <Link href="/properties" className={linkClass}>
                  فروش ملک
                </Link>
              </li>
              <li>
                <Link href="/engineering" className={linkClass}>
                  خدمات مهندسی
                </Link>
              </li>
              <li>
                <Link href="/stories" className={linkClass}>
                  قصه‌های دماوند
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-[15px] font-bold text-[#111111]">تماس با ما</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-[#111111]" strokeWidth={1.75} />
                <span className="text-[14px] text-[#444444]">{GOOOYA_CONTACT_PHONE_DISPLAY}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[#111111]" strokeWidth={1.75} />
                <span className="text-[14px] text-[#444444]">{GOOOYA_CONTACT_EMAIL}</span>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 text-center text-[14px] text-[#666666]">
          ۱۴۰۵ گویا تمامی حقوق محفوظ است.
        </p>
      </div>
    </footer>
  );
}
