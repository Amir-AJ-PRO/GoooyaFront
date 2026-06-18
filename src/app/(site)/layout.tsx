import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AiWidget from "@/components/aiwidget/AiWidget"

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
    <div className=" bg-[#E0E0E0]">
      <Header />
      <main className="flex-1 ">
        {children}
          <div className="fixed bottom-0 right-0 z-50">
        <AiWidget/>


      </div>
      </main>
      <Footer />
    </div>
  );
}


