import { Metadata } from 'next';
import { FavoritesPage } from '@/components/favorites/FavoritesPage';
import { buildPageMetadata } from '@/lib/seo';

export const metadata: Metadata = buildPageMetadata({
  title: 'علاقه‌مندی‌های من',
  description: 'مدیریت املاک ذخیره‌شده در حساب کاربری گویا.',
  path: '/user/favorites',
  noIndex: true,
});

/**
 * صفحه علاقه‌مندی‌های کاربر
 */
export default function UserFavoritesPage() {
  return <FavoritesPage />;
}
