import { prisma } from '@/lib/prisma';
import type { Initiative, Prisma } from '@prisma/client';

export async function listAllInitiatives(): Promise<Initiative[]> {
  return prisma.initiative.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function getInitiativeById(id: string): Promise<Initiative | null> {
  return prisma.initiative.findUnique({ where: { id } });
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
