'use client';

import {
  Box,
  Card,
  HStack,
  VStack,
  Text,
  Badge,
  Button,
  Image,
} from '@chakra-ui/react';
import { Star } from 'lucide-react';
import type { CredentialListItem } from '@/types';
import { CopyButton } from '@/components/shared/CopyButton';
import { PasswordField } from '@/components/shared/PasswordField';
import { CATEGORY_LABELS } from '@/lib/constants';
import { getInitialColor } from '@/lib/constants';
import { useState } from 'react';

interface CredentialCardProps {
  credential: CredentialListItem;
  onEdit: (c: CredentialListItem) => void;
  onDelete: (c: CredentialListItem) => void;
  onToggleFavorite: (c: CredentialListItem) => void;
  onOpen?: (c: CredentialListItem) => void;
  panicHidden?: boolean;
  compact?: boolean;
}

export function CredentialCard({
  credential,
  onEdit,
  onDelete,
  onToggleFavorite,
  onOpen,
  panicHidden,
  compact,
}: CredentialCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const initial = credential.appName.charAt(0).toUpperCase();
  const bgColor = getInitialColor(credential.appName);

  return (
    <Card.Root
      size="sm"
      variant="outline"
      borderRadius="xl"
      bg="bg.panel"
      cursor={onOpen ? 'pointer' : undefined}
      onClick={onOpen ? () => onOpen(credential) : undefined}
      _hover={{ shadow: 'lg', transform: 'translateY(-3px)' }}
      transition="all 0.2s ease"
    >
      <Card.Header pb={2}>
        <HStack justify="space-between">
          <HStack gap={3}>
            {credential.iconUrl ? (
              <Image
                src={credential.iconUrl}
                alt={credential.appName}
                boxSize="40px"
                borderRadius="full"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : (
              <Box
                w="40px"
                h="40px"
                borderRadius="full"
                bg={bgColor}
                color="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontWeight="bold"
              >
                {initial}
              </Box>
            )}
            <VStack align="start" gap={0}>
              <Text fontWeight="semibold" letterSpacing="-0.01em">
                {credential.appName}
              </Text>
              <Badge size="sm" colorPalette="blue">
                {CATEGORY_LABELS[credential.category]}
              </Badge>
            </VStack>
          </HStack>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(credential);
            }}
            aria-label="Favorito"
          >
            <Star
              size={18}
              fill={credential.isFavorite ? 'gold' : 'none'}
              color={credential.isFavorite ? 'gold' : 'currentColor'}
            />
          </Button>
        </HStack>
      </Card.Header>
      <Card.Body pt={0}>
        <VStack align="stretch" gap={2}>
          {credential.username && (
            <HStack justify="space-between">
              <Text fontSize="sm" color="fg.muted">
                {credential.username}
              </Text>
              <Box onClick={(e) => e.stopPropagation()}>
                <CopyButton value={credential.username} label="Usuário" />
              </Box>
            </HStack>
          )}
          {credential.email && (
            <HStack justify="space-between">
              <Text fontSize="sm" color="fg.muted">
                {credential.email}
              </Text>
              <Box onClick={(e) => e.stopPropagation()}>
                <CopyButton value={credential.email} label="Email" />
              </Box>
            </HStack>
          )}
          {!compact && (
            <HStack justify="space-between" data-sensitive>
              <Text fontSize="sm" fontFamily="mono">
                {panicHidden || !showPassword
                  ? '••••••••'
                  : credential.password}
              </Text>
              <HStack onClick={(e) => e.stopPropagation()}>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={panicHidden}
                >
                  {showPassword ? 'Ocultar' : 'Ver'}
                </Button>
                <CopyButton value={credential.password} label="Senha" />
              </HStack>
            </HStack>
          )}
          {compact && (
            <Box onClick={(e) => e.stopPropagation()}>
              <CopyButton value={credential.password} label="Senha" />
            </Box>
          )}
        </VStack>
      </Card.Body>
      {!compact && (
        <Card.Footer pt={0}>
          <HStack w="full" justify="flex-end" gap={2}>
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(credential);
              }}
            >
              Editar
            </Button>
            <Button
              size="sm"
              colorPalette="red"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(credential);
              }}
            >
              Excluir
            </Button>
          </HStack>
        </Card.Footer>
      )}
    </Card.Root>
  );
}
