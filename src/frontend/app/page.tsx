import { redirect } from 'next/navigation';
import { getSessionFromCookies } from '@/lib/session';
import { getVaultStatus } from '@/services/auth.service';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  try {
    const [session, status] = await Promise.all([
      getSessionFromCookies(),
      getVaultStatus(),
    ]);
    if (session) {
      redirect('/dashboard');
    }
    redirect(status.configured ? '/login' : '/register');
  } catch {
    redirect('/login');
  }
}
