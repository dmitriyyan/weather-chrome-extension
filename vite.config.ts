import { defineConfig } from 'vite';
import { crx } from "@crxjs/vite-plugin";
import react from '@vitejs/plugin-react-swc';
import manifestJson from './public/manifest.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest: manifestJson })],
});
