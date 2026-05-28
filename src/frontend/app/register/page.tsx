import { redirect } from 'next/navigation';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { getSessionFromCookies } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function RegisterPage() {
  const session = await getSessionFromCookies();

  if (session) {
    redirect('/dashboard');
  }

  return <RegisterForm />;
}
