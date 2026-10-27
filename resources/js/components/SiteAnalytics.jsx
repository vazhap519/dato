import { useEffect } from 'react';

function identifier(key, storage) {
    let value = storage.getItem(key);
    if (!value) {
        value = crypto.randomUUID();
        storage.setItem(key, value);
    }
    return value;
}

export default function SiteAnalytics() {
    useEffect(() => {
        const enabled = () => {
            try { return localStorage.getItem('site_analytics_consent') === 'granted'; }
            catch { return false; }
        };
        if (!enabled()) return;
        let visitorId, sessionId;
        try {
            visitorId = identifier('site_analytics_visitor', localStorage);
            sessionId = identifier('site_analytics_session', sessionStorage);
        } catch { return; }
        const send = (event, element) => {
            const params = new URLSearchParams(location.search);
            let referrer = null;
            try { referrer = document.referrer ? new URL(document.referrer).hostname : null; } catch {}
            fetch('/analytics/event', {
                method: 'POST',
                credentials: 'same-origin',
                keepalive: true,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({
                    visitor_id: visitorId,
                    session_id: sessionId,
                    event, element,
                    path: location.pathname,
                    referrer_host: referrer,
                    utm_source: params.get('utm_source'),
                    utm_medium: params.get('utm_medium'),
                    utm_campaign: params.get('utm_campaign'),
                }),
            }).catch(() => {});
        };
        const page = () => send('page_view', null);
        const click = (e) => {
            const target = e.target.closest('a, button');
            if (!target) return;
            const name = target.dataset.analytics || target.getAttribute('aria-label') || target.textContent?.trim().slice(0, 100);
            if (name) send(target.tagName === 'A' ? 'link_click' : 'cta_click', name);
        };
        page();
        document.addEventListener('inertia:navigate', page);
        document.addEventListener('click', click, true);
        return () => {
            document.removeEventListener('inertia:navigate', page);
            document.removeEventListener('click', click, true);
        };
    }, []);
    return null;
}
