import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Brain, 
  Zap, 
  Target, 
  TrendingUp, 
  CheckCircle,
  Search,
  MessageSquare
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "جستجوی هوشمند ملک با شهر GPT",
  description: "جستجوی ملک با زبان طبیعی از طریق شهر GPT. پیدا کردن آپارتمان، ویلا و زمین در شرق تهران بدون فیلترهای پیچیده.",
  path: "/ai-search",
  keywords: ["شهر GPT", "جستجوی هوشمند املاک", "هوش مصنوعی املاک", "جستجوی ملک با AI"],
});

export default function AISearchPage() {
  const features = [
    {
      icon: Brain,
      title: "متصل به شهر GPT",
      description: "گویا به پیشرفته‌ترین موتور جستجوی هوش مصنوعی املاک ایران متصل است"
    },
    {
      icon: Target,
      title: "جستجوی زبان طبیعی",
      description: "با شهر GPT، به جای فیلترهای پیچیده، به زبان ساده بنویسید چه می‌خواهید"
    },
    {
      icon: Zap,
      title: "سرعت فوق‌العاده",
      description: "با قدرت AI شهر GPT، در کسری از ثانیه به نتیجه برسید"
    },
    {
      icon: TrendingUp,
      title: "پیشنهادات هوشمند",
      description: "شهر GPT املاکی را پیشنهاد می‌دهد که دقیقاً با نیاز شما مطابقت دارند"
    },
  ];

  const advantages = [
    "شهر GPT بزرگ‌ترین پلتفرم جستجوی هوش مصنوعی املاک ایران است",
    "جستجوی زبان طبیعی: مثل گفتگو با یک مشاور واقعی",
    "درک عمیق از نیاز: شهر GPT دقیقاً متوجه می‌شود چه می‌خواهید",
    "نتایج شخصی‌سازی شده: بر اساس سلیقه و بودجه شما",
    "سرعت بالا: جستجو در میلیون‌ها ملک در ثانیه‌ها",
    "به‌روز و پیشرفته: تکنولوژی جدید و مدرن هوش مصنوعی",
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/20 via-primary/10 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full px-6 py-3 mb-6">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              <span className="text-yellow-700 font-semibold">
                متصل به شهر GPT - اولین پلتفرم املاک هوشمند ایران
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              جستجوی هوشمند املاک با
              <span className="text-primary block mt-2">قدرت هوش مصنوعی</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              گویا به پیشرفته‌ترین پلتفرم جستجوی هوش مصنوعی املاک ایران،
              <span className="font-bold text-foreground"> شهر GPT</span>، متصل شده است.
              <br />
              با استفاده از این تکنولوژی، دقیق‌ترین و سریع‌ترین نتایج جستجو را به شما ارائه می‌دهیم.
            </p>

            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/properties">
                <Button size="lg" className="gap-2">
                  <Search className="h-5 w-5" />
                  شروع جستجوی هوشمند
                </Button>
              </Link>
              <Link href="/chat">
                <Button size="lg" variant="outline" className="gap-2">
                  <MessageSquare className="h-5 w-5" />
                  چت با هوش مصنوعی
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What is Shahr GPT */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              شهر GPT چیست؟
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              <span className="font-bold text-foreground">شهر GPT</span> یک پلتفرم مستقل و پیشرفته جستجوی هوش مصنوعی است 
              که به‌طور تخصصی برای صنعت املاک طراحی شده است.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              این پلتفرم با استفاده از تکنولوژی یادگیری ماشین و پردازش زبان طبیعی،
              به کاربران کمک می‌کند تا با جستجوی ساده و گفتگو محور،
              دقیق‌ترین و مرتبط‌ترین املاک را در کمترین زمان پیدا کنند.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-xl transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              چرا اتصال به شهر GPT مهم است؟
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-start gap-3 bg-background p-4 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-foreground">{advantage}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              چگونه کار می‌کند؟
            </h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">شما جستجو می‌کنید</h3>
                  <p className="text-muted-foreground">
                    به زبان ساده بنویسید چه می‌خواهید. 
                    <br />
                    مثال: "یک آپارتمان 2 خوابه در شمال تهران با پارکینگ و قیمت مناسب"
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">شهر GPT تحلیل می‌کند</h3>
                  <p className="text-muted-foreground">
                    موتور هوش مصنوعی شهر GPT، درخواست شما را تحلیل می‌کند و دقیقاً متوجه می‌شود که چه می‌خواهید.
                    <br />
                    حتی اگر کامل توضیح ندهید، نیاز واقعی‌تان را تشخیص می‌دهد!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-xl mb-2">دریافت نتایج دقیق</h3>
                  <p className="text-muted-foreground">
                    گویا با استفاده از پیشنهادات شهر GPT، بهترین املاک متناسب با نیاز شما را نمایش می‌دهد.
                    <br />
                    به ترتیب اولویت و دقت - سریع و هوشمند!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <Sparkles className="h-16 w-16 mx-auto mb-6 text-primary-foreground" />
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
              تجربه جستجوی هوشمند با شهر GPT
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8">
              گویا با اتصال به شهر GPT، قدرتمندترین ابزار جستجوی املاک را در اختیار شما قرار می‌دهد
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/properties">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Search className="h-5 w-5" />
                  جستجوی هوشمند املاک
                </Button>
              </Link>
              <Link href="/chat">
                <Button size="lg" variant="outline" className="bg-white hover:bg-white/90 gap-2">
                  <MessageSquare className="h-5 w-5" />
                  چت با AI
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

