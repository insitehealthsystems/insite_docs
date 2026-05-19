import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],

  // Fix workspace root detection (multiple lockfiles in monorepo)
  turbopack: {
    root: __dirname,
  },

  async redirects() {
    return [
      { source: '/blog/manage', destination: '/admin/dashboard', permanent: true },
      { source: '/blog/manage/:path*', destination: '/admin/dashboard', permanent: true },
    ]
  },
};

export default nextConfig;
