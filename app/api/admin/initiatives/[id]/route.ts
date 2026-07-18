import { NextResponse } from 'next/server';
import { getInitiativeById, updateInitiative, deleteInitiative } from '@/lib/adminInitiatives';
import { deleteUploadedFile } from '@/lib/uploads';
import { initiativePatchSchema } from '@/lib/validation/submission';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const initiative = await getInitiativeById(id);
  if (!initiative) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(initiative);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const existing = await getInitiativeById(id);
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const raw = await req.json().catch(() => null);
  if (!raw || typeof raw !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = initiativePatchSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const updated = await updateInitiative(id, parsed.data);
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const hard = searchParams.get('hard') === 'true';

  const initiative = await getInitiativeById(id);
  if (!initiative) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  if (hard) {
    await deleteInitiative(id);
    if (initiative.photoPath) await deleteUploadedFile(initiative.photoPath);
  } else {
    await updateInitiative(id, { published: false });
  }
  return NextResponse.json({ ok: true });
}
