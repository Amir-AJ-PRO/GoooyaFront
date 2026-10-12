import type { Metadata } from 'next';
import { GooyaClubPage } from '@/features/club/GooyaClubPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'گویا کلاب',
  description:
    'امتیازهای داستانی، قرعه‌کشی پایان ماه و ثبت آیدی اینستاگرام در گویا کلاب.',
  path: '/user/club',
  noIndex: true,
});

/**
 * صفحه گویا کلاب در پنل کاربری
 */
export default function UserClubPage() {
  return <GooyaClubPage />;
}
