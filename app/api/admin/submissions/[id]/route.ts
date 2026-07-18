import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSubmission, deleteSubmission } from '@/lib/submissions';
import { deleteUploadedFile } from '@/lib/uploads';
import { submissionPatchSchema } from '@/lib/validation/submission';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const submission = await getSubmission(id);
  if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(submission);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const raw = await req.json().catch(() => null);
  if (!raw || typeof raw !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
  const existing = await getSubmission(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const parsed = submissionPatchSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await prisma.submission.update({ where: { id }, data: parsed.data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const submission = await getSubmission(id);
  if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  await deleteSubmission(id);
  if (submission.photoPath) {
    await deleteUploadedFile(submission.photoPath);
  }
  return NextResponse.json({ ok: true });
}
