import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "گویا - پلتفرم املاک فارسی",
  description: "بهترین پلتفرم برای خرید، فروش و اجاره املاک در ایران. جستجو و مشاهده هزاران آگهی املاک با امکانات پیشرفته.",
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}

