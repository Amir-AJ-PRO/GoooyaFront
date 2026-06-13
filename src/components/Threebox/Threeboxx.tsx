"use client"

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
import type { Metadata } from "next";

import { engineeringServices } from "@/data/engineeringServices";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import localFont from 'next/font/local';
import BgImage from './BgImage';


interface ThreeboxProps {
    SetBoxNuber: (n: number) => void;
}


const Threebox = ({SetBoxNuber }:ThreeboxProps) => {

    



    //engieering 



    const [selectedService, setSelectedService] = useState<string>(engineeringServices[0].name);
    const currentService = engineeringServices.find(s => s.name === selectedService) || engineeringServices[0];
    //

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





    //my code
    const [box, setbox] = useState(1)

    useEffect(()=>{SetBoxNuber(box)},[box])

    return (<div className=' hidden lg:block'>
        <div className='flex justify-center items-center '>
            <div className='w-8/12 flex justify-center items-center '>
            

                {/* make flex */}
                {/* the  box */}
                <div onClick={() => { setbox(1); setTab("buy") ; }} className='mx-5 bg-[#FEFEFE] rounded-md w-5/12 min-w-[305px] h-20 relative border-black flex flex-col justify-around  '>
                    <div className=' mx-3 flex justify-between cursor-pointer'>
                        <div className="font-bold text-3xl"  > خرید ملک</div>

                        <div><Home className='my-2 h-9 w-9' /></div>
                    </div>
                    <div className=' cursor-pointer mx-3 mb-1'>
                        پیدا کردن بهترین گزینه های خرید ملک
                    </div>


                    {/* the square */}
                    <div className="relative  ">
                        {box === 1 ? (
                            <div className="absolute w-full h-14 bottom-[-50px] bg-[#FEFEFE]">
                                <div className="w-full h-full relative">

                                </div>
                            </div>
                        ) : <div></div>}
                        {/* THE BIG BOX */}
                        {box === 1 ? (<div className="absolute top-5 h-44 w-[328%] rounded-sm bg-[#FEFEFE] flex flex-col justify-evenly">   
                            <div className=' mx-3 font-bold text-xl  '> فیلتر ها و جستجو </div>
                            <div className='flex justify-around items-center  '>
                                {/* شهر */}
                                <div className='w-60 h-10'>
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
                                {/* منطقه */}
                                <div className='w-60 h-10'>
                                    <Select
                                        value={location}
                                        onValueChange={setLocation}
                                        disabled={!selectedCityId}
                                    >
                                        <SelectTrigger dir="rtl">
                                            <SelectValue placeholder={selectedCityId ? "منطقه" : "منطقه"} />
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
                                {/* نوع ملک */}
                                <div className='w-60 h-10'>
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

                                <Button className='w-3/12 h-10 rounded-sm bg-[#221188] text-white' onClick={submitSearch}>
                                    <Search className="h-4 w-4 inline-block ml-2" /> جستجو
                                </Button>


                            </div>

                        </div>) : <div></div>}
                    </div>

                </div>






                {/* the scound box */}
                <div onClick={() => { setbox(2); setTab("rent") }} className='cursor-pointer mx-5 bg-[#FEFEFE] min-w-[310px] rounded-md w-5/12 h-20 relative border-black flex flex-col justify-around  '>
                    <div className=' mx-3 flex justify-between'>
                        <div className='font-bold  text-3xl '> اجاره ملک</div>
                        <div><KeyIcon className='my-2 h-9 w-9' /></div>
                    </div>
                    <div className='mx-3 cursor-pointer mb-1'>
                        املاک اماده اجاره با فیلتر دهای دقیق وسریع
                    </div>


                    {/* the square */}
                    <div className="relative ">
                        {box === 2 ? (
                            <div className="absolute w-full h-14 bottom-[-50px] bg-[#FEFEFE] cursor-pointer">
                                <div className="w-full h-full relative">

                                </div>
                            </div>
                        ) : <div></div>}
                        {/* THE BIG BOX */}
                        {box === 2 ? (<div className="h-44 absolute top-5 -left-[113%]  w-[326%] rounded-sm bg-[#FEFEFE] flex flex-col justify-evenly ">
                            <div className=' mx-3 font-bold text-xl '> فیلتر ها و جستجو </div>
                            <div className='flex justify-around items-center '>
                                {/* شهر */}
                                <div className='w-60 h-10'>
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
                                {/* منطقه */}
                                <div className='w-60 h-10'>
                                    <Select
                                        value={location}
                                        onValueChange={setLocation}
                                        disabled={!selectedCityId}
                                    >
                                        <SelectTrigger dir="rtl">
                                            <SelectValue placeholder={selectedCityId ? "منطقه" : "منطقه"} />
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
                                {/* نوع ملک */}
                                <div className='w-60 h-10'>
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

                                <Button className='w-3/12 h-10 rounded-sm bg-[#221188] text-white' onClick={submitSearch}>
                                    <Search className="h-4 w-4 inline-block ml-2" /> جستجو
                                </Button>


                            </div>

                        </div>) : <div></div>}

                    </div>

                </div>







                {/* the third box */}
                <div onClick={() => { setbox(3); }} className=' min-w-[305px]  mx-5 bg-[#FEFEFE] rounded-md w-5/12 h-20 relative border-black flex flex-col justify-around  '>
                    <div className=' mx-3 flex justify-between cursor-pointer'>
                        <div className='font-bold text-3xl'> خدمات مهندسی </div>
                        <div><DraftingCompassIcon className='my-2 h-9 w-9' /></div>
                    </div>
                    <div className='cursor-pointer mx-3 mb-1'>
                        از نقشه تا تایید و خدمات مهندسی
                    </div>


                    {/* the square */}
                    <div className="relative ">
                        {box === 3 ? (
                            <div className="absolute w-full h-14 bottom-[-50px] bg-[#FEFEFE] cursor-pointer ">
                                <div className="w-full h-full relative">

                                </div>
                            </div>
                        ) : <div></div>}
                        {/* THE BIG BOX */}
                        {box === 3 ? (<div className="h-44   absolute top-5 left-[0]  w-[326%] rounded-sm bg-[#FEFEFE] flex flex-col justify-around   ">
                            <div className=' mx-3 font-bold text-xl '>
                                خدمات ما
                            </div>
                            <div className=''>
                                {/* Service Buttons */}
                                <div className="flex flex-wrap gap-2 mx-1  " dir="rtl">
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
                            {/* Service Details Card */}
                            <div className='line-clamp-2 mb-1  mx-1 flex'>
                                <div className='line-clamp-2 mb-1 text-sm  mx-1 basis-9/12'>
                                    {currentService.details}
                                </div>
                                <div className='basis-3/12'>
                                    <button className='bg-blue-900 w-full rounded-sm h-5/6 text-white' onClick={() => { router.push("/engineering") }}>
                                        مشاهده اطلاعات بیشتر
                                    </button>
                                </div>
                            </div>


                        </div>) : <div></div>}

                    </div>

                </div>








            </div>
        </div>
    </div>
    )
}

export default Threebox