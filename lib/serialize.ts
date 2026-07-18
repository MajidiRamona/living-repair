import type { Initiative } from '@prisma/client';

export type PublicInitiative = ReturnType<typeof serializePublicInitiative>;

function asArray(json: unknown): string[] {
  return Array.isArray(json) ? (json as string[]) : [];
}

export function serializePublicInitiative(i: Initiative) {
  const hidden = new Set(asArray(i.hiddenFields));
  const show = <T>(key: string, val: T): T | undefined => (hidden.has(key) ? undefined : val ?? undefined);

  return {
    id: i.slug,
    name: i.name,
    slug: i.slug,
    city: i.city,
    country: i.country,
    lat: i.lat,
    lng: i.lng,
    domain: i.domain,
    repair_sector: i.repairSector,
    tagline: i.tagline,
    description: i.description,
    founded: i.founded ?? undefined,
    people_reached: i.peopleReached ?? undefined,
    items_repaired: i.itemsRepaired ?? undefined,
    co2_saved_t: i.co2SavedT ?? undefined,
    materials_diverted_kg: i.materialsDivertedKg ?? undefined,
    social_cohesion_score: i.socialCohesionScore ?? undefined,
    sdg_alignment: asArray(i.sdgAlignment),
    keywords: asArray(i.keywords),
    climate_link: show('climateLink', i.climateLink ?? undefined),
    website: i.website ?? undefined,
    featured: i.featured,

    repair_categories: asArray(i.repairCategories),
    org_types: asArray(i.orgTypes),
    activities: asArray(i.activities),
    audience: asArray(i.audience),
    people_involved: show('peopleInvolved', i.peopleInvolved ?? undefined),
    knowledge_skills: show('knowledgeSkills', i.knowledgeSkills ?? undefined),
    heritage_dimension: show('heritageDimension', i.heritageDimension ?? undefined),
    challenges_and_threats: i.challengesPublic ? i.challengesAndThreats ?? undefined : undefined,
    needs: i.needsPublic ? asArray(i.needs) : undefined,
    email: i.emailPublic ? i.email ?? undefined : undefined,
    social_media: i.socialMedia ?? undefined,
    street: show('street', i.street ?? undefined),
    region: i.region ?? undefined,
    photo_url: i.photoPath ? `/uploads/${i.photoPath}` : undefined,
    video_url: show('videoUrl', i.videoUrl ?? undefined),
  };
}
