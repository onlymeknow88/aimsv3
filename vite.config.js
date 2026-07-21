import collectModuleAssetsPaths from './vite-module-loader.js';
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

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
                '@FLS': '/Modules/FieldLeadership/resources/js',
            },
        },
    };
});
