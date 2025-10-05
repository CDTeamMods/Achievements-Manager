import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  // Carrega variáveis de ambiente
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'

  return {
    main: {
      plugins: [],
      build: {
        outDir: 'dist/main',
        lib: {
          entry: 'src/main/main.js',
          formats: ['cjs']
        },
        rollupOptions: {
          external: [
            'electron',
            'node:*',
            'fs',
            'path',
            'os',
            'crypto',
            'util',
            'events',
            'stream',
            'buffer',
            'url',
            'querystring',
            'electron-store'
          ],
          output: {
            format: 'cjs',
            inlineDynamicImports: true,
            entryFileNames: '[name].js'
          }
        },
        minify: isProduction,
        sourcemap: !isProduction,
        commonjsOptions: {
          include: [/node_modules/, /src/]
        }
      },
      resolve: {
        alias: {
          '@main': resolve('src/main'),
          '@shared': resolve('src/shared')
        }
      }
    },
    preload: {
      plugins: [externalizeDepsPlugin()],
      build: {
        outDir: 'dist/preload',
        lib: {
          entry: 'src/preload/preload.js',
          formats: ['cjs']
        },
        rollupOptions: {
          external: ['electron'],
          output: {
            entryFileNames: '[name].js'
          }
        },
        minify: isProduction,
         sourcemap: !isProduction
       }
    },
    renderer: {
      root: 'src/renderer',
      plugins: [
        {
          name: 'js-module-content-type',
          configureServer(server) {
            server.middlewares.use((req, res, next) => {
              if (req.url && req.url.endsWith('.js')) {
                res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
                res.setHeader('X-Content-Type-Options', 'nosniff');
              }
              next();
            });
          }
        }
      ],
      build: {
        outDir: 'dist/renderer',
        rollupOptions: {
          input: {
            main: resolve('src/renderer/index.html'),
            splash: resolve('src/renderer/splash.html')
          },
          output: {
            format: 'es',
            entryFileNames: '[name].js',
            chunkFileNames: '[name]-[hash].js',
            assetFileNames: '[name]-[hash].[ext]'
          },
          preserveEntrySignatures: 'strict'
        },
        minify: isProduction,
        sourcemap: !isProduction,
        chunkSizeWarningLimit: 1000,
        assetsInlineLimit: 4096,
        target: 'esnext',
        modulePreload: false
      },
      esbuild: isProduction ? {
        target: 'esnext',
        format: 'esm',
        platform: 'browser',
        legalComments: 'none',
        keepNames: true
      } : false,
      rollupOptions: {
        external: [],
        output: {
          format: 'es',
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js'
        }
      },
      resolve: {
        alias: {
          '@renderer': resolve('src/renderer'),
          '@shared': resolve('src/shared'),
          '@': resolve('src/renderer')
        }
      },
      css: {
        postcss: './postcss.config.js',
        devSourcemap: !isProduction,
        preprocessorOptions: {
          scss: {
            additionalData: `@import "@/styles/variables.scss";`
          }
        }
      },
      optimizeDeps: {
        include: [],
        noDiscovery: !isProduction
      },
      server: {
        port: 3000,
        strictPort: true,
        cors: true,
        hmr: {
          port: 3002,
          host: 'localhost'
        },
        middlewareMode: false,
        fs: {
          strict: false
        }
      },
      define: {
        __DEV__: !isProduction,
        __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
      }
    }
  }
})