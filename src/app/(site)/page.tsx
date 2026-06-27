import type { Metadata } from "next";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import TopSection from "@/components/Threebox/TopSection";
import AgentHome from "@/components/agent/AgentHome"
import EnginneringHomepage from "@/components/home/EnginneringHomepage"
import TabletPropertySwiper from "@/components/home/TabletPropertySwiper"
import { useHomepageProperties } from "@/hooks/usePropertyMutations";
import AiWidget from "@/components/aiwidget/AiWidget"







export default function Home() {
  



  return (
    <div className="home-page">
      {/* Hero Section */}
      <TopSection />  







      {/* Featured Properties */}
      <FeaturedProperties />

      {/* About Section Preview */}
      {/* <section className="py-16 bg-secondary/30  ">
        <div className="container mx-auto px-4 ">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">درباره گویا</h2>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              گویا، پلی بین خریداران و اجاره‌کنندگان با مشاوران املاک. تجربه‌ای ساده و مدرن برای پیدا کردن ملک مورد نظرتان.
              ما با ارائه پلتفرمی حرفه‌ای و کاربرپسند، فرآیند خرید، فروش و اجاره املاک را برای شما آسان می‌کنیم.
            </p>
            <Link href="/about">
              <Button variant="default" className="gap-2">
                بیشتر بخوانید
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section> */}
   
      {/* مشاورین */}
      <div  >
        <AgentHome />

      </div>
      {/* خدمات مهندسی  */}
      <EnginneringHomepage />
    </div>
  );
}

