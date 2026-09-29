import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  // Самодостаточный бандл нужен только для cPanel: туда уезжает он, а не 800 МБ node_modules.
  // Vercel собирает своим способом и выставляет VERCEL=1 — ему standalone не нужен.
  output: process.env.VERCEL ? undefined : "standalone",

  // Оптимизатор картинок требует sharp и заметно ест CPU и память.
  // На тарифе с лимитом 1 ГБ это не окупается: next/image тут в трёх местах админки.
  images: { unoptimized: true },

  async headers() {
    // По умолчанию статика шла с max-age=0 — при каждом заходе браузер переспрашивал
    // сервер про каждое видео и картинку.
    // Видео, картинки, шрифты, PDF: имя без хеша, поэтому не навсегда — сутки из кэша,
    // потом ещё неделю отдаём сохранённое, проверяя обновление в фоне.
    const media = "public, max-age=86400, stale-while-revalidate=604800";
    // Vite кладёт в /assets файлы с хешем в имени: изменится содержимое — изменится имя.
    const hashed = "public, max-age=31536000, immutable";
    return [
      {
        // регистр важен: у фото судов встречается .JPG
        source: "/:file(.*\\.(?:mp4|MP4|webm|png|PNG|jpe?g|JPE?G|webp|avif|gif|svg|ico|woff2?|pdf|PDF))",
        headers: [{ key: "Cache-Control", value: media }],
      },
      // последним — при совпадении нескольких правил побеждает последнее
      { source: "/assets/:path*", headers: [{ key: "Cache-Control", value: hashed }] },
    ];
  },

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
