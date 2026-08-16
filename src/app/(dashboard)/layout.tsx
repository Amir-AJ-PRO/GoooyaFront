import type { Metadata } from 'next';
import DashboardShell from './DashboardShell';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'پنل کاربری',
  description: 'مدیریت حساب کاربری گویا',
  path: '/user',
  noIndex: true,
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
