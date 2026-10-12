import { redirect } from 'next/navigation';
import { decodePathSlug } from '@/lib/utils';

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * دیپ‌لینک قدیمی /stories/:slug → مدال روی همان صفحه Explore
 */
export default async function StorySlugPage({ params }: Props) {
  const { slug: rawSlug } = await params;
  const slug = decodePathSlug(rawSlug);
  redirect(`/stories?play=${encodeURIComponent(slug)}`);
}
