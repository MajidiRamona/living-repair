import Link from 'next/link';
import { getPublishedInitiatives } from '@/lib/initiatives';
import { DOMAIN_COLORS, DOMAIN_LABELS, fmtNum } from '@/lib/domains';
import SiteFooter from '@/components/SiteFooter';

export const revalidate = 0;

export default async function HomePage() {
  const initiatives = await getPublishedInitiatives();
  const featured = initiatives.filter((i) => i.featured).slice(0, 3);

  return (
    <>
      <header className="hero">
        <div className="container">
          <div className="eyebrow">Observatory of Repair Practices · 2026</div>
          <h1>Heritage is not just fragile... It is a resource.</h1>
          <p className="lede">
            Water and land management, health-caring, collective labour systems and solidarity networks, ecological
            knowledge systems and non-extractive economies — the living practices humanity has carried for centuries
            are now also carrying humanity and our planet. This platform maps how old and new repair and reuse
            traditions and initiatives are contributing to more responsible consumption.
          </p>
          <div className="cta">
            <Link href="/dashboard" className="btn">
              Explore the dashboard
            </Link>
            <Link href="/submit" className="btn ghost">
              Submit an initiative
            </Link>
          </div>
        </div>
      </header>

      <section className="section">
        <div className="container">
          <div className="title-row">
            <div>
              <div className="label">Featured</div>
              <h2>Initiatives in focus</h2>
            </div>
            <p>Geneva-based collectives doing tangible repair work, transmitting skills and giving objects new life.</p>
          </div>
          <div className="card-grid">
            {featured.map((i) => (
              <Link key={i.id} className="card" href={`/initiatives/${i.id}`}>
                <span className="tag" style={{ borderColor: DOMAIN_COLORS[i.domain], color: DOMAIN_COLORS[i.domain] }}>
                  {DOMAIN_LABELS[i.domain]}
                </span>
                <h3>{i.name}</h3>
                <p>{i.tagline}</p>
                <div className="meta">
                  <span>
                    {i.city}, {i.country}
                  </span>
                  <span>{fmtNum(i.people_reached)} people</span>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: 40 }}>
            <Link href="/initiatives" className="btn ghost">
              See all initiatives →
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-2)' }}>
        <div className="container">
          <div className="title-row">
            <div>
              <div className="label">How to use this platform</div>
              <h2>For researchers, practitioners, and communities</h2>
            </div>
          </div>
          <div className="card-grid">
            <div className="card">
              <div className="tag">01 — Dashboard</div>
              <h3>Read the repair impact data</h3>
              <p>See items repaired, materials diverted, and people reached across every tracked initiative.</p>
              <div className="meta">
                <span>Charts</span>
                <Link href="/dashboard">Open →</Link>
              </div>
            </div>
            <div className="card">
              <div className="tag">02 — Map</div>
              <h3>Locate the practices</h3>
              <p>Repair is geographically uneven. The map plots living initiatives and shows where they cluster.</p>
              <div className="meta">
                <span>Geography</span>
                <Link href="/map">Open →</Link>
              </div>
            </div>
            <div className="card">
              <div className="tag">03 — Submit</div>
              <h3>Add an initiative we missed</h3>
              <p>Crucial data is held by communities, not committees. Send us a project so it joins the visualisation.</p>
              <div className="meta">
                <span>Form</span>
                <Link href="/submit">Open →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter>
        <div>
          Source: <em>Will Heritage Save Us?</em> — Chiara Bortolotto, Cambridge University Press, 2025.
        </div>
        <div style={{ marginTop: 6 }}>© 2026 Living Repair · Geneva</div>
      </SiteFooter>
    </>
  );
}
