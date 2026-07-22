import { NextResponse } from 'next/server';
import { approveSchema } from '@/lib/validation/submission';
import { approveSubmission, ApprovalValidationError, ConsentDeclinedError } from '@/lib/submissions';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = approveSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const initiative = await approveSubmission(id, parsed.data);
    return NextResponse.json(initiative, { status: 201 });
  } catch (err) {
    if (err instanceof ConsentDeclinedError) {
      return NextResponse.json({ error: err.message }, { status: 403 });
    }
    if (err instanceof ApprovalValidationError) {
      return NextResponse.json({ error: err.message, fields: err.fields }, { status: 422 });
    }
    if (err instanceof Error && err.message === 'Submission not found') {
      return NextResponse.json({ error: err.message }, { status: 404 });
    }
    throw err;
  }
}
