'use client';

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, FileText, MapPin, Hammer, ClipboardCheck, CheckCircle2, Phone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import engineeringImage from "@/assets/about-consultation.jpg";

const engineeringServices = [
  { 
    name: "طراحی نقشه", 
    icon: FileText, 
    description: "طراحی نقشه های معماری و سازه ای ساختمان",
    details: "خدمات طراحی نقشه شامل طراحی معماری، سازه، تاسیسات مکانیکی و برقی ساختمان می‌باشد. تیم مهندسان ما با استفاده از جدیدترین نرم‌افزارها و استانداردهای روز دنیا، نقشه‌های دقیق و کامل برای پروژه شما آماده می‌کنند. این خدمت شامل طراحی اولیه، طراحی تفصیلی و ارائه نقشه‌های اجرایی می‌شود."
  },
  { 
    name: "نقشه برداری", 
    icon: MapPin, 
    description: "نقشه برداری دقیق از زمین و املاک",
    details: "نقشه‌برداری دقیق زمین و املاک با استفاده از تجهیزات پیشرفته و متخصصان مجرب انجام می‌شود. این خدمت شامل اندازه‌گیری دقیق ابعاد، مساحت، ارتفاعات و موقعیت دقیق ملک می‌باشد. نتایج نقشه‌برداری به صورت نقشه‌های کاداستر و توپوگرافی ارائه می‌گردد که برای مراحل بعدی طراحی و ثبت ضروری است."
  },
  { 
    name: "کارهای ثبتی", 
    icon: ClipboardCheck, 
    description: "انجام کلیه کارهای ثبتی و اسناد مالکیت",
    details: "انجام کلیه کارهای ثبتی شامل تفکیک، افراز، تجمیع، اصلاح سند و دریافت سند تک‌برگ می‌باشد. تیم حقوقی و کارشناسان ما تمامی مراحل ثبتی را از ابتدا تا دریافت سند رسمی به صورت کامل پیگیری می‌کنند. این خدمت شامل تهیه مدارک، مراجعه به اداره ثبت و پیگیری‌های قانونی است."
  },
  { 
    name: "بازسازی", 
    icon: Hammer, 
    description: "بازسازی و نوسازی ساختمان های قدیمی",
    details: "خدمات بازسازی شامل تخریب و بازسازی کامل یا جزئی ساختمان‌های قدیمی است. این خدمت با ارزیابی اولیه ساختار، طراحی بازسازی مناسب، اجرای تخصصی و نظارت دقیق انجام می‌شود. تیم ما تضمین می‌کند که بازسازی شما با بالاترین استانداردهای ایمنی و کیفیت انجام شود و ساختمان شما به یک فضای مدرن و کاربردی تبدیل گردد."
  },
  { 
    name: "اجرا و ساخت", 
    icon: Building2, 
    description: "اجرا و ساخت پروژه های ساختمانی",
    details: "خدمات اجرا و ساخت شامل مدیریت کامل پروژه از مرحله پی‌کنی تا تحویل کلید است. تیم متخصص ما با نظارت دقیق بر تمام مراحل اجرایی، تضمین می‌کند که پروژه شما با بالاترین کیفیت و در زمان مقرر به اتمام برسد. این خدمت شامل تامین مصالح، نیروی کار متخصص، نظارت فنی و کنترل کیفیت مستمر است."
  },
  { 
    name: "عدم خلافی", 
    icon: CheckCircle2, 
    description: "اخذ گواهی عدم خلاف ساختمانی",
    details: "اخذ گواهی عدم خلاف ساختمانی از شهرداری یکی از مهم‌ترین مدارک برای هر ساختمان است. تیم ما با بررسی دقیق ساختمان، تطبیق با نقشه‌های مصوب و انجام اصلاحات لازم در صورت نیاز، گواهی عدم خلاف را برای شما اخذ می‌کند. این خدمت شامل مراجعه به شهرداری، تهیه مدارک و پیگیری کامل تا دریافت گواهی است."
  },
  { 
    name: "پایان کار", 
    icon: FileText, 
    description: "دریافت پایان کار و جواز ساختمانی",
    details: "دریافت پروانه پایان‌کار از آخرین و مهم‌ترین مراحل قانونی ساختمان‌سازی است. این مدرک ثابت می‌کند که ساختمان شما مطابق با نقشه‌های مصوب و مقررات ساخت و ساز اجرا شده است. همچنین اخذ جواز ساختمانی برای شروع ساخت‌وساز ضروری است. تیم ما تمام مراحل دریافت این مجوزها را با سرعت و دقت انجام می‌دهد."
  },
];

