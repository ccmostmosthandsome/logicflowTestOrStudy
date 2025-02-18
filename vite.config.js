import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vitejs.dev/config/
export default defineConfig({
  // 在codesandbox中需要用443来保证开发时不会重复刷新
  // server: {
  //   hmr: {
  //     port: 443
  //   }
  // },
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  // 服务配置
  server: {
    port: 3000, // 端口号
    open: true, // 自动在浏览器打开
    cors: true, // 允许跨域
    host: "0.0.0.0",
    https: false, // 是否开启 https,
    proxy: {
      //   "/api": {
      //     target: loadEnv(mode, process.cwd()).VITE_APP_BASE_API,
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(/^\/api/, ""),
      //   },
    },
  },
});
