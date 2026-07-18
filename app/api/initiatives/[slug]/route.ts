import { NextResponse } from 'next/server';
import { getPublishedInitiativeBySlug } from '@/lib/initiatives';

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const initiative = await getPublishedInitiativeBySlug(slug);
  if (!initiative) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(initiative);
}
