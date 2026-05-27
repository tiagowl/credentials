import { Category, Theme } from '@prisma/client';

export const CATEGORY_LABELS: Record<Category, string> = {
  SOCIAL: 'Redes Sociais',
  STREAMING: 'Streaming',
  EMAIL: 'Email',
  BANKING: 'Bancos',
  WORK: 'Trabalho',
  OTHER: 'Outros',
};

export const THEME_LABELS: Record<Theme, string> = {
  LIGHT: 'Claro',
  DARK: 'Escuro',
  SYSTEM: 'Sistema',
};

export const ACCENT_COLORS = ['blue', 'purple', 'teal', 'orange', 'pink', 'green'] as const;

export const SESSION_TIMEOUT_OPTIONS = [5, 15, 30, 60] as const;

export const MAX_LOGIN_ATTEMPTS = 5;
export const LOGIN_LOCKOUT_MS = 5 * 60 * 1000;

export const CATEGORY_SUGGESTIONS: Record<string, Category> = {
  youtube: 'STREAMING',
  netflix: 'STREAMING',
  spotify: 'STREAMING',
  facebook: 'SOCIAL',
  twitter: 'SOCIAL',
  instagram: 'SOCIAL',
  linkedin: 'SOCIAL',
  gmail: 'EMAIL',
  outlook: 'EMAIL',
  nubank: 'BANKING',
  github: 'WORK',
  gitlab: 'WORK',
};

export function suggestCategory(appName: string): Category {
  const key = appName.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const [pattern, category] of Object.entries(CATEGORY_SUGGESTIONS)) {
    if (key.includes(pattern)) return category;
  }
  return 'OTHER';
}

export function getFaviconUrl(appName: string, url?: string | null): string {
  if (url) {
    try {
      const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      // fall through
    }
  }
  const domain = appName.toLowerCase().replace(/\s+/g, '') + '.com';
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

export function getInitialColor(appName: string): string {
  const colors = ['#3182CE', '#805AD5', '#D53F8C', '#DD6B20', '#38A169', '#00B5D8'];
  let hash = 0;
  for (let i = 0; i < appName.length; i++) {
    hash = appName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}
