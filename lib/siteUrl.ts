// Set NEXT_PUBLIC_SITE_URL once the production domain is known (e.g. on Railway) so
// sitemap/robots/canonical URLs resolve correctly instead of falling back to localhost.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');
