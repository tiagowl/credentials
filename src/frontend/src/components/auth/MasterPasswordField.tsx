'use client';

import { Box, Field, HStack, IconButton, Input, Progress, Text } from '@chakra-ui/react';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import {
  calculatePasswordStrength,
  getStrengthColor,
  getStrengthLabel,
} from '@/lib/password-strength';
import { generatePasswordLocal } from '@/lib/password-generator';

interface MasterPasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  confirmValue?: string;
  onConfirmChange?: (value: string) => void;
  showConfirm?: boolean;
  showGenerator?: boolean;
  required?: boolean;
}

export function MasterPasswordField({
  value,
  onChange,
  label = 'Senha mestra',
  confirmValue = '',
  onConfirmChange,
  showConfirm = false,
  showGenerator = true,
  required,
}: MasterPasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const strength = calculatePasswordStrength(value);

  const generate = () => {
    onChange(generatePasswordLocal(20, true));
    if (onConfirmChange) onConfirmChange('');
  };

  return (
    <>
      <Field.Root required={required}>
        <Field.Label>{label}</Field.Label>
        <HStack>
          <Input
            type={visible ? 'text' : 'password'}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            flex={1}
            autoComplete="new-password"
          />
          <IconButton
            aria-label={visible ? 'Ocultar' : 'Mostrar'}
            variant="ghost"
            onClick={() => setVisible(!visible)}
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </IconButton>
          {showGenerator && (
            <IconButton
              aria-label="Gerar senha forte"
              variant="ghost"
              title="Gerar senha automaticamente"
              onClick={generate}
            >
              <RefreshCw size={16} />
            </IconButton>
          )}
        </HStack>
        {value && (
          <Box mt={2}>
            <Progress.Root
              value={strength}
              size="sm"
              colorPalette={getStrengthColor(strength)}
            >
              <Progress.Track>
                <Progress.Range />
              </Progress.Track>
            </Progress.Root>
            <Text fontSize="xs" color="fg.muted">
              {getStrengthLabel(strength)}
            </Text>
          </Box>
        )}
      </Field.Root>

      {showConfirm && onConfirmChange && (
        <Field.Root required={required}>
          <Field.Label>Confirmar senha mestra</Field.Label>
          <HStack>
            <Input
              type={confirmVisible ? 'text' : 'password'}
              value={confirmValue}
              onChange={(e) => onConfirmChange(e.target.value)}
              flex={1}
              autoComplete="new-password"
            />
            <IconButton
              aria-label={confirmVisible ? 'Ocultar' : 'Mostrar'}
              variant="ghost"
              onClick={() => setConfirmVisible(!confirmVisible)}
            >
              {confirmVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </IconButton>
          </HStack>
        </Field.Root>
      )}
    </>
  );
}
