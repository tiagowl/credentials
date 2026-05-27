import type { Metadata, Viewport } from 'next';
import { Provider } from '@/components/ui/provider';
import { PwaRegister } from '@/components/shared/PwaRegister';
import './globals.css';

export const metadata: Metadata = {
  title: 'Credentials Vault',
  description: 'Gerenciador pessoal de credenciais',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#3182CE',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Provider>
          <PwaRegister />
          {children}
        </Provider>
      </body>
    </html>
  );
}
