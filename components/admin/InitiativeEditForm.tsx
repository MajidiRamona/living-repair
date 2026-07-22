'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CheckboxGroup from '@/components/CheckboxGroup';
import {
  ACTIVITIES,
  AUDIENCE,
  DOMAINS,
  NEEDS,
  ORG_TYPES,
  REPAIR_CATEGORIES,
  REPAIR_SECTORS,
} from '@/lib/formOptions';

type InitiativeData = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  city: string;
  region: string | null;
  street: string | null;
  country: string;
  lat: number;
  lng: number;
  domain: string;
  repairSector: string;
  repairCategories: string[];
  orgTypes: string[];
  activities: string[];
  audience: string[];
  peopleInvolved: string | null;
  knowledgeSkills: string | null;
  heritageDimension: string | null;
  challengesAndThreats: string | null;
  challengesPublic: boolean;
  needs: string[];
  founded: number | null;
  peopleReached: number | null;
  itemsRepaired: number | null;
  co2SavedT: number | null;
  materialsDivertedKg: number | null;
  socialCohesionScore: number | null;
  sdgAlignment: number[];
  keywords: string[];
  website: string | null;
  socialMedia: string | null;
  videoUrl: string | null;
  photoPath: string | null;
  featured: boolean;
  published: boolean;
};

function toStr(v: number | string | null | undefined): string {
  return v === null || v === undefined ? '' : String(v);
}

