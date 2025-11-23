import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { MapPin, Building2, Target, Heart, Lightbulb, Mountain, Trees, Home as HomeIcon } from "lucide-react";
import Image from "next/image";

export const metadata: Metadata = {
  title: "درباره گویا - متخصص املاک شرق تهران",
  description: "گویا، پلتفرم تخصصی املاک و مستغلات در شرق استان تهران، دماوند و پردیس. خرید، فروش و اجاره ملک با مشاوران محلی و متخصص.",
  keywords: ["املاک شرق تهران", "املاک دماوند", "املاک پردیس", "مشاور املاک دماوند", "خرید خانه شرق تهران"],
  openGraph: {
    title: "درباره گویا - متخصص املاک شرق تهران",
    description: "پلتفرم تخصصی املاک در دماوند، پردیس و شرق استان تهران",
    images: [
      {
        url: "/assets/about_us_header.png",
        width: 1200,
        height: 630,
        alt: "درباره گویا - املاک شرق تهران",
      },
    ],
  },
};

export default function About() {
  const coverageAreas = [
    { 
      icon: Mountain, 
      name: "دماوند",
      description: "متخصص در املاک مسکونی، ویلایی و باغ‌ویلا در منطقه دماوند"
    },
    { 
      icon: Building2, 
      name: "پردیس",
      description: "خدمات املاک آپارتمانی و مجتمع‌های مسکونی پردیس"
    },
    { 
      icon: Trees, 
      name: "شرق تهران",
      description: "پوشش کامل مناطق شرقی استان تهران و حومه"
    },
  ];

  return (
    <>
      {/* Hero Section with Image */}
      <section className="relative h-[450px] md:h-[550px] overflow-hidden">
        <Image
          src="/assets/about_us_header.png"
          alt="گویا - املاک شرق تهران"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            <span className="text-lg md:text-xl text-white/90 font-medium">شرق استان تهران</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            املاک در قلب طبیعت
          </h1>
          <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed">
            گویا، پلتفرم تخصصی املاک در <span className="font-bold text-primary">دماوند</span>، <span className="font-bold text-primary">پردیس</span> و <span className="font-bold text-primary">شرق تهران</span>
            <br className="hidden md:block" />
            با مشاوران محلی و متخصص، همراه شما در یافتن خانه رویایی
          </p>
        </div>
      </section>

      {/* Mission Section with Image */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            <div className="order-2 lg:order-1">
              <Image
                src="/assets/team-photo-1.jpg"
                alt="تیم گویا - مشاوران و متخصصان املاک"
                width={600}
                height={400}
                className="rounded-2xl shadow-large w-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
                <HomeIcon className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-primary">ماموریت ما</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                شریک مطمئن شما در شرق تهران
              </h2>
              <p className="text-foreground text-lg leading-relaxed mb-4">
                <span className="font-bold text-primary">گویا</span> با درک عمیق از بازار املاک <span className="font-semibold">دماوند، پردیس و شرق استان تهران</span>، 
                پلتفرمی است که به‌طور تخصصی روی این مناطق زیبا و پرپتانسیل تمرکز دارد.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                ما می‌دانیم که خرید خانه در کنار طبیعت دلبر دماوند یا زندگی در شهرهای نوساز مثل پردیس، 
                نیازمند مشاوران محلی با تجربه است که بازار منطقه را به خوبی بشناسند.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                <span className="font-semibold text-foreground">هدف ما</span> این است که با ارائه پلتفرمی مدرن و کاربرپسند، 
                فرآیند خرید، فروش و اجاره املاک در شرق تهران را آسان، سریع و شفاف کنیم.
              </p>
              <div className="bg-secondary/30 rounded-xl p-4 border-r-4 border-primary">
                <p className="text-sm text-muted-foreground italic">
                  "ما معتقدیم هر کسی حق دارد خانه‌ای داشته باشد که در آن آرامش، زیبایی و دسترسی به امکانات را با هم تجربه کند."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Areas Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-background rounded-full px-4 py-2 mb-4">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">مناطق تحت پوشش</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              حوزه فعالیت گویا
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              ما به‌طور تخصصی در شرق استان تهران فعالیت می‌کنیم و با شناخت عمیق از بازار محلی، بهترین خدمات را ارائه می‌دهیم
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {coverageAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <Card key={index} className="p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50">
                  <div className="flex justify-center mb-6">
                    <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth hover:scale-110">
                      <Icon className="h-10 w-10 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-center">{area.name}</h3>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    {area.description}
                  </p>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-background rounded-2xl p-8 max-w-4xl mx-auto shadow-lg">
              <div className="flex items-start gap-4 text-right">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-xl mb-3">چرا تمرکز بر شرق تهران؟</h4>
                  <p className="text-muted-foreground text-base leading-relaxed">
                    شرق استان تهران با طبیعت بکر دماوند، رشد سریع پردیس و توسعه زیرساخت‌ها، 
                    یکی از پرطرفدارترین مناطق برای خرید ملک و سرمایه‌گذاری است. 
                    ما با شناخت کامل از ویژگی‌های منحصربه‌فرد هر منطقه، 
                    می‌توانیم بهترین گزینه‌ها را برای شما پیدا کنیم.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ارزش‌های ما</h2>
            <p className="text-muted-foreground text-lg">
              اصولی که در تمام کارهایمان به آن‌ها پایبند هستیم
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 hover:shadow-large transition-smooth group">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">شفافیت</h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                ارائه اطلاعات دقیق و کامل از هر ملک، بدون پنهان‌کاری. 
                قیمت‌ها، مشخصات و شرایط به‌صورت واضح در اختیار شماست.
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
                ایجاد رابطه‌ای بلندمدت و مبتنی بر اعتماد با مشتریان، 
                مشاوران و همکاران ما اولویت اصلی ماست.
              </p>
            </Card>
            <Card className="p-8 hover:shadow-large transition-smooth group">
              <div className="flex justify-center mb-6">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
                  <Lightbulb className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">تخصص محلی</h3>
              <p className="text-muted-foreground text-center leading-relaxed">
                شناخت عمیق از بازار محلی و ویژگی‌های هر منطقه، 
                ما را قادر می‌سازد بهترین مشاوره را به شما ارائه دهیم.
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
                ترکیبی از تکنولوژی مدرن و تخصص محلی، 
                گویا را به بهترین انتخاب برای املاک در شرق تهران تبدیل کرده است.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">مشاوران محلی و با تجربه</h3>
                    <p className="text-muted-foreground">
                      تیم ما از بازار دماوند، پردیس و شرق تهران شناخت کامل دارد
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">پلتفرم آنلاین هوشمند</h3>
                    <p className="text-muted-foreground">
                      جستجوی آسان املاک با فیلترهای پیشرفته و نقشه تعاملی
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">خدمات جامع املاک</h3>
                    <p className="text-muted-foreground">
                      از جستجو تا مشاوره، بازدید، قرارداد و خدمات مهندسی
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">شفافیت و امنیت کامل</h3>
                    <p className="text-muted-foreground">
                      تمام فرآیندها شفاف و با بالاترین استانداردهای امنیتی
                    </p>
                  </div>
                </div>
              </div>
            </div>
             <div className="order-first lg:order-last">
               <Image
                 src="/assets/team-photo-2.jpg"
                 alt="جلسه تیم گویا - برنامه‌ریزی و مشاوره"
                 width={600}
                 height={500}
                 className="rounded-2xl shadow-large w-full object-cover"
               />
             </div>
          </div>
        </div>
      </section>
    </>
  );
}

