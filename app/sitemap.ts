import type { MetadataRoute } from 'next';
import { getPublishedInitiatives } from '@/lib/initiatives';
import { SITE_URL } from '@/lib/siteUrl';

// Must be dynamic: this queries the database, which doesn't exist yet at Docker build time
// (the volume is only mounted at container runtime) — prerendering this at build fails.
// It also means the sitemap always reflects currently published initiatives, which is what we want.
export const dynamic = 'force-dynamic';

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