export default function InitiativeEditForm({
  initiative,
  publicationConsent,
}: {
  initiative: InitiativeData;
  publicationConsent: string | null;
}) {
  const router = useRouter();
  // null = no linked submission (e.g. hand-seeded data) — unrestricted.
  const challengesLocked = publicationConsent !== null && publicationConsent !== 'YES';
  const [form, setForm] = useState({
    name: initiative.name,
    tagline: initiative.tagline,
    description: initiative.description,
    street: initiative.street ?? '',
    city: initiative.city,
    region: initiative.region ?? '',
    country: initiative.country,
    lat: toStr(initiative.lat),
    lng: toStr(initiative.lng),
    domain: initiative.domain,
    repairSector: initiative.repairSector,
    repairCategories: initiative.repairCategories,
    orgTypes: initiative.orgTypes,
    activities: initiative.activities,
    audience: initiative.audience,
    peopleInvolved: initiative.peopleInvolved ?? '',
    knowledgeSkills: initiative.knowledgeSkills ?? '',
    heritageDimension: initiative.heritageDimension ?? '',
    challengesAndThreats: initiative.challengesAndThreats ?? '',
    challengesPublic: initiative.challengesPublic,
    needs: initiative.needs,
    founded: toStr(initiative.founded),
    peopleReached: toStr(initiative.peopleReached),
    itemsRepaired: toStr(initiative.itemsRepaired),
    co2SavedT: toStr(initiative.co2SavedT),
    materialsDivertedKg: toStr(initiative.materialsDivertedKg),
    socialCohesionScore: toStr(initiative.socialCohesionScore),
    sdgAlignment: initiative.sdgAlignment.join(', '),
    keywords: initiative.keywords.join(', '),
    website: initiative.website ?? '',
    socialMedia: initiative.socialMedia ?? '',
    videoUrl: initiative.videoUrl ?? '',
    featured: initiative.featured,
    published: initiative.published,
  });
  const [status, setStatus] = useState<'idle' | 'saving' | 'ok' | 'err'>('idle');
  const [error, setError] = useState('');

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleIn(key: 'repairCategories' | 'orgTypes' | 'activities' | 'audience' | 'needs', value: string) {
    setForm((f) => {
      const list = f[key];
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      return { ...f, [key]: next };
    });
  }

  const numOrNull = (v: string) => (v.trim() === '' ? null : Number(v));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('saving');
    setError('');

    const body = {
      name: form.name,
      tagline: form.tagline,
      description: form.description,
      street: form.street || null,
      city: form.city,
      region: form.region || null,
      country: form.country,
      lat: Number(form.lat),
      lng: Number(form.lng),
      domain: form.domain,
      repairSector: form.repairSector,
      repairCategories: form.repairCategories,
      orgTypes: form.orgTypes,
      activities: form.activities,
      audience: form.audience,
      peopleInvolved: form.peopleInvolved || null,
      knowledgeSkills: form.knowledgeSkills || null,
      heritageDimension: form.heritageDimension || null,
      challengesAndThreats: form.challengesAndThreats || null,
      challengesPublic: form.challengesPublic,
      needs: form.needs,
      founded: numOrNull(form.founded),
      peopleReached: numOrNull(form.peopleReached),
      itemsRepaired: numOrNull(form.itemsRepaired),
      co2SavedT: numOrNull(form.co2SavedT),
      materialsDivertedKg: numOrNull(form.materialsDivertedKg),
      socialCohesionScore: numOrNull(form.socialCohesionScore),
      sdgAlignment: form.sdgAlignment
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map(Number),
      keywords: form.keywords
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      website: form.website || null,
      socialMedia: form.socialMedia || null,
      videoUrl: form.videoUrl || null,
      featured: form.featured,
      published: form.published,
    };

    const res = await fetch(`/api/admin/initiatives/${initiative.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setStatus('ok');
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setStatus('err');
      setError(typeof data?.error === 'string' ? data.error : 'Could not save — check the fields and try again.');
    }
  }

  async function unpublish() {
    if (!confirm('Unpublish this initiative? It will disappear from the public site but can be re-published later.')) return;
    await fetch(`/api/admin/initiatives/${initiative.id}`, { method: 'DELETE' });
    router.push('/admin/initiatives');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="label" style={{ marginTop: 0 }}>Editing</div>
      <h1 style={{ marginBottom: 8 }}>{initiative.name}</h1>
      <p style={{ color: 'var(--ink-2)', marginBottom: 32 }}>
        Public at <code>/initiatives/{initiative.slug}</code>
      </p>

      <div className="label">Core info</div>
      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <div className="field">
          <label htmlFor="i-name">Name</label>
          <input id="i-name" type="text" required value={form.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="i-tagline">Tagline</label>
          <input id="i-tagline" type="text" required value={form.tagline} onChange={(e) => set('tagline', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="i-description">Description</label>
          <textarea id="i-description" required style={{ minHeight: 160 }} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </div>
      </div>

      <div className="label">Location</div>
      <div className="form-grid" style={{ marginBottom: 12 }}>
        <div className="field">
          <label htmlFor="i-street">Street</label>
          <input id="i-street" type="text" value={form.street} onChange={(e) => set('street', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="i-city">City</label>
          <input id="i-city" type="text" required value={form.city} onChange={(e) => set('city', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="i-region">Region / State</label>
          <input id="i-region" type="text" value={form.region} onChange={(e) => set('region', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="i-country">Country</label>
          <input id="i-country" type="text" required value={form.country} onChange={(e) => set('country', e.target.value)} />
        </div>
      </div>
      <div className="form-grid" style={{ marginBottom: 32 }}>
        <div className="field">
          <label htmlFor="i-lat">Latitude</label>
          <input id="i-lat" type="number" step="any" required value={form.lat} onChange={(e) => set('lat', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="i-lng">Longitude</label>
          <input id="i-lng" type="number" step="any" required value={form.lng} onChange={(e) => set('lng', e.target.value)} />
        </div>
      </div>

      <div className="label">Classification</div>
      <div className="form-grid" style={{ marginBottom: 32 }}>
        <div className="field">
          <label htmlFor="i-domain">Domain (map marker category)</label>
          <select id="i-domain" value={form.domain} onChange={(e) => set('domain', e.target.value)}>
            {DOMAINS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
        <div className="field">
          <label htmlFor="i-sector">Repair sector (filter chips)</label>
          <select id="i-sector" value={form.repairSector} onChange={(e) => set('repairSector', e.target.value)}>
            {REPAIR_SECTORS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>
      <div className="form-grid full" style={{ marginBottom: 20 }}>
        <fieldset className="field">
          <legend>What they repair</legend>
          <CheckboxGroup name="i-repairCategories" options={REPAIR_CATEGORIES} selected={form.repairCategories} onToggle={(v) => toggleIn('repairCategories', v)} />
        </fieldset>
      </div>
      <div className="form-grid full" style={{ marginBottom: 20 }}>
        <fieldset className="field">
          <legend>Who they are</legend>
          <CheckboxGroup name="i-orgTypes" options={ORG_TYPES} selected={form.orgTypes} onToggle={(v) => toggleIn('orgTypes', v)} />
        </fieldset>
      </div>
      <div className="form-grid full" style={{ marginBottom: 20 }}>
        <fieldset className="field">
          <legend>Activities</legend>
          <CheckboxGroup name="i-activities" options={ACTIVITIES} selected={form.activities} onToggle={(v) => toggleIn('activities', v)} />
        </fieldset>
      </div>
      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <fieldset className="field">
          <legend>Audience</legend>
          <CheckboxGroup name="i-audience" options={AUDIENCE} selected={form.audience} onToggle={(v) => toggleIn('audience', v)} />
        </fieldset>
      </div>

      <div className="label">Profile content</div>
      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <div className="field">
          <label htmlFor="i-people">People involved</label>
          <textarea id="i-people" value={form.peopleInvolved} onChange={(e) => set('peopleInvolved', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="i-knowledge">Knowledge and skills</label>
          <textarea id="i-knowledge" value={form.knowledgeSkills} onChange={(e) => set('knowledgeSkills', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="i-heritage">Living heritage</label>
          <textarea id="i-heritage" value={form.heritageDimension} onChange={(e) => set('heritageDimension', e.target.value)} />
        </div>
      </div>

      <div className="label">Research questions</div>
      <div className="form-grid full" style={{ marginBottom: 20 }}>
        <div className="field">
          <label htmlFor="i-challenges">Challenges and threats</label>
          <textarea id="i-challenges" value={form.challengesAndThreats} onChange={(e) => set('challengesAndThreats', e.target.value)} />
          <label className="checkbox-inline" style={{ marginTop: 10, opacity: challengesLocked ? 0.5 : 1 }} htmlFor="i-challengesPublic">
            <input
              id="i-challengesPublic"
              type="checkbox"
              checked={form.challengesPublic}
              disabled={challengesLocked}
              onChange={(e) => set('challengesPublic', e.target.checked)}
            />
            Public on profile page
          </label>
          {challengesLocked && (
            <div className="hint">
              The submitter did not consent to publishing this — it can never be made public, regardless of this toggle.
            </div>
          )}
        </div>
      </div>
      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <fieldset className="field">
          <legend>Current needs</legend>
          <CheckboxGroup name="i-needs" options={NEEDS} selected={form.needs} onToggle={(v) => toggleIn('needs', v)} />
        </fieldset>
      </div>

      <div className="label">Impact metrics</div>
      <div className="hint" style={{ marginTop: -14, marginBottom: 20 }}>
        Not collected by the public form — fill in whatever you know from following up with the initiative.
      </div>
      <div className="form-grid" style={{ marginBottom: 12 }}>
        <div className="field">
          <label htmlFor="i-founded">Founded (year)</label>
          <input id="i-founded" type="number" value={form.founded} onChange={(e) => set('founded', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="i-peopleReached">People reached</label>
          <input id="i-peopleReached" type="number" value={form.peopleReached} onChange={(e) => set('peopleReached', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="i-itemsRepaired">Items repaired</label>
          <input id="i-itemsRepaired" type="number" value={form.itemsRepaired} onChange={(e) => set('itemsRepaired', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="i-co2">CO&#8322; saved (tonnes)</label>
          <input id="i-co2" type="number" step="any" value={form.co2SavedT} onChange={(e) => set('co2SavedT', e.target.value)} />
        </div>
      </div>
      <div className="form-grid" style={{ marginBottom: 20 }}>
        <div className="field">
          <label htmlFor="i-materials">Materials diverted (kg)</label>
          <input id="i-materials" type="number" step="any" value={form.materialsDivertedKg} onChange={(e) => set('materialsDivertedKg', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="i-cohesion">Social cohesion score (0-100)</label>
          <input id="i-cohesion" type="number" value={form.socialCohesionScore} onChange={(e) => set('socialCohesionScore', e.target.value)} />
        </div>
      </div>
      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <div className="field">
          <label htmlFor="i-sdg">SDG alignment (comma-separated numbers, e.g. 11, 12, 13)</label>
          <input id="i-sdg" type="text" value={form.sdgAlignment} onChange={(e) => set('sdgAlignment', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="i-keywords">Keywords (comma-separated)</label>
          <input id="i-keywords" type="text" value={form.keywords} onChange={(e) => set('keywords', e.target.value)} />
        </div>
      </div>

      <div className="label">Contact</div>
      <div className="form-grid" style={{ marginBottom: 32 }}>
        <div className="field">
          <label htmlFor="i-website">Website</label>
          <input id="i-website" type="url" value={form.website} onChange={(e) => set('website', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="i-socialMedia">Social media</label>
          <input id="i-socialMedia" type="text" value={form.socialMedia} onChange={(e) => set('socialMedia', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="i-videoUrl">Video link</label>
          <input id="i-videoUrl" type="url" value={form.videoUrl} onChange={(e) => set('videoUrl', e.target.value)} />
        </div>
      </div>

      <div className="label">Publish settings</div>
      <div className="form-grid full" style={{ marginBottom: 32, display: 'flex', gap: 24 }}>
        <label className="checkbox-inline" htmlFor="i-featured">
          <input id="i-featured" type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)} />
          Featured on homepage
        </label>
        <label className="checkbox-inline" htmlFor="i-published">
          <input id="i-published" type="checkbox" checked={form.published} onChange={(e) => set('published', e.target.checked)} />
          Published (visible on the public site)
        </label>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button type="submit" className="btn" disabled={status === 'saving'}>
          {status === 'saving' ? 'Saving…' : 'Save changes'}
        </button>
        <button type="button" className="btn danger" onClick={unpublish}>Unpublish &amp; remove</button>
      </div>

      <div className={`form-status ${status === 'ok' ? 'ok' : status === 'err' ? 'err' : ''}`} role="status">
        {status === 'ok' && 'Saved.'}
        {status === 'err' && error}
      </div>
    </form>
  );
}
