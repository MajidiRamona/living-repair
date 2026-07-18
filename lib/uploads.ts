import { randomUUID } from 'crypto';
import { mkdir, readFile, stat, writeFile, unlink } from 'fs/promises';
import path from 'path';

const ALLOWED: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const MAX_BYTES = 5 * 1024 * 1024; // 5MB

function uploadsRoot(): string {
  return process.env.UPLOADS_DIR ?? path.join(process.cwd(), 'uploads');
}

export async function saveUploadedPhoto(file: File): Promise<string> {
  if (!(file.type in ALLOWED)) {
    throw new Error('Unsupported file type — please upload a JPEG, PNG, or WebP image.');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('File too large — please upload an image under 5MB.');
  }

  const ext = ALLOWED[file.type];
  const bucket = new Date().toISOString().slice(0, 7); // YYYY-MM
  const filename = `${randomUUID()}.${ext}`;
  const dir = path.join(uploadsRoot(), bucket);
  await mkdir(dir, { recursive: true });

  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buf);

  return `${bucket}/${filename}`;
}

export async function readUploadedFile(relativePath: string): Promise<Buffer> {
  const root = uploadsRoot();
  const full = path.normalize(path.join(root, relativePath));
  if (!full.startsWith(path.normalize(root))) {
    throw new Error('Invalid path');
  }
  await stat(full);
  return readFile(full);
}

export async function deleteUploadedFile(relativePath: string): Promise<void> {
  const root = uploadsRoot();
  const full = path.normalize(path.join(root, relativePath));
  if (!full.startsWith(path.normalize(root))) return;
  await unlink(full).catch(() => {});
}

const EXT_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

export function mimeForPath(relativePath: string): string {
  const ext = relativePath.split('.').pop()?.toLowerCase() ?? '';
  return EXT_TO_MIME[ext] ?? 'application/octet-stream';
}
