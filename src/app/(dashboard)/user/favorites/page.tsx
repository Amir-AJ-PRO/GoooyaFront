import { Metadata } from 'next';
import { FavoritesPage } from '@/components/favorites/FavoritesPage';

export const metadata: Metadata = {
  title: 'علاقه‌مندی‌های من | گویا',
  description: 'مدیریت املاک مورد علاقه‌تان در پلتفرم گویا',
};

/**
 * صفحه علاقه‌مندی‌های کاربر
 */
export default function UserFavoritesPage() {
  return <FavoritesPage />;
}
