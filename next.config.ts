import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  // Собираем самодостаточный бандл: на сервер уезжает он, а не 800 МБ node_modules.
  output: "standalone",

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
