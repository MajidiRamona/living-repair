'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ACTIVITIES,
  AUDIENCE,
  DOMAINS,
  NEEDS,
  ORG_TYPES,
  REPAIR_CATEGORIES,
  REPAIR_SECTORS,
  labelsFor,
  suggestRepairSector,
} from '@/lib/formOptions';

type SubmissionData = {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  name: string;
  tagline: string;
  description: string;
  repairCategories: string[];
  repairCategoriesOtherText: string | null;
  orgTypes: string[];
  orgTypesOtherText: string | null;
  peopleInvolved: string | null;
  activities: string[];
  activitiesOtherText: string | null;
  knowledgeSkills: string | null;
  challengesAndThreats: string | null;
  challengesPublicRequested: boolean;
  needs: string[];
  needsOtherText: string | null;
  needsPublicRequested: boolean;
  website: string | null;
  email: string | null;
  socialMedia: string | null;
  street: string | null;
  city: string;
  region: string | null;
  country: string;
  lat: number | null;
  lng: number | null;
  audience: string[];
  heritageDimension: string | null;
  photoPath: string | null;
  videoUrl: string | null;
  rejectionReason: string | null;
  createdAt: string;
};

function Field({ label, value, visible, onToggle }: { label: string; value: React.ReactNode; visible?: boolean; onToggle?: () => void }) {
  return (
    <div className="kv" style={{ borderRight: 'none', padding: '16px 0', borderBottom: '1px dashed var(--ink-2)' }}>
      <div className="k" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span>{label}</span>
        {onToggle && (
          <label className="checkbox-inline">
            <input type="checkbox" checked={visible} onChange={onToggle} />
            Public
          </label>
        )}
      </div>
      <div style={{ marginTop: 6 }}>{value || <span style={{ color: 'var(--ink-2)' }}>—</span>}</div>
    </div>
  );
}

