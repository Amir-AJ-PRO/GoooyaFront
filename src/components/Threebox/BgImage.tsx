"use client"
import Image from 'next/image'
import React, { useState } from 'react'
import x from '../../assets/box1.jpg'

const BgImage = ({ imageNum }) => {



    return (
        <div>
         

            {imageNum == 1 && <Image
                src="/publicPhotos/box1.jpg"
                alt="گویا - پلتفرم املاک فارسی"
                fill
                className="object-cover"
                priority
            />}
            {imageNum == 2 && <Image
                src="/publicPhotos/box2.jpg"
                alt="گویا - پلتفرم املاک فارسی"
                fill
                className="object-cover"
                priority
            />}
            {imageNum == 3 && <Image
                src="/publicPhotos/box3.jpg"
                alt="گویا - پلتفرم املاک فارسی"
                fill
                className="object-cover"
                priority
            />}

        </div>
    )
}

export default BgImage