export default function EngineeringServices() {
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<string>(engineeringServices[0].name);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  function persianDigitsToEnglish(s: string) {
    const map: Record<string, string> = {
      '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
      '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
    };
    return s.replace(/[۰-۹٠-٩]/g, (d) => map[d] ?? d);
  }

  function normalizeIranPhone(input: string): string | null {
    if (!input) return null;
    let s = input.trim();
    s = persianDigitsToEnglish(s);
    s = s.replace(/^\+/, "");
    s = s.replace(/[^0-9]/g, "");

    if (/^0?9\d{9}$/.test(s)) {
      if (s.length === 11 && s.startsWith("0")) s = s.slice(1);
      return "+98" + s;
    }

    if (/^98?9\d{9}$/.test(s)) {
      if (s.length === 12 && s.startsWith("98")) return "+" + s;
      if (s.length === 11 && s.startsWith("9")) return "+98" + s;
    }

    return null;
  }

  function submitEngineeringContact() {
    if (!firstName.trim() || !lastName.trim()) {
      toast({ 
        title: "نام وارد نشده", 
        description: "لطفا نام و نام خانوادگی خود را وارد کنید.",
        variant: "destructive"
      });
      return;
    }

    const normalized = normalizeIranPhone(contactPhone);
    if (!normalized) {
      toast({ 
        title: "شماره تلفن نامعتبر", 
        description: "لطفا یک شماره تلفن معتبر وارد کنید (مثال: 0912xxxxxxx یا +98912xxxxxxx).",
        variant: "destructive"
      });
      return;
    }

    const payload = { 
      service: selectedService, 
      firstName, 
      lastName, 
      contactPhone: normalized 
    };
    console.log("engineering contact", payload);
    toast({ 
      title: "درخواست ارسال شد", 
      description: `درخواست شما برای خدمت "${selectedService}" با موفقیت ارسال شد. همکاران ما در اسرع وقت با شما تماس می‌گیرند.` 
    });
    
    // Reset form
    setFirstName("");
    setLastName("");
    setContactPhone("");
  }
  
  const currentService = engineeringServices.find(s => s.name === selectedService) || engineeringServices[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
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

        {/* Services Categories */}
        <section className="py-16 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">خدمات ما</h2>
              <p className="text-muted-foreground text-lg">
                خدمت مورد نظر خود را انتخاب کنید و توضیحات کامل را مشاهده نمایید
              </p>
            </div>

            {/* Service Buttons */}
            <div className="flex flex-wrap gap-3 justify-center mb-8" dir="rtl">
              {engineeringServices.map((service) => {
                const Icon = service.icon;
                const isSelected = selectedService === service.name;
                return (
                  <button
                    key={service.name}
                    onClick={() => setSelectedService(service.name)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                      isSelected 
                        ? 'bg-primary text-primary-foreground shadow-lg scale-105' 
                        : 'bg-card hover:bg-secondary border border-input hover:shadow-md'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm md:text-base">{service.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Service Details Card */}
            <div className="max-w-4xl mx-auto mb-16">
              <Card className="shadow-xl">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      {(() => {
                        const Icon = currentService.icon;
                        return <Icon className="h-8 w-8 text-primary" />;
                      })()}
                    </div>
                    <div className="text-right flex-1">
                      <CardTitle className="text-2xl mb-2">{currentService.name}</CardTitle>
                      <CardDescription className="text-base">
                        {currentService.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-foreground leading-relaxed text-justify" dir="rtl">
                    {currentService.details}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Why Choose Us */}
            <div className="bg-secondary/30 rounded-2xl p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-6 text-center">چرا خدمات مهندسی گویا؟</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">مهندسان مجرب و متخصص</h4>
                    <p className="text-muted-foreground">
                      تیمی از مهندسان با سالها تجربه در زمینه های مختلف ساختمانی
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">قیمت های رقابتی و منصفانه</h4>
                    <p className="text-muted-foreground">
                      ارائه بهترین خدمات با قیمت های مناسب و شفاف
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">سرعت و دقت در انجام کار</h4>
                    <p className="text-muted-foreground">
                      تعهد به زمان و کیفیت بالای خدمات ارائه شده
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-2">پشتیبانی و مشاوره رایگان</h4>
                    <p className="text-muted-foreground">
                      مشاوره تخصصی رایگان قبل از شروع هر پروژه
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact-form" className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">درخواست خدمات مهندسی</h2>
                <p className="text-muted-foreground text-lg">
                  اطلاعات تماس خود را وارد کنید تا کارشناسان ما در اسرع وقت با شما تماس بگیرند
                </p>
              </div>

              <Card className="shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">خدمت انتخابی:</CardTitle>
                    <div className="flex items-center gap-2 text-primary">
                      {(() => {
                        const Icon = currentService.icon;
                        return <Icon className="h-5 w-5" />;
                      })()}
                      <span className="font-bold">{currentService.name}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4" dir="rtl">
                    {/* انتخاب خدمت */}
                    <div>
                      <label className="text-sm font-medium mb-2 block text-right">
                        خدمت مورد نظر *
                      </label>
                      <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="انتخاب خدمت" />
                        </SelectTrigger>
                        <SelectContent>
                          {engineeringServices.map((service) => {
                            const Icon = service.icon;
                            return (
                              <SelectItem key={service.name} value={service.name}>
                                <div className="flex items-center gap-2">
                                  <Icon className="h-4 w-4" />
                                  <span>{service.name}</span>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block text-right">
                          نام *
                        </label>
                        <Input 
                          className="text-right" 
                          value={firstName} 
                          onChange={(e) => setFirstName(e.target.value)} 
                          placeholder="نام"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block text-right">
                          نام خانوادگی *
                        </label>
                        <Input 
                          className="text-right" 
                          value={lastName} 
                          onChange={(e) => setLastName(e.target.value)} 
                          placeholder="نام خانوادگی"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block text-right">
                        شماره تماس *
                      </label>
                      <Input
                        className="text-right"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        onBlur={() => {
                          const n = normalizeIranPhone(contactPhone);
                          if (n) setContactPhone(n);
                        }}
                        placeholder="09123456789"
                      />
                    </div>

                    <div className="pt-4">
                      <Button className="w-full" onClick={submitEngineeringContact} size="lg">
                        <Phone className="h-4 w-4 ml-2" />
                        ارسال درخواست برای {currentService.name}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center mt-3">
                        با ارسال فرم، کارشناسان ما حداکثر تا 24 ساعت با شما تماس خواهند گرفت
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
