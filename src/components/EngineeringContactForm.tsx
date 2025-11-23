'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { engineeringServices } from "@/data/engineeringServices";

/**
 * EngineeringContactForm Component
 * فرم درخواست خدمات مهندسی (Client Component)
 */
export default function EngineeringContactForm() {
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
  );
}

