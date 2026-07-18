import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/slug';
import type { SubmissionInput, ApproveInput } from '@/lib/validation/submission';
import type { Submission, SubmissionStatus } from '@prisma/client';

export async function createSubmission(data: SubmissionInput, photoPath: string | null): Promise<Submission> {
  const { honeypot: _honeypot, ...rest } = data;
  return prisma.submission.create({
    data: { ...rest, photoPath },
  });
}

export async function listSubmissions(status?: SubmissionStatus): Promise<Submission[]> {
  return prisma.submission.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
  });
}

export async function getSubmission(id: string): Promise<Submission | null> {
  return prisma.submission.findUnique({ where: { id } });
}

export async function rejectSubmission(id: string, reason?: string): Promise<Submission> {
  return prisma.submission.update({
    where: { id },
    data: { status: 'REJECTED', rejectionReason: reason ?? null, reviewedAt: new Date() },
  });
}

export async function deleteSubmission(id: string): Promise<void> {
  await prisma.submission.delete({ where: { id } });
}

const REQUIRED_TO_PUBLISH = ['name', 'tagline', 'description', 'city', 'country'] as const;

export class ApprovalValidationError extends Error {
  constructor(public fields: string[]) {
    super(`Missing required fields to publish: ${fields.join(', ')}`);
  }
}

export async function approveSubmission(id: string, input: ApproveInput) {
  const submission = await prisma.submission.findUnique({ where: { id } });
  if (!submission) throw new Error('Submission not found');

  const lat = input.lat ?? submission.lat ?? undefined;
  const lng = input.lng ?? submission.lng ?? undefined;

  const missing: string[] = REQUIRED_TO_PUBLISH.filter(
    (f) => !(submission as unknown as Record<string, unknown>)[f],
  );
  if (lat === undefined || lng === undefined) missing.push('lat/lng');
  if (missing.length) throw new ApprovalValidationError(missing);

  // Visibility consent rule: admin can only make a section MORE private than requested, never less.
  const challengesPublic = input.visibility.challengesPublic && submission.challengesPublicRequested;
  const needsPublic = input.visibility.needsPublic && submission.needsPublicRequested;
  const emailPublic = input.visibility.emailPublic; // always defaults false unless admin opts in

  const baseSlug = slugify(input.slug || submission.name);
  let slug = baseSlug;
  let n = 2;
  while (await prisma.initiative.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${n++}`;
  }

  return prisma.$transaction(async (tx) => {
    const initiative = await tx.initiative.create({
      data: {
        slug,
        name: submission.name,
        tagline: submission.tagline,
        description: submission.description,
        city: submission.city,
        region: submission.region,
        street: submission.street,
        country: submission.country,
        lat: lat as number,
        lng: lng as number,
        domain: input.domain,
        repairSector: input.repairSector,
        repairCategories: submission.repairCategories as object,
        orgTypes: submission.orgTypes as object,
        activities: submission.activities as object,
        audience: submission.audience as object,
        peopleInvolved: submission.peopleInvolved,
        knowledgeSkills: submission.knowledgeSkills,
        heritageDimension: submission.heritageDimension,
        challengesAndThreats: submission.challengesAndThreats,
        challengesPublic,
        needs: submission.needs as object | undefined,
        needsPublic,
        founded: input.founded,
        peopleReached: input.peopleReached,
        itemsRepaired: input.itemsRepaired,
        co2SavedT: input.co2SavedT,
        materialsDivertedKg: input.materialsDivertedKg,
        socialCohesionScore: input.socialCohesionScore,
        website: submission.website,
        email: submission.email,
        emailPublic,
        socialMedia: submission.socialMedia,
        photoPath: submission.photoPath,
        videoUrl: submission.videoUrl,
        featured: input.featured,
        hiddenFields: input.hiddenFields,
        submissionId: submission.id,
      },
    });

    await tx.submission.update({
      where: { id: submission.id },
      data: { status: 'APPROVED', reviewedAt: new Date() },
    });

    return initiative;
  });
}
