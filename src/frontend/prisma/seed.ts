import { PrismaClient, Category } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const SEED_SALT = 'credentials-vault-seed-salt-2026';
const MASTER_PASSWORD = 'Master123!';
const VAULT_ID = '00000000-0000-0000-0000-000000000001';

function deriveVaultKey(password: string): Buffer {
  return crypto.pbkdf2Sync(password, SEED_SALT, 100_000, 32, 'sha256');
}

function encryptToStorage(plaintext: string, vaultKey: Buffer) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', vaultKey, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return {
    enc: JSON.stringify({
      c: encrypted.toString('base64'),
      t: authTag.toString('base64'),
    }),
    iv: iv.toString('base64'),
  };
}

function strength(password: string): number {
  let score = 0;
  if (password.length >= 8) score += 30;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 20;
  if (/[^a-zA-Z0-9]/.test(password)) score += 30;
  return Math.min(100, score);
}

function sqlEscape(s: string): string {
  return s.replace(/'/g, "''");
}

const SAMPLE_CREDENTIALS = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    appName: 'YouTube',
    username: 'tiago.dev',
    email: 'tiago@gmail.com',
    password: 'Yt#Str0ng!2024Pass',
    url: 'https://youtube.com',
    category: 'STREAMING' as Category,
    isFavorite: true,
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    appName: 'Facebook',
    username: 'tiago.silva',
    email: 'tiago.silva@email.com',
    password: 'Fb@Secure99!',
    url: 'https://facebook.com',
    category: 'SOCIAL' as Category,
    isFavorite: true,
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    appName: 'Twitter',
    username: '@tiago_dev',
    email: 'tiago@twitter.com',
    password: '123456',
    url: 'https://twitter.com',
    category: 'SOCIAL' as Category,
    isFavorite: false,
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    appName: 'Gmail',
    username: 'tiago',
    email: 'tiago@gmail.com',
    password: 'Gm@ilP@ss2024!Secure',
    url: 'https://gmail.com',
    category: 'EMAIL' as Category,
    isFavorite: true,
  },
  {
    id: '10000000-0000-0000-0000-000000000005',
    appName: 'Netflix',
    username: 'tiago@email.com',
    email: 'tiago@email.com',
    password: 'Nx$Watch2024!',
    url: 'https://netflix.com',
    category: 'STREAMING' as Category,
    isFavorite: false,
  },
  {
    id: '10000000-0000-0000-0000-000000000006',
    appName: 'GitHub',
    username: 'tiagodev',
    email: 'dev@github.com',
    password: 'Gh#C0de2024!Dev',
    url: 'https://github.com',
    category: 'WORK' as Category,
    isFavorite: true,
  },
  {
    id: '10000000-0000-0000-0000-000000000007',
    appName: 'Nubank',
    username: '123.456.789-00',
    email: 'tiago@email.com',
    password: 'Nu$B@nk2024!',
    url: 'https://nubank.com.br',
    category: 'BANKING' as Category,
    isFavorite: false,
    customFields: [{ label: 'PIN', value: '1234', type: 'pin' }],
  },
  {
    id: '10000000-0000-0000-0000-000000000008',
    appName: 'Spotify',
    username: 'tiago_spotify',
    email: 'tiago@spotify.com',
    password: '123456',
    url: 'https://spotify.com',
    category: 'STREAMING' as Category,
    isFavorite: false,
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  await prisma.passwordHistory.deleteMany();
  await prisma.credential.deleteMany();
  await prisma.vaultConfig.deleteMany();

  const masterPasswordHash = await bcrypt.hash(MASTER_PASSWORD, 12);
  const vaultKey = deriveVaultKey(MASTER_PASSWORD);

  await prisma.vaultConfig.create({
    data: {
      id: VAULT_ID,
      masterPasswordHash,
      encryptionSalt: SEED_SALT,
      sessionTimeout: 15,
      theme: 'SYSTEM',
      accentColor: 'blue',
    },
  });

  const sqlLines: string[] = [
    '-- Credentials Vault — Dados de teste gerados automaticamente',
    '-- Senha mestra: Master123!',
    '-- Salt: credentials-vault-seed-salt-2026',
    '',
    'DELETE FROM "PasswordHistory";',
    'DELETE FROM "Credential";',
    'DELETE FROM "VaultConfig";',
    '',
    `INSERT INTO "VaultConfig" ("id", "masterPasswordHash", "encryptionSalt", "sessionTimeout", "theme", "accentColor", "createdAt", "updatedAt") VALUES (`,
    `  '${VAULT_ID}',`,
    `  '${sqlEscape(masterPasswordHash)}',`,
    `  '${SEED_SALT}',`,
    `  15, 'SYSTEM'::"Theme", 'blue', NOW(), NOW());`,
    '',
  ];

  let historyIdx = 1;

  for (const cred of SAMPLE_CREDENTIALS) {
    const { enc, iv } = encryptToStorage(cred.password, vaultKey);
    const str = strength(cred.password);

    let customEnc: string | null = null;
    let customIv: string | null = null;
    if (cred.customFields?.length) {
      const stored = encryptToStorage(JSON.stringify(cred.customFields), vaultKey);
      customEnc = stored.enc;
      customIv = stored.iv;
    }

    const iconUrl = `https://www.google.com/s2/favicons?domain=${cred.url.replace('https://', '')}&sz=64`;

    await prisma.credential.create({
      data: {
        id: cred.id,
        appName: cred.appName,
        username: cred.username,
        email: cred.email,
        passwordEnc: enc,
        passwordIv: iv,
        url: cred.url,
        category: cred.category,
        iconUrl,
        isFavorite: cred.isFavorite,
        customFieldsEnc: customEnc,
        customFieldsIv: customIv,
        passwordStrength: str,
        passwordHistory: {
          create: [{ strength: str }],
        },
      },
    });

    sqlLines.push(
      `INSERT INTO "Credential" ("id", "appName", "username", "email", "passwordEnc", "passwordIv", "url", "category", "iconUrl", "isFavorite", "customFieldsEnc", "customFieldsIv", "passwordStrength", "createdAt", "updatedAt") VALUES (`,
      `  '${cred.id}', '${sqlEscape(cred.appName)}', '${sqlEscape(cred.username)}', '${sqlEscape(cred.email)}',`,
      `  '${sqlEscape(enc)}', '${iv}', '${cred.url}', '${cred.category}'::"Category", '${iconUrl}',`,
      `  ${cred.isFavorite}, ${customEnc ? `'${sqlEscape(customEnc)}'` : 'NULL'}, ${customIv ? `'${customIv}'` : 'NULL'},`,
      `  ${str}, NOW(), NOW());`
    );

    const histId = `20000000-0000-0000-0000-${String(historyIdx).padStart(12, '0')}`;
    sqlLines.push(
      `INSERT INTO "PasswordHistory" ("id", "credentialId", "strength", "changedAt") VALUES (`,
      `  '${histId}', '${cred.id}', ${str}, NOW());`
    );
    historyIdx++;

    console.log(`  ✓ ${cred.appName}`);
  }

  const sqlPath = path.join(__dirname, 'seed.sql');
  fs.writeFileSync(sqlPath, sqlLines.join('\n'), 'utf8');
  console.log(`\n📄 seed.sql atualizado em ${sqlPath}`);
  console.log('\n✅ Seed complete!');
  console.log(`   Senha mestra: ${MASTER_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
