import { Metadata } from 'next';
import BlogPostClient from './BlogPostClient';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // TODO: دریافت اطلاعات مقاله برای SEO
  return {
    title: `مقاله - گویا`,
    description: 'مطالعه مقاله در وبسایت گویا',
  };
}

export default function BlogPostPage({ params }: Props) {
  return <BlogPostClient slug={params.slug} />;
}
