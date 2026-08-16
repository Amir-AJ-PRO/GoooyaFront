import type { Metadata } from "next";
import BecomeAgentClient from "./BecomeAgentClient";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "همکاری به عنوان مشاور املاک",
  description: "به شبکه مشاوران گویا بپیوندید و آگهی‌های ملک خود را در شرق تهران، دماوند و پردیس منتشر کنید.",
  path: "/become-agent",
  keywords: ["استخدام مشاور املاک", "ثبت‌نام مشاور املاک", "همکاری با گویا"],
});

export default function BecomeAgentPage() {
  return <BecomeAgentClient />;
}





