'use client';

import { useRef, useState } from 'react';
import {
  REPAIR_CATEGORIES,
  ORG_TYPES,
  ACTIVITIES,
  NEEDS,
  AUDIENCE,
} from '@/lib/formOptions';
import CheckboxGroup from '@/components/CheckboxGroup';

type FormState = {
  name: string;
  tagline: string;
  description: string;
  repairCategories: string[];
  repairCategoriesOtherText: string;
  orgTypes: string[];
  orgTypesOtherText: string;
  peopleInvolved: string;
  activities: string[];
  activitiesOtherText: string;
  knowledgeSkills: string;
  challengesAndThreats: string;
  challengesPublicRequested: boolean;
  needs: string[];
  needsOtherText: string;
  needsPublicRequested: boolean;
  website: string;
  email: string;
  socialMedia: string;
  street: string;
  city: string;
  region: string;
  country: string;
  lat: string;
  lng: string;
  audience: string[];
  heritageDimension: string;
  videoUrl: string;
  honeypot: string;
};

const INITIAL: FormState = {
  name: '',
  tagline: '',
  description: '',
  repairCategories: [],
  repairCategoriesOtherText: '',
  orgTypes: [],
  orgTypesOtherText: '',
  peopleInvolved: '',
  activities: [],
  activitiesOtherText: '',
  knowledgeSkills: '',
  challengesAndThreats: '',
  challengesPublicRequested: false,
  needs: [],
  needsOtherText: '',
  needsPublicRequested: false,
  website: '',
  email: '',
  socialMedia: '',
  street: '',
  city: '',
  region: '',
  country: '',
  lat: '',
  lng: '',
  audience: [],
  heritageDimension: '',
  videoUrl: '',
  honeypot: '',
};

