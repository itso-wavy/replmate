import { NextRequest, NextResponse } from 'next/server';

import { getToken } from 'next-auth/jwt';

const PROTECTED_PATHS = [
  '/dashboard',
  '/stores',
  '/products',
  '/options',
  '/replys',
  '/subscribe',
  '/account',
];

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  if (!token && isProtected) {
    const url = new URL('/login', req.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  if (token && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/stores/:path*',
    '/products/:path*',
    '/options/:path*',
    '/replys/:path*',
    '/subscribe/:path*',
    '/account/:path*',
    '/login',
  ],
};
