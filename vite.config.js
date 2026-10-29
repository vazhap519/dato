import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'

// Load the CommonJS Babel plugin through Node rather than Vite's config bundler.
// Its dependency on node:crypto requires Node's native require.
const nativeRequire = createRequire(import.meta.url)
const exploreCopyBabel = nativeRequire(resolve(process.cwd(), 'scripts/explore-copy-babel.cjs'))

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
