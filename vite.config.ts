
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, (process as any).cwd(), '');
    
    // Priority order: 
    // 1. VITE_GEMINI_API_KEY (Vite specific - Preferred)
    // 2. GEMINI_API_KEY (Generic)
    // 3. process.env (System Env Vars)
    const apiKey = 
        env.VITE_GEMINI_API_KEY || 
        process.env.VITE_GEMINI_API_KEY ||
        env.GEMINI_API_KEY || 
        process.env.GEMINI_API_KEY ||
        env.VITE_API_KEY || 
        process.env.VITE_API_KEY ||
        '';

    // Log to console during build so you can verify if key is picked up (will show in terminal)
    if (apiKey) {
        console.log("✅ API Key successfully resolved for build injection.");
    } else {
        console.warn("⚠️ API Key NOT found during build. AI features will fail unless provided at runtime via VITE_GEMINI_API_KEY.");
    }

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        // Inject the resolved key into the code
        'process.env.API_KEY': JSON.stringify(apiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(apiKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
