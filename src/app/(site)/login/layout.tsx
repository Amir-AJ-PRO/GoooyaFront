import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'ورود به گویا',
  description: 'ورود به حساب کاربری گویا برای مدیریت آگهی، علاقه‌مندی‌ها و درخواست بازدید ملک.',
  path: '/login',
  noIndex: true,
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
