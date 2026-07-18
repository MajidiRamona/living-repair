import Link from 'next/link';
import { getMetrics, getPublishedInitiatives } from '@/lib/initiatives';
import { DOMAIN_COLORS, DOMAIN_LABELS, fmtNum } from '@/lib/domains';
import HeroChart from '@/components/HeroChart';
import AnimatedStat from '@/components/AnimatedStat';
import SiteFooter from '@/components/SiteFooter';

export const revalidate = 0;

export default async function HomePage() {
  const [metrics, initiatives] = await Promise.all([getMetrics(), getPublishedInitiatives()]);
  const tl = metrics.climate_impact_timeline;
  const last = tl[tl.length - 1].elements_with_climate_action;
  const first = tl[0].elements_with_climate_action;
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

      <section className="section hero-data">
        <div className="container">
          <div className="title-row">
            <div>
              <div className="label">The 14-year curve</div>
              <h2>How fast climate moved into living heritage.</h2>
            </div>
            <p>UNESCO inscriptions with an explicit climate-adaptation rationale, 2010–2024. The rise is not gradual.</p>
          </div>

          <div className="big-chart-wrap">
            <div className="big-chart-canvas">
              <HeroChart timeline={tl} />
            </div>
            <aside className="big-chart-side">
              <div className="big-num">
                <AnimatedStat target={last} />
              </div>
              <div className="big-num-lbl">elements with an explicit climate rationale, end of 2024</div>
              <div className="big-num-delta">
                <span className="up">↑</span> from <strong>{first}</strong> in 2010
              </div>
              <div className="big-num-foot">
                A <strong>20×</strong> increase in 14 years — faster than any other category of UNESCO listing.
              </div>
            </aside>
          </div>

          <div className="data-strip">
            <div className="data-strip-cell">
              <div className="dsc-num">
                <AnimatedStat target={metrics.global.ich_elements_listed} />
              </div>
              <div className="dsc-lbl">Living heritage elements listed</div>
            </div>
            <div className="data-strip-cell">
              <div className="dsc-num">
                <AnimatedStat target={metrics.global.states_parties} />
              </div>
              <div className="dsc-lbl">States Parties</div>
            </div>
            <div className="data-strip-cell accent-cell">
              <div className="dsc-num">
                <AnimatedStat target={metrics.global.elements_at_climate_risk_pct} suffix="%" />
              </div>
              <div className="dsc-lbl">at material climate risk</div>
            </div>
            <div className="data-strip-cell">
              <div className="dsc-num">
                <AnimatedStat target={metrics.global.elements_explicitly_linked_to_sdgs_pct} suffix="%" />
              </div>
              <div className="dsc-lbl">tied to UN SDGs</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="title-row">
            <div>
              <div className="label">Featured</div>
              <h2>Initiatives in focus</h2>
            </div>
            <p>Geneva-based collectives doing tangible climate work without ever calling themselves &quot;climate&quot; projects.</p>
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
              <h3>Read the climate-heritage data</h3>
              <p>Filter UNESCO domains by climate relevance, watch the SDG-alignment curve since 2010, and see where the gaps are.</p>
              <div className="meta">
                <span>Charts</span>
                <Link href="/dashboard">Open →</Link>
              </div>
            </div>
            <div className="card">
              <div className="tag">02 — Map</div>
              <h3>Locate the practices</h3>
              <p>Heritage is geographically uneven. The map plots living initiatives and shows where the climate-vulnerable clusters are.</p>
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
