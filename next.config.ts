import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/index.html",
      },
    ];
  },
};

export default nextConfig;
