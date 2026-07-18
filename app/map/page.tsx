import type { Metadata } from 'next';
import { getPublishedInitiatives } from '@/lib/initiatives';
import MapClient from '@/components/MapClient';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = { title: 'Map' };
export const revalidate = 0;

export default async function MapPage() {
  const initiatives = await getPublishedInitiatives();

  return (
    <>
      <header className="hero" style={{ padding: '60px 0 40px' }}>
        <div className="container">
          <div className="eyebrow">Map · Living initiatives</div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}>Where the practices live.</h1>
          <p className="lede">
            Each marker is an initiative actively transmitting intangible heritage with measurable climate or social
            impact. Geneva — host of major UN environment meetings — is a small but dense cluster.
          </p>
        </div>
      </header>

      <section className="section" style={{ padding: '40px 0' }}>
        <div className="container">
          <MapClient initiatives={initiatives} />
          <div style={{ marginTop: 24, fontSize: '0.85rem', color: 'var(--ink-2)' }}>
            Tip — click a marker to see the initiative summary, then open the full profile.
          </div>
        </div>
      </section>

      <SiteFooter>Map tiles © OpenStreetMap contributors · CC BY-SA 2.0</SiteFooter>
    </>
  );
}
