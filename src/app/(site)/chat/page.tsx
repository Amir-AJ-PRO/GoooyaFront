import type { Metadata } from "next";
import ChatClientWrapper from "@/components/ChatClientWrapper";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "دستیار هوشمند املاک",
  description: "گفتگو با دستیار هوشمند گویا برای پیدا کردن ملک، مشاوره خرید و اجاره در شرق تهران.",
  path: "/chat",
  noIndex: true,
});

/**
 * Chat Page - Server Component
 * صفحه چت با جداسازی کامل منطق به ChatClientWrapper
 */
export default function Chat() {
  return <ChatClientWrapper />;
}
