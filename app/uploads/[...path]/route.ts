import { NextResponse } from 'next/server';
import { readUploadedFile, mimeForPath } from '@/lib/uploads';

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params;
  const relativePath = segments.join('/');

  if (relativePath.includes('..')) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  try {
    const buf = await readUploadedFile(relativePath);
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        'Content-Type': mimeForPath(relativePath),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
