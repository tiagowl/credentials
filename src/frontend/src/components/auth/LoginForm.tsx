'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Field, Input, VStack, Text } from '@chakra-ui/react';
import { AuthCard } from '@/components/auth/AuthCard';
import { api, ApiClientError } from '@/lib/api-client';
import { showToast } from '@/components/ui/toaster';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get<{ configured: boolean }>('/api/vault/status').then((s) => {
      if (!s.configured) router.replace('/setup');
    });
    if (searchParams.get('expired')) {
      showToast('Sessão expirada', 'warning');
    }
  }, [router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/api/auth/login', { password });
      const from = searchParams.get('from') || '/dashboard';
      router.replace(from);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : 'Erro ao fazer login'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Bem-vindo de volta" subtitle="Insira sua senha mestra para desbloquear o vault">
      <form onSubmit={handleSubmit}>
        <VStack gap={4} align="stretch">
          <Field.Root required>
            <Field.Label>Senha mestra</Field.Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
          </Field.Root>
          {error && (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          )}
          <Button type="submit" colorPalette="blue" loading={loading} w="full">
            Desbloquear Vault
          </Button>
        </VStack>
      </form>
    </AuthCard>
  );
}