export default function SubmissionForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [photo, setPhoto] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'err'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleIn(key: 'repairCategories' | 'orgTypes' | 'activities' | 'needs' | 'audience', value: string) {
    setForm((f) => {
      const list = f[key];
      const next = list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
      return { ...f, [key]: next };
    });
  }

  const wordCount = form.description.trim() ? form.description.trim().split(/\s+/).length : 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    const payload = {
      ...form,
      lat: form.lat === '' ? undefined : form.lat,
      lng: form.lng === '' ? undefined : form.lng,
    };

    const body = new FormData();
    body.set('data', JSON.stringify(payload));
    if (photo) body.set('photo', photo);

    try {
      const res = await fetch('/api/submissions', { method: 'POST', body });
      if (res.ok) {
        setStatus('ok');
        setForm(INITIAL);
        setPhoto(null);
        formRef.current?.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus('err');
        setErrorMessage(
          typeof data?.error === 'string' ? data.error : 'Something went wrong — please check the form and try again.',
        );
      }
    } catch {
      setStatus('err');
      setErrorMessage('Network error — please try again.');
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      {/* Honeypot — hidden from real users, bots tend to fill every field */}
      <div style={{ position: 'absolute', left: '-9999px' }} aria-hidden="true">
        <label htmlFor="honeypot">
          Leave this field empty
          <input
            id="honeypot"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={form.honeypot}
            onChange={(e) => set('honeypot', e.target.value)}
          />
        </label>
      </div>

      <div className="label" style={{ marginTop: 0 }}>1. Basic information</div>
      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <div className="field">
          <label htmlFor="name">Name of the entity, initiative, or organization</label>
          <input id="name" type="text" required value={form.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="tagline">One-line tagline</label>
          <input
            id="tagline"
            type="text"
            required
            maxLength={120}
            value={form.tagline}
            onChange={(e) => set('tagline', e.target.value)}
          />
          <div className="hint">{form.tagline.length}/120 characters</div>
        </div>
        <div className="field">
          <label htmlFor="description">Short description</label>
          <textarea
            id="description"
            required
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            style={{ minHeight: 180 }}
          />
          <div className="hint">{wordCount} words — aim for 300–500</div>
        </div>
      </div>

      <div className="label">2. What do you repair, transform, or upcycle?</div>
      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <fieldset className="field">
          <legend>Select all that apply</legend>
          <CheckboxGroup
            name="repairCategories"
            options={REPAIR_CATEGORIES}
            selected={form.repairCategories}
            onToggle={(v) => toggleIn('repairCategories', v)}
          />
          {form.repairCategories.includes('other') && (
            <>
              <label htmlFor="repairCategoriesOtherText" className="sr-only">Please specify other repair category</label>
              <input
                id="repairCategoriesOtherText"
                className="other-input"
                type="text"
                placeholder="Please specify"
                required
                value={form.repairCategoriesOtherText}
                onChange={(e) => set('repairCategoriesOtherText', e.target.value)}
              />
            </>
          )}
        </fieldset>
      </div>

      <div className="label">3. Who are you?</div>
      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <fieldset className="field">
          <legend>Select all that apply</legend>
          <CheckboxGroup name="orgTypes" options={ORG_TYPES} selected={form.orgTypes} onToggle={(v) => toggleIn('orgTypes', v)} />
          {form.orgTypes.includes('other') && (
            <>
              <label htmlFor="orgTypesOtherText" className="sr-only">Please specify other organization type</label>
              <input
                id="orgTypesOtherText"
                className="other-input"
                type="text"
                placeholder="Please specify"
                required
                value={form.orgTypesOtherText}
                onChange={(e) => set('orgTypesOtherText', e.target.value)}
              />
            </>
          )}
        </fieldset>
      </div>

      <div className="label">4. People</div>
      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <div className="field">
          <label htmlFor="peopleInvolved">Describe the people involved and their roles (staff, volunteers, craftspeople, students, community members...)</label>
          <textarea id="peopleInvolved" value={form.peopleInvolved} onChange={(e) => set('peopleInvolved', e.target.value)} />
        </div>
      </div>

      <div className="label">5. Activities</div>
      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <fieldset className="field">
          <legend>Which activities does your initiative organize?</legend>
          <CheckboxGroup name="activities" options={ACTIVITIES} selected={form.activities} onToggle={(v) => toggleIn('activities', v)} />
          {form.activities.includes('other') && (
            <>
              <label htmlFor="activitiesOtherText" className="sr-only">Please specify other activity</label>
              <input
                id="activitiesOtherText"
                className="other-input"
                type="text"
                placeholder="Please specify"
                required
                value={form.activitiesOtherText}
                onChange={(e) => set('activitiesOtherText', e.target.value)}
              />
            </>
          )}
        </fieldset>
      </div>

      <div className="label">6. Knowledge and skills</div>
      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <div className="field">
          <label htmlFor="knowledgeSkills">What knowledge, techniques, or skills are practiced, transmitted, or developed?</label>
          <textarea id="knowledgeSkills" value={form.knowledgeSkills} onChange={(e) => set('knowledgeSkills', e.target.value)} />
        </div>
      </div>

      <div className="label">7. Research questions (optional)</div>

      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <div className="field">
          <div className="subheading">Challenges and threats</div>
          <label htmlFor="challengesAndThreats">What are the main challenges your initiative faces?</label>
          <textarea
            id="challengesAndThreats"
            value={form.challengesAndThreats}
            onChange={(e) => set('challengesAndThreats', e.target.value)}
          />
          <label className="checkbox-inline" style={{ marginTop: 10 }} htmlFor="challengesPublicRequested">
            <input
              id="challengesPublicRequested"
              type="checkbox"
              checked={form.challengesPublicRequested}
              onChange={(e) => set('challengesPublicRequested', e.target.checked)}
            />
            Make this information publicly visible
          </label>
        </div>
      </div>

      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <fieldset className="field">
          <legend className="subheading" style={{ textTransform: 'none', letterSpacing: 'normal' }}>Current needs</legend>
          <div className="hint" style={{ marginTop: -6, marginBottom: 10 }}>Select all that apply</div>
          <CheckboxGroup name="needs" options={NEEDS} selected={form.needs} onToggle={(v) => toggleIn('needs', v)} />
          {form.needs.includes('other') && (
            <>
              <label htmlFor="needsOtherText" className="sr-only">Please specify other need</label>
              <input
                id="needsOtherText"
                className="other-input"
                type="text"
                placeholder="Please specify"
                required
                value={form.needsOtherText}
                onChange={(e) => set('needsOtherText', e.target.value)}
              />
            </>
          )}
          <label className="checkbox-inline" style={{ marginTop: 10 }} htmlFor="needsPublicRequested">
            <input
              id="needsPublicRequested"
              type="checkbox"
              checked={form.needsPublicRequested}
              onChange={(e) => set('needsPublicRequested', e.target.checked)}
            />
            Make this information publicly visible
          </label>
        </fieldset>
      </div>

      <div className="label">8. Contact</div>
      <div className="form-grid" style={{ marginBottom: 32 }}>
        <div className="field">
          <label htmlFor="website">Website</label>
          <input id="website" type="url" placeholder="https://" value={form.website} onChange={(e) => set('website', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="email">Email (optional)</label>
          <input id="email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="socialMedia">Social media (optional)</label>
          <input id="socialMedia" type="text" value={form.socialMedia} onChange={(e) => set('socialMedia', e.target.value)} />
        </div>
      </div>

      <div className="label">9. Location</div>
      <div className="form-grid" style={{ marginBottom: 12 }}>
        <div className="field">
          <label htmlFor="street">Street</label>
          <input id="street" type="text" value={form.street} onChange={(e) => set('street', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="city">City</label>
          <input id="city" type="text" required value={form.city} onChange={(e) => set('city', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="region">Region / State</label>
          <input id="region" type="text" value={form.region} onChange={(e) => set('region', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="country">Country</label>
          <input id="country" type="text" required value={form.country} onChange={(e) => set('country', e.target.value)} />
        </div>
      </div>
      <div className="form-grid" style={{ marginBottom: 32 }}>
        <div className="field">
          <label htmlFor="lat">Latitude (optional)</label>
          <input id="lat" type="number" step="any" value={form.lat} onChange={(e) => set('lat', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="lng">Longitude (optional)</label>
          <input id="lng" type="number" step="any" value={form.lng} onChange={(e) => set('lng', e.target.value)} />
        </div>
      </div>

      <div className="label">10. Audience</div>
      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <fieldset className="field">
          <legend>Who participates?</legend>
          <CheckboxGroup name="audience" options={AUDIENCE} selected={form.audience} onToggle={(v) => toggleIn('audience', v)} />
        </fieldset>
      </div>

      <div className="label">11. Living heritage (optional)</div>
      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <div className="field">
          <label htmlFor="heritageDimension">
            Do you consider the knowledge or practices involved to be part of a cultural tradition or living heritage? Why or why not?
          </label>
          <textarea id="heritageDimension" value={form.heritageDimension} onChange={(e) => set('heritageDimension', e.target.value)} />
        </div>
      </div>

      <div className="label">12. Photo (optional)</div>
      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <div className="field">
          <label htmlFor="photo">A photo of your initiative, workshop, or work</label>
          <input
            id="photo"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      <div className="label">13. Video (optional)</div>
      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <div className="field">
          <label htmlFor="videoUrl">Link to a video about your initiative (YouTube, Vimeo, Instagram...)</label>
          <input
            id="videoUrl"
            type="url"
            placeholder="https://"
            value={form.videoUrl}
            onChange={(e) => set('videoUrl', e.target.value)}
          />
          <div className="hint">Paste a link — no need to upload a file</div>
        </div>
      </div>

      <button type="submit" className="btn" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Submitting…' : 'Submit initiative'}
      </button>

      <div className={`form-status ${status === 'ok' ? 'ok' : status === 'err' ? 'err' : ''}`} role="status">
        {status === 'ok' && "Thank you — your submission is in review. We'll be in touch if we need anything else."}
        {status === 'err' && errorMessage}
      </div>
    </form>
  );
}
