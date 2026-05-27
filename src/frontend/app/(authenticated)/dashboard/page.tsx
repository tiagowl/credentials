'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Button,
  Progress,
  Card,
} from '@chakra-ui/react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { CredentialCard } from '@/components/credentials/CredentialCard';
import { api } from '@/lib/api-client';
import type { DashboardStats, CredentialListItem } from '@/types';
import { usePanicMode } from '@/hooks/usePanicMode';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { panicActive } = usePanicMode();

  const load = () => {
    setHasError(false);
    api
      .get<DashboardStats>('/api/dashboard')
      .then(setStats)
      .catch(() => {
        setStats(null);
        setHasError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const noop = () => {};

  if (loading) {
    return (
      <AppLayout>
        <Text>Carregando...</Text>
      </AppLayout>
    );
  }

  if (hasError || !stats) {
    return (
      <AppLayout>
        <VStack align="stretch" gap={4}>
          <Heading size="md">Nao foi possivel carregar o dashboard</Heading>
          <Text color="fg.muted">
            Verifique sua sessao/conexao e tente novamente.
          </Text>
          <Button onClick={load} maxW="200px">
            Tentar novamente
          </Button>
        </VStack>
      </AppLayout>
    );
  }

  const empty = stats?.total === 0;

  return (
    <AppLayout onNewCredential={() => (window.location.href = '/credentials?new=1')}>
      <VStack align="stretch" gap={6}>
        <Box>
          <Heading size="lg" letterSpacing="-0.02em">
            Olá! 👋
          </Heading>
          <Text color="fg.muted">
            {stats?.total ?? 0} credenciais · {stats?.thisWeek ?? 0} adicionadas esta semana
          </Text>
        </Box>

        {stats?.health && (
          <Card.Root variant="outline" borderRadius="xl" bg="bg.panel" asChild>
            <Link href="/health" style={{ display: 'block' }}>
              <Card.Body>
                <HStack justify="space-between">
                  <VStack align="start" gap={1}>
                    <Text fontWeight="semibold">🛡 Vault Health</Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      {stats.health.score}/100
                    </Text>
                    {stats.health.weak > 0 && (
                      <Text fontSize="sm" color="orange.500">
                        {stats.health.weak} senhas fracas →
                      </Text>
                    )}
                  </VStack>
                  <Box
                    w="64px"
                    h="64px"
                    borderRadius="full"
                    borderWidth="4px"
                    borderColor="blue.500"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontWeight="bold"
                  >
                    {stats.health.score}
                  </Box>
                </HStack>
              </Card.Body>
            </Link>
          </Card.Root>
        )}

        {empty ? (
          <VStack py={12} gap={4} borderWidth="1px" borderRadius="xl" bg="bg.panel">
            <Text fontSize="4xl">🔑</Text>
            <Heading size="md">Seu vault está vazio</Heading>
            <Text color="fg.muted" textAlign="center">
              Adicione sua primeira credencial para começar
            </Text>
            <Button asChild colorPalette="blue">
              <Link href="/credentials?new=1">+ Adicionar credencial</Link>
            </Button>
          </VStack>
        ) : (
          <>
            {stats.favorites.length > 0 && (
              <Box>
                <Heading size="sm" mb={3}>
                  ★ Favoritos
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={4}>
                  {stats.favorites.map((c) => (
                    <CredentialCard
                      key={c.id}
                      credential={c}
                      compact
                      panicHidden={panicActive}
                      onEdit={noop}
                      onDelete={noop}
                      onToggleFavorite={noop}
                    />
                  ))}
                </SimpleGrid>
              </Box>
            )}

            <Box>
              <HStack justify="space-between" mb={3}>
                <Heading size="sm">Recentes</Heading>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/credentials">Ver todas →</Link>
                </Button>
              </HStack>
              <SimpleGrid columns={{ base: 1, md: 2, xl: 4 }} gap={4}>
                {stats.recent.map((c) => (
                  <CredentialCard
                    key={c.id}
                    credential={c}
                    compact
                    panicHidden={panicActive}
                    onEdit={noop}
                    onDelete={noop}
                    onToggleFavorite={noop}
                  />
                ))}
              </SimpleGrid>
            </Box>
          </>
        )}
      </VStack>
    </AppLayout>
  );
}
