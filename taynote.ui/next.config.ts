import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:4400';
    return [{ source: '/api/:path*', destination: `${backendUrl}/:path*` }];
  }
};

export default nextConfig;
