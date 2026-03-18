import { NextRequest, NextResponse } from 'next/server';

import { getToken } from 'next-auth/jwt';

import type { UserDto } from '@/types/api/user';

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
  const needsTermsAgreement =
    (token?.user as UserDto | undefined)?.needsTermsAgreement === true;

  // 비로그인 + 보호 경로 → 로그인
  if (!token && isProtected) {
    const url = new URL('/login', req.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // 비로그인 + 약관 동의 페이지 → 로그인
  if (!token && pathname === '/terms-agreement') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 로그인 + 약관 미동의 + 보호 경로 → 약관 동의 페이지
  if (token && needsTermsAgreement && isProtected) {
    return NextResponse.redirect(new URL('/terms-agreement', req.url));
  }

  // 로그인 + 약관 완료 + 약관 동의 페이지 → 대시보드
  if (token && !needsTermsAgreement && pathname === '/terms-agreement') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // 로그인 + 로그인 페이지 → 대시보드
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
    '/terms-agreement',
    '/login',
  ],
};
