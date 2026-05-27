'use client';

import { ThemeProvider, useTheme as useNextTheme } from 'next-themes';
import { createContext, useContext, useEffect, useState } from 'react';

type ColorMode = 'light' | 'dark' | 'system';

interface ColorModeContextValue {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  resolvedMode: 'light' | 'dark';
}

const ColorModeContext = createContext<ColorModeContextValue | undefined>(undefined);

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ColorModeProviderInner>{children}</ColorModeProviderInner>
    </ThemeProvider>
  );
}

function ColorModeProviderInner({ children }: { children: React.ReactNode }) {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const colorMode = (mounted ? theme : 'system') as ColorMode;
  const resolvedMode = (mounted ? resolvedTheme : 'light') as 'light' | 'dark';

  return (
    <ColorModeContext.Provider
      value={{
        colorMode,
        setColorMode: (m) => {
          if (mounted) setTheme(m);
        },
        resolvedMode,
      }}
    >
      {children}
    </ColorModeContext.Provider>
  );
}

export function useColorMode() {
  const ctx = useContext(ColorModeContext);
  if (!ctx) throw new Error('useColorMode must be used within ColorModeProvider');
  return ctx;
}
