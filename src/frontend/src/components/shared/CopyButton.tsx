'use client';

import { IconButton } from '@chakra-ui/react';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { showToast } from '@/components/ui/toaster';

interface CopyButtonProps {
  value: string;
  label?: string;
  size?: 'sm' | 'md';
}

export function CopyButton({ value, label = 'Valor', size = 'sm' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      showToast(`${label} copiado`, 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Erro ao copiar', 'error');
    }
  };

  return (
    <IconButton
      aria-label={`Copiar ${label}`}
      size={size}
      variant="ghost"
      onClick={handleCopy}
      colorPalette={copied ? 'green' : 'gray'}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </IconButton>
  );
}
