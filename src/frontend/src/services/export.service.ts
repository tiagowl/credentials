import { prisma } from '@/lib/prisma';
import { encryptExport, decryptExport, verifyMasterPassword } from '@/lib/crypto';
import { listCredentials, createCredential } from './credential.service';
import type { CreateCredentialInput } from '@/lib/validators/schemas';
import type { ImportResult } from '@/types';
import { AppError } from '@/lib/api-error';

export async function exportVault(
  userId: string,
  format: 'json' | 'csv',
  masterPassword: string,
  vaultKey: Buffer
): Promise<{ data: string; filename: string; contentType: string }> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError('NOT_FOUND', 'Conta não encontrada', 404);

  const valid = await verifyMasterPassword(masterPassword, user.masterPasswordHash);
  if (!valid) throw new AppError('UNAUTHORIZED', 'Senha mestra incorreta', 401);

  const credentials = await listCredentials(userId, {}, vaultKey);

  if (format === 'csv') {
    const header = 'appName,username,email,password,url,category\n';
    const rows = credentials
      .map(
        (c) =>
          `"${c.appName}","${c.username ?? ''}","${c.email ?? ''}","${c.password}","${c.url ?? ''}","${c.category}"`
      )
      .join('\n');
    return {
      data: header + rows,
      filename: `vault-export-${Date.now()}.csv`,
      contentType: 'text/csv',
    };
  }

  const payload = JSON.stringify({
    version: 1,
    exportedAt: new Date().toISOString(),
    credentials: credentials.map(({ password, customFields, ...rest }) => ({
      ...rest,
      password,
      customFields,
    })),
  });

  const encrypted = encryptExport(payload, masterPassword);
  return {
    data: encrypted,
    filename: `vault-export-${Date.now()}.vault.json`,
    contentType: 'application/json',
  };
}

export async function importVault(
  userId: string,
  content: string,
  format: 'json' | 'csv',
  mode: 'merge' | 'replace',
  vaultKey: Buffer,
  masterPassword?: string
): Promise<ImportResult> {
  let items: CreateCredentialInput[] = [];

  if (format === 'json') {
    if (!masterPassword) {
      throw new AppError('VALIDATION_ERROR', 'Senha mestra obrigatória para JSON', 400);
    }
    try {
      const decrypted = decryptExport(content, masterPassword);
      const parsed = JSON.parse(decrypted) as {
        credentials: CreateCredentialInput[];
      };
      items = parsed.credentials;
    } catch {
      throw new AppError('VALIDATION_ERROR', 'Arquivo inválido ou senha incorreta', 400);
    }
  } else {
    const lines = content.trim().split('\n');
    const [, ...rows] = lines;
    for (const row of rows) {
      const match = row.match(/"([^"]*)","([^"]*)","([^"]*)","([^"]*)","([^"]*)","([^"]*)"/);
      if (match) {
        items.push({
          appName: match[1],
          username: match[2] || undefined,
          email: match[3] || undefined,
          password: match[4],
          url: match[5] || undefined,
          category: (match[6] as CreateCredentialInput['category']) || undefined,
        });
      }
    }
  }

  if (mode === 'replace') {
    await prisma.passwordHistory.deleteMany({
      where: { credential: { userId } },
    });
    await prisma.credential.deleteMany({ where: { userId } });
  }

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const item of items) {
    try {
      if (!item.appName || !item.password) {
        skipped++;
        continue;
      }
      if (mode === 'merge') {
        const existing = await prisma.credential.findFirst({
          where: {
            userId,
            appName: item.appName,
            username: item.username ?? undefined,
          },
        });
        if (existing) {
          skipped++;
          continue;
        }
      }
      await createCredential(userId, item, vaultKey);
      created++;
    } catch {
      errors++;
    }
  }

  return { created, skipped, errors };
}
