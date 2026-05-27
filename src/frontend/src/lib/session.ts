import crypto from 'crypto';

const SESSION_COOKIE = 'vault_session';
const SESSION_MAX_AGE = 60 * 60 * 24; // 24h cookie, idle timeout handled client-side

export interface SessionData {
  sessionId: string;
  vaultKeyB64: string;
  expiresAt: number;
}

type SessionStore = Map<string, { vaultKey: Buffer; expiresAt: number }>;

const globalSession = globalThis as typeof globalThis & {
  __vaultSessionStore?: SessionStore;
};

const sessionStore: SessionStore =
  globalSession.__vaultSessionStore ?? new Map<string, { vaultKey: Buffer; expiresAt: number }>();

if (!globalSession.__vaultSessionStore) {
  globalSession.__vaultSessionStore = sessionStore;
}

async function getCookieStore() {
  const { cookies } = await import('next/headers');
  return cookies();
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET must be at least 32 characters');
  }
  return secret;
}

function sign(value: string): string {
  return crypto.createHmac('sha256', getSessionSecret()).update(value).digest('hex');
}

export function createSession(vaultKey: Buffer, timeoutMinutes = 15): SessionData {
  const sessionId = crypto.randomUUID();
  const expiresAt = Date.now() + timeoutMinutes * 60 * 1000;
  sessionStore.set(sessionId, { vaultKey, expiresAt });
  return {
    sessionId,
    vaultKeyB64: vaultKey.toString('base64'),
    expiresAt,
  };
}

export function getSessionVaultKey(sessionId: string): Buffer | null {
  const session = sessionStore.get(sessionId);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessionStore.delete(sessionId);
    return null;
  }
  return session.vaultKey;
}

export function refreshSession(sessionId: string, timeoutMinutes: number): boolean {
  const session = sessionStore.get(sessionId);
  if (!session) return false;
  session.expiresAt = Date.now() + timeoutMinutes * 60 * 1000;
  return true;
}

export function destroySession(sessionId: string): void {
  sessionStore.delete(sessionId);
}

export function serializeSessionCookie(sessionId: string): string {
  const signature = sign(sessionId);
  return `${sessionId}.${signature}`;
}

export function parseSessionCookie(value: string): string | null {
  const [sessionId, signature] = value.split('.');
  if (!sessionId || !signature) return null;
  if (sign(sessionId) !== signature) return null;
  return sessionId;
}

export async function setSessionCookie(sessionId: string): Promise<void> {
  const cookieStore = await getCookieStore();
  cookieStore.set(SESSION_COOKIE, serializeSessionCookie(sessionId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await getCookieStore();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionFromCookies(): Promise<{
  sessionId: string;
  vaultKey: Buffer;
} | null> {
  const cookieStore = await getCookieStore();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const sessionId = parseSessionCookie(raw);
  if (!sessionId) return null;
  const vaultKey = getSessionVaultKey(sessionId);
  if (!vaultKey) return null;
  return { sessionId, vaultKey };
}

export async function requireSession(): Promise<{ sessionId: string; vaultKey: Buffer }> {
  const session = await getSessionFromCookies();
  if (!session) {
    throw new SessionError('Unauthorized');
  }
  return session;
}

export class SessionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SessionError';
  }
}

export { SESSION_COOKIE };
