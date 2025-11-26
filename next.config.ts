import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  experimental: {
    // e.g. allow up to 100MB
    middlewareClientMaxBodySize: '100mb',
  },
};

export default nextConfig;
