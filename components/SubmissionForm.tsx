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
  activities: string[];
  activitiesOtherText: string;
  repairCategories: string[];
  repairCategoriesOtherText: string;
  orgTypes: string[];
  orgTypesOtherText: string;
  peopleInvolved: string;
  knowledgeSkills: string;
  heritageDimension: string;
  challengesAndThreats: string;
  needs: string[];
  needsOtherText: string;
  contactName: string;
  email: string;
  website: string;
  socialMedia: string;
  street: string;
  city: string;
  region: string;
  country: string;
  lat: string;
  lng: string;
  audience: string[];
  videoUrl: string;
  publicationConsent: '' | 'YES' | 'YES_EXCEPT_CHALLENGES' | 'NO';
  honeypot: string;
};

const INITIAL: FormState = {
  name: '',
  tagline: '',
  description: '',
  activities: [],
  activitiesOtherText: '',
  repairCategories: [],
  repairCategoriesOtherText: '',
  orgTypes: [],
  orgTypesOtherText: '',
  peopleInvolved: '',
  knowledgeSkills: '',
  heritageDimension: '',
  challengesAndThreats: '',
  needs: [],
  needsOtherText: '',
  contactName: '',
  email: '',
  website: '',
  socialMedia: '',
  street: '',
  city: '',
  region: '',
  country: '',
  lat: '',
  lng: '',
  audience: [],
  videoUrl: '',
  publicationConsent: '',
  honeypot: '',
};

