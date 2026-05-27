import { redirect } from 'next/navigation';
import { getSessionFromCookies } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionFromCookies();
  if (!session) {
    redirect('/login');
  }
  return <>{children}</>;
}
