import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';

dotenv.config(); // load env vars from .env

export default defineConfig({
  plugins: [react()],
  define: {
    // eslint-disable-next-line no-undef
    __BASEURL__: `"${process.env.BASEURL}"`, // wrapping in "" since it's a string
    // eslint-disable-next-line no-undef
    __WSURL__: `"${process.env.WSURL}"` // wrapping in "" since it's a string
  },
})
