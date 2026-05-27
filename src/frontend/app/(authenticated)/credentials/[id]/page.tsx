'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Image,
  Card,
  Progress,
  IconButton,
} from '@chakra-ui/react';
import { ArrowLeft, Star, Pencil, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { CredentialDetailField } from '@/components/credentials/CredentialDetailField';
import { CredentialForm } from '@/components/credentials/CredentialForm';
import { CopyButton } from '@/components/shared/CopyButton';
import { api, ApiClientError } from '@/lib/api-client';
import type { CredentialDTO, PasswordHistoryItem } from '@/types';
import { CATEGORY_LABELS, getInitialColor } from '@/lib/constants';
import { getStrengthColor, getStrengthLabel } from '@/lib/password-strength';
import { showToast } from '@/components/ui/toaster';
import { usePanicMode } from '@/hooks/usePanicMode';

export default function CredentialDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { panicActive } = usePanicMode();

  const [credential, setCredential] = useState<CredentialDTO | null>(null);
  const [history, setHistory] = useState<PasswordHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cred, hist] = await Promise.all([
        api.get<CredentialDTO>(`/api/credentials/${id}`),
        api.get<PasswordHistoryItem[]>(`/api/credentials/${id}/history`),
      ]);
      setCredential(cred);
      setHistory(hist);
    } catch {
      showToast('Credencial não encontrada', 'error');
      router.replace('/credentials');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (data: Record<string, unknown>) => {
    setSubmitting(true);
    try {
      const updated = await api.put<CredentialDTO>(`/api/credentials/${id}`, data);
      setCredential(updated);
      setEditing(false);
      showToast('Credencial atualizada', 'success');
      load();
    } catch (err) {
      showToast(
        err instanceof ApiClientError ? err.message : 'Erro ao salvar',
        'error'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Excluir esta credencial permanentemente?')) return;
    try {
      await api.delete(`/api/credentials/${id}`);
      showToast('Credencial excluída', 'success');
      router.push('/credentials');
    } catch {
      showToast('Erro ao excluir', 'error');
    }
  };

  const toggleFavorite = async () => {
    try {
      const updated = await api.patch<CredentialDTO>(`/api/credentials/${id}/favorite`);
      setCredential(updated);
    } catch {
      showToast('Erro ao favoritar', 'error');
    }
  };

  if (loading || !credential) {
    return (
      <AppLayout>
        <Text>Carregando...</Text>
      </AppLayout>
    );
  }

  const initial = credential.appName.charAt(0).toUpperCase();
  const bgColor = getInitialColor(credential.appName);
  const strength = credential.passwordStrength;

  return (
    <AppLayout>
      <VStack align="stretch" gap={6} maxW="720px">
        <Button
          asChild
          variant="ghost"
          size="sm"
          alignSelf="flex-start"
          color="fg.muted"
        >
          <Link href="/credentials">
            <ArrowLeft size={16} /> Voltar para credenciais
          </Link>
        </Button>

        <HStack justify="space-between" align="start" flexWrap="wrap" gap={4}>
          <HStack gap={4}>
            {credential.iconUrl ? (
              <Image
                src={credential.iconUrl}
                alt={credential.appName}
                boxSize="56px"
                borderRadius="xl"
              />
            ) : (
              <Box
                w="56px"
                h="56px"
                borderRadius="xl"
                bg={bgColor}
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontWeight="bold"
                fontSize="xl"
              >
                {initial}
              </Box>
            )}
            <VStack align="start" gap={1}>
              <Heading size="lg" letterSpacing="-0.02em">
                {credential.appName}
              </Heading>
              <HStack>
                <Badge colorPalette="blue">{CATEGORY_LABELS[credential.category]}</Badge>
                {credential.isFavorite && (
                  <Badge colorPalette="yellow">Favorito</Badge>
                )}
              </HStack>
            </VStack>
          </HStack>
          <HStack>
            <IconButton
              aria-label="Favorito"
              variant="outline"
              onClick={toggleFavorite}
            >
              <Star
                size={18}
                fill={credential.isFavorite ? 'gold' : 'none'}
                color={credential.isFavorite ? 'gold' : 'currentColor'}
              />
            </IconButton>
            {!editing && (
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Pencil size={16} /> Editar
              </Button>
            )}
            <Button colorPalette="red" variant="outline" onClick={handleDelete}>
              <Trash2 size={16} /> Excluir
            </Button>
          </HStack>
        </HStack>

        {editing ? (
          <Card.Root borderRadius="xl" bg="bg.panel">
            <Card.Header>
              <Heading size="sm">Editar credencial</Heading>
            </Card.Header>
            <Card.Body>
              <CredentialForm
                initial={credential}
                onSubmit={handleSave}
                onCancel={() => setEditing(false)}
                loading={submitting}
              />
            </Card.Body>
          </Card.Root>
        ) : (
          <>
            <VStack align="stretch" gap={3}>
              <CredentialDetailField
                label="Usuário"
                value={credential.username ?? '—'}
                copyValue={credential.username ?? undefined}
              />
              <CredentialDetailField
                label="Email"
                value={credential.email ?? '—'}
                copyValue={credential.email ?? undefined}
              />
              <CredentialDetailField
                label="Senha"
                value={
                  panicActive || !showPassword
                    ? '••••••••••••'
                    : credential.password
                }
              >
                <HStack justify="space-between" w="full">
                  <Text fontSize="sm" fontFamily="mono" wordBreak="break-all">
                    {panicActive || !showPassword
                      ? '••••••••••••'
                      : credential.password}
                  </Text>
                  <HStack>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={panicActive}
                    >
                      {showPassword ? 'Ocultar' : 'Ver'}
                    </Button>
                    <CopyButton value={credential.password} label="Senha" />
                  </HStack>
                </HStack>
              </CredentialDetailField>
              {credential.url && (
                <CredentialDetailField label="URL" value={credential.url}>
                  <HStack justify="space-between" w="full">
                    <Text fontSize="sm" wordBreak="break-all">
                      {credential.url}
                    </Text>
                    <HStack>
                      <Button asChild size="xs" variant="ghost">
                        <a href={credential.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink size={14} /> Abrir
                        </a>
                      </Button>
                      <CopyButton value={credential.url} label="URL" />
                    </HStack>
                  </HStack>
                </CredentialDetailField>
              )}
            </VStack>

            <Card.Root borderRadius="xl" bg="bg.panel">
              <Card.Body>
                <VStack align="stretch" gap={2}>
                  <Text fontSize="sm" fontWeight="medium">
                    Força da senha
                  </Text>
                  <HStack justify="space-between">
                    <Text fontSize="2xl" fontWeight="bold">
                      {strength}/100
                    </Text>
                    <Badge colorPalette={getStrengthColor(strength)}>
                      {getStrengthLabel(strength)}
                    </Badge>
                  </HStack>
                  <Progress.Root
                    value={strength}
                    size="sm"
                    colorPalette={getStrengthColor(strength)}
                  >
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>
                </VStack>
              </Card.Body>
            </Card.Root>

            {credential.customFields.length > 0 && (
              <Box>
                <Heading size="sm" mb={3}>
                  Campos adicionais
                </Heading>
                <VStack align="stretch" gap={3}>
                  {credential.customFields.map((field, i) => (
                    <CredentialDetailField
                      key={`${field.label}-${i}`}
                      label={field.label}
                      value={field.value}
                    />
                  ))}
                </VStack>
              </Box>
            )}

            {history.length > 0 && (
              <Box>
                <Heading size="sm" mb={3}>
                  Histórico de senhas
                </Heading>
                <VStack align="stretch" gap={2}>
                  {history.map((h) => (
                    <HStack
                      key={h.id}
                      justify="space-between"
                      p={3}
                      borderWidth="1px"
                      borderRadius="lg"
                      bg="bg.panel"
                    >
                      <Text fontSize="sm">
                        {new Date(h.changedAt).toLocaleString('pt-BR')}
                      </Text>
                      <Badge colorPalette={getStrengthColor(h.strength)}>
                        {h.strength}/100
                      </Badge>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            )}

            <Text fontSize="xs" color="fg.muted">
              Criado em {new Date(credential.createdAt).toLocaleString('pt-BR')} ·
              Atualizado em {new Date(credential.updatedAt).toLocaleString('pt-BR')}
            </Text>
          </>
        )}
      </VStack>
    </AppLayout>
  );
}
