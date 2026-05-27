import { redirect } from 'next/navigation';
import { getVaultStatus } from '@/services/auth.service';
import { getSessionFromCookies } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  try {
    const status = await getVaultStatus();
    if (!status.configured) {
      redirect('/setup');
    }

    const session = await getSessionFromCookies();
    redirect(session ? '/dashboard' : '/login');
  } catch {
    redirect('/login');
  }
}
