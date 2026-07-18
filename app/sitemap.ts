import type { MetadataRoute } from 'next';
import { getPublishedInitiatives } from '@/lib/initiatives';
import { SITE_URL } from '@/lib/siteUrl';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const initiatives = await getPublishedInitiatives();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/map`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/dashboard`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/initiatives`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/submit`, changeFrequency: 'monthly', priority: 0.6 },
  ];

  const initiativeRoutes: MetadataRoute.Sitemap = initiatives.map((i) => ({
    url: `${SITE_URL}/initiatives/${i.id}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...initiativeRoutes];
}
