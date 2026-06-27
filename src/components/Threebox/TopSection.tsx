"use client"
import React, { useCallback, useState } from 'react'

import BgImage from "@/components/Threebox/BgImage";
import Threeboxx from "@/components/Threebox/Threeboxx"
import MobileMenuCard from "@/components/Threebox/MobileMenuCard"

const TopSection = () => {
  const [Photo, setPhoto] = useState<1 | 2 | 3>(1)
  const handlePhotoChange = useCallback((value: 1 | 2 | 3) => {
    setPhoto(value)
  }, [])

  return (
    <div>
      <section className="relative min-h-[180px] lg:min-h-[500px] overflow-visible lg:mb-5">
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

        <div className="absolute top-48 lg:top-52 -mt-10 lg:-mt-20 left-0 right-0 z-20">
          <Threeboxx SetBoxNuber={handlePhotoChange} />
        </div>
      </section>

      {/* mobile three bar */}
      <div className='sm:hidden mb-6'>
        <MobileMenuCard setphoto={handlePhotoChange} />
      </div>
    </div>
  )
}

export default TopSection
