"use client"
import React, { useState } from 'react'

import BgImage from "@/components/Threebox/BgImage";
import Threeboxx from "@/components/Threebox/Threeboxx"

import MobileMenuCard from "@/components/Threebox/MobileMenuCard"




const TopSection = () => {
  const [Photo, setPhoto] = useState(1)

  return (
    <div>
      <section className="relative min-h-[180px]    lg:min-h-[500px] overflow-visible     lg:mb-5  ">



        <div
          className="absolute w-11/12 left-1/2 -translate-x-1/2 
             inset-y-0
             top-3
             

             lg:top-0
             lg:-translate-x-0
             justify-center rounded-sm lg:inset-0 overflow-hidden lg:w-full"

        >
          <BgImage imageNum={Photo} />
          <div className="absolute inset-0 bg-black/40" />

        </div>



        {/* <div className="relative container mx-auto px-4 pt-8 md:pt-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-lg md:text-3xl font-bold text-white mb-1.5 md:mb-3">
              خانه رویایی خود را با هوش مصنوعی پیدا کنید
            </h1>
            <p className="text-xs md:text-base text-white/90 mb-2 md:mb-4">
              با شهر GPT، به زبان طبیعی جستجو کنید و بهترین املاک را پیدا کنید
            </p>
          </div>
        </div> */}

        {/* Search Bar - anchor to top so it grows downward (not upward) */}
        {/* <div className="absolute top-full -mt-10 md:-mt-14 left-0 right-0 z-20 ">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <SearchBar />
            </div>
          </div>
        </div> */}


        <div className="absolute top-48   lg:top-52 -mt-10 lg:-mt-20 left-0 right-0 z-20  " >
          {/* three bar */}
          <Threeboxx SetBoxNuber={(value) => { setPhoto(value) }}
          //  SetBoxNuber={(value)=>{setPhoto(value)}}
          />

        </div>
     


      </section>
         {/* mobile three bar */}
      <div className='  sm:hidden mb-6' >
        <MobileMenuCard setphoto={(value)=>{setPhoto(value)}} />
      </div>

    </div>
  )
}

export default TopSection
