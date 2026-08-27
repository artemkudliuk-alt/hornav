import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  // Admin panel lives at /admin prefix.
  // Vite (port 3000) proxies /admin/* here (port 3001).
  basePath: "/admin",
};

export default nextConfig;
