import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = [
  '/login',
  '/register',
  '/setup',
  '/api/vault/status',
  '/api/vault/setup',
  '/api/auth/login',
  '/api/auth/register',
];
const PUBLIC_PREFIXES = [
  '/api/vault/status',
  '/api/vault/setup',
  '/api/auth/login',
  '/api/auth/register',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSessionCookie = !!request.cookies.get('vault_session')?.value;

  const isPublic =
    PUBLIC_PATHS.includes(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/manifest') ||
    pathname === '/sw.js' ||
    pathname.match(/\.(ico|png|svg|json|webmanifest)$/);

  if (pathname.startsWith('/api/') && isPublic) {
    return NextResponse.next();
  }

  // Redireciona na borda (Edge) — não depende de Prisma
  if (pathname === '/') {
    const target = hasSessionCookie ? '/dashboard' : '/login';
    return NextResponse.redirect(new URL(target, request.url));
  }

  if (!hasSessionCookie && !isPublic) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Sessão inválida' } },
        { status: 401 }
      );
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
