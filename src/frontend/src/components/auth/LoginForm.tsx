'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Field, Input, VStack, Text } from '@chakra-ui/react';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthSwitchLinks } from '@/components/auth/AuthSwitchLinks';
import { api, ApiClientError } from '@/lib/api-client';
import { showToast } from '@/components/ui/toaster';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchParams.get('expired')) {
      showToast('Sessão expirada', 'warning');
    }
    if (searchParams.get('logout')) {
      showToast('Você saiu da conta', 'info');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/api/auth/login', { email, password });
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
    <AuthCard
      title="Bem-vindo de volta"
      subtitle="Entre com seu email e senha mestra para acessar seu vault"
    >
      <form onSubmit={handleSubmit}>
        <VStack gap={4} align="stretch">
          <Field.Root required>
            <Field.Label>Email</Field.Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
              placeholder="voce@email.com"
            />
          </Field.Root>
          <Field.Root required>
            <Field.Label>Senha mestra</Field.Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </Field.Root>
          {error && (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          )}
          <Button type="submit" colorPalette="blue" loading={loading} w="full">
            Entrar
          </Button>
        </VStack>
      </form>
      <AuthSwitchLinks mode="login" />
    </AuthCard>
  );
}
