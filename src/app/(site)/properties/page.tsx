import type { Metadata } from "next";
import PropertyCard from "@/components/cards/PropertyCard";
import SearchBar from "@/components/common/SearchBar";
import { FilterSidebar } from "@/components/filters/FilterSidebar";
import { SortFilter } from "@/components/filters/SortFilter";

export const metadata: Metadata = {
  title: "جستجوی املاک - گویا | آپارتمان، ویلا و تاون‌هاوس",
  description: "جستجو در هزاران آگهی املاک برای خرید، فروش و اجاره. فیلترهای پیشرفته برای یافتن ملک مناسب شما در تمام نقاط ایران.",
  keywords: ["جستجوی املاک", "خرید آپارتمان", "اجاره خانه", "فروش ویلا", "املاک تهران", "مشاور املاک"],
  openGraph: {
    title: "جستجوی املاک در گویا",
    description: "هزاران آگهی املاک برای خرید، فروش و اجاره",
    images: [
      {
        url: "/assets/property-1.jpg",
        width: 1200,
        height: 630,
        alt: "املاک گویا",
      },
    ],
  },
};

export default function Properties() {
  const properties = [
    {
      id: 1,
      title: "آپارتمان مدرن در تهران",
      price: "۸ میلیارد تومان",
      location: "تهران، فرشته",
      bedrooms: 3,
      area: 120,
      image: "/assets/property-1.jpg",
    },
    {
      id: 2,
      title: "ویلا لوکس با باغ",
      price: "۱۵ میلیارد تومان",
      location: "تهران، لواسان",
      bedrooms: 4,
      area: 300,
      image: "/assets/property-2.jpg",
    },
    {
      id: 3,
      title: "تاون‌هاوس مدرن",
      price: "۶ میلیارد تومان",
      location: "تهران، پونک",
      bedrooms: 2,
      area: 150,
      image: "/assets/property-3.jpg",
    },
    {
      id: 4,
      title: "آپارتمان نوساز",
      price: "۷ میلیارد تومان",
      location: "تهران، ولنجک",
      bedrooms: 2,
      area: 110,
      image: "/assets/property-1.jpg",
    },
    {
      id: 5,
      title: "ویلا دوبلکس",
      price: "۱۲ میلیارد تومان",
      location: "تهران، نیاوران",
      bedrooms: 5,
      area: 350,
      image: "/assets/property-2.jpg",
    },
    {
      id: 6,
      title: "آپارتمان لوکس",
      price: "۱۰ میلیارد تومان",
      location: "تهران، زعفرانیه",
      bedrooms: 3,
      area: 180,
      image: "/assets/property-3.jpg",
    },
  ];

  return (
    <>
      {/* Search Section */}
      <section className="bg-secondary/30 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">جستجوی املاک</h1>
            <p className="text-muted-foreground">املاک مورد نظر خود را با فیلترهای پیشرفته پیدا کنید</p>
          </div>
          <SearchBar />
        </div>
      </section>

      {/* Properties Grid with Filters */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex gap-6">
            {/* Filter Sidebar */}
            <aside className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar />
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{properties.length}</span> ملک یافت شد
                </p>
                <SortFilter />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

