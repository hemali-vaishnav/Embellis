import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    define: {
      'process.env.REACT_APP_ENV': JSON.stringify(env.REACT_APP_ENV),
      'process.env.REACT_APP_DEV_URL': JSON.stringify(env.REACT_APP_DEV_URL),
      'process.env.REACT_APP_STAGING_URL': JSON.stringify(env.REACT_APP_STAGING_URL),
      'process.env.REACT_APP_PROD_URL': JSON.stringify(env.REACT_APP_PROD_URL),
    },
    plugins: [
      tailwindcss(),
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ],
  }
})
