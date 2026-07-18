import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const initiatives = [
  {
    slug: 'histoires-sans-chute',
    name: 'Histoires Sans Chute',
    tagline: 'Oral storytelling as living memory.',
    description:
      'Geneva-based collective recording and re-circulating intergenerational stories. Treats oral heritage as a renewable resource: zero-material-footprint cultural transmission that strengthens social cohesion.',
    city: 'Geneva',
    region: null,
    street: null,
    country: 'Switzerland',
    lat: 46.2044,
    lng: 6.1432,
    domain: 'oral-traditions',
    repairSector: 'other',
    repairCategories: ['other'],
    orgTypes: ['community_group'],
    activities: ['documentation', 'community_events'],
    audience: ['general_public'],
    founded: 2019,
    peopleReached: 4200,
    itemsRepaired: null,
    co2SavedT: 0,
    materialsDivertedKg: 0,
    socialCohesionScore: 84,
    sdgAlignment: [4, 10, 11, 16],
    keywords: ['oral memory', 'storytelling', 'intangible heritage', 'Geneva'],
    climateLink:
      'Reduces reliance on energy-intensive media production; preserves low-carbon knowledge-transfer practices.',
    website: 'https://histoiresanschute.ch',
    featured: true,
    published: true,
  },
  {
    slug: 'amak-bro',
    name: 'Amak bro',
    tagline: 'Repair and recraft as a social project.',
    description:
      'Geneva collective practising traditional repair, reuse, and re-craft. Diverts textiles and household objects from landfill while transmitting hand-skill knowledge across generations.',
    city: 'Geneva',
    region: null,
    street: null,
    country: 'Switzerland',
    lat: 46.2018,
    lng: 6.1466,
    domain: 'craftsmanship',
    repairSector: 'textile',
    repairCategories: ['textiles'],
    orgTypes: ['community_group'],
    activities: ['repair_services', 'repair_workshops', 'upcycling'],
    audience: ['general_public'],
    founded: 2021,
    peopleReached: 1800,
    itemsRepaired: 940,
    co2SavedT: 12.4,
    materialsDivertedKg: 1620,
    socialCohesionScore: 78,
    sdgAlignment: [11, 12, 13],
    keywords: ['textile repair', 'upcycling', 'craftsmanship', 'Geneva', 'slow fashion'],
    climateLink: 'Each repaired garment avoids ~3.2 kg CO2e versus replacement; preserves slow-craft knowledge.',
    website: 'https://amakbro.ch',
    featured: true,
    published: true,
  },
];

async function main() {
  for (const initiative of initiatives) {
    await prisma.initiative.upsert({
      where: { slug: initiative.slug },
      update: initiative,
      create: initiative,
    });
    console.log(`Seeded: ${initiative.name}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
