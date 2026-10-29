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
        // A voluntary first-party opt-out for the site owner and testers.
        const query = new URLSearchParams(window.location.search);
        if (query.get("analytics_ignore") === "1") {
            try { localStorage.setItem("site_analytics_opt_out", "1"); } catch {}
        } else if (query.get("analytics_ignore") === "0") {
            try { localStorage.removeItem("site_analytics_opt_out"); } catch {}
        }
        try { if (localStorage.getItem("site_analytics_opt_out") === "1") return; } catch {}
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
        // Only coarse milestones are recorded. Answers, prompts and result values
        // are never sent to analytics.
        const milestone = (e) => {
            const event = e.detail?.event;
            const allowed = ['explore_start', 'explore_complete', 'explore_practice'];
            if (!allowed.includes(event)) return;
            const name = String(e.detail?.tool || '').slice(0, 120);
            if (name) send(event, name);
        };
        window.addEventListener('explore:milestone', milestone);
        const page = () => send('page_view', null);
        const click = (e) => {
            const target = e.target instanceof Element ? e.target.closest('a, button') : null;
            if (!target || target.closest('[data-no-analytics]')) return;
            const href = target.tagName === 'A' ? target.getAttribute('href') : null;
            let destination = null;
            try { if (href) destination = new URL(href, window.location.href); } catch {}
            const metaEvent = target.getAttribute('data-meta-event');
            const knownLabels = {
                HeroJoinClick: 'Практикум · запись в первом экране',
                ProgramJoinClick: 'Практикум · запись в программе',
                HowToJoinClick: 'Практикум · запись в инструкции',
                FinalJoinClick: 'Практикум · запись внизу страницы',
                MobileJoinClick: 'Практикум · мобильная кнопка записи',
            };
            const visibleLabel = (target.getAttribute('aria-label') || target.getAttribute('title') || target.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 75);
            const path = window.location.pathname;
            const section = target.closest('section[id], main section, header, footer, nav');
            const sectionName = section?.id || (section?.tagName === 'HEADER' ? 'шапка' : section?.tagName === 'FOOTER' ? 'подвал' : section?.tagName === 'NAV' ? 'меню' : null);
            const destinationLabel = destination
                ? (destination.origin === window.location.origin
                    ? (destination.pathname === '/' ? 'главная' : destination.pathname)
                    : (destination.hostname === 't.me' || destination.hostname === 'telegram.me' ? 'Telegram' : destination.hostname))
                : null;
            // Use explicit event names first. Otherwise combine the visible button
            // label with its destination, so multiple CTAs to the same URL are distinct.
            // Never collect text entered into inputs or form fields.
            const name = target.dataset.analytics
                || (metaEvent ? (knownLabels[metaEvent] || metaEvent) : null)
                || (visibleLabel
                    ? visibleLabel + (destinationLabel ? ' → ' + destinationLabel : '') + (sectionName ? ' · ' + sectionName : '')
                    : (destinationLabel ? 'Переход → ' + destinationLabel + (sectionName ? ' · ' + sectionName : '') : null));
            if (name) send(target.tagName === 'A' ? 'link_click' : 'cta_click', name.slice(0, 120));
        };
        // Lightweight editoria diagnostics: one event per scroll milestone and
        // active-time milestone, no raw cursor positions or personal input.
        let editoriaCleanup = () => {};
        const editoriaMetrics = () => {
            editoriaCleanup();
            if (window.location.pathname !== '/editoria') return;
            const scrolled = new Set();
            const engaged = new Set();
            let activeSeconds = 0;
            let lastTick = Date.now();
            let visible = document.visibilityState === 'visible';
            const onScroll = () => {
                const total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
                const depth = Math.min(100, Math.round(window.scrollY / total * 100));
                [25, 50, 75, 90, 100].forEach(mark => {
                    if (depth >= mark && !scrolled.has(mark)) {
                        scrolled.add(mark);
                        send('scroll_depth', 'scroll_' + mark);
                    }
                });
            };
            const onVisibility = () => {
                if (visible) activeSeconds += Math.min(5, (Date.now() - lastTick) / 1000);
                lastTick = Date.now();
                visible = document.visibilityState === 'visible';
            };
            const interval = window.setInterval(() => {
                onVisibility();
                [10, 30, 60, 120, 300].forEach(mark => {
                    if (activeSeconds >= mark && !engaged.has(mark)) {
                        engaged.add(mark);
                        send('engagement', 'active_' + mark);
                    }
                });
            }, 1000);
            window.addEventListener('scroll', onScroll, { passive: true });
            document.addEventListener('visibilitychange', onVisibility);
            onScroll();
            editoriaCleanup = () => {
                window.clearInterval(interval);
                window.removeEventListener('scroll', onScroll);
                document.removeEventListener('visibilitychange', onVisibility);
            };
        };
        editoriaMetrics();
        const onNavigate = () => { page(); editoriaMetrics(); };
        document.addEventListener('inertia:navigate', onNavigate);
        document.addEventListener('click', click, true);
        return () => {
            window.removeEventListener('explore:milestone', milestone);
            document.removeEventListener('inertia:navigate', onNavigate);
            editoriaCleanup();
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