export default function SubmissionDetail({ submission: s }: { submission: SubmissionData }) {
  const router = useRouter();
  const [domain, setDomain] = useState(DOMAINS[4].value); // craftsmanship default
  const [repairSector, setRepairSector] = useState(suggestRepairSector(s.repairCategories));
  const [challengesPublic, setChallengesPublic] = useState(s.challengesPublicRequested);
  const [needsPublic, setNeedsPublic] = useState(s.needsPublicRequested);
  const [emailPublic, setEmailPublic] = useState(false);
  const [lat, setLat] = useState(s.lat?.toString() ?? '');
  const [lng, setLng] = useState(s.lng?.toString() ?? '');
  const [featured, setFeatured] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  async function approve() {
    setBusy(true);
    setError('');
    const res = await fetch(`/api/admin/submissions/${s.id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        domain,
        repairSector,
        lat: lat === '' ? undefined : Number(lat),
        lng: lng === '' ? undefined : Number(lng),
        visibility: { challengesPublic, needsPublic, emailPublic },
        hiddenFields: [],
        featured,
      }),
    });
    setBusy(false);
    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? 'Approval failed');
    }
  }

  async function reject() {
    setBusy(true);
    setError('');
    const res = await fetch(`/api/admin/submissions/${s.id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: rejectReason || undefined }),
    });
    setBusy(false);
    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? 'Rejection failed');
    }
  }

  const missingLatLng = lat === '' || lng === '';

  return (
    <div>
      <div className="label">Review submission</div>
      <h1 style={{ marginBottom: 8 }}>{s.name}</h1>
      <p style={{ color: 'var(--ink-2)', marginBottom: 32 }}>
        Submitted {new Date(s.createdAt).toLocaleString()} · <span className={`status-badge ${s.status.toLowerCase()}`}>{s.status}</span>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 56 }}>
        <div>
          <Field label="Tagline" value={s.tagline} />
          <Field label="Description" value={<span style={{ whiteSpace: 'pre-wrap' }}>{s.description}</span>} />
          <Field label="What they repair" value={labelsFor(REPAIR_CATEGORIES, s.repairCategories).join(', ')} />
          {s.repairCategoriesOtherText && <Field label="— Other, specified" value={s.repairCategoriesOtherText} />}
          <Field label="Who they are" value={labelsFor(ORG_TYPES, s.orgTypes).join(', ')} />
          {s.orgTypesOtherText && <Field label="— Other, specified" value={s.orgTypesOtherText} />}
          <Field label="People involved" value={s.peopleInvolved} />
          <Field label="Activities" value={labelsFor(ACTIVITIES, s.activities).join(', ')} />
          {s.activitiesOtherText && <Field label="— Other, specified" value={s.activitiesOtherText} />}
          <Field label="Knowledge and skills" value={s.knowledgeSkills} />
          <Field
            label={`Challenges and threats ${s.challengesPublicRequested ? '(submitter asked to publish)' : '(submitter kept private)'}`}
            value={s.challengesAndThreats}
            visible={challengesPublic}
            onToggle={() => setChallengesPublic((v) => !v)}
          />
          <Field
            label={`Current needs ${s.needsPublicRequested ? '(submitter asked to publish)' : '(submitter kept private)'}`}
            value={labelsFor(NEEDS, s.needs).join(', ')}
            visible={needsPublic}
            onToggle={() => setNeedsPublic((v) => !v)}
          />
          {s.needsOtherText && <Field label="— Other, specified" value={s.needsOtherText} />}
          <Field label="Audience" value={labelsFor(AUDIENCE, s.audience).join(', ')} />
          <Field label="Heritage dimension" value={s.heritageDimension} />
          <Field label="Website" value={s.website} />
          <Field
            label="Contact email · defaults to private"
            value={s.email}
            visible={emailPublic}
            onToggle={() => setEmailPublic((v) => !v)}
          />
          <Field label="Social media" value={s.socialMedia} />
          <Field
            label="Video link"
            value={
              s.videoUrl && (
                <a href={s.videoUrl} target="_blank" rel="noopener noreferrer">
                  {s.videoUrl}
                </a>
              )
            }
          />
          <Field label="Address" value={[s.street, s.city, s.region, s.country].filter(Boolean).join(', ')} />
          {s.photoPath && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`/uploads/${s.photoPath}`} alt="Submitted" style={{ maxWidth: '100%', border: '1px solid var(--ink)', marginTop: 16 }} />
          )}
        </div>

        <aside>
          <div className="chart-card">
            <div className="chart-title">Publish settings</div>

            <div className="field" style={{ marginTop: 16 }}>
              <label htmlFor="admin-domain">Domain (map marker category)</label>
              <select id="admin-domain" value={domain} onChange={(e) => setDomain(e.target.value)}>
                {DOMAINS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            <div className="field" style={{ marginTop: 16 }}>
              <label htmlFor="admin-repair-sector">Repair sector (filter chips)</label>
              <select id="admin-repair-sector" value={repairSector} onChange={(e) => setRepairSector(e.target.value)}>
                {REPAIR_SECTORS.map((sct) => (
                  <option key={sct.value} value={sct.value}>{sct.label}</option>
                ))}
              </select>
            </div>

            <div className="form-grid" style={{ marginTop: 16 }}>
              <div className="field">
                <label htmlFor="admin-lat">Latitude</label>
                <input id="admin-lat" type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="admin-lng">Longitude</label>
                <input id="admin-lng" type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} />
              </div>
            </div>
            {missingLatLng && (
              <div className="hint" style={{ marginTop: 8, color: 'var(--accent)' }}>
                Coordinates are required to publish — the submitter didn&apos;t provide them, please look them up.
              </div>
            )}

            <label className="checkbox-inline" style={{ marginTop: 16 }}>
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
              Feature on homepage
            </label>

            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn" onClick={approve} disabled={busy || missingLatLng}>
                {busy ? 'Working…' : 'Approve & publish'}
              </button>
              <label htmlFor="reject-reason" className="sr-only">Rejection reason (optional)</label>
              <input
                id="reject-reason"
                type="text"
                placeholder="Rejection reason (optional)"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                style={{ padding: '10px 12px', border: '1px solid var(--ink)' }}
              />
              <button className="btn danger" onClick={reject} disabled={busy}>
                Reject
              </button>
            </div>
            {error && <div className="form-status err">{error}</div>}
          </div>
        </aside>
      </div>
    </div>
  );
}
