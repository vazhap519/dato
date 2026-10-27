import { useEffect, useState } from 'react';

function identifier(key, storage) {
    let value = storage.getItem(key);
    if (!value) {
        value = crypto.randomUUID();
        storage.setItem(key, value);
    }
    return value;
}

export default function SiteAnalytics() {
    const [choice, setChoice] = useState(() => {
        try { return localStorage.getItem('site_analytics_consent'); }
        catch { return 'denied'; }
    });
    useEffect(() => {
        if (choice !== 'granted') return;
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
    }, [choice]);
    const decide = (value) => {
        try { localStorage.setItem('site_analytics_consent', value); } catch {}
        setChoice(value);
    };
    if (choice) return null;
    return (
        <aside role="dialog" aria-label="Настройки аналитики" className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-lg rounded-xl border border-amber-500/40 bg-[#201b13] p-4 text-sm text-white shadow-2xl">
            <p>Мы используем необязательную аналитику, чтобы улучшать сайт. С вашего согласия фиксируются просмотры страниц и нажатия. <a href="/privacy" className="text-amber-400 underline">Подробнее</a></p>
            <div className="mt-3 flex gap-3"><button type="button" onClick={() => decide('denied')} className="rounded-lg border border-white/30 px-4 py-2">Отказаться</button><button type="button" onClick={() => decide('granted')} className="rounded-lg bg-amber-400 px-4 py-2 font-semibold text-black">Разрешить аналитику</button></div>
        </aside>
    );
}
