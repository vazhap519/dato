import { useEffect, useState } from 'react';

const adsChoice = () => {
    try { return localStorage.getItem('site_ads_consent'); } catch { return null; }
};

const adsAllowed = () => {
    try { return localStorage.getItem('site_ads_consent') === 'granted'; }
    catch { return false; }
};

export default function SiteAnalytics() {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [hasChoice, setHasChoice] = useState(() => adsChoice() !== null);
    const [adsConsent, setAdsConsent] = useState(adsAllowed);

    useEffect(() => {
        // Per-tab IDs survive refreshes but disappear when the tab session ends.
        // No cross-tab or cross-day identity, no analytics cookies or IP fingerprinting.
        const tabId = (key) => {
            try {
                const existing = sessionStorage.getItem(key);
                if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing;
                const id = crypto.randomUUID();
                sessionStorage.setItem(key, id);
                return id;
            } catch {
                return crypto.randomUUID();
            }
        };
        const visitorId = tabId('site_analytics_tab_visitor');
        const sessionId = tabId('site_analytics_tab_session');
        const send = (event, element) => {
            const params = new URLSearchParams(window.location.search);
            let referrer = null;
            try { referrer = document.referrer ? new URL(document.referrer).hostname : null; } catch {}
            fetch('/analytics/event', {
                method: 'POST', credentials: 'same-origin', keepalive: true,
                headers: {
                    'Content-Type': 'application/json', 'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({
                    visitor_id: visitorId, session_id: sessionId, event, element,
                    path: window.location.pathname, referrer_host: referrer,
                    utm_source: params.get('utm_source'), utm_medium: params.get('utm_medium'),
                    utm_campaign: params.get('utm_campaign'),
                }),
            }).catch(() => {});
        };
        const page = () => send('page_view', null);
        const click = (e) => {
            const target = e.target instanceof Element ? e.target.closest('a, button') : null;
            if (!target || target.closest('[data-no-analytics]')) return;
            const name = target.dataset.analytics || target.getAttribute('data-meta-event')
                || (target.tagName === 'A' ? (() => {
                    try {
                        const url = new URL(target.href);
                        return url.origin === location.origin ? url.pathname : 'external_link';
                    } catch { return null; }
                })() : null);
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

    useEffect(() => {
        const open = () => setSettingsOpen(true);
        window.addEventListener('site:open-privacy-settings', open);
        return () => window.removeEventListener('site:open-privacy-settings', open);
    }, []);

    const chooseAds = (allow) => {
        try { localStorage.setItem('site_ads_consent', allow ? 'granted' : 'denied'); } catch {}
        setAdsConsent(allow);
        setHasChoice(true);
        setSettingsOpen(false);
        window.dispatchEvent(new Event('site:consent-changed'));
        // Stop an already loaded third-party tracker by clearing the document.
        if (!allow && adsConsent) window.location.reload();
    };

    if (hasChoice && !settingsOpen) return null;
    return (
        <aside data-no-analytics role="dialog" aria-label="Немного о конфиденциальности"
            className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-3 right-3 z-[80] mx-auto max-w-[390px] rounded-2xl border border-amber-500/20 bg-[#201b13]/95 px-4 py-3 text-white shadow-xl backdrop-blur-md sm:left-auto sm:right-5 sm:max-w-[360px]">
            <div className="text-sm font-semibold text-amber-100">Немного о конфиденциальности</div>
            <p className="mt-2 text-xs leading-relaxed text-white/85">
                Мы используем технологии, которые помогают нам лучше понимать, как работает сайт, и делать его удобнее для вас. Нажимая «ОК», вы соглашаетесь на их использование.
                {' '}<a href="/privacy" className="text-amber-300 underline">Подробнее</a>
            </p>
            <div className="mt-3 flex justify-end gap-2">
                <button type="button" onClick={() => chooseAds(false)} className="rounded-lg px-3 py-2 text-xs text-white/75">Не сейчас</button>
                <button type="button" onClick={() => chooseAds(true)} className="rounded-lg bg-amber-400 px-4 py-2 text-xs font-bold text-black">ОК</button>
            </div>
        </aside>
    );
}
