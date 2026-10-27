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
    const [settingsOpen, setSettingsOpen] = useState(false);
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
            const name = target.dataset.analytics || target.getAttribute('aria-label') || (target.tagName === 'A' ? (() => { try { return new URL(target.href).pathname; } catch { return null; } })() : null);
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
    useEffect(() => {
        const open = () => setSettingsOpen(true);
        window.addEventListener('site:open-privacy-settings', open);
        return () => window.removeEventListener('site:open-privacy-settings', open);
    }, []);
    const decide = (value, ads = false) => {
        try { localStorage.setItem('site_analytics_consent', value); } catch {}
        try { localStorage.setItem('site_ads_consent', ads ? 'granted' : 'denied'); } catch {}
        setChoice(value);
        setSettingsOpen(false);
        window.dispatchEvent(new Event('site:consent-changed'));
    };
    if (choice && !settingsOpen) return null;
    const onWorkshop = window.location.pathname === '/editoria' || window.location.pathname === '/editoria/';
    return (
        <aside
            role="dialog"
            aria-label="Немного о конфиденциальности"
            className={`fixed left-3 right-3 z-[80] mx-auto max-w-[390px] rounded-2xl border border-amber-500/20 bg-[#201b13]/95 px-4 py-3 text-white shadow-xl backdrop-blur-md sm:left-auto sm:right-5 sm:max-w-[360px] ${onWorkshop ? 'bottom-[calc(6.5rem+env(safe-area-inset-bottom))] md:bottom-5' : 'bottom-4'}`}
        >
            <div className="flex items-center gap-2 text-sm font-semibold text-amber-100"><span aria-hidden="true">✦</span> Немного о конфиденциальности</div>
            <p className="mt-2 text-xs leading-relaxed text-white/85">Мы используем технологии аналитики и рекламы, чтобы делать сайт удобнее и полезнее для вас. Нажимая «ОК», вы соглашаетесь с их использованием.</p>
            <p className="mt-2 text-[11px] text-white/60">Подробнее — <a href="/privacy" className="text-amber-300 underline underline-offset-2">в Политике конфиденциальности</a>.</p>
            <div className="mt-3 flex items-center justify-end gap-2">
                <button type="button" onClick={() => decide('denied', false)} className="rounded-lg px-3 py-2 text-xs text-white/75 hover:text-white">Не сейчас</button>
                <button type="button" onClick={() => decide('granted', true)} className="rounded-lg bg-amber-400 px-5 py-2 text-xs font-bold text-black hover:bg-amber-300">ОК</button>
            </div>
        </aside>
    );
}
