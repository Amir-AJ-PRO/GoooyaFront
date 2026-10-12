import FeaturedProperties from '@/components/home/FeaturedProperties';
import TopSection from '@/components/Threebox/TopSection';
import AgentHome from '@/components/agent/AgentHome';
import EnginneringHomepage from '@/components/home/EnginneringHomepage';
import { StoriesHomeBanner } from '@/features/stories/StoriesHomeBanner';
import { ClubHomeBanner } from '@/features/club/ClubHomeBanner';
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
    <div className="home-page min-w-0 max-w-full overflow-x-clip">
      <JsonLd data={breadcrumbJsonLd([{ name: 'خانه', path: '/' }])} />
      <TopSection />
      <FeaturedProperties />
      <StoriesHomeBanner />
      <ClubHomeBanner />
      <div>
        <AgentHome />
      </div>
      <EnginneringHomepage />
    </div>
  );
}
