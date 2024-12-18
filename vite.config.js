import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [
        react({ include: /\.(js|jsx|ts|tsx)$/ }), // Ensure React files are included for processing
        laravel({
            input: ["resources/css/app.css", "resources/js/app.ts"], // Input files for Laravel Vite plugin
            refresh: true, // This enables automatic refresh on changes during development
        }),
    ],
    build: {
        outDir: 'public/build', // Ensure the build output goes to the `public/build` directory
        rollupOptions: {
            output: {
                // This ensures the output is properly handled with hashed filenames for caching
                assetFileNames: 'assets/[name]-[hash][extname]',
                chunkFileNames: 'assets/[name]-[hash].js',
                entryFileNames: 'assets/[name]-[hash].js',
            },
        },
    },
});
