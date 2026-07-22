import { NextResponse } from 'next/server';
import { listSubmissions } from '@/lib/submissions';
import { toCsv } from '@/lib/csv';

const COLUMNS = [
  'id',
  'status',
  'createdAt',
  'reviewedAt',
  'publicationConsent',
  'name',
  'tagline',
  'description',
  'repairCategories',
  'repairCategoriesOtherText',
  'orgTypes',
  'orgTypesOtherText',
  'peopleInvolved',
  'activities',
  'activitiesOtherText',
  'knowledgeSkills',
  'heritageDimension',
  'challengesAndThreats',
  'needs',
  'needsOtherText',
  'contactName',
  'email',
  'website',
  'socialMedia',
  'street',
  'city',
  'region',
  'country',
  'lat',
  'lng',
  'audience',
  'photoPath',
  'videoUrl',
  'rejectionReason',
  'adminNotes',
];

export async function GET() {
  const submissions = await listSubmissions();
  const csv = toCsv(submissions as unknown as Record<string, unknown>[], COLUMNS);
  const filename = `submissions-${new Date().toISOString().slice(0, 10)}.csv`;

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
