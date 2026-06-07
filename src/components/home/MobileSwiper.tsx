'use client';

import React from 'react';
// Import Swiper React components and styles
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { useHomepageProperties } from '@/hooks/usePropertyMutations';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from 'react-day-picker';
import Home from '@/app/(site)/page';
import PropertyCard from '../PropertyCard';
import SwiperContent from '@/components/home/SwiperContent';






export default function MobileSwiper() {

    const { data: properties, isLoading, error } = useHomepageProperties()




    return (
        <div>
            {isLoading ? (
                // حالت بارگذاری
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                    <p className="text-gray-600 text-lg">در حال بارگذاری املاک...</p>
                </div>
            ) : error ? (
                // حالت خطا - نمایش پیام خطا
                <Card className="p-8 text-center border-2 border-red-200 bg-red-50">
                    <AlertCircle className="w-5 h-5 text-red-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-red-800 mb-2">خطا در بارگذاری املاک</h3>
                    <p className="text-red-600 mb-4">
                        {error.message || 'مشکلی در دریافت املاک پیش آمده است'}
                    </p>
                    <Button
                        variant="outline"
                        className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                        onClick={() => window.location.reload()}
                    >
                        تلاش مجدد
                    </Button>
                </Card>
            ) : properties && properties.length > 0 ? (

                <>

                    <div className="">

                        <div className="w-full bg-[#f3f4f6] py-6 px-4 font-sans" dir="rtl">


                            {/* Swiper Section */}
                            <div className="-mx-4 px-4">
                                <Swiper
                                    spaceBetween={16}
                                    slidesPerView={1.2}
                                    className="w-full"
                                >
                                    {properties.map((property) => (
                                        <SwiperSlide key={property.id} className='pb-4'>
                                            <SwiperContent property={property} />
                                        </SwiperSlide>




                                    ))}
                                </Swiper>
                            </div>
                        </div>

                    </div>


                </>
            ) : (

                <div>هیچ ملکی موجود نیست</div>
            )}
        </div>

    );
}




