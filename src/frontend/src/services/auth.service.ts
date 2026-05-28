import { prisma } from '@/lib/prisma';
import {
  hashMasterPassword,
  verifyMasterPassword,
  deriveVaultKey,
  encryptToStorage,
  decryptFromStorage,
  getEncryptionSalt,
} from '@/lib/crypto';
import {
  createSessionPayload,
  clearSessionCookie,
  getSessionFromCookies,
  extendSessionCookie,
  type SessionPayload,
} from '@/lib/session';
import { AppError } from '@/lib/api-error';
import crypto from 'crypto';

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

async function findUserById(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('NOT_FOUND', 'Conta não encontrada', 404);
  return user;
}

export async function getVaultStatus(): Promise<{
  configured: boolean;
  registrationOpen: boolean;
}> {
  const count = await prisma.user.count();
  return {
    configured: count > 0,
    registrationOpen: true,
  };
}

export async function registerVault(
  email: string,
  password: string,
  displayName?: string
): Promise<{ success: true; payload: SessionPayload }> {
  const normalizedEmail = normalizeEmail(email);

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (existing) {
    throw new AppError('CONFLICT', 'Este email já está cadastrado', 409);
  }

  const encryptionSalt = crypto.randomBytes(16).toString('hex');
  const masterPasswordHash = await hashMasterPassword(password);

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      displayName: displayName?.trim() || null,
      masterPasswordHash,
      encryptionSalt,
      sessionTimeout: parseInt(process.env.DEFAULT_SESSION_TIMEOUT ?? '15', 10),
    },
  });

  const vaultKey = deriveVaultKey(password, encryptionSalt);
  const payload = createSessionPayload(vaultKey, user.id, user.sessionTimeout);
  return { success: true, payload };
}

export async function setupVault(
  email: string,
  password: string,
  displayName?: string
) {
  return registerVault(email, password, displayName);
}

export async function login(
  email: string,
  password: string
): Promise<{ success: true; payload: SessionPayload }> {
  const user = await prisma.user.findUnique({
    where: { email: normalizeEmail(email) },
  });
  if (!user) {
    throw new AppError('UNAUTHORIZED', 'Email ou senha incorretos', 401);
  }

  const valid = await verifyMasterPassword(password, user.masterPasswordHash);
  if (!valid) {
    throw new AppError('UNAUTHORIZED', 'Email ou senha incorretos', 401);
  }

  const vaultKey = deriveVaultKey(password, user.encryptionSalt);
  const payload = createSessionPayload(vaultKey, user.id, user.sessionTimeout);
  return { success: true, payload };
}

export async function logout() {
  await clearSessionCookie();
  return { success: true };
}

export async function lockVault() {
  return logout();
}

export async function getAccountProfile(userId: string) {
  const user = await findUserById(userId);
  return {
    email: user.email,
    displayName: user.displayName,
    hasEmail: true,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function updateAccountProfile(
  userId: string,
  data: { email?: string; displayName?: string | null }
) {
  const user = await findUserById(userId);

  let email = user.email;
  if (data.email !== undefined) {
    const normalized = normalizeEmail(data.email);
    const taken = await prisma.user.findFirst({
      where: { email: normalized, NOT: { id: user.id } },
    });
    if (taken) {
      throw new AppError('CONFLICT', 'Este email já está em uso', 409);
    }
    email = normalized;
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      email: data.email !== undefined ? email : undefined,
      displayName:
        data.displayName !== undefined
          ? data.displayName?.trim() || null
          : undefined,
    },
  });

  return {
    email: updated.email,
    displayName: updated.displayName,
    hasEmail: true,
    createdAt: updated.createdAt.toISOString(),
  };
}

export async function changeMasterPassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
  vaultKey: Buffer
): Promise<{ success: true; payload: SessionPayload }> {
  const user = await findUserById(userId);

  const valid = await verifyMasterPassword(
    currentPassword,
    user.masterPasswordHash
  );
  if (!valid) {
    throw new AppError('UNAUTHORIZED', 'Senha mestra atual incorreta', 401);
  }

  const newKey = deriveVaultKey(newPassword, user.encryptionSalt);
  const credentials = await prisma.credential.findMany({ where: { userId } });

  await prisma.$transaction(async (tx) => {
    for (const cred of credentials) {
      const password = decryptFromStorage(
        cred.passwordEnc,
        cred.passwordIv,
        vaultKey
      );
      const { enc, iv } = encryptToStorage(password, newKey);

      let customFieldsEnc = cred.customFieldsEnc;
      let customFieldsIv = cred.customFieldsIv;
      if (cred.customFieldsEnc && cred.customFieldsIv) {
        const customJson = decryptFromStorage(
          cred.customFieldsEnc,
          cred.customFieldsIv,
          vaultKey
        );
        const reenc = encryptToStorage(customJson, newKey);
        customFieldsEnc = reenc.enc;
        customFieldsIv = reenc.iv;
      }

      await tx.credential.update({
        where: { id: cred.id },
        data: {
          passwordEnc: enc,
          passwordIv: iv,
          customFieldsEnc,
          customFieldsIv,
        },
      });
    }

    await tx.user.update({
      where: { id: user.id },
      data: {
        masterPasswordHash: await hashMasterPassword(newPassword),
      },
    });
  });

  const payload = createSessionPayload(newKey, user.id, user.sessionTimeout);
  return { success: true, payload };
}

export async function getVaultConfig(userId: string) {
  const user = await findUserById(userId);
  return {
    sessionTimeout: user.sessionTimeout,
    theme: user.theme,
    accentColor: user.accentColor,
  };
}

export async function updateVaultConfig(
  userId: string,
  data: {
    sessionTimeout?: number;
    theme?: 'LIGHT' | 'DARK' | 'SYSTEM';
    accentColor?: string;
  }
) {
  const user = await findUserById(userId);

  const updated = await prisma.user.update({
    where: { id: user.id },
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
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { sessionTimeout: true },
  });
  const timeout = user?.sessionTimeout ?? 15;
  return extendSessionCookie(timeout);
}

export { getEncryptionSalt };
