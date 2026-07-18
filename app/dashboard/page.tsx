import type { Metadata } from 'next';
import { getMetrics, getPublishedInitiatives } from '@/lib/initiatives';
import { fmtNum, SECTOR_LABELS } from '@/lib/domains';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = { title: 'Dashboard' };
export const revalidate = 0;

const SECTORS = ['textile', 'furniture', 'electronics', 'other'] as const;

export default async function DashboardPage() {
  const [metrics, initiatives] = await Promise.all([getMetrics(), getPublishedInitiatives()]);
  const ri = metrics.repair_impact;

  const counts: Record<string, number> = Object.fromEntries(SECTORS.map((s) => [s, 0]));
  initiatives.forEach((i) => {
    if (counts[i.repair_sector] !== undefined) counts[i.repair_sector]++;
  });

  return (
    <>
      <header className="hero" style={{ padding: '60px 0 40px' }}>
        <div className="container">
          <div className="eyebrow">Dashboard · 2026</div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.4rem)' }}>The data behind the practice.</h1>
          <p className="lede">
            Repair is not marginal. This dashboard tracks the material impact of repair and reuse initiatives —
            items saved from landfill, emissions avoided, and people reached.
          </p>
        </div>
      </header>

      <section className="section" style={{ padding: '56px 0' }}>
        <div className="container">
          <div className="stat-grid" style={{ marginBottom: 56 }}>
            <div className="stat">
              <div className="num">
                <span className="accent">{fmtNum(ri.items_repaired_total)}</span>
              </div>
              <div className="lbl">Items repaired across tracked initiatives</div>
            </div>
            <div className="stat">
              <div className="num">
                <span className="accent">{ri.co2_avoided_t_total.toFixed(1)}</span>t
              </div>
              <div className="lbl">CO₂e avoided through repair &amp; re-craft</div>
            </div>
            <div className="stat">
              <div className="num">
                <span className="accent">{fmtNum(ri.materials_diverted_kg_total)}</span>kg
              </div>
              <div className="lbl">Materials diverted from landfill</div>
            </div>
            <div className="stat">
              <div className="num">
                <span className="accent">{fmtNum(ri.people_engaged_total)}</span>
              </div>
              <div className="lbl">People engaged across initiatives</div>
            </div>
          </div>

          <div className="label" style={{ marginBottom: 20 }}>
            Initiatives by repair sector
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {SECTORS.map((s) => (
              <div key={s} style={{ border: '1px solid var(--ink)', padding: '24px 20px' }}>
                <div style={{ fontFamily: 'var(--font-fraunces)', fontSize: '2rem', fontWeight: 500 }}>{counts[s]}</div>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-2)', marginTop: 6 }}>
                  {SECTOR_LABELS[s]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter>Impact data is community-submitted and updated as initiatives report. Numbers may change.</SiteFooter>
    </>
  );
}
