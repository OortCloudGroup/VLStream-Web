import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendTarget = env.VITE_DEV_PROXY_TARGET || 'http://127.0.0.1:8080'
  const ssoTarget = env.VITE_SSO_PROXY_TARGET || 'http://oort.oortcloudsmart.com:21410/bus/apaas-sso'

  const backendProxy = {
    target: backendTarget,
    changeOrigin: true,
    secure: false
  }

  return {
    plugins: [vue()],
    base: '/bus/vls-ui/',  // 生产环境的基础路径
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      port: 3000,
      host: '0.0.0.0',  // 允许所有IP访问
      headers: {
        // 临时移除COEP策略以允许跨域图片显示
        // 'Cross-Origin-Embedder-Policy': 'require-corp',
        // 'Cross-Origin-Opener-Policy': 'same-origin'
      },
      proxy: {
        '/system': backendProxy,
        '/blade-auth': backendProxy,
        '/blade-system': backendProxy,
        '/auth': backendProxy,
        '/blade-job': backendProxy,
        '/vls': backendProxy,
        '/vlsTagManagement': backendProxy,
        '/vlsAlgorithmTraining': backendProxy,
        '/vlsAlgorithmModel': backendProxy,
        '/vlsAlgorithmManagement': backendProxy,
        '/vlsDevice': backendProxy,
        '/video-record': backendProxy,
        '/api': backendProxy,
        '/sso': {
          target: ssoTarget,
          changeOrigin: true,
          secure: false
        }
      }
    }
  }
})
