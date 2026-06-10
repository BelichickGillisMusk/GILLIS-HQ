import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv, PluginOption } from "vite";

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from 'path'

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Spark dev proxy reads process.env.GITHUB_TOKEN (not exposed to the client bundle).
  const env = loadEnv(mode, projectRoot, '')
  if (env.GITHUB_TOKEN && !process.env.GITHUB_TOKEN) {
    process.env.GITHUB_TOKEN = env.GITHUB_TOKEN
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      // DO NOT REMOVE
      createIconImportProxy() as PluginOption,
      sparkPlugin() as PluginOption,
    ],
    resolve: {
      alias: {
        '@': resolve(projectRoot, 'src')
      }
    },
    build: {
      cssMinify: false,
    },
  }
});
