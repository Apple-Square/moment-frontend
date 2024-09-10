import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5173,
  },
  plugins: [react(), svgr()],
  define: {
    'process.env': process.env
  },
  publicDir: 'public', // Ensure this is correct if you have a custom public directory
})
