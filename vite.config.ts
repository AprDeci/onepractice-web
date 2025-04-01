import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import Components from "unplugin-vue-components/vite";
import { resolve } from "path";
import MotionResolver from "motion-v/resolver";

export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    tailwindcss(),
    Components({
      dts: true,
      resolvers: [MotionResolver()]
    })
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@exam": resolve(__dirname, "src/components/exam")
    }
  }
});
