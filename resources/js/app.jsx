import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import ScrollToTop from './components/ScrollToTop.jsx'
import SiteAnalytics from './components/SiteAnalytics.jsx'

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true })
        return pages[`./Pages/${name}.jsx`]
    },
    setup({ el, App, props }) {
        createRoot(el).render(<><App {...props} /><ScrollToTop /><SiteAnalytics /></>)
    },
})
