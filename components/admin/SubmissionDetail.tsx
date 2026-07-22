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
  name: string | null;
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
  needs: string[];
  needsOtherText: string | null;
  contactName: string;
  email: string;
  website: string | null;
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
  publicationConsent: 'YES' | 'YES_EXCEPT_CHALLENGES' | 'NO';
  rejectionReason: string | null;
  createdAt: string;
};

const CONSENT_LABELS: Record<SubmissionData['publicationConsent'], string> = {
  YES: 'Yes — full publication allowed, including challenges & threats',
  YES_EXCEPT_CHALLENGES: 'Yes, except challenges & threats — that section must stay private',
  NO: 'No — submitter declined publication entirely; can only be stored',
};

const CONSENT_BADGE_CLASS: Record<SubmissionData['publicationConsent'], string> = {
  YES: 'approved',
  YES_EXCEPT_CHALLENGES: 'pending',
  NO: 'rejected',
};

function Field({ label, value, visible, onToggle, disabled }: {
  label: string;
  value: React.ReactNode;
  visible?: boolean;
  onToggle?: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="kv" style={{ borderRight: 'none', padding: '16px 0', borderBottom: '1px dashed var(--ink-2)' }}>
      <div className="k" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <span>{label}</span>
        {onToggle && (
          <label className="checkbox-inline" style={{ opacity: disabled ? 0.5 : 1 }}>
            <input type="checkbox" checked={visible} disabled={disabled} onChange={onToggle} />
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
  const [name, setName] = useState(s.name ?? '');
  const [domain, setDomain] = useState(DOMAINS[4].value); // craftsmanship default
  const [repairSector, setRepairSector] = useState(suggestRepairSector(s.repairCategories));
  const [challengesPublic, setChallengesPublic] = useState(s.publicationConsent === 'YES');
  const [lat, setLat] = useState(s.lat?.toString() ?? '');
  const [lng, setLng] = useState(s.lng?.toString() ?? '');
  const [featured, setFeatured] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const canPublish = s.publicationConsent !== 'NO';
  const challengesLocked = s.publicationConsent !== 'YES';

  async function approve() {
    setBusy(true);
    setError('');
    const res = await fetch(`/api/admin/submissions/${s.id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        domain,
        repairSector,
        lat: lat === '' ? undefined : Number(lat),
        lng: lng === '' ? undefined : Number(lng),
        challengesPublic: challengesLocked ? false : challengesPublic,
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
  const missingName = name.trim() === '';

  return (
    <div>
      <div className="label">Review submission</div>
      <h1 style={{ marginBottom: 8 }}>{s.name || <em>(no name given)</em>}</h1>
      <p style={{ color: 'var(--ink-2)', marginBottom: 16 }}>
        Submitted {new Date(s.createdAt).toLocaleString()} · <span className={`status-badge ${s.status.toLowerCase()}`}>{s.status}</span>
      </p>
      <p style={{ marginBottom: 32 }}>
        <span className={`status-badge ${CONSENT_BADGE_CLASS[s.publicationConsent]}`}>Publication consent</span>{' '}
        {CONSENT_LABELS[s.publicationConsent]}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 56 }}>
        <div>
          <Field label="Tagline" value={s.tagline} />
          <Field label="Description" value={<span style={{ whiteSpace: 'pre-wrap' }}>{s.description}</span>} />
          <Field label="Activities" value={labelsFor(ACTIVITIES, s.activities).join(', ')} />
          {s.activitiesOtherText && <Field label="— Other, specified" value={s.activitiesOtherText} />}
          <Field label="What they repair" value={labelsFor(REPAIR_CATEGORIES, s.repairCategories).join(', ')} />
          {s.repairCategoriesOtherText && <Field label="— Other, specified" value={s.repairCategoriesOtherText} />}
          <Field label="Who they are" value={labelsFor(ORG_TYPES, s.orgTypes).join(', ')} />
          {s.orgTypesOtherText && <Field label="— Other, specified" value={s.orgTypesOtherText} />}
          <Field label="People involved" value={s.peopleInvolved} />
          <Field label="Knowledge and skills" value={s.knowledgeSkills} />
          <Field label="Living heritage" value={s.heritageDimension} />
          <Field
            label="Challenges and threats"
            value={s.challengesAndThreats}
            visible={challengesPublic}
            disabled={challengesLocked}
            onToggle={() => setChallengesPublic((v) => !v)}
          />
          {challengesLocked && (
            <div className="hint" style={{ marginTop: -10, marginBottom: 16 }}>
              Submitter did not consent to publishing this section — it cannot be made public.
            </div>
          )}
          <Field label="Current needs" value={labelsFor(NEEDS, s.needs).join(', ')} />
          {s.needsOtherText && <Field label="— Other, specified" value={s.needsOtherText} />}
          <Field label="Audience" value={labelsFor(AUDIENCE, s.audience).join(', ')} />
          <Field label="Contact name · internal only, never published" value={s.contactName} />
          <Field label="Contact email · internal only, never published" value={s.email} />
          <Field label="Website" value={s.website} />
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

            {!canPublish && (
              <div className="hint" style={{ marginTop: 12, color: 'var(--accent)' }}>
                This submitter chose not to publish anything — approval is disabled. You can still Reject to close it out.
              </div>
            )}

            <div className="field" style={{ marginTop: 16 }}>
              <label htmlFor="admin-name">Publish name</label>
              <input id="admin-name" type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={!canPublish} />
              {missingName && <div className="hint">Required to publish — the submitter left this blank.</div>}
            </div>

            <div className="field" style={{ marginTop: 16 }}>
              <label htmlFor="admin-domain">Domain (map marker category)</label>
              <select id="admin-domain" value={domain} onChange={(e) => setDomain(e.target.value)} disabled={!canPublish}>
                {DOMAINS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            <div className="field" style={{ marginTop: 16 }}>
              <label htmlFor="admin-repair-sector">Repair sector (filter chips)</label>
              <select id="admin-repair-sector" value={repairSector} onChange={(e) => setRepairSector(e.target.value)} disabled={!canPublish}>
                {REPAIR_SECTORS.map((sct) => (
                  <option key={sct.value} value={sct.value}>{sct.label}</option>
                ))}
              </select>
            </div>

            <div className="form-grid" style={{ marginTop: 16 }}>
              <div className="field">
                <label htmlFor="admin-lat">Latitude</label>
                <input id="admin-lat" type="number" step="any" value={lat} onChange={(e) => setLat(e.target.value)} disabled={!canPublish} />
              </div>
              <div className="field">
                <label htmlFor="admin-lng">Longitude</label>
                <input id="admin-lng" type="number" step="any" value={lng} onChange={(e) => setLng(e.target.value)} disabled={!canPublish} />
              </div>
            </div>
            {missingLatLng && canPublish && (
              <div className="hint" style={{ marginTop: 8, color: 'var(--accent)' }}>
                Coordinates are required to publish — the submitter didn&apos;t provide them, please look them up.
              </div>
            )}

            <label className="checkbox-inline" style={{ marginTop: 16, opacity: canPublish ? 1 : 0.5 }}>
              <input type="checkbox" checked={featured} disabled={!canPublish} onChange={(e) => setFeatured(e.target.checked)} />
              Feature on homepage
            </label>

            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn" onClick={approve} disabled={busy || !canPublish || missingLatLng || missingName}>
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
