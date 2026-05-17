import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "https://api.sarirniroo.ir/",
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  }
});
// https://api.sarirniroo.ir/