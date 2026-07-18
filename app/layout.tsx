import './globals.css';
import 'leaflet/dist/leaflet.css';
import type { Metadata } from 'next';
import SiteNav from '@/components/SiteNav';
import { fraunces, inter } from '@/lib/fonts';
import { SITE_URL } from '@/lib/siteUrl';

const description =
  'Living Repair is a University of Geneva student-led observatory documenting repair, reuse, and upcycling as living cultural heritage and a pathway toward more sustainable futures.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Living Repair — An Observatory of Repair Practices',
    template: '%s · Living Repair',
  },
  description,
  openGraph: {
    type: 'website',
    siteName: 'Living Repair',
    title: 'Living Repair — An Observatory of Repair Practices',
    description,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Living Repair — An Observatory of Repair Practices',
    description,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <SiteNav />
        {children}
      </body>
    </html>
  );
}
