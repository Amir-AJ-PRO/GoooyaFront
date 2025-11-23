import type { Metadata } from "next";
import ChatClientWrapper from "@/components/ChatClientWrapper";

export const metadata: Metadata = {
  title: "گویا AI - دستیار هوشمند املاک",
  description: "چت با دستیار هوشمند گویا برای یافتن ملک مناسب، دریافت مشاوره و پاسخ به سوالات املاک",
  keywords: ["چت بات املاک", "دستیار هوشمند", "مشاوره املاک آنلاین", "AI املاک"],
};

/**
 * Chat Page - Server Component
 * صفحه چت با جداسازی کامل منطق به ChatClientWrapper
 */
export default function Chat() {
  return <ChatClientWrapper />;
}
