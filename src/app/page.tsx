'use client';

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import { ArrowLeft } from "lucide-react";

export default function Home() {
  const featuredProperties = [
    {
      id: 1,
      title: "آپارتمان مدرن در تهران",
      price: "۸ میلیارد تومان",
      location: "تهران، فرشته",
      bedrooms: 3,
      area: 120,
      image: "/assets/property-1.jpg",
    },
    {
      id: 2,
      title: "ویلا لوکس با باغ",
      price: "۱۵ میلیارد تومان",
      location: "تهران، لواسان",
      bedrooms: 4,
      area: 300,
      image: "/assets/property-2.jpg",
    },
    {
      id: 3,
      title: "تاون‌هاوس مدرن",
      price: "۶ میلیارد تومان",
      location: "تهران، پونک",
      bedrooms: 2,
      area: 150,
      image: "/assets/property-3.jpg",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[240px] md:min-h-[320px] overflow-visible mb-12 md:mb-20">
          <div className="absolute inset-0 overflow-hidden">
            <Image
              src="/assets/picnew.png"
              alt="Hero"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="relative container mx-auto px-4 pt-8 md:pt-16">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-lg md:text-3xl font-bold text-white mb-1.5 md:mb-3">
                خانه رویایی خود را پیدا کنید
              </h1>
              <p className="text-xs md:text-base text-white/90 mb-2 md:mb-4">
                گویا، پلتفرم مدرن املاک و مستغلات برای خرید، فروش و اجاره ملک
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
        <section className="py-2 md:py-4 bg-background">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl font-bold mb-2">املاک ویژه</h2>
                <p className="text-muted-foreground">بهترین املاک منتخب برای شما</p>
              </div>
              <Link href="/properties">
                <Button variant="outline" className="gap-2">
                  مشاهده همه
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
          </div>
        </section>

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
      </main>

      <Footer />
    </div>
  );
}
