import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },

  build: {
    chunkSizeWarningLimit: 1000, // Increase size limit to 1000kb
  },

  optimizeDeps: {
    include: ["react-quill"],
  },

  preview: {
    allowedHosts: ["admin.uat.picklebay.com"],
  },
});
