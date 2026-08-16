import type { Metadata } from 'next';
import BlogPostClient from './BlogPostClient';
import JsonLd from '@/components/seo/JsonLd';
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  getSiteUrl,
  stripHtml,
  truncateText,
} from '@/lib/seo';
import { getMediaUrl } from '@/lib/utils';
import { fetchBlogPostForSeo } from '@/lib/server/seo-data';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchBlogPostForSeo(slug);

  if (!post) {
    return buildPageMetadata({
      title: 'مقاله املاک',
      description: 'مطالعه مقالات و راهنماهای خرید، فروش و اجاره ملک در گویا.',
      path: `/blog/${slug}`,
    });
  }

  const image = post.thumbnail
    ? post.thumbnail.startsWith('http')
      ? post.thumbnail
      : post.thumbnail.startsWith('/')
        ? post.thumbnail
        : getMediaUrl(post.thumbnail)
    : undefined;

  return buildPageMetadata({
    title: post.title,
    description: truncateText(post.description || stripHtml(post.body) || post.title),
    path: `/blog/${post.slug}`,
    image,
    imageAlt: post.title,
    type: 'article',
    publishedTime: post.pub_date,
    modifiedTime: post.updated || post.pub_date,
    keywords: [
      post.category?.name,
      ...(post.blogtags?.map((tag) => tag.name) || []),
      'املاک',
    ].filter(Boolean) as string[],
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await fetchBlogPostForSeo(slug);

  return (
    <>
      {post && (
        <JsonLd
          data={[
            {
              '@context': 'https://schema.org',
              '@type': 'Article',
              headline: post.title,
              description: truncateText(post.description || stripHtml(post.body)),
              datePublished: post.pub_date,
              dateModified: post.updated || post.pub_date,
              author: { '@type': 'Person', name: post.author || 'گویا' },
              publisher: { '@id': `${getSiteUrl()}/#organization` },
              image: post.thumbnail || undefined,
              mainEntityOfPage: `${getSiteUrl()}/blog/${post.slug}`,
            },
            breadcrumbJsonLd([
              { name: 'خانه', path: '/' },
              { name: 'مقالات', path: '/blog' },
              { name: post.title, path: `/blog/${post.slug}` },
            ]),
          ]}
        />
      )}
      <BlogPostClient slug={slug} />
    </>
  );
}
