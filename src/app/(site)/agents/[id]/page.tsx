import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import AgentPublicProfileClient from './AgentPublicProfileClient';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `پروفایل مشاور ${id} - گویا`,
    description: 'مشاهده پروفایل عمومی مشاور و لیست املاک مرتبط',
  };
}

export default async function AgentPublicProfilePage({ params }: Props) {
  const { id } = await params;
  const agentId = Number(id);

  if (!agentId || Number.isNaN(agentId)) {
    notFound();
  }

  return <AgentPublicProfileClient agentId={agentId} />;
}


