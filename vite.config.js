import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import collectModuleAssetsPaths from './vite-module-loader.js';

export default defineConfig(async () => {
    const paths = await collectModuleAssetsPaths([], 'Modules');

    return {
        plugins: [
            laravel({
                input: [
                    'resources/js/app.jsx',
                    ...paths,
                ],
                refresh: true,
            }),
            react(),
        ],
        resolve: {
            alias: {
                '@': '/resources/js',
                '@DS': '/Modules/DocumentSystem/resources/js',
            },
        },
    };
});
