import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:4400';
  const path = request.nextUrl.pathname.replace(/^\/api/, '');
  const destination = new URL(`${path}${request.nextUrl.search}`, backendUrl);
  return NextResponse.rewrite(destination);
}

export const config = {
  matcher: '/api/:path*'
};
