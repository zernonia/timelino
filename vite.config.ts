import { defineConfig } from "vite"
import Vue from "@vitejs/plugin-vue"
import Pages from "vite-plugin-pages"
import Icons from "unplugin-icons/vite"
import IconsResolver from "unplugin-icons/resolver"
import Components from "unplugin-vue-components/vite"
import WindiCSS from "vite-plugin-windicss"

import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    Vue(),
    Pages(),
    Components({
      resolvers: IconsResolver(),
      dts: true,
    }),
    Icons(),
    WindiCSS(),
  ],
})
