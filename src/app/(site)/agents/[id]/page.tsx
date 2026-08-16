import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AgentPublicProfileClient from './AgentPublicProfileClient';
import JsonLd from '@/components/seo/JsonLd';
import {
  absoluteUrl,
  breadcrumbJsonLd,
  buildPageMetadata,
  truncateText,
} from '@/lib/seo';
import { getMediaUrl } from '@/lib/utils';
import { fetchAgentForSeo } from '@/lib/server/seo-data';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const agentId = Number(id);

  if (!agentId || Number.isNaN(agentId)) {
    return buildPageMetadata({
      title: 'مشاور یافت نشد',
      description: 'پروفایل این مشاور در گویا در دسترس نیست.',
      path: `/agents/${id}`,
      noIndex: true,
    });
  }

  const data = await fetchAgentForSeo(agentId);
  const agent = data?.agent;

  if (!agent) {
    return buildPageMetadata({
      title: 'مشاور املاک',
      description: 'مشاهده پروفایل مشاور املاک و آگهی‌های مرتبط در گویا.',
      path: `/agents/${agentId}`,
    });
  }

  const city = agent.city_name || '';
  const title = agent.full_name;
  const description = truncateText(
    agent.bio ||
      `${agent.full_name}، مشاور املاک${city ? ` در ${city}` : ''}${agent.office_name ? ` از ${agent.office_name}` : ''}. مشاهده آگهی‌ها و اطلاعات تماس در گویا.`
  );

  return buildPageMetadata({
    title,
    description,
    path: `/agents/${agent.id}`,
    image: agent.profile_image ? getMediaUrl(agent.profile_image) : undefined,
    imageAlt: agent.full_name,
    keywords: ['مشاور املاک', agent.full_name, city, agent.office_name || '', 'گویا'].filter(Boolean),
    modifiedTime: agent.updated_at,
  });
}

export default async function AgentPublicProfilePage({ params }: Props) {
  const { id } = await params;
  const agentId = Number(id);

  if (!agentId || Number.isNaN(agentId)) {
    notFound();
  }

  const data = await fetchAgentForSeo(agentId);
  const agent = data?.agent;

  return (
    <>
      {agent && (
        <JsonLd
          data={[
            {
              '@context': 'https://schema.org',
              '@type': 'RealEstateAgent',
              name: agent.full_name,
              image: agent.profile_image ? getMediaUrl(agent.profile_image) : undefined,
              address: agent.office_address || agent.city_name || undefined,
              description: agent.bio || undefined,
              url: absoluteUrl(`/agents/${agent.id}`),
            },
            breadcrumbJsonLd([
              { name: 'خانه', path: '/' },
              { name: 'مشاوران', path: '/agents' },
              { name: agent.full_name, path: `/agents/${agent.id}` },
            ]),
          ]}
        />
      )}
      <Suspense fallback={<div className="container mx-auto px-4 py-16 min-h-[40vh]" />}>
        <AgentPublicProfileClient agentId={agentId} />
      </Suspense>
    </>
  );
}
