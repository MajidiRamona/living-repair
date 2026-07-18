import { sealData, unsealData } from 'iron-session';
import { cookies } from 'next/headers';

export const COOKIE_NAME = 'lr_admin_session';
export const TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

type SessionData = { isAdmin: boolean; issuedAt: number };

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error('SESSION_SECRET must be set to a random string of at least 32 characters');
  }
  return s;
}

export async function createSessionCookie(): Promise<string> {
  return sealData({ isAdmin: true, issuedAt: Date.now() } satisfies SessionData, {
    password: secret(),
    ttl: TTL_SECONDS,
  });
}

export async function readSession(cookieValue: string | undefined): Promise<SessionData | null> {
  if (!cookieValue) return null;
  try {
    const data = await unsealData<SessionData>(cookieValue, { password: secret() });
    return data?.isAdmin ? data : null;
  } catch {
    return null;
  }
}

/** Server-component / route-handler helper: throws if not logged in. */
export async function requireAdmin(): Promise<void> {
  const jar = await cookies();
  const session = await readSession(jar.get(COOKIE_NAME)?.value);
  if (!session) {
    throw new Error('Unauthorized');
  }
}
