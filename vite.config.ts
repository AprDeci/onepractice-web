import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import Components from "unplugin-vue-components/vite";
import { resolve } from "path";
import MotionResolver from "motion-v/resolver";
import viteCompression from "vite-plugin-compression";
import { visualizer } from "rollup-plugin-visualizer";
export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    tailwindcss(),
    visualizer(),
    Components({
      dts: true,
      resolvers: [MotionResolver()]
    }),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240, // 文件大小超过此值时进行压缩，单位为字节
      algorithm: "gzip", // 压缩算法，可选 'gzip' 或 'brotli'
      ext: ".gz" // 压缩后的文件扩展名
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@exam": resolve(__dirname, "src/components/exam")
    }
  },
  build: {
    terserOptions: {
      compress: {
        //生产环境时移除console
        drop_console: true,
        drop_debugger: true
      }
    },
    //   关闭文件计算
    reportCompressedSize: false,
    //   关闭生成map文件 可以达到缩小打包体积
    sourcemap: false // 这个生产环境一定要关闭，不然打包的产物会很大}
  }
});
