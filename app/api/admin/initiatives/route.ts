import { NextResponse } from 'next/server';
import { listAllInitiatives } from '@/lib/adminInitiatives';

export async function GET() {
  const initiatives = await listAllInitiatives();
  return NextResponse.json({ initiatives });
}
