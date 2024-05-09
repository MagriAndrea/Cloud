import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';

export default ({ mode }) => {
  // Carica le variabili d'ambiente
  const env = loadEnv(mode, process.cwd());

  return defineConfig({
    plugins: [react()],
    // Inserisci altre configurazioni qui
    // Puoi accedere alle variabili d'ambiente con env.VITE_API_BASE_URL
  });
};

