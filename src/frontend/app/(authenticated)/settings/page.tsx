'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Box,
  Heading,
  VStack,
  HStack,
  Button,
  Text,
  NativeSelect,
  Field,
  Input,
  RadioGroup,
  Card,
} from '@chakra-ui/react';
import { AppLayout } from '@/components/layout/AppLayout';
import { api } from '@/lib/api-client';
import { ACCENT_COLORS, SESSION_TIMEOUT_OPTIONS } from '@/lib/constants';
import { useColorMode } from '@/components/ui/color-mode';
import { showToast } from '@/components/ui/toaster';
import type { VaultConfigDTO } from '@/types';

export default function SettingsPage() {
  const { colorMode, setColorMode } = useColorMode();
  const [config, setConfig] = useState<VaultConfigDTO | null>(null);
  const [exportPassword, setExportPassword] = useState('');
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    api.get<VaultConfigDTO>('/api/vault/config').then(setConfig);
  }, []);

  const saveConfig = async (patch: Partial<VaultConfigDTO>) => {
    try {
      const updated = await api.patch<VaultConfigDTO>('/api/vault/config', patch);
      setConfig(updated);
      showToast('Configurações salvas', 'success');
    } catch {
      showToast('Erro ao salvar', 'error');
    }
  };

  const handleExport = async () => {
    try {
      const res = await fetch('/api/vault/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ format: exportFormat, password: exportPassword }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error?.message ?? 'Erro');
      }
      const blob = await res.blob();
      const disposition = res.headers.get('Content-Disposition');
      const filename =
        disposition?.match(/filename="(.+)"/)?.[1] ?? `vault-export.${exportFormat}`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Export concluído', 'success');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Erro ao exportar', 'error');
    }
  };

  const handleImport = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('mode', importMode);
    formData.append(
      'format',
      file.name.endsWith('.csv') ? 'csv' : 'json'
    );
    if (file.name.endsWith('.vault.json') || file.name.endsWith('.json')) {
      const pwd = prompt('Senha mestra do arquivo:');
      if (pwd) formData.append('password', pwd);
    }
    try {
      const result = await fetch('/api/vault/import', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await result.json();
      if (!result.ok) throw new Error(data.error?.message);
      showToast(
        `Import: ${data.created} criadas, ${data.skipped} ignoradas`,
        'success'
      );
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Erro ao importar', 'error');
    }
  };

  return (
    <AppLayout>
      <VStack align="stretch" gap={8} maxW="600px">
        <Box>
          <Heading size="lg" letterSpacing="-0.02em">
            Configurações
          </Heading>
          <Text color="fg.muted" fontSize="sm">
            Personalize aparência, segurança e gerenciamento de dados.
          </Text>
        </Box>

        <Card.Root borderRadius="xl" bg="bg.panel">
          <Card.Header>
            <Heading size="sm">Aparência</Heading>
          </Card.Header>
          <Card.Body>
            <VStack align="stretch" gap={4}>
              <Field.Root>
                <Field.Label>Tema</Field.Label>
                <HStack>
                  {(['light', 'dark', 'system'] as const).map((t) => (
                    <Button
                      key={t}
                      size="sm"
                      variant={colorMode === t ? 'solid' : 'outline'}
                      onClick={() => {
                        setColorMode(t);
                        saveConfig({
                          theme: t.toUpperCase() as VaultConfigDTO['theme'],
                        });
                      }}
                    >
                      {t === 'light' ? 'Claro' : t === 'dark' ? 'Escuro' : 'Sistema'}
                    </Button>
                  ))}
                </HStack>
              </Field.Root>
              <Field.Root>
                <Field.Label>Cor de destaque</Field.Label>
                <HStack>
                  {ACCENT_COLORS.map((c) => (
                    <Button
                      key={c}
                      size="sm"
                      colorPalette={c}
                      variant={config?.accentColor === c ? 'solid' : 'outline'}
                      onClick={() => saveConfig({ accentColor: c })}
                    >
                      {c}
                    </Button>
                  ))}
                </HStack>
              </Field.Root>
            </VStack>
          </Card.Body>
        </Card.Root>

        <Card.Root borderRadius="xl" bg="bg.panel">
          <Card.Header>
            <Heading size="sm">Segurança</Heading>
          </Card.Header>
          <Card.Body>
            <VStack align="stretch" gap={4}>
              <Field.Root>
                <Field.Label>Timeout de sessão (min)</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={String(config?.sessionTimeout ?? 15)}
                    onChange={(e) =>
                      saveConfig({ sessionTimeout: parseInt(e.target.value, 10) })
                    }
                  >
                    {SESSION_TIMEOUT_OPTIONS.map((m) => (
                      <option key={m} value={m}>
                        {m} minutos
                      </option>
                    ))}
                  </NativeSelect.Field>
                </NativeSelect.Root>
              </Field.Root>
              <Text fontSize="sm" color="fg.muted">
                Atalhos: Ctrl+H oculta senhas · Ctrl+L bloqueia vault
              </Text>
              <Button
                variant="outline"
                onClick={() => {
                  fetch('/api/auth/lock', { method: 'POST', credentials: 'include' }).then(
                    () => (window.location.href = '/login')
                  );
                }}
              >
                🔒 Bloquear vault agora
              </Button>
            </VStack>
          </Card.Body>
        </Card.Root>

        <Card.Root borderRadius="xl" bg="bg.panel">
          <Card.Header>
            <Heading size="sm">Dados</Heading>
          </Card.Header>
          <Card.Body>
            <VStack align="stretch" gap={4}>
              <Field.Root>
                <Field.Label>Exportar vault</Field.Label>
                <RadioGroup.Root
                  value={exportFormat}
                  onValueChange={(e) =>
                    setExportFormat(e.value as 'json' | 'csv')
                  }
                >
                  <HStack>
                    <RadioGroup.Item value="json">
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemControl />
                      <RadioGroup.ItemText>JSON criptografado</RadioGroup.ItemText>
                    </RadioGroup.Item>
                    <RadioGroup.Item value="csv">
                      <RadioGroup.ItemHiddenInput />
                      <RadioGroup.ItemControl />
                      <RadioGroup.ItemText>CSV (inseguro)</RadioGroup.ItemText>
                    </RadioGroup.Item>
                  </HStack>
                </RadioGroup.Root>
                <Input
                  type="password"
                  placeholder="Senha mestra para confirmar"
                  value={exportPassword}
                  onChange={(e) => setExportPassword(e.target.value)}
                  mt={2}
                />
                <Button mt={2} onClick={handleExport} disabled={!exportPassword}>
                  📤 Exportar
                </Button>
              </Field.Root>

              <Field.Root>
                <Field.Label>Importar credenciais</Field.Label>
                <NativeSelect.Root mb={2}>
                  <NativeSelect.Field
                    value={importMode}
                    onChange={(e) =>
                      setImportMode(e.target.value as 'merge' | 'replace')
                    }
                  >
                    <option value="merge">Adicionar (merge)</option>
                    <option value="replace">Substituir tudo</option>
                  </NativeSelect.Field>
                </NativeSelect.Root>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".json,.csv,.vault.json"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleImport(f);
                  }}
                />
                <Button onClick={() => fileRef.current?.click()}>📥 Importar arquivo</Button>
              </Field.Root>
            </VStack>
          </Card.Body>
        </Card.Root>

        <Text fontSize="sm" color="fg.muted">
          Credentials Vault v1.0
        </Text>
      </VStack>
    </AppLayout>
  );
}
