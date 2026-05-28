import { z } from 'zod';
import { Category } from '@prisma/client';

export const setupSchema = z
  .object({
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  });

export const registerSchema = z
  .object({
    email: z.string().email('Email inválido'),
    displayName: z.string().max(80).optional(),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  });

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha obrigatória'),
});

export const profileSchema = z.object({
  email: z.string().email('Email inválido').optional(),
  displayName: z.string().max(80).optional().nullable(),
});

export const changeMasterPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Senha atual obrigatória'),
    newPassword: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Senhas não coincidem',
    path: ['confirmPassword'],
  });

export const createCredentialSchema = z.object({
  appName: z.string().min(1, 'Nome do app é obrigatório'),
  username: z.string().optional().nullable(),
  email: z
    .string()
    .email('Email inválido')
    .optional()
    .nullable()
    .or(z.literal('')),
  password: z.string().min(1, 'Senha é obrigatória'),
  url: z.string().url('URL inválida').optional().nullable().or(z.literal('')),
  category: z.nativeEnum(Category).optional(),
  iconUrl: z.string().optional().nullable(),
  isFavorite: z.boolean().optional(),
  customFields: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
        type: z.enum(['text', 'url', 'note', 'pin', 'backup']),
      })
    )
    .optional(),
});

export const updateCredentialSchema = createCredentialSchema.partial().extend({
  password: z.string().optional(),
});

export const vaultConfigSchema = z.object({
  sessionTimeout: z.number().min(5).max(60).optional(),
  theme: z.enum(['LIGHT', 'DARK', 'SYSTEM']).optional(),
  accentColor: z.string().optional(),
});

export const exportSchema = z.object({
  format: z.enum(['json', 'csv']),
  password: z.string().min(1, 'Senha mestra obrigatória'),
});

export const importSchema = z.object({
  mode: z.enum(['merge', 'replace']),
  password: z.string().optional(),
});

export type CreateCredentialInput = z.infer<typeof createCredentialSchema>;
export type UpdateCredentialInput = z.infer<typeof updateCredentialSchema>;
