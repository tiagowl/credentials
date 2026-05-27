'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Box,
  Heading,
  SimpleGrid,
  HStack,
  VStack,
  Button,
  Input,
  NativeSelect,
  Text,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CredentialCard } from '@/components/credentials/CredentialCard';
import { CredentialForm } from '@/components/credentials/CredentialForm';
import { api, ApiClientError } from '@/lib/api-client';
import type { CredentialListItem, CredentialDTO, PaginatedCredentials } from '@/types';
import { CATEGORY_LABELS } from '@/lib/constants';
import { showToast } from '@/components/ui/toaster';
import { usePanicMode } from '@/hooks/usePanicMode';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

function CredentialsContent() {
  const PAGE_SIZE = 6;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [credentials, setCredentials] = useState<CredentialListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 300);
  const [filterApp, setFilterApp] = useState('');
  const [filterUserEmail, setFilterUserEmail] = useState('');
  const debouncedUserEmail = useDebouncedValue(filterUserEmail, 300);
  const [filterCategory, setFilterCategory] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<CredentialDTO | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CredentialListItem | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { panicActive } = usePanicMode();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set('search', debouncedSearch);
      if (filterApp) params.set('appName', filterApp);
      if (debouncedUserEmail) params.set('userEmail', debouncedUserEmail);
      if (filterCategory) params.set('category', filterCategory);
      params.set('limit', String(PAGE_SIZE));
      params.set('offset', String((page - 1) * PAGE_SIZE));
      const data = await api.get<PaginatedCredentials>(
        `/api/credentials?${params.toString()}`
      );
      setCredentials(data.items);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filterApp, debouncedUserEmail, filterCategory, page]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterApp, debouncedUserEmail, filterCategory]);

  useEffect(() => {
    if (searchParams.get('new') === '1') {
      setEditing(null);
      setFormOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === 'k') || e.key === '/') {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('[data-search]')?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSubmit = async (data: Record<string, unknown>) => {
    setSubmitting(true);
    try {
      if (editing) {
        await api.put(`/api/credentials/${editing.id}`, data);
        showToast('Credencial atualizada', 'success');
      } else {
        await api.post('/api/credentials', data);
        showToast('Credencial criada', 'success');
      }
      setFormOpen(false);
      setEditing(null);
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
    if (!deleteTarget) return;
    try {
      await api.delete(`/api/credentials/${deleteTarget.id}`);
      showToast('Credencial excluída', 'success');
      setDeleteTarget(null);
      load();
    } catch {
      showToast('Erro ao excluir', 'error');
    }
  };

  const handleToggleFavorite = async (c: CredentialListItem) => {
    try {
      await api.patch(`/api/credentials/${c.id}/favorite`);
      load();
    } catch {
      showToast('Erro ao favoritar', 'error');
    }
  };

  const openEdit = async (c: CredentialListItem) => {
    try {
      const full = await api.get<CredentialDTO>(`/api/credentials/${c.id}`);
      setEditing(full);
      setFormOpen(true);
    } catch {
      showToast('Erro ao carregar credencial', 'error');
    }
  };

  return (
    <AppLayout
      searchValue={search}
      onSearch={setSearch}
      onNewCredential={() => {
        setEditing(null);
        setFormOpen(true);
      }}
    >
      <VStack align="stretch" gap={4}>
        <Box>
          <Heading size="lg" letterSpacing="-0.02em">
            Credenciais
          </Heading>
          <Text color="fg.muted" fontSize="sm">
            Gerencie, filtre e proteja suas contas em um só lugar.
          </Text>
        </Box>

        <HStack
          flexWrap="wrap"
          gap={2}
          borderWidth="1px"
          borderRadius="xl"
          bg="bg.panel"
          p={3}
        >
          <Input
            placeholder="Filtrar por app"
            value={filterApp}
            onChange={(e) => setFilterApp(e.target.value)}
            maxW={{ base: 'full', md: '180px' }}
            flex={{ base: '1 1 100%', md: '0 0 auto' }}
            size="sm"
          />
          <Input
            placeholder="Usuário ou email"
            value={filterUserEmail}
            onChange={(e) => setFilterUserEmail(e.target.value)}
            maxW={{ base: 'full', md: '220px' }}
            flex={{ base: '1 1 100%', md: '0 0 auto' }}
            size="sm"
          />
          <NativeSelect.Root maxW="180px" size="sm">
            <NativeSelect.Field
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Todas categorias</option>
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </NativeSelect.Field>
          </NativeSelect.Root>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setFilterApp('');
              setFilterUserEmail('');
              setFilterCategory('');
              setSearch('');
              setPage(1);
            }}
          >
            Limpar filtros
          </Button>
        </HStack>

        <Text fontSize="sm" color="fg.muted">
          {total} credencial(is)
        </Text>

        {loading ? (
          <Text>Carregando...</Text>
        ) : credentials.length === 0 ? (
          <VStack py={8}>
            <Text>Nenhuma credencial encontrada</Text>
            <Button
              colorPalette="blue"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              + Adicionar credencial
            </Button>
          </VStack>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, xl: 3 }} gap={4}>
            {credentials.map((c) => (
              <CredentialCard
                key={c.id}
                credential={c}
                panicHidden={panicActive}
                onOpen={(cred) => router.push(`/credentials/${cred.id}`)}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </SimpleGrid>
        )}

        {!loading && total > PAGE_SIZE && (
          <HStack justify="center" pt={2}>
            <Button
              size="sm"
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </Button>
            <Text fontSize="sm" color="fg.muted">
              Página {page} de {Math.max(1, Math.ceil(total / PAGE_SIZE))}
            </Text>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= Math.ceil(total / PAGE_SIZE)}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </Button>
          </HStack>
        )}
      </VStack>

      <Dialog.Root
        open={formOpen}
        onOpenChange={(e) => {
          if (!e.open) {
            setFormOpen(false);
            setEditing(null);
          }
        }}
        size={{ base: 'full', md: 'lg' }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>
                  {editing ? 'Editar credencial' : 'Nova credencial'}
                </Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <CredentialForm
                  initial={editing ?? undefined}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setFormOpen(false);
                    setEditing(null);
                  }}
                  loading={submitting}
                />
              </Dialog.Body>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>

      <Dialog.Root
        open={!!deleteTarget}
        onOpenChange={(e) => !e.open && setDeleteTarget(null)}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Excluir credencial?</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  {deleteTarget?.appName} será removido permanentemente.
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                  Cancelar
                </Button>
                <Button colorPalette="red" onClick={handleDelete}>
                  Excluir
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </AppLayout>
  );
}

export default function CredentialsPage() {
  return (
    <Suspense fallback={<Text>Carregando...</Text>}>
      <CredentialsContent />
    </Suspense>
  );
}
