import { Metadata } from 'next';
import PropertiesPageClient from './PropertiesPageClient';

export const metadata: Metadata = {
  title: 'املاک - گویا',
  description: 'مشاهده لیست کامل املاک موجود برای خرید و اجاره',
  openGraph: {
    title: 'املاک - گویا',
    description: 'مشاهده لیست کامل املاک موجود برای خرید و اجاره',
  }
};

export default function PropertiesPage() {
  return <PropertiesPageClient />;
}
