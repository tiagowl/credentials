import { Category, Theme } from '@prisma/client';

export { Category, Theme };
export const CATEGORY_VALUES = Object.values(Category);
export const THEME_VALUES = Object.values(Theme);

export interface CustomField {
  label: string;
  value: string;
  type: 'text' | 'url' | 'note' | 'pin' | 'backup';
}

export interface CredentialDTO {
  id: string;
  appName: string;
  username: string | null;
  email: string | null;
  password: string;
  url: string | null;
  category: Category;
  iconUrl: string | null;
  isFavorite: boolean;
  customFields: CustomField[];
  passwordStrength: number;
  createdAt: string;
  updatedAt: string;
}

export interface CredentialListItem extends Omit<CredentialDTO, 'customFields'> {
  customFields?: CustomField[];
}

export interface PaginatedCredentials {
  items: CredentialListItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface VaultHealth {
  score: number;
  total: number;
  strong: number;
  weak: number;
  reused: number;
  weakCredentials: CredentialListItem[];
  reusedCredentials: CredentialListItem[];
}

export interface DashboardStats {
  total: number;
  thisWeek: number;
  favorites: CredentialListItem[];
  recent: CredentialListItem[];
  health: VaultHealth;
}

export interface VaultConfigDTO {
  sessionTimeout: number;
  theme: Theme;
  accentColor: string;
}

export interface AccountProfileDTO {
  email: string | null;
  displayName: string | null;
  hasEmail: boolean;
  createdAt: string;
}

export interface VaultStatusDTO {
  configured: boolean;
  registrationOpen: boolean;
}

export interface PasswordHistoryItem {
  id: string;
  strength: number;
  changedAt: string;
}

export interface ImportPreviewItem {
  appName: string;
  username?: string;
  email?: string;
  status: 'new' | 'duplicate' | 'skip';
}

export interface ImportResult {
  created: number;
  skipped: number;
  errors: number;
}
