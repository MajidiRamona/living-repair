import Link from 'next/link';
import type { Metadata } from 'next';
import { getPublishedInitiativeBySlug } from '@/lib/initiatives';
import { DOMAIN_COLORS, DOMAIN_LABELS, fmtNum } from '@/lib/domains';
import { ACTIVITIES, AUDIENCE, NEEDS, ORG_TYPES, REPAIR_CATEGORIES, labelsFor } from '@/lib/formOptions';
import { toEmbedUrl } from '@/lib/video';
import SiteFooter from '@/components/SiteFooter';

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const initiative = await getPublishedInitiativeBySlug(id);
  if (!initiative) return { title: 'Initiative not found' };

  return {
    title: initiative.name,
    description: initiative.tagline,
    openGraph: {
      title: initiative.name,
      description: initiative.tagline,
      type: 'article',
      images: initiative.photo_url ? [{ url: initiative.photo_url }] : undefined,
    },
    twitter: {
      card: initiative.photo_url ? 'summary_large_image' : 'summary',
      title: initiative.name,
      description: initiative.tagline,
    },
  };
}

export default async function InitiativeProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const i = await getPublishedInitiativeBySlug(id);

  if (!i) {
    return (
      <header className="hero">
        <div className="container">
          <div className="eyebrow">404</div>
          <h1>Initiative not found.</h1>
          <p className="lede">
            That initiative isn&apos;t in our register yet. <Link href="/initiatives">See all initiatives</Link> or{' '}
            <Link href="/submit">submit one</Link>.
          </p>
        </div>
      </header>
    );
  }

  const kvs: { k: string; v: string }[] = [];
  if (i.people_reached) kvs.push({ k: 'People reached', v: fmtNum(i.people_reached) });
  if (i.co2_saved_t) kvs.push({ k: 'CO₂ avoided (t)', v: i.co2_saved_t.toFixed(1) });
  if (i.materials_diverted_kg) kvs.push({ k: 'Materials diverted (kg)', v: fmtNum(i.materials_diverted_kg) });
  if (i.items_repaired) kvs.push({ k: 'Items repaired', v: fmtNum(i.items_repaired) });
  if (i.social_cohesion_score) kvs.push({ k: 'Social cohesion score', v: `${i.social_cohesion_score}/100` });

  return (
    <div>
      <header className="profile-hero">
        <div className="container">
          <Link href="/initiatives" style={{ fontSize: '0.85rem', textDecoration: 'none', color: 'var(--ink-2)' }}>
            ← All initiatives
          </Link>
          <div style={{ marginTop: 24 }}>
            <span
              className="domain-tag"
              style={{ borderColor: DOMAIN_COLORS[i.domain], color: DOMAIN_COLORS[i.domain] }}
            >
              {DOMAIN_LABELS[i.domain]}
            </span>
            <h1>{i.name}</h1>
            <p className="tagline">{i.tagline}</p>
            <div style={{ fontSize: '0.95rem', color: 'var(--ink-2)', marginTop: 16 }}>
              <span>
                {i.city}, {i.country}
              </span>
              {i.founded ? <> · founded {i.founded < 1900 ? `~${i.founded}` : i.founded}</> : null}
            </div>
          </div>
        </div>
      </header>

      <section className="section" style={{ padding: '0 0 56px' }}>
        <div className="container">
          {kvs.length > 0 && (
            <div className="kv-grid">
              {kvs.slice(0, 4).map((kv) => (
                <div className="kv" key={kv.k}>
                  <div className="k">{kv.k}</div>
                  <div className="v">{kv.v}</div>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 56, marginTop: 40 }}>
            <div className="prose">
              {i.photo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={i.photo_url}
                  alt={i.name}
                  style={{ width: '100%', border: '1px solid var(--ink)', marginBottom: 32 }}
                />
              )}

              <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.2rem', marginBottom: 12 }}>About</h3>
              <p>{i.description}</p>

              {i.video_url && (
                <>
                  <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.2rem', marginTop: 32, marginBottom: 12 }}>
                    Video
                  </h3>
                  {(() => {
                    const embedUrl = toEmbedUrl(i.video_url);
                    return embedUrl ? (
                      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                        <iframe
                          src={embedUrl}
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: '1px solid var(--ink)' }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <a href={i.video_url} target="_blank" rel="noopener noreferrer">
                        Watch video →
                      </a>
                    );
                  })()}
                </>
              )}

              {i.repair_categories.length > 0 && (
                <>
                  <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.2rem', marginTop: 32, marginBottom: 12 }}>
                    What they repair
                  </h3>
                  <p>{labelsFor(REPAIR_CATEGORIES, i.repair_categories).join(', ')}</p>
                </>
              )}

              {i.org_types.length > 0 && (
                <>
                  <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.2rem', marginTop: 32, marginBottom: 12 }}>
                    Who they are
                  </h3>
                  <p>{labelsFor(ORG_TYPES, i.org_types).join(', ')}</p>
                </>
              )}

              {i.people_involved && (
                <>
                  <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.2rem', marginTop: 32, marginBottom: 12 }}>
                    People
                  </h3>
                  <p>{i.people_involved}</p>
                </>
              )}

              {i.activities.length > 0 && (
                <>
                  <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.2rem', marginTop: 32, marginBottom: 12 }}>
                    Activities
                  </h3>
                  <p>{labelsFor(ACTIVITIES, i.activities).join(', ')}</p>
                </>
              )}

              {i.knowledge_skills && (
                <>
                  <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.2rem', marginTop: 32, marginBottom: 12 }}>
                    Knowledge and skills
                  </h3>
                  <p>{i.knowledge_skills}</p>
                </>
              )}

              {i.audience.length > 0 && (
                <>
                  <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.2rem', marginTop: 32, marginBottom: 12 }}>
                    Audience
                  </h3>
                  <p>{labelsFor(AUDIENCE, i.audience).join(', ')}</p>
                </>
              )}

              {i.challenges_and_threats && (
                <>
                  <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.2rem', marginTop: 32, marginBottom: 12 }}>
                    Challenges and threats
                  </h3>
                  <p>{i.challenges_and_threats}</p>
                </>
              )}

              {i.needs && i.needs.length > 0 && (
                <>
                  <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.2rem', marginTop: 32, marginBottom: 12 }}>
                    Current needs
                  </h3>
                  <p>{labelsFor(NEEDS, i.needs).join(', ')}</p>
                </>
              )}

              {i.heritage_dimension && (
                <>
                  <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.2rem', marginTop: 32, marginBottom: 12 }}>
                    Living heritage
                  </h3>
                  <p>{i.heritage_dimension}</p>
                </>
              )}

              {i.climate_link && (
                <>
                  <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: '1.2rem', marginTop: 32, marginBottom: 12 }}>
                    Climate link
                  </h3>
                  <p>{i.climate_link}</p>
                </>
              )}
            </div>

            <aside>
              {i.keywords.length > 0 && (
                <div className="chart-card">
                  <div className="chart-title">Keywords</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                    {i.keywords.map((k) => (
                      <span
                        key={k}
                        style={{ display: 'inline-block', padding: '4px 10px', border: '1px solid var(--ink)', fontSize: '0.78rem', letterSpacing: '0.06em' }}
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(i.website || i.email || i.social_media) && (
                <div className="chart-card" style={{ marginTop: 16 }}>
                  <div className="chart-title">Contact</div>
                  {i.website && (
                    <div style={{ marginTop: 8 }}>
                      <a href={i.website} style={{ fontSize: '0.95rem' }} target="_blank" rel="noopener noreferrer">
                        {i.website}
                      </a>
                    </div>
                  )}
                  {i.email && (
                    <div style={{ marginTop: 8 }}>
                      <a href={`mailto:${i.email}`} style={{ fontSize: '0.95rem' }}>
                        {i.email}
                      </a>
                    </div>
                  )}
                  {i.social_media && <div style={{ marginTop: 8, fontSize: '0.95rem' }}>{i.social_media}</div>}
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>

      <SiteFooter>Profile data is community-submitted and curated.</SiteFooter>
    </div>
  );
}
