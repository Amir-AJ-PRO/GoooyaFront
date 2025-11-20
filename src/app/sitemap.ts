import { MetadataRoute } from 'next';

/**
 * سایت‌مپ داینامیک برای بهینه‌سازی SEO
 * این فایل به صورت خودکار توسط Next.js در زمان build یا runtime تولید می‌شود
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gooya.ir';
  
  // صفحات استاتیک
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/map`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/chat`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/engineering`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // TODO: در آینده می‌توانید املاک را از API بگیرید و به sitemap اضافه کنید
  // مثال:
  // const properties = await fetchAllProperties();
  // const propertyPages = properties.map((property) => ({
  //   url: `${baseUrl}/property/${property.id}`,
  //   lastModified: new Date(property.updatedAt),
  //   changeFrequency: 'weekly' as const,
  //   priority: 0.8,
  // }));

  // برای مثال، چند صفحه ملک نمونه اضافه می‌کنیم
  const samplePropertyPages: MetadataRoute.Sitemap = [1, 2, 3, 4, 5, 6].map(
    (id) => ({
      url: `${baseUrl}/property/${id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })
  );

  return [...staticPages, ...samplePropertyPages];
}

