import { prisma } from '@/lib/prisma';
import { serializePublicInitiative, type PublicInitiative } from '@/lib/serialize';

export async function getPublishedInitiatives(): Promise<PublicInitiative[]> {
  const rows = await prisma.initiative.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });
  return rows.map(serializePublicInitiative);
}

export async function getPublishedInitiativeBySlug(slug: string): Promise<PublicInitiative | null> {
  const row = await prisma.initiative.findFirst({ where: { slug, published: true } });
  return row ? serializePublicInitiative(row) : null;
}

export async function getMetrics() {
  const agg = await prisma.initiative.aggregate({
    where: { published: true },
    _sum: {
      itemsRepaired: true,
      co2SavedT: true,
      materialsDivertedKg: true,
      peopleReached: true,
    },
    _count: true,
  });

  return {
    repair_impact: {
      items_repaired_total: agg._sum.itemsRepaired ?? 0,
      co2_avoided_t_total: agg._sum.co2SavedT ?? 0,
      materials_diverted_kg_total: agg._sum.materialsDivertedKg ?? 0,
      people_engaged_total: agg._sum.peopleReached ?? 0,
      active_initiatives: agg._count,
    },
  };
}
