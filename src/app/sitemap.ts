import { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';
import {
  fetchAgentsPageForSeo,
  fetchBlogListForSeo,
  fetchCitiesForSeo,
  fetchPropertiesPageForSeo,
  fetchStoriesListForSeo,
} from '@/lib/server/seo-data';

export const revalidate = 300;

const MAX_SITEMAP_PAGES = 20;

async function collectPaginatedUrls(
  fetchPage: (
    page: number
  ) => Promise<{ total_pages?: number; results?: Array<{ url: string; lastModified?: Date }> } | null>
): Promise<MetadataRoute.Sitemap> {
  const first = await fetchPage(1);
  if (!first?.results?.length) return [];

  const entries: MetadataRoute.Sitemap = [...first.results];
  const totalPages = Math.min(first.total_pages || 1, MAX_SITEMAP_PAGES);

  if (totalPages > 1) {
    const rest = await Promise.all(
      Array.from({ length: totalPages - 1 }, (_, index) => fetchPage(index + 2))
    );
    for (const page of rest) {
      if (page?.results?.length) entries.push(...page.results);
    }
  }

  return entries;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/properties`, lastModified: now, changeFrequency: 'hourly', priority: 0.95 },
    { url: `${baseUrl}/properties?transaction_type=sale`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/properties?transaction_type=rent`, lastModified: now, changeFrequency: 'hourly', priority: 0.9 },
    { url: `${baseUrl}/map`, lastModified: now, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${baseUrl}/agents`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${baseUrl}/blog`, lastModified: now, changeFrequency: 'daily', priority: 0.75 },
    { url: `${baseUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/engineering`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/become-agent`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/ai-search`, lastModified: now, changeFrequency: 'monthly', priority: 0.55 },
    { url: `${baseUrl}/support`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/stories`, lastModified: now, changeFrequency: 'daily', priority: 0.7 },
  ];

  const [propertyPages, agentPages, blogPages, cities, stories] = await Promise.all([
    collectPaginatedUrls(async (page) => {
      const data = await fetchPropertiesPageForSeo(page, 100);
      if (!data) return null;
      return {
        total_pages: data.total_pages,
        results: data.results.map((property) => ({
          url: `${baseUrl}/properties/${property.slug}`,
          lastModified: property.updated_at ? new Date(property.updated_at) : now,
          changeFrequency: 'daily' as const,
          priority: 0.85,
        })),
      };
    }),
    collectPaginatedUrls(async (page) => {
      const data = await fetchAgentsPageForSeo(page, 100);
      if (!data) return null;
      return {
        total_pages: data.total_pages,
        results: data.results.map((agent) => ({
          url: `${baseUrl}/agents/${agent.id}`,
          lastModified: agent.updated_at ? new Date(agent.updated_at) : now,
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        })),
      };
    }),
    collectPaginatedUrls(async (page) => {
      const data = await fetchBlogListForSeo(page, 50);
      if (!data) return null;
      return {
        total_pages: data.total_pages,
        results: data.results.map((post) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: post.updated ? new Date(post.updated) : post.pub_date ? new Date(post.pub_date) : now,
          changeFrequency: 'weekly' as const,
          priority: 0.65,
        })),
      };
    }),
    fetchCitiesForSeo(),
    fetchStoriesListForSeo(),
  ]);

  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/cities/${city.id}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const storyPages: MetadataRoute.Sitemap = (stories?.results ?? []).map((story) => ({
    url: `${baseUrl}/stories/${story.slug}`,
    lastModified: story.updated_at ? new Date(story.updated_at) : now,
    changeFrequency: 'weekly',
    priority: 0.65,
  }));

  return [
    ...staticPages,
    ...propertyPages,
    ...agentPages,
    ...blogPages,
    ...cityPages,
    ...storyPages,
  ];
}
