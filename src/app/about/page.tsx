'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Home, Users, Award, TrendingUp, Target, Heart, Lightbulb } from "lucide-react";
import Image from "next/image";

export default function About() {
  const stats = [
    { icon: Home, value: "۱۰،۰۰۰+", label: "املاک ثبت شده" },
    { icon: Users, value: "۵،۰۰۰+", label: "کاربران فعال" },
    { icon: Award, value: "۱۰۰+", label: "مشاور حرفه‌ای" },
    { icon: TrendingUp, value: "۹۵٪", label: "رضایت مشتریان" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section with Image */}
        <section className="relative h-[400px] md:h-[500px] overflow-hidden">
          <Image
            src="/assets/about-hero.jpg"
            alt="درباره گویا"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">درباره گویا</h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              پلتفرم مدرن املاک و مستغلات برای ایجاد ارتباط بین خریداران، فروشندگان و مشاوران املاک
            </p>
          </div>
        </section>

        {/* Mission Section with Image */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
              <div className="order-2 lg:order-1">
                <Image
                  src="/assets/about-team.jpg"
                  alt="تیم گویا"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-large w-full object-cover"
                />
              </div>
              <div className="order-1 lg:order-2">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">مأموریت ما</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  گویا با هدف تسهیل و مدرن‌سازی فرآیند خرید، فروش و اجاره املاک در ایران راه‌اندازی شده است. 
                  ما بر این باوریم که یافتن خانه مناسب نباید یک فرآیند پیچیده و زمان‌بر باشد.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                  با استفاده از تکنولوژی‌های روز و رابط کاربری ساده و کاربرپسند، ما تجربه‌ای منحصر به فرد را برای کاربران خود فراهم می‌کنیم.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  هدف نهایی ما ایجاد یک اکوسیستم کامل از خدمات املاک است که نیازهای تمامی ذینفعان این صنعت را برطرف کند.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">دستاوردهای ما</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center group">
                    <div className="flex justify-center mb-6">
                      <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth group-hover:scale-110">
                        <Icon className="h-10 w-10 text-primary" />
                      </div>
                    </div>
                    <div className="text-4xl font-bold mb-3 text-primary">{stat.value}</div>
                    <div className="text-muted-foreground text-lg">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">ارزش‌های ما</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <Card className="p-8 hover:shadow-large transition-smooth group">
                <div className="flex justify-center mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                    <Target className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center">شفافیت</h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  ما به شفافیت کامل در تمامی معاملات و ارائه اطلاعات دقیق به کاربران خود متعهدیم.
                </p>
              </Card>
              <Card className="p-8 hover:shadow-large transition-smooth group">
                <div className="flex justify-center mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center">اعتماد</h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  ایجاد اعتماد بین خریداران، فروشندگان و مشاوران املاک اولویت اصلی ماست.
                </p>
              </Card>
              <Card className="p-8 hover:shadow-large transition-smooth group">
                <div className="flex justify-center mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                    <Lightbulb className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center">نوآوری</h3>
                <p className="text-muted-foreground text-center leading-relaxed">
                  با استفاده از جدیدترین تکنولوژی‌ها، تجربه‌ای مدرن و کاربرپسند ارائه می‌دهیم.
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-primary/5">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">چرا گویا را انتخاب کنیم؟</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  گویا با ترکیب تکنولوژی پیشرفته و تجربه کاربری عالی، بهترین راه حل برای نیازهای املاک شماست.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">جستجوی هوشمند</h3>
                      <p className="text-muted-foreground">با فیلترهای پیشرفته دقیقاً همان چیزی که می‌خواهید پیدا کنید</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">مشاوران حرفه‌ای</h3>
                      <p className="text-muted-foreground">دسترسی به بهترین مشاوران املاک با سابقه کاری قوی</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">امنیت و اعتماد</h3>
                      <p className="text-muted-foreground">تمام معاملات با بالاترین استانداردهای امنیتی انجام می‌شود</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-first lg:order-last">
                <Image
                  src="/assets/about-consultation.jpg"
                  alt="مشاوره املاک"
                  width={600}
                  height={500}
                  className="rounded-2xl shadow-large w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
