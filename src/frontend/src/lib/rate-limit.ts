const loginAttempts = new Map<string, { count: number; lockedUntil: number }>();

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (record && record.lockedUntil > now) {
    return { allowed: false, retryAfter: Math.ceil((record.lockedUntil - now) / 1000) };
  }

  if (record && record.lockedUntil <= now) {
    loginAttempts.delete(ip);
  }

  return { allowed: true };
}

export function recordFailedLogin(ip: string): number {
  const now = Date.now();
  const record = loginAttempts.get(ip) ?? { count: 0, lockedUntil: 0 };
  record.count += 1;

  if (record.count >= 5) {
    record.lockedUntil = now + 5 * 60 * 1000;
    record.count = 0;
  }

  loginAttempts.set(ip, record);
  return 5 - (record.count || 5);
}

export function clearLoginAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return 'local';
}
