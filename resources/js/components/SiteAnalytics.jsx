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
    const [adsChoice, setAdsChoice] = useState(() => { try { return localStorage.getItem('site_ads_consent') === 'granted'; } catch { return false; } });
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
        setAdsChoice(ads);
        setChoice(value);
        setSettingsOpen(false);
        window.dispatchEvent(new Event('site:consent-changed'));
    };
    if (choice && !settingsOpen) return <button type="button" onClick={() => setSettingsOpen(true)} className="fixed bottom-3 left-3 z-[90] rounded-full border border-amber-500/30 bg-[#201b13] px-3 py-2 text-xs text-white shadow-lg" aria-label="Настройки конфиденциальности">Конфиденциальность</button>;
    return (
        <aside role="dialog" aria-label="Настройки аналитики" className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-lg rounded-xl border border-amber-500/40 bg-[#201b13] p-4 text-sm text-white shadow-2xl">
            <p>Вы можете отдельно разрешить аналитику посещений и рекламные технологии Meta Pixel. Без вашего согласия необязательное отслеживание отключено. <a href="/privacy" className="text-amber-400 underline">Политика конфиденциальности</a></p>
            <label className="mt-3 flex items-center gap-2"><input type="checkbox" checked={adsChoice} onChange={e => setAdsChoice(e.target.checked)} /> Разрешить рекламное отслеживание Meta</label>
            <div className="mt-3 flex flex-wrap gap-3"><button type="button" onClick={() => decide('denied', false)} className="rounded-lg border border-white/30 px-4 py-2">Отклонить всё</button><button type="button" onClick={() => decide('granted', adsChoice)} className="rounded-lg bg-amber-400 px-4 py-2 font-semibold text-black">Сохранить выбор и разрешить аналитику</button></div>
        </aside>
    );
}
