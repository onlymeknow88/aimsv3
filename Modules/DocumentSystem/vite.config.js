import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export const paths = [
    'Modules/DocumentSystem/resources/assets/sass/app.scss',
    'Modules/DocumentSystem/resources/assets/js/app.js',
];

export default defineConfig({
    build: {
        outDir: '../../public/build-documentsystem',
        emptyOutDir: true,
        manifest: true,
    },
    plugins: [
        laravel({
            publicDirectory: '../../public',
            buildDirectory: 'build-documentsystem',
            input: [
                __dirname + '/resources/assets/sass/app.scss',
                __dirname + '/resources/assets/js/app.js'
            ],
            refresh: true,
        }),
        // Uncomment the plugin for your frontend framework:
        // vue({
        //     template: {
        //         transformAssetUrls: {
        //             base: null,
        //             includeAbsolute: false,
        //         },
        //     },
        // }),
        // react(),
        // svelte(),
    ],
    resolve: {
        alias: {
            '@': __dirname + '/resources/js',
        },
    },
});
