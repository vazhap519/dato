import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import exploreCopyBabel from './scripts/explore-copy-babel.cjs'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx', 'resources/css/app.css'],
            refresh: true,
        }),
        tailwindcss(),
        react({
            babel: {
                plugins: [exploreCopyBabel],
            },
        }),
    ],
    build: {
        minify: 'esbuild',
        cssCodeSplit: true,
        sourcemap: false,
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom']
                }
            }
        }
    }
})
