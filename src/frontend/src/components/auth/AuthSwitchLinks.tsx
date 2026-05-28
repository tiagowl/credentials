'use client';

import Link from 'next/link';
import { Box, Text } from '@chakra-ui/react';

interface AuthSwitchLinksProps {
  mode: 'login' | 'register';
}

export function AuthSwitchLinks({ mode }: AuthSwitchLinksProps) {
  if (mode === 'login') {
    return (
      <Box
        mt={4}
        pt={4}
        borderTopWidth="1px"
        borderColor="border.muted"
        textAlign="center"
      >
        <Text fontSize="sm" color="fg.muted" mb={2}>
          Não tem uma conta?
        </Text>
        <Link href="/register">
          <Text
            as="span"
            fontSize="sm"
            fontWeight="semibold"
            color="blue.500"
            _hover={{ textDecoration: 'underline' }}
          >
            Criar conta gratuita →
          </Text>
        </Link>
      </Box>
    );
  }

  return (
    <Box
      mt={4}
      pt={4}
      borderTopWidth="1px"
      borderColor="border.muted"
      textAlign="center"
    >
      <Text fontSize="sm" color="fg.muted" mb={2}>
        Já possui conta?
      </Text>
      <Link href="/login">
        <Text
          as="span"
          fontSize="sm"
          fontWeight="semibold"
          color="blue.500"
          _hover={{ textDecoration: 'underline' }}
        >
          Entrar no vault →
        </Text>
      </Link>
    </Box>
  );
}
