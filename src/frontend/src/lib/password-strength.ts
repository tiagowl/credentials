const COMMON_PASSWORDS = new Set([
  'password', '123456', '12345678', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'master',
]);

export function calculatePasswordStrength(password: string): number {
  if (!password) return 0;

  let score = 0;
  const len = password.length;

  if (len >= 8) score += 15;
  if (len >= 12) score += 15;
  if (len >= 16) score += 10;
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^a-zA-Z0-9]/.test(password)) score += 15;
  if (len >= 20) score += 10;

  const uniqueChars = new Set(password).size;
  if (uniqueChars >= len * 0.7) score += 5;

  if (COMMON_PASSWORDS.has(password.toLowerCase())) score = Math.min(score, 20);
  if (/^(.)\1+$/.test(password)) score = Math.min(score, 10);
  if (/^[0-9]+$/.test(password)) score = Math.min(score, 15);
  if (/^[a-zA-Z]+$/.test(password)) score = Math.min(score, 30);

  return Math.min(100, Math.max(0, score));
}

export function getStrengthLabel(score: number): string {
  if (score <= 25) return 'Fraca';
  if (score <= 50) return 'Média';
  if (score <= 75) return 'Boa';
  return 'Excelente';
}

export function getStrengthColor(score: number): string {
  if (score <= 25) return 'red';
  if (score <= 50) return 'orange';
  if (score <= 75) return 'yellow';
  return 'green';
}
