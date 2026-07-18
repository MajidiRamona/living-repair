import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createSessionCookie, COOKIE_NAME, TTL_SECONDS } from '@/lib/session';
import { clientIp, isRateLimited } from '@/lib/rateLimit';

export async function POST(req: Request) {
  if (isRateLimited(`login:${clientIp(req)}`, 10, 15 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many login attempts — please try again later.' }, { status: 429 });
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    return NextResponse.json({ error: 'Admin login is not configured' }, { status: 500 });
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const ok = typeof body.password === 'string' && (await bcrypt.compare(body.password, hash));
  if (!ok) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, await createSessionCookie(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: TTL_SECONDS,
  });
  return res;
}
