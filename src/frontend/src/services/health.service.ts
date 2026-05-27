import { prisma } from '@/lib/prisma';
import { listCredentials } from './credential.service';
import type { VaultHealth } from '@/types';

export async function getVaultHealth(vaultKey: Buffer): Promise<VaultHealth> {
  const all = await listCredentials({}, vaultKey);

  const weak = all.filter((c) => c.passwordStrength < 50);
  const passwordMap = new Map<string, typeof all>();
  for (const c of all) {
    const key = c.password;
    if (!passwordMap.has(key)) passwordMap.set(key, []);
    passwordMap.get(key)!.push(c);
  }
  const reused = Array.from(passwordMap.values())
    .filter((g) => g.length > 1)
    .flat();

  const strong = all.filter((c) => c.passwordStrength >= 76).length;
  let score = 100;
  if (all.length > 0) {
    score = Math.round(
      all.reduce((sum, c) => sum + c.passwordStrength, 0) / all.length
    );
    score = Math.max(0, score - weak.length * 5 - Math.floor(reused.length / 2) * 3);
  }

  return {
    score,
    total: all.length,
    strong,
    weak: weak.length,
    reused: new Set(reused.map((c) => c.id)).size,
    weakCredentials: weak,
    reusedCredentials: reused.filter(
      (c, i, arr) => arr.findIndex((x) => x.id === c.id) === i
    ),
  };
}

export async function getDashboardStats(vaultKey: Buffer) {
  const all = await listCredentials({}, vaultKey);
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const thisWeek = all.filter((c) => new Date(c.createdAt) >= weekAgo).length;
  const favorites = all.filter((c) => c.isFavorite).slice(0, 6);
  const recent = [...all]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);
  const health = await getVaultHealth(vaultKey);

  return {
    total: all.length,
    thisWeek,
    favorites,
    recent,
    health,
  };
}
