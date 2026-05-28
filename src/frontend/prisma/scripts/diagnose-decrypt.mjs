import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const TARGET_EMAIL = 'winkellandi123@gmail.com';
const CANDIDATE_PASSWORDS = [
  'mV9#Qx2!Lt7$Wr4@Nz8*Hp1^Dc6&Ka3?',
  'Master123!',
  process.env.SEED_MASTER_PASSWORD,
].filter(Boolean);

const CANDIDATE_SALTS = [
  process.env.ENCRYPTION_SALT,
  'credentials-vault-seed-salt-2026',
].filter(Boolean);

function deriveVaultKey(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100_000, 32, 'sha256');
}

function decryptFromStorage(enc, iv, vaultKey) {
  const parsed = JSON.parse(enc);
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    vaultKey,
    Buffer.from(iv, 'base64')
  );
  decipher.setAuthTag(Buffer.from(parsed.t, 'base64'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(parsed.c, 'base64')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}

function tryDecrypt(cred, password, salt) {
  try {
    const key = deriveVaultKey(password, salt);
    return decryptFromStorage(cred.passwordEnc, cred.passwordIv, key);
  } catch {
    return null;
  }
}

async function main() {
  const user = await prisma.user.findUnique({ where: { email: TARGET_EMAIL } });
  const cred = await prisma.credential.findFirst({
    where: user ? { userId: user.id } : undefined,
  });

  if (!cred) {
    console.log('Nenhuma credencial encontrada.');
    return;
  }

  console.log('User:', user?.email, 'db salt:', user?.encryptionSalt);
  console.log('Sample credential:', cred.appName);
  console.log('---');

  const salts = new Set(CANDIDATE_SALTS);
  if (user?.encryptionSalt) salts.add(user.encryptionSalt);

  const users = await prisma.user.findMany({ select: { encryptionSalt: true } });
  users.forEach((u) => salts.add(u.encryptionSalt));

  for (const password of CANDIDATE_PASSWORDS) {
    for (const salt of salts) {
      const plain = tryDecrypt(cred, password, salt);
      if (plain) {
        console.log('OK -> password:', JSON.stringify(password), 'salt:', salt);
        console.log('   decrypted preview:', plain.slice(0, 20) + '...');
      }
    }
  }

  if (user?.masterPasswordHash) {
    for (const password of CANDIDATE_PASSWORDS) {
      const match = await bcrypt.compare(password, user.masterPasswordHash);
      if (match) console.log('bcrypt hash matches password:', JSON.stringify(password));
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
