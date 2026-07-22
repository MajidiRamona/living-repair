import { z } from 'zod';
import {
  REPAIR_CATEGORIES,
  ORG_TYPES,
  ACTIVITIES,
  NEEDS,
  AUDIENCE,
} from '@/lib/formOptions';

const valuesOf = (opts: { value: string }[]) => opts.map((o) => o.value) as [string, ...string[]];

const RepairCategory = z.enum(valuesOf(REPAIR_CATEGORIES));
const OrgType = z.enum(valuesOf(ORG_TYPES));
const Activity = z.enum(valuesOf(ACTIVITIES));
const Need = z.enum(valuesOf(NEEDS));
const Audience = z.enum(valuesOf(AUDIENCE));

export const PublicationConsent = z.enum(['YES', 'YES_EXCEPT_CHALLENGES', 'NO']);

const emptyToUndefined = (v: unknown) => (v === '' ? undefined : v);

// Plain z.string().url() accepts any scheme, including javascript: — which we later render
// straight into an <a href>. Restrict to http(s) so a submission can never smuggle a script URI.
const httpUrl = z
  .string()
  .trim()
  .max(500)
  .refine(
    (v) => {
      try {
        return ['http:', 'https:'].includes(new URL(v).protocol);
      } catch {
        return false;
      }
    },
    { message: 'Must be a valid http:// or https:// URL' },
  );

export const submissionSchema = z
  .object({
    // 1. Basic information — name is optional, not everyone has a formal entity name
    name: z.preprocess(emptyToUndefined, z.string().trim().min(2).max(200).optional()),
    tagline: z.string().trim().min(1).max(120),
    description: z.string().trim().min(50).max(4000),

    // 2. Activities
    activities: z.array(Activity).min(1),
    activitiesOtherText: z.preprocess(emptyToUndefined, z.string().max(200).optional()),

    // 3. What do you repair/transform/upcycle
    repairCategories: z.array(RepairCategory).min(1),
    repairCategoriesOtherText: z.preprocess(emptyToUndefined, z.string().max(200).optional()),

    // 4. Who are you
    orgTypes: z.array(OrgType).min(1),
    orgTypesOtherText: z.preprocess(emptyToUndefined, z.string().max(200).optional()),

    // 5. People
    peopleInvolved: z.preprocess(emptyToUndefined, z.string().max(2000).optional()),

    // 6. Knowledge and skills
    knowledgeSkills: z.preprocess(emptyToUndefined, z.string().max(2000).optional()),

    // 7. Why do you care about repair / heritage transmission
    heritageDimension: z.preprocess(emptyToUndefined, z.string().max(2000).optional()),

    // 8. Challenges and threats
    challengesAndThreats: z.preprocess(emptyToUndefined, z.string().max(2000).optional()),

    // 9. Current needs
    needs: z.array(Need).default([]),
    needsOtherText: z.preprocess(emptyToUndefined, z.string().max(200).optional()),

    // 10. Contact — name and email are mandatory, never published regardless of consent
    contactName: z.string().trim().min(1).max(200),
    email: z.string().trim().email(),
    website: z.preprocess(emptyToUndefined, httpUrl.optional()),
    socialMedia: z.preprocess(emptyToUndefined, z.string().max(300).optional()),

    // 11. Location
    street: z.preprocess(emptyToUndefined, z.string().max(200).optional()),
    city: z.string().trim().min(1).max(120),
    region: z.preprocess(emptyToUndefined, z.string().max(120).optional()),
    country: z.string().trim().min(1).max(120),
    lat: z.coerce.number().min(-90).max(90).optional(),
    lng: z.coerce.number().min(-180).max(180).optional(),

    // 12. Audience
    audience: z.array(Audience).min(1),

    videoUrl: z.preprocess(emptyToUndefined, httpUrl.optional()),

    // Publication consent — the ceiling on what admin approval can ever expose
    publicationConsent: PublicationConsent,

    honeypot: z.preprocess(emptyToUndefined, z.string().max(0).optional()),
  })
  .superRefine((v, ctx) => {
    if (v.repairCategories.includes('other') && !v.repairCategoriesOtherText) {
      ctx.addIssue({ path: ['repairCategoriesOtherText'], code: 'custom', message: 'Required when "Other" is selected' });
    }
    if (v.orgTypes.includes('other') && !v.orgTypesOtherText) {
      ctx.addIssue({ path: ['orgTypesOtherText'], code: 'custom', message: 'Required when "Other" is selected' });
    }
    if (v.activities.includes('other') && !v.activitiesOtherText) {
      ctx.addIssue({ path: ['activitiesOtherText'], code: 'custom', message: 'Required when "Other" is selected' });
    }
    if (v.needs.includes('other') && !v.needsOtherText) {
      ctx.addIssue({ path: ['needsOtherText'], code: 'custom', message: 'Required when "Other" is selected' });
    }
    if ((v.lat === undefined) !== (v.lng === undefined)) {
      ctx.addIssue({ path: ['lng'], code: 'custom', message: 'Latitude and longitude must both be provided, or both left blank' });
    }
  });

