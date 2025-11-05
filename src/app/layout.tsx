import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import DevLoginHelper from "@/components/DevLoginHelper";
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
          {children}
        </Providers>
      </body>
    </html>
  );
}
