// import { defineConfig } from 'vite'
// import laravel from 'laravel-vite-plugin'
// import tailwindcss from '@tailwindcss/vite'
// import react from '@vitejs/plugin-react'
//
// export default defineConfig({
//     plugins: [
//         laravel({
//             input: ['resources/js/app.jsx', 'resources/css/app.css'],
//             refresh: true,
//         }),
//         tailwindcss(),
//         react(),
//     ],
// })
import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx', 'resources/css/app.css'],
            refresh: true,
        }),
        tailwindcss(),
        react(),
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
