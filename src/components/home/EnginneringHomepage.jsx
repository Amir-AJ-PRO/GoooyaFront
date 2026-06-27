"use client";

import React from "react";
import {
    Ruler,
    TriangleRight,
    PencilRuler,

    
  Triangle,
  FileText,
  Building2,
  Pencil,
  DraftingCompass,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: Pencil,
    bgIcon: Ruler,
    title: "طراحی نقشه",
    desc: "تهیه نقشه‌های معماری، سازه و تاسیسات",
  },
  {
    icon: TriangleRight,
    bgIcon: TriangleRight,
    title: "نقشه برداری",
    desc: "برداشت UTM، مساحت، تعیین ارتفاع",
  },
  {
    icon: FileText,
    bgIcon: FileText,
    title: "پایان کار",
    desc: "پیگیری پرونده شهرداری و دریافت پایان‌کار",
  },
  {
    icon: Building2,
    bgIcon: Building2,
    title: "اجرا و نظارت",
    desc: "نظارت و اجرای پروژه طبق مقررات ساختمان",
  },
];

function ServiceCard({ icon: Icon, bgIcon: BgIcon, title, desc }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white px-5 py-4">
      <div className="relative z-10 flex flex-col gap-1.5 text-right">
        <div className="flex items-center justify-start gap-2">
          <Icon className="size-[18px] shrink-0 text-black" strokeWidth={1.75} />
          <h3 className="text-base font-bold text-black">{title}</h3>
        </div>
        <p className="text-sm leading-6 text-[#666666]">{desc}</p>
      </div>
      <BgIcon
        className="pointer-events-none absolute -bottom-3 -left-2 size-[72px] text-[#D9D9D9]"
        strokeWidth={1.25}
      />
    </div>
  );
}

const EnginneringHomepage = () => {
  return (
    <section className="bg-[#E0E0E0]">
      <div className="container mx-auto px-4">
        <div className="mb-5 mt-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DraftingCompass className="size-6 text-black" strokeWidth={1.75} />
            <h2 className="text-lg font-bold text-black">خدمات مهندسی</h2>
          </div>
          <Link
            href="/engineering"
            className="flex items-center gap-1 text-sm text-black transition-colors hover:text-gray-700"
          >
            <span>مشاهده کامل خدمات مهندسی</span>
            <ChevronLeft className="size-5" />
          </Link>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {services.map((item) => (
            <ServiceCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnginneringHomepage;