// The API returns { error: string } for simple failures, or { error: <zod flatten() shape> }
// for validation failures — { formErrors: string[], fieldErrors: Record<string, string[]> }.
// Surface whichever it is instead of always falling back to a generic message.
function extractErrorMessage(data: unknown, status: number): string {
  if (data && typeof data === 'object' && 'error' in data) {
    const err = (data as { error: unknown }).error;
    if (typeof err === 'string') return err;
    if (err && typeof err === 'object') {
      const { formErrors, fieldErrors } = err as { formErrors?: string[]; fieldErrors?: Record<string, string[]> };
      const parts: string[] = [...(formErrors ?? [])];
      for (const [field, messages] of Object.entries(fieldErrors ?? {})) {
        if (messages?.length) parts.push(`${field}: ${messages[0]}`);
      }
      if (parts.length) return parts.join(' · ');
    }
  }
  return `Something went wrong (${status}) — please check the form and try again.`;
}

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

  const countWords = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);
  const MAX_WORDS = 800;
  const descriptionWordCount = countWords(form.description);
  const knowledgeWordCount = countWords(form.knowledgeSkills);
  const peopleWordCount = countWords(form.peopleInvolved);
  const heritageWordCount = countWords(form.heritageDimension);
  const challengesWordCount = countWords(form.challengesAndThreats);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.publicationConsent) {
      setStatus('err');
      setErrorMessage('Please choose one of the publishing options at the bottom of the form.');
      return;
    }

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
        const data = await res.json().catch(() => null);
        setStatus('err');
        setErrorMessage(extractErrorMessage(data, res.status));
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
          <label htmlFor="name">Name of the entity, initiative, or organization (optional)</label>
          <input id="name" type="text" value={form.name} onChange={(e) => set('name', e.target.value)} />
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
          <div className="hint">{descriptionWordCount} words — aim for 300–500 (max {MAX_WORDS})</div>
        </div>
      </div>

      <div className="label">2. Activities</div>
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

      <div className="label">3. What do you repair, transform, or upcycle?</div>
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

      <div className="label">4. Who are you?</div>
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

      <div className="label">5. People</div>
      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <div className="field">
          <label htmlFor="peopleInvolved">Describe the people involved and their roles (staff, volunteers, craftspeople, students, community members...)</label>
          <textarea id="peopleInvolved" value={form.peopleInvolved} onChange={(e) => set('peopleInvolved', e.target.value)} />
          <div className="hint">{peopleWordCount} words (max {MAX_WORDS})</div>
        </div>
      </div>

      <div className="label">6. Knowledge and skills</div>
      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <div className="field">
          <label htmlFor="knowledgeSkills">What knowledge, techniques, or skills are practiced, transmitted, or developed?</label>
          <textarea id="knowledgeSkills" value={form.knowledgeSkills} onChange={(e) => set('knowledgeSkills', e.target.value)} />
          <div className="hint">{knowledgeWordCount} words — aim for 300–500 (max {MAX_WORDS})</div>
        </div>
      </div>

      <div className="label">7. Living heritage</div>
      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <div className="field">
          <label htmlFor="heritageDimension">
            Why do you care about repair, and would you like repair knowledge to be transmitted through generations? Why?
          </label>
          <textarea id="heritageDimension" value={form.heritageDimension} onChange={(e) => set('heritageDimension', e.target.value)} />
          <div className="hint">{heritageWordCount} words (max {MAX_WORDS})</div>
        </div>
      </div>

      <div className="label">8. Challenges and threats</div>
      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <div className="field">
          <label htmlFor="challengesAndThreats">What are the main challenges your initiative faces?</label>
          <textarea
            id="challengesAndThreats"
            value={form.challengesAndThreats}
            onChange={(e) => set('challengesAndThreats', e.target.value)}
          />
          <div className="hint">{challengesWordCount} words (max {MAX_WORDS})</div>
        </div>
      </div>

      <div className="label">9. Current needs</div>
      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <fieldset className="field">
          <legend>Select all that apply</legend>
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
        </fieldset>
      </div>

      <div className="label">10. Contact</div>
      <div className="hint" style={{ marginTop: -14, marginBottom: 20 }}>
        Your name and email are for our records only — they are never published, whatever you choose below.
      </div>
      <div className="form-grid" style={{ marginBottom: 32 }}>
        <div className="field">
          <label htmlFor="contactName">Your name</label>
          <input id="contactName" type="text" required value={form.contactName} onChange={(e) => set('contactName', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="email">Your email</label>
          <input id="email" type="email" required value={form.email} onChange={(e) => set('email', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="website">Website (optional)</label>
          <input id="website" type="url" placeholder="https://" value={form.website} onChange={(e) => set('website', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="socialMedia">Social media (optional)</label>
          <input id="socialMedia" type="text" value={form.socialMedia} onChange={(e) => set('socialMedia', e.target.value)} />
        </div>
      </div>

      <div className="label">11. Location</div>
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

      <div className="label">12. Audience</div>
      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <fieldset className="field">
          <legend>Who participates?</legend>
          <CheckboxGroup name="audience" options={AUDIENCE} selected={form.audience} onToggle={(v) => toggleIn('audience', v)} />
        </fieldset>
      </div>

      <div className="label">13. Photo (optional)</div>
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

      <div className="label">14. Video (optional)</div>
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

      <div className="label">15. Publishing your information</div>
      <div className="form-grid full" style={{ marginBottom: 32 }}>
        <fieldset className="field">
          <legend>
            We&apos;d love to promote your initiative on the platform — but it&apos;s entirely your choice whether
            any of this becomes public. Submissions are reviewed either way, and we never publish your name, email,
            or anything you didn&apos;t consent to.
          </legend>
          <div className="checkbox-row" style={{ gridTemplateColumns: '1fr' }}>
            <label htmlFor="consent-yes">
              <input
                id="consent-yes"
                type="radio"
                name="publicationConsent"
                required
                checked={form.publicationConsent === 'YES'}
                onChange={() => set('publicationConsent', 'YES')}
              />
              Yes — you can publish everything, including the challenges and threats section
            </label>
            <label htmlFor="consent-yes-except">
              <input
                id="consent-yes-except"
                type="radio"
                name="publicationConsent"
                checked={form.publicationConsent === 'YES_EXCEPT_CHALLENGES'}
                onChange={() => set('publicationConsent', 'YES_EXCEPT_CHALLENGES')}
              />
              Yes, except the challenges and threats section — keep that part private
            </label>
            <label htmlFor="consent-no">
              <input
                id="consent-no"
                type="radio"
                name="publicationConsent"
                checked={form.publicationConsent === 'NO'}
                onChange={() => set('publicationConsent', 'NO')}
              />
              No — please don&apos;t publish anything from this submission, just keep it on file
            </label>
          </div>
        </fieldset>
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
