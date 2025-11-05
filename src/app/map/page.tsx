'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { MapPin, Search, Home, ArrowLeft, Info } from 'lucide-react';
import { Province, City } from '@/data/iranData';

// Dynamic import to avoid SSR issues with leaflet
const IranMap = dynamic(() => import('@/components/IranMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  ),
});

export default function Map() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<{
    province: Province;
    city: City;
  } | null>(null);

  const handleLocationSelect = (province: Province, city: City) => {
    setSelectedLocation({ province, city });
  };

  const handleSearchProperties = () => {
    if (selectedLocation) {
      router.push(`/properties?province=${selectedLocation.province.id}&city=${selectedLocation.city.id}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <MapPin className="h-6 w-6 md:h-8 md:w-8" />
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                  نقشه ایران
                </h1>
              </div>
              <p className="text-base md:text-lg lg:text-xl opacity-90 mb-4 md:mb-6">
                استان و شهر مورد نظر خود را انتخاب کنید تا املاک آن منطقه را مشاهده کنید
              </p>
              
              {selectedLocation && (
                <div className="bg-background/10 backdrop-blur-sm rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Info className="h-5 w-5" />
                    <span className="font-medium">موقعیت انتخاب شده:</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Badge variant="secondary" className="text-sm">
                      {selectedLocation.province.name}
                    </Badge>
                    <Badge variant="outline" className="text-sm bg-background/20">
                      {selectedLocation.city.name}
                    </Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-4 md:py-8 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-7xl mx-auto">
              <div className="h-[600px] md:h-[700px] xl:h-[600px]">
                <IranMap onLocationSelect={handleLocationSelect} />
              </div>
            </div>
          </div>
        </section>

        {/* Action Section */}
        {selectedLocation && (
          <section className="py-4 md:py-8 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Search className="h-5 w-5" />
                      جستجوی املاک در {selectedLocation.city.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription className="text-sm">
                          شما {selectedLocation.city.name} در استان {selectedLocation.province.name} را انتخاب کرده‌اید. 
                          برای مشاهده املاک موجود در این منطقه، روی دکمه زیر کلیک کنید.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="flex flex-col gap-3">
                        <Button 
                          onClick={handleSearchProperties}
                          className="w-full gap-2"
                          size="lg"
                        >
                          <Search className="h-4 w-4" />
                          جستجوی املاک در {selectedLocation.city.name}
                        </Button>
                        
                        <Button 
                          variant="outline"
                          onClick={() => router.push('/properties')}
                          className="w-full gap-2"
                          size="lg"
                        >
                          <Home className="h-4 w-4" />
                          مشاهده همه املاک
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

        {/* Instructions Section */}
        <section className="py-8 md:py-12 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-6 md:mb-8">
                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">راهنمای استفاده</h2>
                <p className="text-sm md:text-base text-muted-foreground">
                  برای انتخاب موقعیت مورد نظر خود، از روش‌های زیر استفاده کنید:
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                      <Search className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      جستجوی مستقیم
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      نام شهر مورد نظر خود را در کادر جستجو تایپ کنید و از نتایج موجود انتخاب کنید.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                      <MapPin className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      انتخاب از نقشه
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      روی نشانگرهای موجود در نقشه کلیک کنید تا استان یا شهر مورد نظر را انتخاب کنید.
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                      <ArrowLeft className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                      انتخاب مرحله‌ای
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      ابتدا استان و سپس شهر مورد نظر خود را از فهرست‌های کشویی انتخاب کنید.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
