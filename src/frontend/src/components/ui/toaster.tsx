'use client';

import { createToaster, Toaster as ChakraToaster, Toast } from '@chakra-ui/react';

export const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
});

export function Toaster() {
  return (
    <ChakraToaster toaster={toaster}>
      {(toast) => (
        <Toast.Root>
          <Toast.Title>{toast.title}</Toast.Title>
          {toast.description && <Toast.Description>{toast.description}</Toast.Description>}
          <Toast.CloseTrigger />
        </Toast.Root>
      )}
    </ChakraToaster>
  );
}

export function showToast(
  title: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'success',
  description?: string
) {
  toaster.create({ title, description, type, duration: 3000 });
}
