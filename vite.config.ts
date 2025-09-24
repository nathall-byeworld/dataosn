import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/nathall-byeworld.github.io/dataosn/", // replace with your repo name
  plugins: [react()],
})
