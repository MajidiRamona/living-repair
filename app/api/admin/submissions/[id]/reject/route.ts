import { NextResponse } from 'next/server';
import { getSubmission, rejectSubmission } from '@/lib/submissions';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = await getSubmission(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const reason = typeof body?.reason === 'string' ? body.reason : undefined;

  const submission = await rejectSubmission(id, reason);
  return NextResponse.json(submission);
}
