'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Field, Input, VStack, Text } from '@chakra-ui/react';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthSwitchLinks } from '@/components/auth/AuthSwitchLinks';
import { MasterPasswordField } from '@/components/auth/MasterPasswordField';
import { api, ApiClientError } from '@/lib/api-client';
import { showToast } from '@/components/ui/toaster';

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('A senha mestra deve ter no mínimo 8 caracteres');
      return;
    }
    if (password !== confirm) {
      setError('As senhas não coincidem');
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/auth/register', {
        email,
        displayName: displayName.trim() || undefined,
        password,
        confirmPassword: confirm,
      });
      showToast('Conta criada com sucesso!', 'success');
      router.replace('/dashboard');
      router.refresh();
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : 'Erro ao criar conta'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Criar sua conta"
      subtitle="Cada usuário tem seu próprio vault criptografado. Use um email e uma senha mestra forte."
    >
      <form onSubmit={handleSubmit}>
        <VStack gap={4} align="stretch">
          <Field.Root required>
            <Field.Label>Email</Field.Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              autoComplete="email"
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Nome (opcional)</Field.Label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Como deseja ser chamado"
            />
          </Field.Root>
          <MasterPasswordField
            value={password}
            onChange={setPassword}
            confirmValue={confirm}
            onConfirmChange={setConfirm}
            showConfirm
          />
          {error && (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          )}
          <Button type="submit" colorPalette="blue" loading={loading} w="full">
            Criar conta
          </Button>
        </VStack>
      </form>
      <AuthSwitchLinks mode="register" />
    </AuthCard>
  );
}
