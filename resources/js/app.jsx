import '../css/app.css';
import '../css/aims_ui.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        if (name.startsWith('DocumentSystem/')) {
            const page = name.replace('DocumentSystem/', '');
            const targetPath = `../../Modules/DocumentSystem/resources/js/Pages/${page}.jsx`;
            const glob = import.meta.glob('../../Modules/DocumentSystem/resources/js/Pages/**/*.jsx');
            console.log('Resolving DocumentSystem Page:', { name, page, targetPath, availableKeys: Object.keys(glob) });
            return resolvePageComponent(targetPath, glob);
        }
        if (name.startsWith('Coe/')) {
            const page = name.replace('Coe/', '');
            const targetPath = `../../Modules/Coe/resources/js/Pages/${page}.jsx`;
            const glob = import.meta.glob('../../Modules/Coe/resources/js/Pages/**/*.jsx');
            console.log('Resolving Coe Page:', { name, page, targetPath, availableKeys: Object.keys(glob) });
            return resolvePageComponent(targetPath, glob);
        }
        return resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        );
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
