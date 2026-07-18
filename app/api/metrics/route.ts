import { NextResponse } from 'next/server';
import { getMetrics } from '@/lib/initiatives';

export async function GET() {
  const metrics = await getMetrics();
  return NextResponse.json(metrics);
}
