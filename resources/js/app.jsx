import { router } from '@inertiajs/react'
import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import ScrollToTop from './components/ScrollToTop.jsx'
import SiteAnalytics from './components/SiteAnalytics.jsx'
import ExploreConnections from './components/ExploreConnections.jsx'
import { setExploreCms } from './lib/exploreCms.js'

function applyPageTheme(page) {
    const isNumbers = page?.component === 'Numbers';
    const allowLight = isNumbers && page?.props?.settings?.numbers_light_theme_enabled === true;
    const systemLight = window.matchMedia?.('(prefers-color-scheme: light)')?.matches ?? false;
    const light = allowLight && systemLight;
    document.documentElement.classList.toggle('light', light);
    document.documentElement.classList.toggle('dark', !light);
    document.documentElement.dataset.theme = light ? 'light' : 'dark';
    document.documentElement.style.colorScheme = light ? 'light' : 'dark';
}

// Prevent a flash of the wrong theme while Inertia mounts.
try {
    const page = JSON.parse(document.getElementById('app')?.dataset?.page || '{}');
    applyPageTheme(page);
    setExploreCms(page);
} catch (_) {
    document.documentElement.classList.add('dark');
}

createInertiaApp({
    resolve: async name => {
        const pages = import.meta.glob('./Pages/**/*.jsx');
        const loadPage = pages[`./Pages/${name}.jsx`];
        if (!loadPage) throw new Error(`Страница Inertia не найдена: ${name}`);
        const module = await loadPage();
        return module.default;
    },
    setup({ el, App, props }) {
        applyPageTheme(props.initialPage);
        setExploreCms(props.initialPage);
        const media = window.matchMedia?.('(prefers-color-scheme: light)');
        const onSystemChange = () => applyPageTheme(window.__arutyunCurrentPage);
        window.__arutyunCurrentPage = props.initialPage;
        media?.addEventListener?.('change', onSystemChange);
        router.on('navigate', event => {
            window.__arutyunCurrentPage = event.detail.page;
            applyPageTheme(event.detail.page);
            setExploreCms(event.detail.page);
        });
        createRoot(el).render(<><App {...props} /><ExploreConnections /><ScrollToTop /><SiteAnalytics /></>);
    },
})
