'use client';


import { Home, KeyIcon, DraftingCompassIcon } from 'lucide-react'

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState, memo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCities } from "@/hooks/useCities";
import { usePropertyTypes } from "@/hooks/usePropertyMutations";
import { useLocations } from "@/hooks/useLocations";
import Link from "next/link";
import { set } from 'date-fns';


import { engineeringServices } from "@/data/engineeringServices";



export default function MobileMenuCard({ setphoto }) {
  // Track which main tab is active. Default to 'engineering'
  const [activeTab, setActiveTab] = useState('buy');
  // Track sub-menu selection
  const [activeSubTab, setActiveSubTab] = useState('design');

  //engieering 



  const [selectedService, setSelectedService] = useState(engineeringServices[0].name);
  const currentService = engineeringServices.find(s => s.name === selectedService) || engineeringServices[0];
  //

  const router = useRouter();
  const [tab, setTab] = useState("buy");
  const [city, setCity] = useState(undefined);
  const [location, setLocation] = useState(undefined);
  const [type, setType] = useState(undefined);
  const [price, setPrice] = useState(undefined);


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
    console.log(tab)

    searchParams.set('transaction_type', tab === 'buy' ? 'sale' : 'rent');
    searchParams.set('from', 'home');

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
      const priceRanges = {
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
    <div className="w-full max-w-md mx-auto bg-[#f1f1f1] p-4 font-sans rounded-sm" dir="rtl" >

      {/* Top 3 Menu Boxes */}
      <div className="grid grid-cols-3 gap-2 mb-3 text-sm font-bold">
        <button
          onClick={() => { setActiveTab('buy'); setphoto(1); setTab("buy") }}
          className={`py-4 rounded-[14px] transition-colors shadow-sm ${activeTab === 'buy'
            ? 'bg-[#1b1464] text-white'
            : 'bg-white text-gray-800'
            }`}
        >
          خرید ملک
        </button>
        <button
          onClick={() => { setActiveTab('rent'); setphoto(2); setTab("rent") }}
          className={`py-4 rounded-[14px] transition-colors shadow-sm ${activeTab === 'rent'
            ? 'bg-[#1b1464] text-white'
            : 'bg-white text-gray-800'
            }`}
        >
          اجاره ملک
        </button>
        <button
          onClick={() => { setActiveTab('engineering'); setphoto(3) }}
          className={`py-4 rounded-[14px] transition-colors shadow-sm ${activeTab === 'engineering'
            ? 'bg-[#1b1464] text-white'
            : 'bg-white text-gray-800'
            }`}
        >
          خدمات مهندسی
        </button>
      </div>

      {/* The "Big Box" Content Area */}
      <div className="bg-white rounded-[16px] p-4 shadow-sm">

        {/* Content changes based on activeTab */}
        {activeTab === 'engineering' && (
          <div className="animate-fade-in">
            {/* Sub-menu Carousel / Scrollable Pills */}
            <div className="flex overflow-x-auto gap-2 pb-2 hide-scrollbar">
              {/* <button
                onClick={() => setActiveSubTab('design')}
                className={`
                flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors ${activeSubTab === 'design'
                  ? 'bg-[#1b1464] text-white border-[#1b1464]'
                  : 'bg-white text-[#1b1464] border-[#1b1464]'
                  }`}
              >
                <RulerIcon />
                <span className="text-sm font-medium">طراحی نقشه</span>
              </button> */}

              {/* Service Buttons */}
              <div className="flex flex-wrap gap-2   flex-shrink-0  items-center  px-4 py-2 rounded-xl border  transition-colors overflow-auto " dir="rtl">
                {engineeringServices.map((service) => {
                  const Icon = service.icon;
                  const isSelected = selectedService === service.name;
                  return (
                    <button
                      key={service.name}
                      onClick={() => setSelectedService(service.name)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium transition-all border-1 border-blue-900 border-solid ${isSelected
                        ? 'bg-blue-900 text-white shadow-lg '
                        : 'bg-card hover:bg-secondary border text-blue-900 border-input hover:shadow-md'
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-sm md:text-sm">{service.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description Text */}

            <div className='line-clamp-2 mb-1  mx-1 flex'>
              <div className='line-clamp-2 text-gray-800 text-sm leading-7 mt-4 mb-6 text-justify '>
                {currentService.details}
              </div>

            </div>

            {/* Action Button */}
            <button onClick={() => { router.push("/engineering") }} className="w-full bg-[#1b1464] text-white rounded-xl py-3.5 flex justify-center items-center gap-2 font-medium hover:bg-opacity-90 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              مشاهده اطلاعات بیشتر
            </button>
          </div>
        )}

        {/* Placeholders for other tabs */}
        {activeTab === 'buy' && (
          <div className=" flex justify-center py-3 text-center text-gray-600 animate-fade-in">
            <div className=' justify-between flex-col w-[90%] flex  '>

              <div className='flex justify-around items-center my-2 gap-2  '>
                {/* شهر */}
                <div className=' w-36  h-7'>
                  <Select
                    value={city}
                    onValueChange={(value) => {
                      setCity(value);
                      setLocation(undefined); // تغییر شهر => ریست منطقه
                    }}
                  >
                    <SelectTrigger dir="rtl">
                      <SelectValue placeholder=" شهر" />
                    </SelectTrigger>
                    <SelectContent className=' w-48 h-44'>
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
                {/* منطقه */}
                <div className='w-36 h-7'>
                  <Select
                    value={location}
                    onValueChange={setLocation}
                    disabled={!selectedCityId}
                  >
                    <SelectTrigger dir="rtl">
                      <SelectValue placeholder={selectedCityId ? "منطقه" : "منطقه"} />
                    </SelectTrigger>
                    <SelectContent className=' w-48 h-44'>
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
                {/* نوع ملک */}
                <div className='w-36  h-7'>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger dir="rtl">
                      <SelectValue placeholder="نوع ملک" />
                    </SelectTrigger>
                    <SelectContent className=' w-48 h-44'>
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
              <div className='my-3'>

                <Button className='w-full h-10 rounded-sm bg-[#221188] text-white' onClick={submitSearch}>
                  <Search className="h-4 w-full inline-block ml-2" /> جستجو
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rent' && (
          <div className=" flex justify-center py-3 text-center text-gray-600 animate-fade-in">
            <div className=' justify-between flex-col w-[90%] flex  '>

              <div className='flex justify-around items-center my-2 gap-2  '>
                {/* شهر */}
                <div className=' w-36  h-7'>
                  <Select
                    value={city}
                    onValueChange={(value) => {
                      setCity(value);
                      setLocation(undefined); // تغییر شهر => ریست منطقه
                    }}
                  >
                    <SelectTrigger dir="rtl">
                      <SelectValue placeholder=" شهر" />
                    </SelectTrigger>
                    <SelectContent className=' w-48 h-44'>
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
                {/* منطقه */}
                <div className='w-36 h-7'>
                  <Select
                    value={location}
                    onValueChange={setLocation}
                    disabled={!selectedCityId}
                  >
                    <SelectTrigger dir="rtl">
                      <SelectValue placeholder={selectedCityId ? "منطقه" : "منطقه"} />
                    </SelectTrigger>
                    <SelectContent className=' w-48 h-44'>
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
                {/* نوع ملک */}
                <div className='w-36  h-7'>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger dir="rtl">
                      <SelectValue placeholder="نوع ملک" />
                    </SelectTrigger>
                    <SelectContent className=' w-48 h-44'>
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
              <div className='my-3'>

                <Button className='w-full h-10 rounded-sm bg-[#221188] text-white' onClick={submitSearch}>
                  <Search className="h-4 w-full inline-block ml-2" /> جستجو
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Custom Ruler/Plan Icon matching your design
function RulerIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 20H4L4 4" />
      <path d="M16 4l-8 16" />
      <path d="M14 8h2" />
      <path d="M12 12h2" />
      <path d="M10 16h2" />

    </svg>
  );
}
