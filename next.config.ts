import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // No output: 'export' — this causes 404 on Vercel with App Router
  // No basePath unless you have a subdirectory deployment
};

export default nextConfig;