export type SubmissionInput = z.infer<typeof submissionSchema>;

export const approveSchema = z.object({
  // Admin-supplied/confirmed publish name — the submission's own name may be blank.
  name: z.string().trim().min(1).max(200),
  domain: z.enum(['oral-traditions', 'performing-arts', 'social-practices', 'knowledge-of-nature', 'craftsmanship', 'food']),
  repairSector: z.enum(['textile', 'furniture', 'electronics', 'other']),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  // Admin's editorial choice to show challenges — only ever honored if the submitter's
  // consent was the full YES; enforced again server-side in approveSubmission(), not just here.
  challengesPublic: z.boolean().default(false),
  hiddenFields: z.array(z.string()).default([]),
  slug: z.preprocess(emptyToUndefined, z.string().max(200).optional()),
  founded: z.coerce.number().int().optional(),
  peopleReached: z.coerce.number().int().optional(),
  itemsRepaired: z.coerce.number().int().optional(),
  co2SavedT: z.coerce.number().optional(),
  materialsDivertedKg: z.coerce.number().optional(),
  socialCohesionScore: z.coerce.number().int().optional(),
  featured: z.boolean().default(false),
});

export type ApproveInput = z.infer<typeof approveSchema>;

// Admin edit forms are the other place a website/videoUrl string reaches the database —
// reuse the same http(s)-only rule so the same XSS vector can't be reopened from the admin panel.
export const initiativePatchSchema = z
  .object({
    name: z.string().trim().min(2).max(200),
    tagline: z.string().trim().min(1).max(120),
    description: z.string().trim().min(1).max(4000),
    city: z.string().trim().min(1).max(120),
    region: z.string().max(120).nullable(),
    street: z.string().max(200).nullable(),
    country: z.string().trim().min(1).max(120),
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
    domain: z.enum(['oral-traditions', 'performing-arts', 'social-practices', 'knowledge-of-nature', 'craftsmanship', 'food']),
    repairSector: z.enum(['textile', 'furniture', 'electronics', 'other']),
    repairCategories: z.array(RepairCategory),
    orgTypes: z.array(OrgType),
    activities: z.array(Activity),
    audience: z.array(Audience),
    peopleInvolved: z.string().max(2000).nullable(),
    knowledgeSkills: z.string().max(2000).nullable(),
    heritageDimension: z.string().max(2000).nullable(),
    challengesAndThreats: z.string().max(2000).nullable(),
    challengesPublic: z.boolean(),
    needs: z.array(Need),
    founded: z.coerce.number().int().nullable(),
    peopleReached: z.coerce.number().int().nullable(),
    itemsRepaired: z.coerce.number().int().nullable(),
    co2SavedT: z.coerce.number().nullable(),
    materialsDivertedKg: z.coerce.number().nullable(),
    socialCohesionScore: z.coerce.number().int().nullable(),
    sdgAlignment: z.array(z.number().int()),
    keywords: z.array(z.string().max(60)),
    website: httpUrl.nullable(),
    socialMedia: z.string().max(300).nullable(),
    videoUrl: httpUrl.nullable(),
    featured: z.boolean(),
    published: z.boolean(),
    hiddenFields: z.array(z.string()),
  })
  .partial();

export type InitiativePatchInput = z.infer<typeof initiativePatchSchema>;

export const submissionPatchSchema = submissionSchema.innerType().partial().extend({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  adminNotes: z.string().max(2000).nullable().optional(),
});

export type SubmissionPatchInput = z.infer<typeof submissionPatchSchema>;
