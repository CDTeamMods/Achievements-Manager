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
          input: {
            main: 'src/main/main.js'
          },
          output: {
            format: 'cjs',
            inlineDynamicImports: false,
            entryFileNames: '[name].js',
            chunkFileNames: '[name].js',
            manualChunks: undefined,
            // Preservar estrutura de diretórios
            preserveModules: false,
            preserveModulesRoot: 'src/main'
          }
        },
        minify: isProduction ? false : false,
        sourcemap: !isProduction,
        commonjsOptions: {
          include: [/node_modules/, /src/],
          transformMixedEsModules: true
        },
        // Otimizações de performance para o processo principal
        target: 'node18',
        reportCompressedSize: false,
        chunkSizeWarningLimit: 2000,
        // Preservar estrutura de módulos
        preserveEntrySignatures: 'strict'
      },
      resolve: {
        alias: {
          '@main': resolve('src/main'),
          '@modules': resolve('src/main/modules'),
          '@utils': resolve('src/main/utils')
        },
        // Garantir que caminhos relativos funcionem em produção
        preserveSymlinks: false
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
        minify: isProduction ? 'esbuild' : false,
        sourcemap: !isProduction,
        // Otimizações específicas para preload
        target: 'node18',
        reportCompressedSize: false
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
        minify: isProduction ? 'esbuild' : false,
        sourcemap: !isProduction,
        chunkSizeWarningLimit: 2000,
        assetsInlineLimit: 8192, // Aumentado para melhor performance
        target: 'esnext',
        modulePreload: false,
        reportCompressedSize: false,
        // Otimizações de performance
        cssCodeSplit: true,
        emptyOutDir: true
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
        include: [
          // Pré-bundling de dependências comuns para melhor performance
        ],
        exclude: [
          // Excluir dependências que não devem ser pré-bundled
          'electron'
        ],
        noDiscovery: !isProduction,
        force: false, // Cache de dependências otimizadas
        esbuildOptions: {
          target: 'esnext'
        }
      },
      // Configurações de cache para melhor performance
      cacheDir: 'node_modules/.vite',
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