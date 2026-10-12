import FeaturedProperties from '@/components/home/FeaturedProperties';
import TopSection from '@/components/Threebox/TopSection';
import AgentHome from '@/components/agent/AgentHome';
import EnginneringHomepage from '@/components/home/EnginneringHomepage';
import { StoriesHomeBanner } from '@/features/stories/StoriesHomeBanner';
import JsonLd from '@/components/seo/JsonLd';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  breadcrumbJsonLd,
  buildPageMetadata,
} from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    path: '/',
    keywords: [
      'املاک شرق تهران',
      'خرید خانه دماوند',
      'فروش ویلا پردیس',
      'اجاره ملک',
      'مشاور املاک',
      'گویا',
    ],
  }),
  title: { absolute: DEFAULT_TITLE },
};

export default function Home() {
  return (
    <div className="home-page">
      <JsonLd data={breadcrumbJsonLd([{ name: 'خانه', path: '/' }])} />
      <TopSection />
      <FeaturedProperties />
      <StoriesHomeBanner />
      <div>
        <AgentHome />
      </div>
      <EnginneringHomepage />
    </div>
  );
}
