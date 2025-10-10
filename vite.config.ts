
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';
  import fs from 'fs';

  export default defineConfig({
    plugins: [
      react(),
      // _posts 폴더를 서빙하는 플러그인
      {
        name: 'serve-posts',
        configureServer(server) {
          // 개발 서버에서 /_posts/ 경로 처리
          server.middlewares.use((req, res, next) => {
            if (req.url?.startsWith('/_posts/')) {
              try {
                // URL에서 쿼리 파라미터 제거
                const urlPath = req.url.split('?')[0];
                const filename = urlPath.replace('/_posts/', '');
                
                // 파일명 검증 (보안)
                if (filename.includes('..') || !filename.endsWith('.md')) {
                  res.statusCode = 400;
                  res.end('Invalid filename');
                  return;
                }
                
                const filePath = path.resolve(__dirname, '_posts', filename);
                
                if (fs.existsSync(filePath)) {
                  const content = fs.readFileSync(filePath, 'utf-8');
                  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
                  res.setHeader('Cache-Control', 'no-cache');
                  res.end(content);
                  return;
                } else {
                  console.warn(`[serve-posts] File not found: ${filePath}`);
                  res.statusCode = 404;
                  res.end('File not found');
                  return;
                }
              } catch (error) {
                console.error('[serve-posts] Error:', error);
                res.statusCode = 500;
                res.end('Internal server error');
                return;
              }
            }
            next();
          });
        },
        closeBundle() {
          // 빌드 시 dist/_posts로 복사
          const postsDir = path.resolve(__dirname, '_posts');
          const outDir = path.resolve(__dirname, 'dist/_posts');
          
          if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
          }
          
          const files = fs.readdirSync(postsDir);
          files.forEach(file => {
            if (file.endsWith('.md')) {
              fs.copyFileSync(
                path.join(postsDir, file),
                path.join(outDir, file)
              );
            }
          });
          
          console.log('✅ Copied _posts to dist/_posts');
        }
      }
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        'vaul@1.1.2': 'vaul',
        'sonner@2.0.3': 'sonner',
        'recharts@2.15.2': 'recharts',
        'react-resizable-panels@2.1.7': 'react-resizable-panels',
        'react-hook-form@7.55.0': 'react-hook-form',
        'react-day-picker@8.10.1': 'react-day-picker',
        'next-themes@0.4.6': 'next-themes',
        'lucide-react@0.487.0': 'lucide-react',
        'input-otp@1.4.2': 'input-otp',
        'embla-carousel-react@8.6.0': 'embla-carousel-react',
        'cmdk@1.1.1': 'cmdk',
        'class-variance-authority@0.7.1': 'class-variance-authority',
        '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
        '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
        '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
        '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
        '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
        '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
        '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
        '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
        '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
        '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
        '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
        '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
        '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
        '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
        '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
        '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
        '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
        '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
        '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
        '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
        '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
        '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
        '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
        '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
        '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
        '@': path.resolve(__dirname, './src'),
      },
    },
  build: {
    target: 'esnext',
    outDir: 'dist',
  },
    server: {
      port: 3000,
      open: true,
    },
  });