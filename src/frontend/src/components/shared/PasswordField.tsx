'use client';

import { Box, Field, Input, HStack, IconButton, Progress } from '@chakra-ui/react';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import {
  calculatePasswordStrength,
  getStrengthLabel,
  getStrengthColor,
} from '@/lib/password-strength';
import { api } from '@/lib/api-client';
import { showToast } from '@/components/ui/toaster';

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  showStrength?: boolean;
  showGenerator?: boolean;
  required?: boolean;
  panicHidden?: boolean;
}

export function PasswordField({
  value,
  onChange,
  label = 'Senha',
  showStrength = true,
  showGenerator = true,
  required,
  panicHidden,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const [generating, setGenerating] = useState(false);
  const strength = calculatePasswordStrength(value);

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await api.get<{ password: string; strength: number }>(
        '/api/password/generate?length=16'
      );
      onChange(res.password);
      showToast('Senha gerada', 'success');
    } catch {
      showToast('Erro ao gerar senha', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const display = panicHidden ? '••••••••' : visible ? value : value ? '•'.repeat(Math.min(value.length, 12)) : '';

  return (
    <Field.Root required={required}>
      <Field.Label>{label}</Field.Label>
      <HStack>
        <Input
          data-sensitive
          type={visible && !panicHidden ? 'text' : 'password'}
          value={panicHidden ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
          flex={1}
        />
        <IconButton
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
          variant="ghost"
          onClick={() => setVisible(!visible)}
          disabled={panicHidden}
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </IconButton>
        {showGenerator && (
          <IconButton
            aria-label="Gerar senha"
            variant="ghost"
            onClick={generate}
            loading={generating}
          >
            <RefreshCw size={16} />
          </IconButton>
        )}
      </HStack>
      {showStrength && value && !panicHidden && (
        <Box mt={2}>
          <Progress.Root value={strength} size="sm" colorPalette={getStrengthColor(strength)}>
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
          </Progress.Root>
          <Box fontSize="xs" color="fg.muted" mt={1}>
            {getStrengthLabel(strength)} ({strength}/100)
          </Box>
        </Box>
      )}
      {panicHidden && (
        <Input type="hidden" value={display} readOnly />
      )}
    </Field.Root>
  );
}
