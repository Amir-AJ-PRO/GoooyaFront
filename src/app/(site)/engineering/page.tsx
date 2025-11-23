import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import Image from "next/image";
import engineeringImage from "@/assets/about-consultation.jpg";
import EngineeringServiceSelector from "@/components/EngineeringServiceSelector";
import EngineeringContactForm from "@/components/EngineeringContactForm";

export const metadata: Metadata = {
  title: "خدمات مهندسی ساختمان - گویا",
  description: "خدمات کامل مهندسی ساختمان شامل طراحی نقشه، نقشه برداری، کارهای ثبتی، بازسازی، اجرا و ساخت، عدم خلافی، پایان کار و دریافت جواز ساختمان",
  keywords: ["خدمات مهندسی", "طراحی نقشه", "نقشه برداری", "پایان کار ساختمان", "جواز ساختمان", "بازسازی"],
};

/**
 * Engineering Services Page - Server Component
 * صفحه خدمات مهندسی با جداسازی بخش‌های Client-side
 */
export default function EngineeringServices() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-primary/5 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              خدمات مهندسی ساختمان
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              گویا با همکاری بهترین متخصصان و مهندسان مجرب، طیف کاملی از خدمات مهندسی ساختمان را 
              برای شما عزیزان فراهم کرده است. از طراحی و نقشه برداری تا اجرا و دریافت مجوزهای لازم، 
              ما در کنار شما هستیم.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a href="#contact-form">
                <Button size="lg" className="gap-2">
                  <Phone className="h-5 w-5" />
                  درخواست مشاوره رایگان
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="relative w-full h-[300px] md:h-[450px] rounded-2xl shadow-xl overflow-hidden">
              <Image 
                src={engineeringImage} 
                alt="خدمات مهندسی" 
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Categories - Client Component */}
      <EngineeringServiceSelector />

      {/* Contact Form - Client Component */}
      <EngineeringContactForm />
    </>
  );
}
