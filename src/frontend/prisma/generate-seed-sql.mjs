/**
 * Gera prisma/seed.sql com dados determinísticos (somente Node.js built-in).
 * Execute: node prisma/generate-seed-sql.mjs
 */
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SEED_SALT = 'credentials-vault-seed-salt-2026';
const MASTER_PASSWORD = 'Master123!';
const VAULT_ID = '00000000-0000-0000-0000-000000000001';
// bcrypt hash de Master123! (cost 12)
const MASTER_HASH =
  '$2b$12$u8lVfvboazk2td10NShw7.nXqZKLMf8ZaSAxVFM6r4pFyzu3Uo3GO';

const vaultKey = crypto.pbkdf2Sync(
  MASTER_PASSWORD,
  SEED_SALT,
  100_000,
  32,
  'sha256'
);

function encryptField(plaintext, ivSeed) {
  const iv = Buffer.alloc(12);
  Buffer.from(ivSeed).copy(iv, 0, 0, Math.min(12, ivSeed.length));
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

function esc(s) {
  return s.replace(/'/g, "''");
}

const CREDENTIALS = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    appName: 'YouTube',
    username: 'tiago.dev',
    email: 'tiago@gmail.com',
    password: 'Yt#Str0ng!2024Pass',
    url: 'https://youtube.com',
    category: 'STREAMING',
    isFavorite: 1,
    strength: 85,
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    appName: 'Facebook',
    username: 'tiago.silva',
    email: 'tiago.silva@email.com',
    password: 'Fb@Secure99!',
    url: 'https://facebook.com',
    category: 'SOCIAL',
    isFavorite: 1,
    strength: 80,
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    appName: 'Twitter',
    username: '@tiago_dev',
    email: 'tiago@twitter.com',
    password: '123456',
    url: 'https://twitter.com',
    category: 'SOCIAL',
    isFavorite: 0,
    strength: 20,
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    appName: 'Gmail',
    username: 'tiago',
    email: 'tiago@gmail.com',
    password: 'Gm@ilP@ss2024!Secure',
    url: 'https://gmail.com',
    category: 'EMAIL',
    isFavorite: 1,
    strength: 90,
  },
  {
    id: '10000000-0000-0000-0000-000000000005',
    appName: 'Netflix',
    username: 'tiago@email.com',
    email: 'tiago@email.com',
    password: 'Nx$Watch2024!',
    url: 'https://netflix.com',
    category: 'STREAMING',
    isFavorite: 0,
    strength: 85,
  },
  {
    id: '10000000-0000-0000-0000-000000000006',
    appName: 'GitHub',
    username: 'tiagodev',
    email: 'dev@github.com',
    password: 'Gh#C0de2024!Dev',
    url: 'https://github.com',
    category: 'WORK',
    isFavorite: 1,
    strength: 90,
  },
  {
    id: '10000000-0000-0000-0000-000000000007',
    appName: 'Nubank',
    username: '123.456.789-00',
    email: 'tiago@email.com',
    password: 'Nu$B@nk2024!',
    url: 'https://nubank.com.br',
    category: 'BANKING',
    isFavorite: 0,
    strength: 85,
    customFields: [{ label: 'PIN', value: '1234', type: 'pin' }],
  },
  {
    id: '10000000-0000-0000-0000-000000000008',
    appName: 'Spotify',
    username: 'tiago_spotify',
    email: 'tiago@spotify.com',
    password: '123456',
    url: 'https://spotify.com',
    category: 'STREAMING',
    isFavorite: 0,
    strength: 20,
  },
];

const lines = [
  '-- Credentials Vault — Dados de teste (SQL)',
  '-- Senha mestra: Master123!',
  '-- Salt: credentials-vault-seed-salt-2026',
  '-- Gerado por: node prisma/generate-seed-sql.mjs',
  '',
  'DELETE FROM "PasswordHistory";',
  'DELETE FROM "Credential";',
  'DELETE FROM "VaultConfig";',
  '',
  `INSERT INTO "VaultConfig" ("id", "masterPasswordHash", "encryptionSalt", "sessionTimeout", "theme", "accentColor", "createdAt", "updatedAt") VALUES (`,
  `  '${VAULT_ID}', '${esc(MASTER_HASH)}', '${SEED_SALT}', 15, 'SYSTEM'::"Theme", 'blue', NOW(), NOW());`,
  '',
];

let histIdx = 1;

for (const cred of CREDENTIALS) {
  const { enc, iv } = encryptField(cred.password, cred.id);
  let customEnc = 'NULL';
  let customIv = 'NULL';
  if (cred.customFields) {
    const cf = encryptField(JSON.stringify(cred.customFields), cred.id + 'cf');
    customEnc = `'${esc(cf.enc)}'`;
    customIv = `'${cf.iv}'`;
  }
  const icon = `https://www.google.com/s2/favicons?domain=${cred.url.replace('https://', '')}&sz=64`;

  lines.push(
    `INSERT INTO "Credential" ("id", "appName", "username", "email", "passwordEnc", "passwordIv", "url", "category", "iconUrl", "isFavorite", "customFieldsEnc", "customFieldsIv", "passwordStrength", "createdAt", "updatedAt") VALUES (`,
    `  '${cred.id}', '${esc(cred.appName)}', '${esc(cred.username)}', '${esc(cred.email)}', '${esc(enc)}', '${iv}', '${cred.url}', '${cred.category}'::"Category", '${icon}', ${cred.isFavorite ? 'true' : 'false'}, ${customEnc}, ${customIv}, ${cred.strength}, NOW(), NOW());`
  );

  const histId = `20000000-0000-0000-0000-${String(histIdx).padStart(12, '0')}`;
  lines.push(
    `INSERT INTO "PasswordHistory" ("id", "credentialId", "strength", "changedAt") VALUES (`,
    `  '${histId}', '${cred.id}', ${cred.strength}, NOW());`
  );
  histIdx++;
}

const outPath = path.join(__dirname, 'seed.sql');
fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
console.log('seed.sql gerado:', outPath);
