import crypto from 'crypto';
import type { NextResponse } from 'next/server';

const SESSION_COOKIE = 'vault_session';
const SESSION_MAX_AGE = 60 * 60 * 24; // 24h cookie; idle timeout in payload.exp

export interface SessionPayload {
  sid: string;
  exp: number;
  vk: string;
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

function getSessionEncryptionKey(): Buffer {
  return crypto
    .createHmac('sha256', getSessionSecret())
    .update('vault-session-payload-v1')
    .digest();
}

function encryptPayload(payload: SessionPayload): string {
  const key = getSessionEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(payload), 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  const packed = JSON.stringify({
    iv: iv.toString('base64'),
    t: tag.toString('base64'),
    d: encrypted.toString('base64'),
  });
  return Buffer.from(packed, 'utf8').toString('base64url');
}

function decryptPayload(token: string): SessionPayload | null {
  try {
    const parsed = JSON.parse(
      Buffer.from(token, 'base64url').toString('utf8')
    ) as { iv: string; t: string; d: string };
    const key = getSessionEncryptionKey();
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      key,
      Buffer.from(parsed.iv, 'base64')
    );
    decipher.setAuthTag(Buffer.from(parsed.t, 'base64'));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(parsed.d, 'base64')),
      decipher.final(),
    ]);
    return JSON.parse(decrypted.toString('utf8')) as SessionPayload;
  } catch {
    return null;
  }
}

export function serializeSessionCookie(payload: SessionPayload): string {
  const encrypted = encryptPayload(payload);
  const signature = sign(encrypted);
  return `${encrypted}.${signature}`;
}

export function parseSessionCookie(value: string): SessionPayload | null {
  const lastDot = value.lastIndexOf('.');
  if (lastDot <= 0) return null;
  const encrypted = value.slice(0, lastDot);
  const signature = value.slice(lastDot + 1);
  if (!encrypted || !signature || sign(encrypted) !== signature) return null;
  return decryptPayload(encrypted);
}

export function createSessionPayload(
  vaultKey: Buffer,
  timeoutMinutes = 15
): SessionPayload {
  return {
    sid: crypto.randomUUID(),
    exp: Date.now() + timeoutMinutes * 60 * 1000,
    vk: vaultKey.toString('base64'),
  };
}

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE,
};

export function applySessionCookie(
  response: NextResponse,
  payload: SessionPayload
): void {
  response.cookies.set(
    SESSION_COOKIE,
    serializeSessionCookie(payload),
    SESSION_COOKIE_OPTIONS
  );
}

export async function setSessionCookie(payload: SessionPayload): Promise<void> {
  const cookieStore = await getCookieStore();
  cookieStore.set(
    SESSION_COOKIE,
    serializeSessionCookie(payload),
    SESSION_COOKIE_OPTIONS
  );
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
  const payload = parseSessionCookie(raw);
  if (!payload || Date.now() > payload.exp) return null;
  return {
    sessionId: payload.sid,
    vaultKey: Buffer.from(payload.vk, 'base64'),
  };
}

export async function extendSessionCookie(timeoutMinutes: number): Promise<boolean> {
  const cookieStore = await getCookieStore();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return false;
  const payload = parseSessionCookie(raw);
  if (!payload || Date.now() > payload.exp) return false;
  payload.exp = Date.now() + timeoutMinutes * 60 * 1000;
  await setSessionCookie(payload);
  return true;
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
