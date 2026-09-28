import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  // Самодостаточный бандл нужен только для cPanel: туда уезжает он, а не 800 МБ node_modules.
  // Vercel собирает своим способом и выставляет VERCEL=1 — ему standalone не нужен.
  output: process.env.VERCEL ? undefined : "standalone",

  // Оптимизатор картинок требует sharp и заметно ест CPU и память.
  // На тарифе с лимитом 1 ГБ это не окупается: next/image тут в трёх местах админки.
  images: { unoptimized: true },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          destination: "/index.html",
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
