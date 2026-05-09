import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import DevLoginHelper from "@/components/DevLoginHelper";
import "./globals.css";
import localFont from 'next/font/local';

  



export const metadata: Metadata = {
  title: "گویا - پلتفرم املاک فارسی",
  description: "بهترین پلتفرم برای خرید، فروش و اجاره املاک در ایران. جستجو و مشاهده هزاران آگهی املاک با امکانات پیشرفته.",
  keywords: ["املاک", "خرید خانه", "فروش ملک", "اجاره آپارتمان", "مشاور املاک", "پلتفرم املاک"],
  authors: [{ name: "گویا" }],
  icons: {
    icon: [
      { url: "/logo.png" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/logo.png" },
      { url: "/logo.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/logo.png"],
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "https://gooya.ir",
    siteName: "گویا",
    title: "گویا - پلتفرم املاک فارسی",
    description: "بهترین پلتفرم برای خرید، فروش و اجاره املاک در ایران",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "لوگوی گویا",
      },
      {
        url: "/assets/hero-home.jpg",
        width: 1200,
        height: 630,
        alt: "گویا - پلتفرم املاک فارسی",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "گویا - پلتفرم املاک فارسی",
    description: "بهترین پلتفرم برای خرید، فروش و اجاره املاک در ایران",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};
const myfont = localFont({
  src: [
    {
      path:"../../public/Iransans/IRANSansXFaNum-Regular.ttf",
      
    }]
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html  lang="fa" dir="rtl" className={myfont.className}>
      <head>
   
      </head>
      <body className="antialiased   ">
        <Providers>
          <DevLoginHelper />
          <div className="min-h-screen flex flex-col   ">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
