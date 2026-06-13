"use client"
import Image from 'next/image'
import React from 'react'

interface BgImageProps {
  imageNum: 1 | 2 | 3
}

const BgImage = ({ imageNum }: BgImageProps) => {
  return (
    <div>
      {imageNum === 1 && (
        <Image
          src="/publicPhotos/box1.jpg"
          alt="گویا - پلتفرم املاک فارسی"
          fill
          className="object-cover"
          priority
        />
      )}
      {imageNum === 2 && (
        <Image
          src="/publicPhotos/box2.jpg"
          alt="گویا - پلتفرم املاک فارسی"
          fill
          className="object-cover"
          priority
        />
      )}
      {imageNum === 3 && (
        <Image
          src="/publicPhotos/box3.jpg"
          alt="گویا - پلتفرم املاک فارسی"
          fill
          className="object-cover"
          priority
        />
      )}
    </div>
  )
}

export default BgImage
