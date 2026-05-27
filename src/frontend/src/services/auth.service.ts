import { prisma } from '@/lib/prisma';
import {
  hashMasterPassword,
  verifyMasterPassword,
  deriveVaultKey,
  getEncryptionSalt,
} from '@/lib/crypto';
import {
  createSession,
  setSessionCookie,
  clearSessionCookie,
  destroySession,
  getSessionFromCookies,
  refreshSession,
} from '@/lib/session';
import { AppError } from '@/lib/api-error';
import crypto from 'crypto';

export async function getVaultStatus(): Promise<{ configured: boolean }> {
  const config = await prisma.vaultConfig.findFirst();
  return { configured: !!config };
}

export async function setupVault(password: string) {
  const existing = await prisma.vaultConfig.findFirst();
  if (existing) {
    throw new AppError('CONFLICT', 'Vault já configurado', 409);
  }

  const encryptionSalt = crypto.randomBytes(16).toString('hex');
  const masterPasswordHash = await hashMasterPassword(password);

  await prisma.vaultConfig.create({
    data: {
      masterPasswordHash,
      encryptionSalt,
      sessionTimeout: parseInt(process.env.DEFAULT_SESSION_TIMEOUT ?? '15', 10),
    },
  });

  const vaultKey = deriveVaultKey(password, encryptionSalt);
  const session = createSession(vaultKey, 15);
  await setSessionCookie(session.sessionId);

  return { success: true };
}

export async function login(password: string) {
  const config = await prisma.vaultConfig.findFirst();
  if (!config) {
    throw new AppError('NOT_FOUND', 'Vault não configurado', 404);
  }

  const valid = await verifyMasterPassword(password, config.masterPasswordHash);
  if (!valid) {
    throw new AppError('UNAUTHORIZED', 'Senha incorreta', 401);
  }

  const vaultKey = deriveVaultKey(password, config.encryptionSalt);
  const session = createSession(vaultKey, config.sessionTimeout);
  await setSessionCookie(session.sessionId);

  return { success: true };
}

export async function logout() {
  const session = await getSessionFromCookies();
  if (session) {
    destroySession(session.sessionId);
  }
  await clearSessionCookie();
  return { success: true };
}

export async function lockVault() {
  return logout();
}

export async function getVaultConfig() {
  const config = await prisma.vaultConfig.findFirst();
  if (!config) throw new AppError('NOT_FOUND', 'Vault não configurado', 404);
  return {
    sessionTimeout: config.sessionTimeout,
    theme: config.theme,
    accentColor: config.accentColor,
  };
}

export async function updateVaultConfig(data: {
  sessionTimeout?: number;
  theme?: 'LIGHT' | 'DARK' | 'SYSTEM';
  accentColor?: string;
}) {
  const config = await prisma.vaultConfig.findFirst();
  if (!config) throw new AppError('NOT_FOUND', 'Vault não configurado', 404);

  const updated = await prisma.vaultConfig.update({
    where: { id: config.id },
    data,
  });

  return {
    sessionTimeout: updated.sessionTimeout,
    theme: updated.theme,
    accentColor: updated.accentColor,
  };
}

export async function refreshSessionActivity() {
  const session = await getSessionFromCookies();
  if (!session) return false;
  const config = await prisma.vaultConfig.findFirst();
  const timeout = config?.sessionTimeout ?? 15;
  return refreshSession(session.sessionId, timeout);
}

export { getEncryptionSalt };
