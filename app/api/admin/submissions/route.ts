import { NextResponse } from 'next/server';
import { listSubmissions } from '@/lib/submissions';
import type { SubmissionStatus } from '@prisma/client';

const VALID_STATUSES: SubmissionStatus[] = ['PENDING', 'APPROVED', 'REJECTED'];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const statusParam = searchParams.get('status')?.toUpperCase();
  const status = VALID_STATUSES.includes(statusParam as SubmissionStatus)
    ? (statusParam as SubmissionStatus)
    : undefined;

  const submissions = await listSubmissions(status);
  return NextResponse.json({ submissions });
}
