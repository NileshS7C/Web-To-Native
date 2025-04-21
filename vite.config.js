import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    host: true,
    strictPort: true,
  },
  preview: {
    allowedHosts: ["admin.uat.picklebay.com", "www.admin.uat.picklebay.com"], // Explicitly allow the domain
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
  },

  build: {
    chunkSizeWarningLimit: 1000, // Increase size limit to 1000kb
  },

  optimizeDeps: {
    include: ["react-quill"],
  },
});
