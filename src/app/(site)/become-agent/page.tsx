import type { Metadata } from "next";
import BecomeAgentClient from "./BecomeAgentClient";

export const metadata: Metadata = {
  title: "درخواست تبدیل به مشاور املاک - گویا",
  description: "درخواست تبدیل به مشاور املاک در پلتفرم گویا. با پر کردن فرم زیر، درخواست خود را برای تبدیل به agent ثبت کنید.",
  keywords: ["مشاور املاک", "درخواست agent", "ثبت‌نام مشاور", "کار در املاک"],
  openGraph: {
    title: "درخواست تبدیل به مشاور املاک - گویا",
    description: "با پر کردن فرم زیر، درخواست خود را برای تبدیل به agent ثبت کنید",
  },
};

export default function BecomeAgentPage() {
  return <BecomeAgentClient />;
}

