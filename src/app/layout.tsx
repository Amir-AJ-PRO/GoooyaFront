import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import DevLoginHelper from "@/components/DevLoginHelper";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "گویا - پلتفرم املاک فارسی",
  description: "بهترین پلتفرم برای خرید، فروش و اجاره املاک در ایران. جستجو و مشاهده هزاران آگهی املاک با امکانات پیشرفته.",
  keywords: ["املاک", "خرید خانه", "فروش ملک", "اجاره آپارتمان", "مشاور املاک", "پلتفرم املاک"],
  authors: [{ name: "گویا" }],
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "https://gooya.ir",
    siteName: "گویا",
    title: "گویا - پلتفرم املاک فارسی",
    description: "بهترین پلتفرم برای خرید، فروش و اجاره املاک در ایران",
    images: [
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
    images: ["/assets/hero-home.jpg"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
          rel="stylesheet"
          type="text/css"
        />
      </head>
      <body className="antialiased">
        <Providers>
          <DevLoginHelper />
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
