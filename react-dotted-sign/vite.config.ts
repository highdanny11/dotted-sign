import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    AutoImport({
      dts: './src/auto-imports.d.ts',
      imports: [
        'react',
      ],
    })
  ],
  resolve:{
    alias: {
      "@": path.resolve(__dirname, "src"),
    }
  }
})
