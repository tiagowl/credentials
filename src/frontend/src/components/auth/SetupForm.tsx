'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Field, Input, VStack, Progress, Box, Text } from '@chakra-ui/react';
import { AuthCard } from '@/components/auth/AuthCard';
import { api, ApiClientError } from '@/lib/api-client';
import { calculatePasswordStrength, getStrengthLabel, getStrengthColor } from '@/lib/password-strength';
import { showToast } from '@/components/ui/toaster';

export function SetupForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const strength = calculatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Minimo 8 caracteres');
      return;
    }
    if (password !== confirm) {
      setError('Senhas nao coincidem');
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/vault/setup', { password, confirmPassword: confirm });
      showToast('Vault criado com sucesso!', 'success');
      router.replace('/dashboard');
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof ApiClientError ? err.message : 'Erro ao configurar vault';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Crie sua senha mestra"
      subtitle="Ela protege todas as suas credenciais. Leva menos de 1 minuto. Anote em local seguro."
    >
      <form onSubmit={handleSubmit}>
        <VStack gap={4} align="stretch">
          <Field.Root required>
            <Field.Label>Senha mestra</Field.Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {password && (
              <Box mt={2}>
                <Progress.Root value={strength} size="sm" colorPalette={getStrengthColor(strength)}>
                  <Progress.Track>
                    <Progress.Range />
                  </Progress.Track>
                </Progress.Root>
                <Text fontSize="xs" color="fg.muted">
                  {getStrengthLabel(strength)}
                </Text>
              </Box>
            )}
          </Field.Root>
          <Field.Root required>
            <Field.Label>Confirmar senha</Field.Label>
            <Input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </Field.Root>
          {error && (
            <Text color="red.500" fontSize="sm">
              {error}
            </Text>
          )}
          <Button type="submit" colorPalette="blue" loading={loading} w="full">
            Criar Vault
          </Button>
        </VStack>
      </form>
    </AuthCard>
  );
}
