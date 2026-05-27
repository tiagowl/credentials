import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { LoginForm } from '@/components/auth/LoginForm';
import { getVaultStatus } from '@/services/auth.service';
import { getSessionFromCookies } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const [status, session] = await Promise.all([
    getVaultStatus(),
    getSessionFromCookies(),
  ]);

  if (!status.configured) {
    redirect('/setup');
  }
  if (session) {
    redirect('/dashboard');
  }

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
