import { redirect } from 'next/navigation';
import { getSessionFromCookies } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  try {
    const session = await getSessionFromCookies();
    redirect(session ? '/dashboard' : '/login');
  } catch {
    redirect('/login');
  }
}
