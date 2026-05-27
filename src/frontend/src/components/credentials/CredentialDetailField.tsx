'use client';

import { HStack, VStack, Text, Box } from '@chakra-ui/react';
import { CopyButton } from '@/components/shared/CopyButton';

interface CredentialDetailFieldProps {
  label: string;
  value: string;
  copyValue?: string;
  mono?: boolean;
  children?: React.ReactNode;
}

export function CredentialDetailField({
  label,
  value,
  copyValue,
  mono,
  children,
}: CredentialDetailFieldProps) {
  const toCopy = copyValue ?? value;
  const showCopy = toCopy && toCopy !== '—';

  return (
    <HStack
      justify="space-between"
      align="start"
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      bg="bg.panel"
      gap={3}
    >
      <VStack align="start" gap={1} flex={1} minW={0}>
        <Text fontSize="xs" fontWeight="medium" color="fg.muted" textTransform="uppercase">
          {label}
        </Text>
        {children ?? (
          <Text
            fontSize="sm"
            fontFamily={mono ? 'mono' : undefined}
            wordBreak="break-all"
          >
            {value}
          </Text>
        )}
      </VStack>
      {showCopy && !children && (
        <Box flexShrink={0}>
          <CopyButton value={toCopy} label={label} />
        </Box>
      )}
    </HStack>
  );
}
