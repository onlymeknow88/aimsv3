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
        const parts = name.split('/');
        if (parts.length > 1) {
            const moduleName = parts[0];
            const pagePath = parts.slice(1).join('/');
            const targetPath = `../../Modules/${moduleName}/resources/js/Pages/${pagePath}.jsx`;
            const glob = import.meta.glob('../../Modules/*/resources/js/Pages/**/*.jsx');
            
            if (glob[targetPath]) {
                console.log('Resolving Module Page:', { name, targetPath });
                return resolvePageComponent(targetPath, glob);
            }
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
