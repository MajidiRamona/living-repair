import type { Metadata } from 'next';
import { getPublishedInitiatives } from '@/lib/initiatives';
import InitiativesFilter from '@/components/InitiativesFilter';
import SiteFooter from '@/components/SiteFooter';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Initiatives' };
export const revalidate = 0;

export default async function InitiativesPage() {
  const initiatives = await getPublishedInitiatives();

  return (
    <>
      <header className="hero" style={{ padding: '60px 0 40px' }}>
        <div className="container">
          <div className="eyebrow">Initiatives · {initiatives.length} currently tracked</div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}>Repair practices in the field.</h1>
          <p className="lede">Collectives and workshops making repair visible — across textiles, furniture, electronics, and more.</p>
        </div>
      </header>

      <section className="section" style={{ padding: '40px 0' }}>
        <div className="container">
          <InitiativesFilter initiatives={initiatives} />
        </div>
      </section>

      <SiteFooter>
        Know a repair initiative we should track? <Link href="/submit">Submit it →</Link>
      </SiteFooter>
    </>
  );
}
