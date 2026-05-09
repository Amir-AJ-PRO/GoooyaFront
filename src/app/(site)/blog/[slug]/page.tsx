import type { Metadata } from 'next';
import BlogPostClient from './BlogPostClient';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  // TODO: دریافت اطلاعات مقاله برای SEO بر اساس slug
  return {
    title: `مقاله - گویا`,
    description: 'مطالعه مقاله در وبسایت گویا',
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  return  <BlogPostClient slug={slug} />;
}
