import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "تماس با گویا",
  description: "برای مشاوره خرید، فروش و اجاره ملک در دماوند، پردیس و شرق تهران با تیم گویا در ارتباط باشید.",
  path: "/contact",
  keywords: ["تماس با گویا", "مشاوره املاک دماوند", "پشتیبانی املاک", "شماره تماس گویا"],
});

export default function Contact() {
  const contactInfo = [
    {
      icon: Phone,
      title: "تلفن تماس",
      value: "۰۲۱-۱۲۳۴۵۶۷۸",
      description: "شنبه تا پنجشنبه، ۹ صبح تا ۶ عصر",
    },
    {
      icon: Mail,
      title: "ایمیل",
      value: "info@gooya.ir",
      description: "پاسخ در کمتر از ۲۴ ساعت",
    },
    {
      icon: MapPin,
      title: "آدرس",
      value: "تهران، منطقه ۱، فرشته",
      description: "ساختمان گویا، طبقه ۳",
    },
    {
      icon: Clock,
      title: "ساعات کاری",
      value: "شنبه تا پنجشنبه",
      description: "۹:۰۰ صبح تا ۶:۰۰ عصر",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">تماس با ما</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            ما همیشه آماده پاسخگویی به سوالات و نیازهای شما هستیم
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-bold mb-2">{info.title}</h3>
                    <p className="text-lg font-semibold mb-1">{info.value}</p>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">فرم تماس</h2>
                  <p className="text-muted-foreground">
                    پیام خود را برای ما ارسال کنید و ما در اسرع وقت با شما تماس خواهیم گرفت
                  </p>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">نام و نام خانوادگی *</Label>
                      <Input 
                        id="name" 
                        placeholder="نام خود را وارد کنید" 
                        className="mt-2"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">شماره تماس *</Label>
                      <Input 
                        id="phone" 
                        type="tel"
                        placeholder="09123456789" 
                        className="mt-2"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">ایمیل</Label>
                    <Input 
                      id="email" 
                      type="email"
                      placeholder="email@example.com" 
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">موضوع *</Label>
                    <Input 
                      id="subject" 
                      placeholder="موضوع پیام خود را وارد کنید" 
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">پیام شما *</Label>
                    <Textarea 
                      id="message" 
                      placeholder="پیام خود را اینجا بنویسید..." 
                      className="mt-2 min-h-[150px]"
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full">
                    ارسال پیام
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section (Optional) */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">موقعیت ما</h2>
            <p className="text-muted-foreground">
              برای مراجعه حضوری، آدرس و نقشه دفتر ما
            </p>
          </div>
          <div className="max-w-5xl mx-auto h-[400px] bg-secondary rounded-xl flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">نقشه به زودی اضافه می‌شود</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

