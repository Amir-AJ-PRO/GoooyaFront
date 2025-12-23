'use client';

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState, memo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCities } from "@/hooks/useCities";
import { usePropertyTypes } from "@/hooks/usePropertyMutations";
import { useLocations } from "@/hooks/useLocations";
import Link from "next/link";

const SearchBar = memo(() => {
  const router = useRouter();
  const [tab, setTab] = useState<"buy" | "rent">("buy");
  const [city, setCity] = useState<string | undefined>(undefined);
  const [location, setLocation] = useState<string | undefined>(undefined);
  const [type, setType] = useState<string | undefined>(undefined);
  const [price, setPrice] = useState<string | undefined>(undefined);

  // دریافت شهرها
  const { data: cities = [], isLoading: citiesLoading } = useCities();
  
  // دریافت انواع ملک از دیتابیس
  const { data: propertyTypes = [], isLoading: propertyTypesLoading } = usePropertyTypes();

  const selectedCity = city ? cities.find((c) => c.id === Number(city)) : undefined;
  const selectedCityId = city ? Number(city) : undefined;

  // دریافت مناطق (ترجیحاً بعد از انتخاب شهر)
  const { data: locations = [], isLoading: locationsLoading } = useLocations(selectedCityId, {
    enabled: !!selectedCityId,
  });

  const selectedLocation = location
    ? locations.find((l) => l.id === Number(location))
    : undefined;

  const submitSearch = useCallback(() => {
    // ساخت پارامترهای جستجو
    const searchParams = new URLSearchParams();
    
    searchParams.set('transaction_type', tab === 'buy' ? 'sale' : 'rent');
    
    if (city) {
      searchParams.set('city', city);
    }

    if (location) {
      searchParams.set('location', location);
    }
    
    if (type) {
      // type حالا ID است (از دیتابیس)
      searchParams.set('property_type', type);
    }
    
    if (price) {
      // تبدیل محدوده قیمت
      const priceRanges: Record<string, { min: string, max: string }> = {
        'low': { min: '0', max: '5000000000' },
        'mid': { min: '5000000000', max: '20000000000' },
        'high': { min: '20000000000', max: '100000000000' }
      };
      if (priceRanges[price]) {
        searchParams.set('min_price', priceRanges[price].min);
        searchParams.set('max_price', priceRanges[price].max);
      }
    }
    
    // انتقال به صفحه املاک
    router.push(`/properties?${searchParams.toString()}`);
  }, [router, tab, city, location, type, price]);

  return (
    <div className="bg-card rounded-2xl shadow-large p-3 md:p-6" dir="rtl">
      {/* Tabs */}
      <div className="flex gap-2 mb-3 md:mb-4 justify-start">
        <button
          className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
            tab === "buy" 
              ? "bg-primary text-primary-foreground" 
              : "bg-transparent border border-input hover:bg-secondary"
          }`}
          onClick={() => setTab("buy")}
        >
          خرید ملک
        </button>
        <button
          className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
            tab === "rent" 
              ? "bg-primary text-primary-foreground" 
              : "bg-transparent border border-input hover:bg-secondary"
          }`}
          onClick={() => setTab("rent")}
        >
          رهن و اجاره
        </button>
      </div>

      {/* Content - Mobile */}
      <div className="md:hidden space-y-2">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Select
              value={city}
              onValueChange={(value) => {
                setCity(value);
                setLocation(undefined); // تغییر شهر => ریست منطقه
              }}
            >
              <SelectTrigger dir="rtl" className="h-9 text-xs">
                <SelectValue placeholder="شهر" />
              </SelectTrigger>
              <SelectContent>
                {citiesLoading ? (
                  <SelectItem value="loading" disabled>در حال بارگذاری...</SelectItem>
                ) : (
                  cities.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              value={location}
              onValueChange={setLocation}
              disabled={!selectedCityId}
            >
              <SelectTrigger dir="rtl" className="h-9 text-xs">
                <SelectValue placeholder={selectedCityId ? "منطقه" : "ابتدا شهر"} />
              </SelectTrigger>
              <SelectContent>
                {!selectedCityId ? (
                  <SelectItem value="disabled" disabled>ابتدا شهر را انتخاب کنید</SelectItem>
                ) : locationsLoading ? (
                  <SelectItem value="loading" disabled>در حال بارگذاری...</SelectItem>
                ) : locations.length === 0 ? (
                  <SelectItem value="empty" disabled>منطقه‌ای یافت نشد</SelectItem>
                ) : (
                  locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id.toString()}>
                      {loc.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-2">
            <Select value={type} onValueChange={setType}>
              <SelectTrigger dir="rtl" className="h-9 text-xs">
                <SelectValue placeholder="نوع ملک" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypesLoading ? (
                  <SelectItem value="loading" disabled>در حال بارگذاری...</SelectItem>
                ) : (
                  propertyTypes.map((pt) => (
                    <SelectItem key={pt.id} value={pt.id.toString()}>
                      {pt.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button className="w-full h-9 text-xs" onClick={submitSearch}>
          <Search className="h-3 w-3 inline-block ml-2" /> جستجو
        </Button>
      </div>

      {/* Content - Desktop */}
      <div className="hidden md:block">
        <div className="grid grid-cols-4 gap-3 items-end">
          <div>
            <Select
              value={city}
              onValueChange={(value) => {
                setCity(value);
                setLocation(undefined); // تغییر شهر => ریست منطقه
              }}
            >
              <SelectTrigger dir="rtl">
                <SelectValue placeholder="انتخاب شهر" />
              </SelectTrigger>
              <SelectContent>
                {citiesLoading ? (
                  <SelectItem value="loading" disabled>در حال بارگذاری...</SelectItem>
                ) : (
                  cities.map((city) => (
                    <SelectItem key={city.id} value={city.id.toString()}>
                      {city.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              value={location}
              onValueChange={setLocation}
              disabled={!selectedCityId}
            >
              <SelectTrigger dir="rtl">
                <SelectValue placeholder={selectedCityId ? "منطقه" : "ابتدا شهر"} />
              </SelectTrigger>
              <SelectContent>
                {!selectedCityId ? (
                  <SelectItem value="disabled" disabled>ابتدا شهر را انتخاب کنید</SelectItem>
                ) : locationsLoading ? (
                  <SelectItem value="loading" disabled>در حال بارگذاری...</SelectItem>
                ) : locations.length === 0 ? (
                  <SelectItem value="empty" disabled>منطقه‌ای یافت نشد</SelectItem>
                ) : (
                  locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id.toString()}>
                      {loc.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger dir="rtl">
                <SelectValue placeholder="نوع ملک" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypesLoading ? (
                  <SelectItem value="loading" disabled>در حال بارگذاری...</SelectItem>
                ) : (
                  propertyTypes.map((pt) => (
                    <SelectItem key={pt.id} value={pt.id.toString()}>
                      {pt.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={price} onValueChange={setPrice}>
              <SelectTrigger dir="rtl">
                <SelectValue placeholder="قیمت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">تا ۵ میلیارد</SelectItem>
                <SelectItem value="mid">۵ تا ۲۰ میلیارد</SelectItem>
                <SelectItem value="high">بیشتر از ۲۰ میلیارد</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-3">
          <Button className="w-full" onClick={submitSearch}>
            <Search className="h-4 w-4 inline-block ml-2" /> جستجو
          </Button>
        </div>
      </div>

      {/* درباره شهر انتخاب شده */}
      {selectedCity && (
        <div className="mt-4 pt-4 border-t">
          <Link
            href={`/cities/${selectedCity.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            در مورد {selectedCity.name}
            <span className="text-muted-foreground text-xs font-normal">
              (مشاهده اطلاعات شهر و املاک مرتبط)
            </span>
          </Link>
        </div>
      )}

      {/* درباره منطقه انتخاب شده */}
      {selectedLocation && (
        <div className="mt-2">
          <Link
            href={`/locations/${selectedLocation.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            در مورد {selectedLocation.name}
            <span className="text-muted-foreground text-xs font-normal">
              (مشاهده اطلاعات منطقه و املاک مرتبط)
            </span>
          </Link>
        </div>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;

