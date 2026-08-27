import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  // Proxy the Danamira marketing site through the admin server.
  // Admin routes (/fleet, /leads, /settings, /api/...) take priority.
  // Everything else falls through to the Vite frontend (port 5173).
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          source: "/:path*",
          destination: "http://localhost:5173/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
