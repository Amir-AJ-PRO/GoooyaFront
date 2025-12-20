import type { Metadata } from 'next';
import AgentsPageClient from './AgentsPageClient';

export const metadata: Metadata = {
  title: 'مشاورین - گویا',
  description: 'مشاهده لیست مشاورین فعال در گویا به همراه فیلترها و جستجو',
  openGraph: {
    title: 'مشاورین - گویا',
    description: 'مشاهده لیست مشاورین فعال در گویا به همراه فیلترها و جستجو',
  },
};

export default function AgentsPage() {
  return <AgentsPageClient />;
}


