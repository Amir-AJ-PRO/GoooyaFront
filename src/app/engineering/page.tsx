'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, FileText, MapPin, Hammer, ClipboardCheck, CheckCircle2, Phone, FileCheck } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import engineeringImage from "@/assets/about-consultation.jpg";

const engineeringServices = [
  { 
    name: "طراحی نقشه", 
    icon: FileText, 
    description: "طراحی نقشه های معماری و سازه ای ساختمان",
    details: "داشتن یک نقشه معماری مناسب باعث می شود که هم سلیقه ی کارفرما از همان ابتدا در طرح وارد شود هم سازنده یک برنامه ی دقیق برای اجرا داشته باشد؛ در نتیجه از تغییرات بعدی که باعث افزایش هزینه و زمان انجام پروژه می شود، جلوگیری می گردد.\n\nعلاوه بر این ساختمانِ با نقشه ی خوب از ارزش مالی بیشتری برخوردار است.\n\nمهندسانِ معماری و عمران ما، با تکیه بر تخصص و تجربه خود یک نقشه معماری مناسب با بهترین طراحی را برای شما فراهم می کنند که تمامی موارد لازم از جمله: رعایت قوانین و مقرارت شهرداری و سایر ارگان ها، کاربری ساختمان، الزامات معماری و تاسیسات، مقاومت زلزله، امکان پذیر بودن اجرا و ساخت، بودجه و زمانِ در دست برای ساخت را شامل می شود.\n\nکافیست شماره تماس خود را وارد کرده و روی ثبت درخواست کلیک کنید، در سریع ترین زمان ممکن مشاوران ما با شما تماس می گیرند."
  },
  { 
    name: "نقشه برداری", 
    icon: MapPin, 
    description: "نقشه برداری دقیق از زمین و املاک",
    details: "داشتن یک نقشه معماری مناسب باعث می شود که هم سلیقه ی کارفرما از همان ابتدا در طرح وارد شود هم سازنده یک برنامه ی دقیق برای اجرا داشته باشد؛ در نتیجه از تغییرات بعدی که باعث افزایش هزینه و زمان انجام پروژه می شود، جلوگیری می گردد.\n\nعلاوه بر این ساختمانِ با نقشه ی خوب از ارزش مالی بیشتری برخوردار است.\n\nمهندسانِ معماری و عمران ما، با تکیه بر تخصص و تجربه خود یک نقشه معماری مناسب با بهترین طراحی را برای شما فراهم می کنند که تمامی موارد لازم از جمله: رعایت قوانین و مقرارت شهرداری و سایر ارگان ها، کاربری ساختمان، الزامات معماری و تاسیسات، مقاومت زلزله، امکان پذیر بودن اجرا و ساخت، بودجه و زمانِ در دست برای ساخت را شامل می شود.\n\nکافیست شماره تماس خود را وارد کرده و روی ثبت درخواست کلیک کنید، در سریع ترین زمان ممکن مشاوران ما با شما تماس می گیرند."
  },
  { 
    name: "کارهای ثبتی", 
    icon: ClipboardCheck, 
    description: "انجام کلیه کارهای ثبتی و اسناد مالکیت",
    details: "کار سخت و پر و پیچ خمِ دریافت پایان کار ساختمان و طی کردن راه پله های شهرداری را با اطمینان و خیالی آسوده به ما بسپارید و زمان ارزشمندتتان را در آرامش ذخیره کنید. حتما می دانید که برای دریافت سند ساختمان و هرگونه نقل و انتقالات در دفاتر اسناد رسمی به گواهی پایان کار ساختمان نیاز دارید. دریافت این گواهی مانند کارهای اداری دیگر مراحل و دردسرهای زیادی دارد. تیم ما راهی آسان برای دریافت گواهی پایان کار ساختمان به شما معرفی می کند. تنها با ارائه مدارک لازم و دادن وکالت نامه قانونی به کارشناسان ما، طی کردن مراحل قانونی دریافت گواهی پایان کار ساختمان خود را به ما بسپارید. با وارد کردن شماره تماس خود و کلیک بر روی ثبت درخواست منتظر تماس مشاوران ما باشید.\n\nمدارک مورد نیاز:\n1. درخواست متقاضی\n2. فتوکپی اسناد مالکیت (2 برگ)\n3. فتوکپی پایان کار (1 برگ)\n4. قبض عوارض نوسازی\n5. مفاصاحساب از واحد درآمد"
  },
  { 
    name: "بازسازی", 
    icon: Hammer, 
    description: "مشاوره حقوقی و دعاوی ملکی",
    details: "در موضوع دعاوی ملکی داشتن اطلاعات درست و کافی از قوانین مربوطه بسیار مهم و تاثیرگذار است. بهره مندی از مشاوره حقوقی برای انجام معاملات، حل اختلاف، پیگیری مواردی از جمله جعل اسناد و کلاهبرداری های ملکی، تصرف عدوانی، دعوی الزام به اخذ پایان کار و نظایر آن که توسط وکیل متخصص امور ملکی انجام می گیرد.\n\nچنانچه شما قصد شکایت، ارائه دادخواست و یا تنظیم قراردادهای حقوقی ملکی دارید کافیست شماره تماس خود را وارد کرده و روی ثبت درخواست کلیک کنید، در سریع ترین زمان ممکن مشاوران ما با شما تماس می گیرند."
  },
  { 
    name: "اجرا و ساخت", 
    icon: Building2, 
    description: "اجرا و ساخت پروژه های ساختمانی",
    details: "تجربه در ساخت و اجرا به ما ثابت کرده حتی بهترین طراحی ها چنانچه با اجرایی ضعیف همراه باشد عامل از بین رفتن سرمایه خواهد بود بنابراین با به خدمت گرفتن متخصصین ساخت و اجرا با تجربه ای که حساسیت های یک اجرای بی نقص را درک می کنند، مجموعه ای کامل فراهم نموده ایم که توان اجرای تمامی مراحل پروژه (طراحی و اجرا) را داشته و درنهایت کاری با کیفیت و درخور اعتماد کارفرمایان و اعتبار این مجموعه تحویل نماید. همچنین استفاده از تجارب ارزنده و حرفه ای تیم ساخت و اجرا درکنار تقویت واحد فنی مهندسی، این شرکت را قادر به اجرای انواع پروژه ها با ابعاد و مشخصات متفاوت از ابتدا تا پایان نموده و چشم اندازها و اهداف وسیعی را برای مجموعه ی ما ترسیم کرده است.\n\nبرای کمک گرفتن از کارشناسان متخصص ما کافیست شماره تماس خود را وارد کرده و روی ثبت درخواست کلیک کنید، در سریع ترین زمان ممکن مشاوران ما با شما تماس می گیرند."
  },
  { 
    name: "عدم خلافی", 
    icon: CheckCircle2, 
    description: "کارشناسی و ارزیابی املاک",
    details: "یکی از موارد ارجاع به کارشناسی در بحث اختلافات ملکی است که بر سر یک ملک و یا بر سر مرزهای یک ملک اتفاق می افتد. برای این کار هر طرف دعوا لازم است مدارکی را تهیه کنند که کارشناس دادگستری این مدارک را بررسی و مستندات لازم را تهیه میکند.\n\nیکی دیگر از موارد شایع در ارجاع دعاوی به کارشناسی، موضوع ارزیابی و تعیین قیمت املاک است. ارزیابی ملک به این معنی است که قیمت و ارزش واقعی ملک به صورت دقیق مشخص شود.\n\nدر واقع، کارشناسی املاک یکی از موضوعات مهم در استنادات آرای دادگاه‌ها و تعیین حق و حق‌دار است. به اصطلاح می توان گفت که کارشناس بازوی قاضی است و مسلم است هرگونه بی‌دقتی در این حوزه، می‌تواند نتیجه منفی در آرای صادره دادگاه‌ها داشته باشد.\n\nبرای کمک گرفتن از کارشناسان متخصص و عادل ما کافیست شماره تماس خود را وارد کرده و روی ثبت درخواست کلیک کنید، در سریع ترین زمان ممکن مشاوران ما با شما تماس می گیرند."
  },
  { 
    name: "پایان کار", 
    icon: FileText, 
    description: "دریافت گواهی پایان کار ساختمان",
    details: "کار سخت و پر و پیچ خمِ دریافت پایان کار ساختمان و طی کردن راه پله های شهرداری را با اطمینان و خیالی آسوده به ما بسپارید و زمان ارزشمندتتان را در آرامش ذخیره کنید.\n\nحتما می دانید که برای دریافت سند ساختمان و هرگونه نقل و انتقالات در دفاتر اسناد رسمی به گواهی پایان کار ساختمان نیاز دارید. دریافت این گواهی مانند کارهای اداری دیگر مراحل و دردسرهای زیادی دارد.\n\nتیم ما راهی آسان برای دریافت گواهی پایان کار ساختمان به شما معرفی می کند. تنها با ارائه مدارک لازم و دادن وکالت نامه قانونی به کارشناسان ما، طی کردن مراحل قانونی دریافت گواهی پایان کار ساختمان خود را به ما بسپارید.\n\nبا وارد کردن شماره تماس خود و کلیک بر روی ثبت درخواست منتظر تماس مشاوران ما باشید.\n\nمدارک مورد نیاز:\n1. درخواست متقاضی\n2. فتوکپی اسناد مالکیت (2 برگ)\n3. فتوکپی پایان کار (1 برگ)\n4. قبض عوارض نوسازی\n5. مفاصاحساب از واحد درآمد"
  },
  { 
    name: "جواز", 
    icon: FileCheck, 
    description: "دریافت پروانه و مجوز ساختمان",
    details: "اگر قصد ساخت بنا در زمینی خالی را دارید یا می خواهید خانه ای قدیمی را نوسازی کنید؛ حتما می دانید که ساخت ساختمان بدون صدور پروانه ساختمان غیرقانونی است و مراجع مربوطه کار را متوقف خواهند کرد.\n\nدریافت مجوز ساختمان به دوندگی بسیار، پیگیری های قانونی و پرداخت هزینه های مختلفی نیاز دارد. اگر انجام این کار برای شما سخت و طولانی است و یا مشغله های زیادی دارید و زمان کافی برای کارهای اداری ندارید؛ میتوانید روی کمک تیم ما حساب باز کنید.\n\nهدف از صدور مجوز ساخت رعایت مشخصات فنی و اصول شهرسازی است. همچنین شما برای بهره‌مند شدن از تسهیلات بانکی، بیمه شدن ساختمان و افراد مشغولِ کار در آن، جلوگیری از بروز حوادث ساختمانی و استفاده از تجارب فنی و مهندسی در ساختِ بنا به دریافت پروانه ساختمان، نیاز دارید.\n\nمراحل دریافت جواز ساخت خود را تنها با ارائه مدارک لازم به کارشناسان ما بسپارید. شماره تماس خود را وارد کرده و روی ثبت درخواست کلیک کنید و منتظر تماس مشاوران ما باشید."
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
    </>
  );
}
