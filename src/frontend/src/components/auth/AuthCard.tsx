'use client';

import { Box, Card, Heading, Text, VStack } from '@chakra-ui/react';

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="bg.canvas"
      p={4}
    >
      <Card.Root maxW="400px" w="full" p={6}>
        <VStack gap={6} align="stretch">
          <VStack gap={1}>
            <Text fontSize="2xl">🔐</Text>
            <Heading size="lg">{title}</Heading>
            {subtitle && (
              <Text color="fg.muted" fontSize="sm" textAlign="center">
                {subtitle}
              </Text>
            )}
          </VStack>
          {children}
        </VStack>
      </Card.Root>
    </Box>
  );
}
