'use client';

import {
  Button,
  Field,
  Input,
  VStack,
  HStack,
  NativeSelect,
  Checkbox,
  Box,
  IconButton,
  Textarea,
  Text,
} from '@chakra-ui/react';
import { Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Category } from '@prisma/client';
import type { CredentialDTO, CustomField } from '@/types';
import { PasswordField } from '@/components/shared/PasswordField';
import { CATEGORY_LABELS, suggestCategory } from '@/lib/constants';
import { api } from '@/lib/api-client';

interface CredentialFormProps {
  initial?: Partial<CredentialDTO>;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export function CredentialForm({
  initial,
  onSubmit,
  onCancel,
  loading,
}: CredentialFormProps) {
  const [appName, setAppName] = useState(initial?.appName ?? '');
  const [username, setUsername] = useState(initial?.username ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [password, setPassword] = useState(initial?.password ?? '');
  const [url, setUrl] = useState(initial?.url ?? '');
  const [category, setCategory] = useState<Category>(
    initial?.category ?? 'OTHER'
  );
  const [isFavorite, setIsFavorite] = useState(initial?.isFavorite ?? false);
  const [iconUrl, setIconUrl] = useState(initial?.iconUrl ?? '');
  const [customFields, setCustomFields] = useState<CustomField[]>(
    initial?.customFields ?? []
  );

  useEffect(() => {
    if (appName && !initial?.category) {
      setCategory(suggestCategory(appName));
    }
    if (appName.length > 2) {
      const t = setTimeout(async () => {
        try {
          const res = await api.get<{ iconUrl: string }>(
            `/api/favicon?appName=${encodeURIComponent(appName)}&url=${encodeURIComponent(url)}`
          );
          setIconUrl(res.iconUrl);
        } catch {
          // ignore
        }
      }, 500);
      return () => clearTimeout(t);
    }
  }, [appName, url, initial?.category]);

  const addCustomField = () => {
    setCustomFields([...customFields, { label: '', value: '', type: 'text' }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      appName,
      username: username || null,
      email: email || null,
      password: password || undefined,
      url: url || null,
      category,
      isFavorite,
      iconUrl: iconUrl || null,
      customFields: customFields.filter((f) => f.label && f.value),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={4} align="stretch">
        <Field.Root required>
          <Field.Label>Nome do aplicativo</Field.Label>
          <Input
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            placeholder="YouTube, Facebook..."
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Categoria</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
            >
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </NativeSelect.Field>
          </NativeSelect.Root>
        </Field.Root>

        <Field.Root>
          <Field.Label>URL</Field.Label>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
          />
        </Field.Root>

        <Field.Root>
          <Field.Label>Usuário</Field.Label>
          <Input value={username} onChange={(e) => setUsername(e.target.value)} />
        </Field.Root>

        <Field.Root>
          <Field.Label>Email</Field.Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field.Root>

        <PasswordField
          value={password}
          onChange={setPassword}
          showGenerator
          required={!initial?.id}
        />

        <Checkbox.Root
          checked={isFavorite}
          onCheckedChange={(e) => setIsFavorite(!!e.checked)}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>Adicionar aos favoritos</Checkbox.Label>
        </Checkbox.Root>

        <Box>
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" fontWeight="medium">
              Campos adicionais
            </Text>
            <Button size="xs" variant="ghost" onClick={addCustomField} type="button">
              <Plus size={14} /> Adicionar
            </Button>
          </HStack>
          {customFields.map((field, i) => (
            <HStack key={i} mb={2} align="end">
              <Field.Root flex={1}>
                <Input
                  placeholder="Label"
                  value={field.label}
                  onChange={(e) => {
                    const next = [...customFields];
                    next[i] = { ...field, label: e.target.value };
                    setCustomFields(next);
                  }}
                  size="sm"
                />
              </Field.Root>
              <Field.Root flex={2}>
                {field.type === 'note' ? (
                  <Textarea
                    value={field.value}
                    onChange={(e) => {
                      const next = [...customFields];
                      next[i] = { ...field, value: e.target.value };
                      setCustomFields(next);
                    }}
                    size="sm"
                    rows={2}
                  />
                ) : (
                  <Input
                    value={field.value}
                    onChange={(e) => {
                      const next = [...customFields];
                      next[i] = { ...field, value: e.target.value };
                      setCustomFields(next);
                    }}
                    size="sm"
                  />
                )}
              </Field.Root>
              <IconButton
                aria-label="Remover campo"
                size="sm"
                variant="ghost"
                onClick={() =>
                  setCustomFields(customFields.filter((_, j) => j !== i))
                }
              >
                <Trash2 size={14} />
              </IconButton>
            </HStack>
          ))}
        </Box>

        <HStack justify="flex-end" pt={4}>
          <Button variant="outline" onClick={onCancel} type="button">
            Cancelar
          </Button>
          <Button type="submit" colorPalette="blue" loading={loading}>
            Salvar credencial
          </Button>
        </HStack>
      </VStack>
    </form>
  );
}
