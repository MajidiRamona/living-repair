import { NextResponse } from 'next/server';
import { getPublishedInitiatives } from '@/lib/initiatives';

export async function GET() {
  const initiatives = await getPublishedInitiatives();
  return NextResponse.json({ initiatives });
}
