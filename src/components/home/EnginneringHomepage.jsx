"use client"

import React from 'react'
import { Ruler, Map, NotepadText, Building, DraftingCompass, ChevronLeftIcon } from "lucide-react"
import Link from 'next/link'

const EnginneringHomepage = () => {
    const services = [
        { icon: <Ruler />, title: "طراحی نقشه", desc: "تهیه نقشه های معماری سازه و تاسیسات" },
        { icon: <Map />, title: "نقشه برداری", desc: "برداشت utm مسافت تعین ارتفاع" },
        { icon: <NotepadText />, title: "پایان کار", desc: "پیگیری پرونده شهرداری و دریافت پایان کار" },
        { icon: <Building />, title: "اجرا نظارت", desc: "نظارت واجرای پروژه طبق قرارداد ساختمان" },
    ];

    return (
        <div>



            <div className="flex flex-col justify-center items-center w-full p-4">
                <div className='w-full max-w-[79rem]  justify-between hidden lg:flex '>
                    <div className='flex my-2'>
                        <div className='size-5 mx-2'><DraftingCompass className='w-full h-full' /></div>
                        <div>خدمات مهندسی</div>
                    </div>
                    <Link href={"/engineering"}>
                        <div className='flex'>
                            <div>مشاهده کامل خدمات مهندسی </div>
                            <div><ChevronLeftIcon /></div>
                        </div>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-7xl ">
                    {services.map((item, index) => (
                        <div key={index}
                         className="bg-white h-20 rounded-3xl flex flex-col justify-evenly
                          p-2 shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2">
                                {item.icon}
                                <h3 className="text-lg font-bold">{item.title}</h3>
                            </div>
                            <p className="text-sm text-gray-600 px-1">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    )
}

export default EnginneringHomepage