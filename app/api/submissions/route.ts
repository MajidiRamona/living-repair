import { NextResponse } from 'next/server';
import { submissionSchema } from '@/lib/validation/submission';
import { createSubmission } from '@/lib/submissions';
import { saveUploadedPhoto } from '@/lib/uploads';
import { clientIp, isRateLimited } from '@/lib/rateLimit';

export async function POST(req: Request) {
  if (isRateLimited(`submit:${clientIp(req)}`, 5, 60 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many submissions from this network — please try again later.' }, { status: 429 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: 'Expected multipart/form-data' }, { status: 400 });
  }

  let raw: unknown;
  try {
    raw = JSON.parse(String(form.get('data') ?? '{}'));
  } catch {
    return NextResponse.json({ error: 'Invalid JSON in "data" field' }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.honeypot) {
    // Silently accept to avoid tipping off bots.
    return NextResponse.json({ ok: true });
  }

  const file = form.get('photo');
  let photoPath: string | null = null;
  if (file instanceof File && file.size > 0) {
    try {
      photoPath = await saveUploadedPhoto(file);
    } catch (err) {
      return NextResponse.json({ error: (err as Error).message }, { status: 400 });
    }
  }

  const submission = await createSubmission(parsed.data, photoPath);
  return NextResponse.json({ id: submission.id }, { status: 201 });
}
