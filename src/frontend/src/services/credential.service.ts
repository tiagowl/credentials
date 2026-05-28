import { Category, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { encryptToStorage, decryptFromStorage } from '@/lib/crypto';
import { calculatePasswordStrength } from '@/lib/password-strength';
import { getFaviconUrl, suggestCategory } from '@/lib/constants';
import type { CreateCredentialInput, UpdateCredentialInput } from '@/lib/validators/schemas';
import type { CredentialDTO, CustomField, CredentialListItem, PaginatedCredentials } from '@/types';
import { AppError } from '@/lib/api-error';

export interface CredentialFilters {
  search?: string;
  appName?: string;
  userEmail?: string;
  username?: string;
  email?: string;
  category?: Category;
  favorite?: boolean;
  sort?: string;
  limit?: number;
  offset?: number;
}

function parseCustomFields(
  enc: string | null,
  iv: string | null,
  vaultKey: Buffer
): CustomField[] {
  if (!enc || !iv) return [];
  try {
    const json = decryptFromStorage(enc, iv, vaultKey);
    return JSON.parse(json) as CustomField[];
  } catch {
    return [];
  }
}

function toDTO(
  row: {
    id: string;
    appName: string;
    username: string | null;
    email: string | null;
    passwordEnc: string;
    passwordIv: string;
    url: string | null;
    category: Category;
    iconUrl: string | null;
    isFavorite: boolean;
    customFieldsEnc: string | null;
    customFieldsIv: string | null;
    passwordStrength: number;
    createdAt: Date;
    updatedAt: Date;
  },
  vaultKey: Buffer,
  includePassword = true
): CredentialDTO {
  const password = includePassword
    ? decryptFromStorage(row.passwordEnc, row.passwordIv, vaultKey)
    : '••••••••';

  return {
    id: row.id,
    appName: row.appName,
    username: row.username,
    email: row.email,
    password,
    url: row.url,
    category: row.category,
    iconUrl: row.iconUrl ?? getFaviconUrl(row.appName, row.url),
    isFavorite: row.isFavorite,
    customFields: parseCustomFields(row.customFieldsEnc, row.customFieldsIv, vaultKey),
    passwordStrength: row.passwordStrength,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function buildWhere(
  userId: string,
  filters: CredentialFilters
): Prisma.CredentialWhereInput {
  const insensitive = { mode: 'insensitive' as const };
  const and: Prisma.CredentialWhereInput[] = [{ userId }];

  if (filters.search) {
    and.push({
      OR: [
        { appName: { contains: filters.search, ...insensitive } },
        { username: { contains: filters.search, ...insensitive } },
        { email: { contains: filters.search, ...insensitive } },
        { url: { contains: filters.search, ...insensitive } },
      ],
    });
  }
  if (filters.userEmail) {
    and.push({
      OR: [
        { username: { contains: filters.userEmail, ...insensitive } },
        { email: { contains: filters.userEmail, ...insensitive } },
      ],
    });
  }
  if (filters.appName) and.push({ appName: { contains: filters.appName, ...insensitive } });
  if (filters.username) and.push({ username: { contains: filters.username, ...insensitive } });
  if (filters.email) and.push({ email: { contains: filters.email, ...insensitive } });
  if (filters.category) and.push({ category: filters.category });
  if (filters.favorite) and.push({ isFavorite: true });

  return and.length ? { AND: and } : {};
}

export async function listCredentials(
  userId: string,
  filters: CredentialFilters,
  vaultKey: Buffer
): Promise<CredentialListItem[]> {
  const orderBy: Prisma.CredentialOrderByWithRelationInput =
    filters.sort === 'appName'
      ? { appName: 'asc' }
      : filters.sort === 'createdAt'
        ? { createdAt: 'desc' }
        : { updatedAt: 'desc' };

  const rows = await prisma.credential.findMany({
    where: buildWhere(userId, filters),
    orderBy,
    take: filters.limit ?? 100,
    skip: filters.offset ?? 0,
  });

  return rows.map((r) => toDTO(r, vaultKey));
}

export async function listCredentialsPaginated(
  userId: string,
  filters: CredentialFilters,
  vaultKey: Buffer
): Promise<PaginatedCredentials> {
  const where = buildWhere(userId, filters);
  const orderBy: Prisma.CredentialOrderByWithRelationInput =
    filters.sort === 'appName'
      ? { appName: 'asc' }
      : filters.sort === 'createdAt'
        ? { createdAt: 'desc' }
        : { updatedAt: 'desc' };

  const take = Math.max(1, Math.min(100, filters.limit ?? 6));
  const skip = Math.max(0, filters.offset ?? 0);

  const [rows, total] = await Promise.all([
    prisma.credential.findMany({
      where,
      orderBy,
      take,
      skip,
    }),
    prisma.credential.count({ where }),
  ]);

  return {
    items: rows.map((r) => toDTO(r, vaultKey)),
    total,
    limit: take,
    offset: skip,
  };
}

export async function getCredential(
  userId: string,
  id: string,
  vaultKey: Buffer
): Promise<CredentialDTO> {
  const row = await prisma.credential.findFirst({ where: { id, userId } });
  if (!row) throw new AppError('NOT_FOUND', 'Credencial não encontrada', 404);
  return toDTO(row, vaultKey);
}

export async function createCredential(
  userId: string,
  input: CreateCredentialInput,
  vaultKey: Buffer
): Promise<CredentialDTO> {
  const strength = calculatePasswordStrength(input.password);
  const { enc, iv } = encryptToStorage(input.password, vaultKey);

  let customEnc: string | null = null;
  let customIv: string | null = null;
  if (input.customFields?.length) {
    const stored = encryptToStorage(JSON.stringify(input.customFields), vaultKey);
    customEnc = stored.enc;
    customIv = stored.iv;
  }

  const category = input.category ?? suggestCategory(input.appName);
  const iconUrl = input.iconUrl ?? getFaviconUrl(input.appName, input.url ?? undefined);

  const row = await prisma.credential.create({
    data: {
      userId,
      appName: input.appName,
      username: input.username || null,
      email: input.email || null,
      passwordEnc: enc,
      passwordIv: iv,
      url: input.url || null,
      category,
      iconUrl,
      isFavorite: input.isFavorite ?? false,
      customFieldsEnc: customEnc,
      customFieldsIv: customIv,
      passwordStrength: strength,
      passwordHistory: {
        create: { strength },
      },
    },
  });

  return toDTO(row, vaultKey);
}

export async function updateCredential(
  userId: string,
  id: string,
  input: UpdateCredentialInput,
  vaultKey: Buffer
): Promise<CredentialDTO> {
  const existing = await prisma.credential.findFirst({ where: { id, userId } });
  if (!existing) throw new AppError('NOT_FOUND', 'Credencial não encontrada', 404);

  const data: Prisma.CredentialUpdateInput = {};

  if (input.appName !== undefined) data.appName = input.appName;
  if (input.username !== undefined) data.username = input.username || null;
  if (input.email !== undefined) data.email = input.email || null;
  if (input.url !== undefined) data.url = input.url || null;
  if (input.category !== undefined) data.category = input.category;
  if (input.isFavorite !== undefined) data.isFavorite = input.isFavorite;
  if (input.iconUrl !== undefined) data.iconUrl = input.iconUrl;

  if (input.password) {
    const strength = calculatePasswordStrength(input.password);
    const { enc, iv } = encryptToStorage(input.password, vaultKey);
    data.passwordEnc = enc;
    data.passwordIv = iv;
    data.passwordStrength = strength;
    data.passwordHistory = { create: { strength } };
  }

  if (input.customFields !== undefined) {
    if (input.customFields.length === 0) {
      data.customFieldsEnc = null;
      data.customFieldsIv = null;
    } else {
      const stored = encryptToStorage(JSON.stringify(input.customFields), vaultKey);
      data.customFieldsEnc = stored.enc;
      data.customFieldsIv = stored.iv;
    }
  }

  const row = await prisma.credential.update({ where: { id }, data });
  return toDTO(row, vaultKey);
}

export async function deleteCredential(userId: string, id: string): Promise<void> {
  const existing = await prisma.credential.findFirst({ where: { id, userId } });
  if (!existing) throw new AppError('NOT_FOUND', 'Credencial não encontrada', 404);
  await prisma.credential.delete({ where: { id } });
}

export async function toggleFavorite(
  userId: string,
  id: string,
  vaultKey: Buffer
): Promise<CredentialDTO> {
  const existing = await prisma.credential.findFirst({ where: { id, userId } });
  if (!existing) throw new AppError('NOT_FOUND', 'Credencial não encontrada', 404);
  const row = await prisma.credential.update({
    where: { id },
    data: { isFavorite: !existing.isFavorite },
  });
  return toDTO(row, vaultKey);
}

export async function getPasswordHistory(credentialId: string) {
  return prisma.passwordHistory.findMany({
    where: { credentialId },
    orderBy: { changedAt: 'desc' },
    take: 10,
  });
}

export { toDTO };
