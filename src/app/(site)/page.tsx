import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/common/SearchBar";
import { ArrowLeft } from "lucide-react";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: "گویا - پلتفرم املاک فارسی | خرید، فروش و اجاره ملک",
  description: "گویا، پلتفرم مدرن املاک و مستغلات برای خرید، فروش و اجاره ملک. جستجوی هوشمند در هزاران آگهی املاک با فیلترهای پیشرفته و مشاوران حرفه‌ای.",
  keywords: ["املاک", "خرید خانه", "فروش ملک", "اجاره آپارتمان", "مشاور املاک تهران", "پلتفرم املاک", "خانه رویایی"],
  openGraph: {
    title: "گویا - پلتفرم املاک فارسی",
    description: "جستجوی هوشمند و پیدا کردن خانه رویایی خود با گویا",
    images: [
      {
        url: "/assets/picnew.png",
        width: 1200,
        height: 630,
        alt: "گویا - پلتفرم املاک",
      },
    ],
  },
};

export default function Home() {

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[240px] md:min-h-[320px] overflow-visible mb-12 md:mb-20">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/assets/picnew.png"
            alt="گویا - پلتفرم املاک فارسی"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative container mx-auto px-4 pt-8 md:pt-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-lg md:text-3xl font-bold text-white mb-1.5 md:mb-3">
              خانه رویایی خود را با هوش مصنوعی پیدا کنید
            </h1>
            <p className="text-xs md:text-base text-white/90 mb-2 md:mb-4">
              با شهر GPT، به زبان طبیعی جستجو کنید و بهترین املاک را پیدا کنید
            </p>
          </div>
        </div>
        
        {/* Search Bar - positioned at bottom edge */}
        <div className="absolute -bottom-10 md:-bottom-14 left-0 right-0 z-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <HomePageClient />

      {/* About Section Preview */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">درباره گویا</h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              گویا، پلی بین خریداران و اجاره‌کنندگان با مشاوران املاک. تجربه‌ای ساده و مدرن برای پیدا کردن ملک مورد نظرتان.
              ما با ارائه پلتفرمی حرفه‌ای و کاربرپسند، فرآیند خرید، فروش و اجاره املاک را برای شما آسان می‌کنیم.
            </p>
            <Link href="/about">
              <Button variant="default" className="gap-2">
                بیشتر بخوانید
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

