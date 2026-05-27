import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const PBKDF2_ITERATIONS = 100_000;
const KEY_LENGTH = 32;
const ALGORITHM = 'aes-256-gcm';
const BCRYPT_ROUNDS = 12;

export interface EncryptedPayload {
  ciphertext: string;
  iv: string;
  authTag: string;
}

export function getEncryptionSalt(): string {
  const salt = process.env.ENCRYPTION_SALT;
  if (!salt) throw new Error('ENCRYPTION_SALT is not configured');
  return salt;
}

export async function hashMasterPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyMasterPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function deriveVaultKey(password: string, salt?: string): Buffer {
  const useSalt = salt ?? getEncryptionSalt();
  return crypto.pbkdf2Sync(password, useSalt, PBKDF2_ITERATIONS, KEY_LENGTH, 'sha256');
}

export function encrypt(plaintext: string, vaultKey: Buffer): EncryptedPayload {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, vaultKey, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();
  return {
    ciphertext: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
  };
}

export function decrypt(
  ciphertext: string,
  iv: string,
  authTag: string,
  vaultKey: Buffer
): string {
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    vaultKey,
    Buffer.from(iv, 'base64')
  );
  decipher.setAuthTag(Buffer.from(authTag, 'base64'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(ciphertext, 'base64')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}

export function encryptToStorage(plaintext: string, vaultKey: Buffer): {
  enc: string;
  iv: string;
} {
  const payload = encrypt(plaintext, vaultKey);
  return {
    enc: JSON.stringify({ c: payload.ciphertext, t: payload.authTag }),
    iv: payload.iv,
  };
}

export function decryptFromStorage(
  enc: string,
  iv: string,
  vaultKey: Buffer
): string {
  const parsed = JSON.parse(enc) as { c: string; t: string };
  return decrypt(parsed.c, iv, parsed.t, vaultKey);
}

export function generatePassword(length = 16, includeSymbols = true): string {
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()-_=+[]{}';
  let chars = lower + upper + numbers;
  if (includeSymbols) chars += symbols;

  const array = new Uint32Array(length);
  crypto.randomFillSync(array);
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars[array[i] % chars.length];
  }
  return password;
}

export function encryptExport(data: string, password: string): string {
  const key = deriveVaultKey(password);
  const payload = encrypt(data, key);
  return JSON.stringify({
    version: 1,
    algorithm: ALGORITHM,
    ...payload,
  });
}

export function decryptExport(encryptedJson: string, password: string): string {
  const parsed = JSON.parse(encryptedJson) as EncryptedPayload & { version?: number };
  const key = deriveVaultKey(password);
  return decrypt(parsed.ciphertext, parsed.iv, parsed.authTag, key);
}
