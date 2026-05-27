import { redirect } from 'next/navigation';
import { getVaultStatus } from '@/services/auth.service';
import { getSessionFromCookies } from '@/lib/session';
import { SetupForm } from '@/components/auth/SetupForm';

export const dynamic = 'force-dynamic';

export default async function SetupPage() {
  const [status, session] = await Promise.all([
    getVaultStatus(),
    getSessionFromCookies(),
  ]);

  if (status.configured) {
    redirect(session ? '/dashboard' : '/login');
  }

  return <SetupForm />;
}
