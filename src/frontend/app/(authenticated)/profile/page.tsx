'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  VStack,
  Button,
  Text,
  Field,
  Input,
  Card,
  HStack,
} from '@chakra-ui/react';
import { AppLayout } from '@/components/layout/AppLayout';
import { MasterPasswordField } from '@/components/auth/MasterPasswordField';
import { api, ApiClientError } from '@/lib/api-client';
import { showToast } from '@/components/ui/toaster';
import type { AccountProfileDTO } from '@/types';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<AccountProfileDTO | null>(null);
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  const loadProfile = () => {
    api
      .get<AccountProfileDTO>('/api/account/profile')
      .then((p) => {
        setProfile(p);
        setEmail(p.email ?? '');
        setDisplayName(p.displayName ?? '');
      })
      .catch(() => showToast('Erro ao carregar perfil', 'error'));
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const saveProfile = async () => {
    if (!email.trim()) {
      showToast('Informe um email válido', 'warning');
      return;
    }
    setSavingProfile(true);
    try {
      const updated = await api.patch<AccountProfileDTO>('/api/account/profile', {
        email: email.trim(),
        displayName: displayName.trim() || null,
      });
      setProfile(updated);
      showToast('Perfil atualizado', 'success');
    } catch (err) {
      showToast(
        err instanceof ApiClientError ? err.message : 'Erro ao salvar perfil',
        'error'
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async () => {
    if (newPassword.length < 8) {
      showToast('Nova senha: mínimo 8 caracteres', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('As senhas não coincidem', 'warning');
      return;
    }
    setSavingPassword(true);
    try {
      await api.post('/api/account/change-password', {
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('Senha mestra alterada', 'success');
    } catch (err) {
      showToast(
        err instanceof ApiClientError ? err.message : 'Erro ao alterar senha',
        'error'
      );
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
      router.push('/login?logout=1');
      router.refresh();
    } catch {
      showToast('Erro ao sair', 'error');
    }
  };

  return (
    <AppLayout>
      <VStack align="stretch" gap={8} maxW="600px">
        <Box>
          <Heading size="lg" letterSpacing="-0.02em">
            Minha conta
          </Heading>
          <Text color="fg.muted" fontSize="sm">
            Gerencie seus dados e a senha mestra do vault.
          </Text>
        </Box>

        <Card.Root borderRadius="xl" bg="bg.panel">
          <Card.Header>
            <Heading size="sm">Informações pessoais</Heading>
          </Card.Header>
          <Card.Body>
            <VStack align="stretch" gap={4}>
              <Field.Root required>
                <Field.Label>Email</Field.Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@email.com"
                />
              </Field.Root>
              <Field.Root>
                <Field.Label>Nome</Field.Label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Seu nome"
                />
              </Field.Root>
              {profile?.createdAt && (
                <Text fontSize="xs" color="fg.muted">
                  Conta criada em{' '}
                  {new Date(profile.createdAt).toLocaleDateString('pt-BR')}
                </Text>
              )}
              <Button
                colorPalette="blue"
                onClick={saveProfile}
                loading={savingProfile}
                alignSelf="flex-start"
              >
                Salvar informações
              </Button>
            </VStack>
          </Card.Body>
        </Card.Root>

        <Card.Root borderRadius="xl" bg="bg.panel">
          <Card.Header>
            <Heading size="sm">Senha mestra</Heading>
          </Card.Header>
          <Card.Body>
            <VStack align="stretch" gap={4}>
              <Text fontSize="sm" color="fg.muted">
                Alterar a senha mestra recriptografa todas as credenciais do vault.
                Use a senha que você já criou para confirmar.
              </Text>
              <Field.Root required>
                <Field.Label>Senha mestra atual</Field.Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </Field.Root>
              <MasterPasswordField
                value={newPassword}
                onChange={setNewPassword}
                label="Nova senha mestra"
                confirmValue={confirmPassword}
                onConfirmChange={setConfirmPassword}
                showConfirm
              />
              <Button
                variant="outline"
                onClick={changePassword}
                loading={savingPassword}
                alignSelf="flex-start"
              >
                Alterar senha mestra
              </Button>
            </VStack>
          </Card.Body>
        </Card.Root>

        <Card.Root borderRadius="xl" bg="bg.panel" borderColor="red.subtle">
          <Card.Header>
            <Heading size="sm">Sessão</Heading>
          </Card.Header>
          <Card.Body>
            <HStack justify="space-between" flexWrap="wrap" gap={3}>
              <Text fontSize="sm" color="fg.muted">
                Encerra a sessão neste dispositivo. Suas credenciais permanecem
                salvas.
              </Text>
              <Button colorPalette="red" variant="outline" onClick={handleLogout}>
                Sair da conta
              </Button>
            </HStack>
          </Card.Body>
        </Card.Root>
      </VStack>
    </AppLayout>
  );
}
