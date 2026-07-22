import { notFound } from 'next/navigation';
import { getSubmission } from '@/lib/submissions';
import SubmissionDetail from '@/components/admin/SubmissionDetail';
import AdminSubNav from '@/components/admin/AdminSubNav';

export const revalidate = 0;

export default async function AdminSubmissionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const submission = await getSubmission(id);
  if (!submission) notFound();

  return (
    <section className="section" style={{ padding: '56px 0' }}>
      <div className="container">
        <AdminSubNav />
        <SubmissionDetail
          submission={{
            id: submission.id,
            status: submission.status,
            name: submission.name,
            tagline: submission.tagline,
            description: submission.description,
            repairCategories: submission.repairCategories as string[],
            repairCategoriesOtherText: submission.repairCategoriesOtherText,
            orgTypes: submission.orgTypes as string[],
            orgTypesOtherText: submission.orgTypesOtherText,
            peopleInvolved: submission.peopleInvolved,
            activities: submission.activities as string[],
            activitiesOtherText: submission.activitiesOtherText,
            knowledgeSkills: submission.knowledgeSkills,
            challengesAndThreats: submission.challengesAndThreats,
            needs: (submission.needs as string[] | null) ?? [],
            needsOtherText: submission.needsOtherText,
            contactName: submission.contactName,
            email: submission.email,
            website: submission.website,
            socialMedia: submission.socialMedia,
            street: submission.street,
            city: submission.city,
            region: submission.region,
            country: submission.country,
            lat: submission.lat,
            lng: submission.lng,
            audience: submission.audience as string[],
            heritageDimension: submission.heritageDimension,
            photoPath: submission.photoPath,
            videoUrl: submission.videoUrl,
            publicationConsent: submission.publicationConsent,
            rejectionReason: submission.rejectionReason,
            createdAt: submission.createdAt.toISOString(),
          }}
        />
      </div>
    </section>
  );
}
