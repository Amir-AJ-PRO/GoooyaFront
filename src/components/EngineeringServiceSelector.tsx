'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { engineeringServices } from "@/data/engineeringServices";

/**
 * EngineeringServiceSelector Component
 * انتخابگر خدمات مهندسی با نمایش جزئیات (Client Component)
 */
export default function EngineeringServiceSelector() {
  const [selectedService, setSelectedService] = useState<string>(engineeringServices[0].name);
  
  const currentService = engineeringServices.find(s => s.name === selectedService) || engineeringServices[0];

  return (
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
  );
}

