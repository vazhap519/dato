import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import ScrollToTop from './components/ScrollToTop.jsx'
import SiteAnalytics from './components/SiteAnalytics.jsx'

// Apply the saved/system theme before React mounts, including on page transitions.
try {
    const stored = window.localStorage.getItem('arutyun-theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = stored === 'dark' || (stored !== 'light' && systemDark);
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('light', !dark);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
} catch (_) {}

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
        return pages[`./Pages/${name}.jsx`]
    },
    setup({ el, App, props }) {
        createRoot(el).render(<><App {...props} /><ScrollToTop /><SiteAnalytics /></>)
    },
})
