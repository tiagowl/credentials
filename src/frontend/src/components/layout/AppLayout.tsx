'use client';

import {
  Box,
  Flex,
  HStack,
  VStack,
  Text,
  Button,
  Input,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import {
  LayoutDashboard,
  Key,
  Shield,
  Settings,
  User,
  Plus,
  Lock,
  LogOut,
  Moon,
  Sun,
  Menu,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useColorMode } from '@/components/ui/color-mode';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { usePanicMode } from '@/hooks/usePanicMode';
import { useState } from 'react';
import { api } from '@/lib/api-client';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/credentials', label: 'Credenciais', icon: Key },
  { href: '/health', label: 'Vault Health', icon: Shield },
  { href: '/profile', label: 'Minha conta', icon: User },
  { href: '/settings', label: 'Configurações', icon: Settings },
];

interface AppLayoutProps {
  children: React.ReactNode;
  onSearch?: (q: string) => void;
  searchValue?: string;
  onNewCredential?: () => void;
}

export function AppLayout({
  children,
  onSearch,
  searchValue = '',
  onNewCredential,
}: AppLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { colorMode, setColorMode, resolvedMode } = useColorMode();
  const { showWarning, continueSession } = useSessionTimeout(15);
  const { panicActive } = usePanicMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  const toggleTheme = () => {
    const next =
      colorMode === 'light' ? 'dark' : colorMode === 'dark' ? 'system' : 'light';
    setColorMode(next);
    api.patch('/api/vault/config', {
      theme: next.toUpperCase() as 'LIGHT' | 'DARK' | 'SYSTEM',
    }).catch(() => {});
  };

  const lockVault = async () => {
    await api.post('/api/auth/lock');
    router.push('/login');
  };

  const logout = async () => {
    await api.post('/api/auth/logout');
    router.push('/login?logout=1');
    router.refresh();
  };

  const Sidebar = () => (
    <VStack
      align="stretch"
      gap={2}
      p={4}
      w={{ base: 'full', md: '240px' }}
      borderRightWidth={{ md: '1px' }}
      minH={{ md: '100vh' }}
      bg="bg.panel"
      backdropFilter="blur(8px)"
    >
      <Box px={2} py={2} mb={2}>
        <Text fontWeight="bold" fontSize="lg" letterSpacing="-0.02em">
          Credentials Vault
        </Text>
        <Text fontSize="xs" color="fg.muted">
          Secure Personal Manager
        </Text>
      </Box>
      {NAV.map(({ href, label, icon: Icon }) => (
        <Button
          key={href}
          asChild
          variant={pathname === href ? 'solid' : 'ghost'}
          colorPalette={pathname === href ? 'blue' : undefined}
          justifyContent="flex-start"
          borderRadius="lg"
          h="42px"
          onClick={() => isMobile && setSidebarOpen(false)}
        >
          <Link href={href}>
            <Icon size={18} />
            {label}
          </Link>
        </Button>
      ))}
    </VStack>
  );

  return (
    <Flex minH="100vh" direction={{ base: 'column', md: 'row' }} bg="bg.canvas">
      {!isMobile && <Sidebar />}
      {isMobile && sidebarOpen && (
        <Box
          position="fixed"
          inset={0}
          zIndex={100}
          bg="blackAlpha.600"
          onClick={() => setSidebarOpen(false)}
        >
          <Box bg="bg.surface" w="80%" maxW="280px" h="full" onClick={(e) => e.stopPropagation()}>
            <Sidebar />
          </Box>
        </Box>
      )}

      <Flex direction="column" flex={1} minW={0}>
        <HStack
          px={4}
          py={3}
          borderBottomWidth="1px"
          bg="bg.panel"
          backdropFilter="blur(8px)"
          gap={3}
          flexWrap="wrap"
          position="sticky"
          top={0}
          zIndex={20}
        >
          {isMobile && (
            <IconButton
              aria-label="Menu"
              variant="ghost"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </IconButton>
          )}
          {onSearch && (
            <Input
              data-search
              placeholder="Buscar credenciais... (Ctrl+K)"
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              maxW={{ md: '400px' }}
              flex={1}
              size="sm"
              borderRadius="lg"
            />
          )}
          <HStack ml="auto" gap={1}>
            <IconButton aria-label="Tema" variant="ghost" onClick={toggleTheme}>
              {resolvedMode === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </IconButton>
            <IconButton aria-label="Bloquear vault" variant="ghost" onClick={lockVault}>
              <Lock size={18} />
            </IconButton>
            <IconButton aria-label="Sair da conta" variant="ghost" onClick={logout}>
              <LogOut size={18} />
            </IconButton>
            {onNewCredential && (
              <Button size="sm" colorPalette="blue" onClick={onNewCredential}>
                <Plus size={16} /> Nova
              </Button>
            )}
          </HStack>
        </HStack>

        {showWarning && (
          <HStack bg="orange.subtle" px={4} py={2} justify="space-between">
            <Text fontSize="sm">Sessão expira em 1 minuto</Text>
            <Button size="xs" onClick={continueSession}>
              Continuar
            </Button>
          </HStack>
        )}

        {panicActive && (
          <HStack bg="gray.subtle" px={4} py={2} justify="center">
            <Text fontSize="sm">Vault oculto — Ctrl+H para restaurar</Text>
          </HStack>
        )}

        <Box flex={1} p={{ base: 4, md: 6 }} overflow="auto">
          {children}
        </Box>

        {isMobile && (
          <HStack
            borderTopWidth="1px"
            justify="space-around"
            py={2}
            bg="bg.panel"
            backdropFilter="blur(8px)"
            display={{ md: 'none' }}
          >
            {NAV.map(({ href, icon: Icon }) => (
              <IconButton
                key={href}
                asChild
                aria-label={href}
                variant={pathname === href ? 'solid' : 'ghost'}
                colorPalette={pathname === href ? 'blue' : undefined}
              >
                <Link href={href}>
                  <Icon size={20} />
                </Link>
              </IconButton>
            ))}
          </HStack>
        )}
      </Flex>
    </Flex>
  );
}
