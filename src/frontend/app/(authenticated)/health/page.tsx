'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Progress,
  SimpleGrid,
  Card,
  Button,
} from '@chakra-ui/react';
import { AppLayout } from '@/components/layout/AppLayout';
import { api } from '@/lib/api-client';
import type { VaultHealth } from '@/types';
import Link from 'next/link';

export default function HealthPage() {
  const PAGE_SIZE = 6;
  const [health, setHealth] = useState<VaultHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [weakPage, setWeakPage] = useState(1);

  useEffect(() => {
    api
      .get<VaultHealth>('/api/vault/health')
      .then(setHealth)
      .finally(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <VStack align="stretch" gap={6}>
        <Box>
          <Heading size="lg" letterSpacing="-0.02em">
            Vault Health
          </Heading>
          <Text color="fg.muted" fontSize="sm">
            Visualize a qualidade geral das suas credenciais.
          </Text>
        </Box>

        {loading ? (
          <Text>Carregando...</Text>
        ) : health ? (
          <>
            <Card.Root borderRadius="xl" bg="bg.panel">
              <Card.Body>
                <VStack gap={4}>
                  <Text fontSize="3xl" fontWeight="bold">
                    {health.score}/100
                  </Text>
                  <Progress.Root value={health.score} w="full" size="lg" colorPalette="blue">
                    <Progress.Track>
                      <Progress.Range />
                    </Progress.Track>
                  </Progress.Root>
                </VStack>
              </Card.Body>
            </Card.Root>

            <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
              <Card.Root borderRadius="xl" bg="bg.panel">
                <Card.Body>
                  <Text color="fg.muted">Fortes</Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    {health.strong}/{health.total}
                  </Text>
                </Card.Body>
              </Card.Root>
              <Card.Root borderRadius="xl" bg="bg.panel">
                <Card.Body>
                  <Text color="fg.muted">Fracas</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                    {health.weak}
                  </Text>
                </Card.Body>
              </Card.Root>
              <Card.Root borderRadius="xl" bg="bg.panel">
                <Card.Body>
                  <Text color="fg.muted">Reutilizadas</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="red.500">
                    {health.reused}
                  </Text>
                </Card.Body>
              </Card.Root>
            </SimpleGrid>

            {health.weakCredentials.length > 0 && (
              <Box>
                <Heading size="sm" mb={3}>
                  Senhas fracas
                </Heading>
                <VStack align="stretch" gap={2}>
                  {health.weakCredentials
                    .slice((weakPage - 1) * PAGE_SIZE, weakPage * PAGE_SIZE)
                    .map((c) => (
                    <HStack
                      key={c.id}
                      justify="space-between"
                      p={3}
                      borderWidth="1px"
                      borderRadius="md"
                    >
                      <Text>
                        {c.appName} — score {c.passwordStrength}
                      </Text>
                      <Button asChild size="sm" colorPalette="blue">
                        <Link href={`/credentials?edit=${c.id}`}>Melhorar</Link>
                      </Button>
                    </HStack>
                  ))}
                </VStack>
                {health.weakCredentials.length > PAGE_SIZE && (
                  <HStack justify="center" pt={3}>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={weakPage === 1}
                      onClick={() => setWeakPage((p) => Math.max(1, p - 1))}
                    >
                      Anterior
                    </Button>
                    <Text fontSize="sm" color="fg.muted">
                      Página {weakPage} de{' '}
                      {Math.max(1, Math.ceil(health.weakCredentials.length / PAGE_SIZE))}
                    </Text>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={
                        weakPage >= Math.ceil(health.weakCredentials.length / PAGE_SIZE)
                      }
                      onClick={() => setWeakPage((p) => p + 1)}
                    >
                      Próxima
                    </Button>
                  </HStack>
                )}
              </Box>
            )}
          </>
        ) : null}
      </VStack>
    </AppLayout>
  );
}
