import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import DevLoginHelper from "@/components/DevLoginHelper";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "گویا - پلتفرم املاک فارسی",
  description: "بهترین پلتفرم برای خرید، فروش و اجاره املاک در ایران",
  keywords: ["املاک", "خرید خانه", "فروش ملک", "اجاره آپارتمان"],
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
