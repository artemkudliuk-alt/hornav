import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    root: './',
    base: '/',
    plugins: [
      {
        name: 'dynamic-page-router',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const rawUrl = req.url || '';
            const cleanUrl = rawUrl.split('?')[0];
            const staticFiles = [
              '/', '/index.html', '/company.html', '/fleet.html', '/vessel.html',
              '/contacts.html', '/accountability.html', '/page.html'
            ];
            if (
              !cleanUrl.includes('.') &&
              !cleanUrl.startsWith('/@') &&
              !cleanUrl.startsWith('/src') &&
              !cleanUrl.startsWith('/assets') &&
              !cleanUrl.startsWith('/api') &&
              !cleanUrl.startsWith('/uploads') &&
              !staticFiles.includes(cleanUrl)
            ) {
              const slug = cleanUrl.replace(/^\/+/, '');
              req.url = `/page.html?slug=${slug}`;
            }
            next();
          });
        }
      }
    ],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        },
        '/uploads': {
          target: 'http://localhost:3000',
          changeOrigin: true,
        }
      }
    },
    css: {
      postcss: './postcss.config.mjs'
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: !isProduction,
      minify: isProduction ? 'terser' : false,
      terserOptions: isProduction ? {
        compress: {
          drop_console: true,
          drop_debugger: true,
          passes: 3,
          unsafe: true,
          pure_getters: true
        },
        mangle: {
          toplevel: true,
          properties: false
        },
        format: {
          comments: false
        }
      } : undefined,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          company: path.resolve(__dirname, 'company.html'),
          accountability: path.resolve(__dirname, 'accountability.html'),
          vessel: path.resolve(__dirname, 'vessel.html'),
          fleet: path.resolve(__dirname, 'fleet.html'),
          contacts: path.resolve(__dirname, 'contacts.html'),
          page: path.resolve(__dirname, 'page.html')
        },
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: ({ name }) => {
            if (/\.(gif|jpe?g|png|svg|webp|avif)$/.test(name ?? '')) {
              return 'assets/img/[name]-[hash].[ext]';
            }
            if (/\.css$/.test(name ?? '')) {
              return 'assets/css/[name]-[hash].[ext]';
            }
            return 'assets/[name]-[hash].[ext]';
          }
        }
      }
    }
  };
});
