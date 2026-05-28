import { redirect } from 'next/navigation';
import { getSessionFromCookies } from '@/lib/session';

export const dynamic = 'force-dynamic';

/** Fallback server-side se o middleware não rodar */
export default async function HomePage() {
  const session = await getSessionFromCookies();
  redirect(session ? '/dashboard' : '/login');
}
