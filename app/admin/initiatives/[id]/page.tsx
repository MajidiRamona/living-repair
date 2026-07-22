import { notFound } from 'next/navigation';
import { getInitiativeById, getPublicationConsentForInitiative } from '@/lib/adminInitiatives';
import AdminSubNav from '@/components/admin/AdminSubNav';
import InitiativeEditForm from '@/components/admin/InitiativeEditForm';

export const revalidate = 0;

export default async function AdminInitiativePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [initiative, publicationConsent] = await Promise.all([
    getInitiativeById(id),
    getPublicationConsentForInitiative(id),
  ]);
  if (!initiative) notFound();

  return (
    <section className="section" style={{ padding: '56px 0' }}>
      <div className="container">
        <AdminSubNav />
        <InitiativeEditForm
          publicationConsent={publicationConsent}
          initiative={{
            id: initiative.id,
            slug: initiative.slug,
            name: initiative.name,
            tagline: initiative.tagline,
            description: initiative.description,
            city: initiative.city,
            region: initiative.region,
            street: initiative.street,
            country: initiative.country,
            lat: initiative.lat,
            lng: initiative.lng,
            domain: initiative.domain,
            repairSector: initiative.repairSector,
            repairCategories: initiative.repairCategories as string[],
            orgTypes: initiative.orgTypes as string[],
            activities: initiative.activities as string[],
            audience: initiative.audience as string[],
            peopleInvolved: initiative.peopleInvolved,
            knowledgeSkills: initiative.knowledgeSkills,
            heritageDimension: initiative.heritageDimension,
            challengesAndThreats: initiative.challengesAndThreats,
            challengesPublic: initiative.challengesPublic,
            needs: (initiative.needs as string[] | null) ?? [],
            founded: initiative.founded,
            peopleReached: initiative.peopleReached,
            itemsRepaired: initiative.itemsRepaired,
            co2SavedT: initiative.co2SavedT,
            materialsDivertedKg: initiative.materialsDivertedKg,
            socialCohesionScore: initiative.socialCohesionScore,
            sdgAlignment: (initiative.sdgAlignment as number[] | null) ?? [],
            keywords: (initiative.keywords as string[] | null) ?? [],
            website: initiative.website,
            socialMedia: initiative.socialMedia,
            videoUrl: initiative.videoUrl,
            photoPath: initiative.photoPath,
            featured: initiative.featured,
            published: initiative.published,
          }}
        />
      </div>
    </section>
  );
}
