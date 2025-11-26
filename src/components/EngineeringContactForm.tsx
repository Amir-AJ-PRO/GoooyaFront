'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { engineeringServices } from "@/data/engineeringServices";
import { useEngineeringForm } from "@/hooks/useEngineering";

/**
 * EngineeringContactForm Component
 * فرم درخواست خدمات مهندسی (Client Component)
 */
export default function EngineeringContactForm() {
  const { toast } = useToast();
  const { submitForm, isLoading, reset } = useEngineeringForm();
  const [selectedService, setSelectedService] = useState<string>(engineeringServices[0].name);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const handleSubmit = async () => {
    if (isLoading) return;

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      
      await submitForm({
        fullName,
        phone: contactPhone,
        serviceType: selectedService,
      });

      // Reset form on success
      setFirstName("");
      setLastName("");
      setContactPhone("");
      reset();
    } catch (error: any) {
      toast({
        title: "خطا در ثبت درخواست",
        description: error.message || "خطای نامشخص رخ داده است",
        variant: "destructive",
      });
    }
  };
  
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
                  <Select value={selectedService} onValueChange={setSelectedService} disabled={isLoading}>
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
                      disabled={isLoading}
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
                      disabled={isLoading}
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
                    placeholder="09123456789"
                    disabled={isLoading}
                  />
                </div>

                <div className="pt-4">
                  <Button 
                    className="w-full" 
                    onClick={handleSubmit} 
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                    ) : (
                      <Phone className="h-4 w-4 ml-2" />
                    )}
                    {isLoading ? 'در حال ارسال...' : `ارسال درخواست برای ${currentService.name}`}
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

