import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that require authentication here
const protectedPaths = [
  '/dashboard',
  '/create-event',
  '/manage',
  '/manage-attendees',
  '/check-in',
  '/profile',
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('evently_token')?.value;

  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));
  
  if (isProtectedPath && !token) {
    // Redirect to login if accessing a protected route without a token
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Config to specify which paths the middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/create-event/:path*',
    '/manage/:path*',
    '/manage-attendees/:path*',
    '/check-in/:path*',
    '/profile/:path*',
    '/login',
    '/signup'
  ],
};
