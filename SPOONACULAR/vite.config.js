import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      //Questo serve per reindirizzare le richieste fatte su questi endpoint su porte diverse
      "/login" : "http://localhost:4000",
      "/check-login" : "http://localhost:4000",
      "/logout" : "http://localhost:4000",
      "^/users/.*" : "http://localhost:4000",
      "^/posts/.*" : "http://localhost:4000",
    }
  }
})
