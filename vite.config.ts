import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api/vpb/its': {
        target: 'http://api3.mit.mgsops.com:7725',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/vpb\/its/, '/Account/VirtualPitBoss/v1'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('ITS VPB proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending ITS VPB Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received ITS VPB Response:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/api/vpb/betway': {
        target: 'http://api2.mal.mgsops.com:7725',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/vpb\/betway/, '/Account/VirtualPitBoss/v1'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Betway VPB proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Betway VPB Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Betway VPB Response:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/api/tokens/its': {
        target: 'http://api3.mit.mgsops.com:7725',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tokens\/its/, '/System/OperatorSecurity/v1/operatortokens'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('ITS Token proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending ITS Token Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received ITS Token Response:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/api/tokens/betway': {
        target: 'http://api2.mal.mgsops.com:7725',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/tokens\/betway/, '/System/OperatorSecurity/v1/operatortokens'),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Betway Token proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Betway Token Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Betway Token Response:', proxyRes.statusCode, req.url);
          });
        },
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@types': path.resolve(__dirname, './src/types'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@data': path.resolve(__dirname, './src/data')
    }
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          icons: ['lucide-react']
        }
      }
    }
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  }
})