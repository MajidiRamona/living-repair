import { prisma } from '@/lib/prisma';
import type { Initiative, Prisma } from '@prisma/client';

export async function listAllInitiatives(): Promise<Initiative[]> {
  return prisma.initiative.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function getInitiativeById(id: string): Promise<Initiative | null> {
  return prisma.initiative.findUnique({ where: { id } });
}

// The consent ceiling set at approval time must keep holding afterward too — an admin
// editing an already-published initiative still can't flip challengesPublic to true if the
// original submitter never consented to it. Initiatives with no linked submission (e.g. the
// two seeded by hand) have no consent record to enforce, so they're unrestricted.
export async function getPublicationConsentForInitiative(id: string): Promise<string | null> {
  const initiative = await prisma.initiative.findUnique({
    where: { id },
    select: { submission: { select: { publicationConsent: true } } },
  });
  return initiative?.submission?.publicationConsent ?? null;
}

export async function updateInitiative(id: string, data: Prisma.InitiativeUpdateInput): Promise<Initiative> {
  return prisma.initiative.update({ where: { id }, data });
}

export async function setInitiativePublished(id: string, published: boolean): Promise<Initiative> {
  return prisma.initiative.update({ where: { id }, data: { published } });
}

export async function deleteInitiative(id: string): Promise<void> {
  await prisma.initiative.delete({ where: { id } });
}
