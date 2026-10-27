import { usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Seo from "@/components/Seo.jsx";

const defaultQuestions = [
    { question: "Практикум действительно бесплатный?", answer: "Да. Участие в трёхдневном практикуме бесплатное." },
    { question: "Где проходит практикум?", answer: "Анонсы и информация о доступе публикуются в Telegram-канале практикума. Эфиры проходят онлайн." },
    { question: "Нужна ли предварительная подготовка?", answer: "Нет. Достаточно интереса к самопознанию и готовности уделить себе немного времени." },
    { question: "Что, если я пропущу эфир?", answer: "Информацию о доступных материалах и возможных записях уточняй в Telegram-канале практикума." },
];

const fallbackDays = [
    { day_label: "День 1", title: "Энергия мира", description: "Замечаем свои чувства, внимание и то, что забирает или наполняет энергией." },
    { day_label: "День 2", title: "Личина, эго и роли", description: "Исследуем привычные реакции, ожидания и роли, за которыми бывает трудно увидеть себя." },
    { day_label: "День 3", title: "Выход из сна", description: "Учимся замечать автоматические сценарии и выбирать следующий шаг осознаннее." },
];


// Meta Pixel is initialized exclusively while the /editoria Inertia page is mounted.
// The route check accepts /editoria, /editoria/ and URLs with query parameters.
const PIXEL_ID = "1435515278787720";
const onEditoria = () => window.location.pathname === "/editoria" || window.location.pathname === "/editoria/";
let pixelMounted = false;
let pixelInitialized = false;
const hasAdsConsent = () => { try { return localStorage.getItem("site_ads_consent") === "granted"; } catch { return false; } };

const pixelEvent = (name, label, href) => {
    if (!pixelMounted || !onEditoria() || !hasAdsConsent() || typeof window.fbq !== "function") return;
    const data = { button_name: label };
    try {
        const destination = new URL(href || "", window.location.origin);
        // No query strings, user identifiers or fragments from external links.
        data.destination_url = destination.origin === window.location.origin
            ? destination.pathname + destination.hash
            : destination.origin + destination.pathname;
    } catch { /* No destination parameter for invalid URLs. */ }
    try {
        window.fbq("trackCustom", name, data);
        // One shared conversion across all five Telegram join CTAs.
        // Keep the individual events above for per-button reporting.
        if (["HeroJoinClick", "ProgramJoinClick", "HowToJoinClick", "FinalJoinClick", "MobileJoinClick"].includes(name)) {
            window.fbq("trackCustom", "TelegramJoinClick", { button_location: name });
        }
    } catch { /* Analytics must never interfere with navigation. */ }
};

function useEditoriaPixel() {
    useEffect(() => {
        if (!onEditoria()) return;
        pixelMounted = hasAdsConsent();

        // Capture native clicks before React's synthetic event handlers and
        // external navigation. The delegated handler survives React re-renders.
        const handleTrackedClick = (event) => {
            const target = event.target instanceof Element
                ? event.target.closest("[data-meta-event]")
                : null;
            if (!target || !onEditoria() || !document.contains(target)) return;
            if (target.hasAttribute("data-registration-required")) return;
            const name = target.getAttribute("data-meta-event");
            if (!name) return;
            pixelEvent(name, target.getAttribute("data-meta-label") || target.textContent.trim(), target.getAttribute("href") || window.location.href);
        };
        document.addEventListener("click", handleTrackedClick, true);

        // Meta's standard queue/bootstrap pattern; never add it to the global layout.
        // Guard against duplicate injection when the page is mounted again.
        const startPixel = () => {
        if (!hasAdsConsent()) return;
        pixelMounted = true;
        if (!window.fbq) {
            const fbq = function () {
                if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments);
                else fbq.queue.push(arguments);
            };
            fbq.queue = [];
            fbq.loaded = true;
            fbq.version = "2.0";
            window.fbq = fbq;
            window._fbq = fbq;
        }

        // Prevent Meta from automatically tracking Inertia/History API navigations.
        // Only the explicit landing-page PageView is permitted.
        window.fbq.disablePushState = true;
        if (!pixelInitialized) {
            window.fbq("set", "autoConfig", false, PIXEL_ID);
            window.fbq("init", PIXEL_ID);
            pixelInitialized = true;
        }
        window.fbq("trackSingle", PIXEL_ID, "PageView");

        let script = document.querySelector('script[data-editoria-pixel="true"]');
        if (!script) {
            script = document.createElement("script");
            script.async = true;
            script.src = "https://connect.facebook.net/en_US/fbevents.js";
            script.dataset.editoriaPixel = "true";
            document.head.appendChild(script);
        }

        };
        const onConsentChange = () => {
            if (hasAdsConsent()) { startPixel(); return; }
            pixelMounted = false;
            document.querySelector('script[data-editoria-pixel="true"]')?.remove();
            if (window._fbq === window.fbq) { delete window.fbq; delete window._fbq; }
            pixelInitialized = false;
        };
        startPixel();
        window.addEventListener("site:consent-changed", onConsentChange);
        return () => {
            window.removeEventListener("site:consent-changed", onConsentChange);
            document.removeEventListener("click", handleTrackedClick, true);
            pixelMounted = false;
            pixelInitialized = false;
            // An Inertia route change must not leave an active tracker behind.
            document.querySelector('script[data-editoria-pixel="true"]')?.remove();
            if (window._fbq === window.fbq) {
                delete window.fbq;
                delete window._fbq;
            }
        };
    }, []);
}

function JoinLink({ href, children, secondary = false, className = "", eventName, onRegister }) {
    const base = "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-bold text-center transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";
    const colors = secondary ? "border border-primary/50 text-primary hover:bg-primary/10" : "bg-primary text-background-dark hover:brightness-110 shadow-lg shadow-primary/10";
    const destination = href || "#how-to-join";

    const handleClick = (event) => {
        if (onRegister && href && href !== "#") { event.preventDefault(); onRegister(href, eventName); return; }
        if (!eventName) return;
        // The native capture listener sends exactly one event for this link.

        // A same-tab external navigation (Telegram in particular) can cancel the
        // image request used by Meta before it leaves the browser. Give it a
        // short opportunity to start; never delay modified/new-tab clicks.
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const anchor = event.currentTarget;
        if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
        const url = new URL(anchor.href, window.location.href);
        if (url.origin === window.location.origin && url.pathname === window.location.pathname) return;
        if (!pixelMounted || !onEditoria() || typeof window.fbq !== "function") return;

        event.preventDefault();
        window.setTimeout(() => { window.location.assign(anchor.href); }, 120);
    };

    return <a href={destination} data-meta-event={eventName} data-registration-required={onRegister ? "true" : undefined} data-meta-label="Присоединиться бесплатно" onClick={handleClick} className={base + " " + colors + " " + className}>{children}<span aria-hidden="true">→</span></a>;
}

export default function Editoria() {
    const { editoria, settings, mailingForm } = usePage().props;
    useEditoriaPixel();
    const [openFaq, setOpenFaq] = useState(0);
    const [openDay, setOpenDay] = useState(-1);
    const [registration, setRegistration] = useState(null);
    const [form, setForm] = useState({ name: "", email: "", phone: "", practice_reminders: true, marketing_consent: false });
    const [sending, setSending] = useState(false);
    const [formError, setFormError] = useState("");
    const register = mailingForm?.registration_form_enabled === false ? null : (url, eventName) => { setFormError(""); setRegistration({ url: mailingForm?.telegram_url || url, eventName }); };
    const submitRegistration = async (event) => {
        event.preventDefault();
        if (!registration || sending) return;
        setSending(true);
        setFormError("");
        try {
            const csrf = document.querySelector('meta[name="csrf-token"]')?.content;
            const response = await fetch("/editoria/register", {
                method: "POST",
                credentials: "same-origin",
                headers: { "Content-Type": "application/json", "Accept": "application/json", ...(csrf ? { "X-CSRF-TOKEN": csrf } : {}) },
                body: JSON.stringify(form),
            });
            if (!response.ok) throw new Error(response.status === 422 ? "Проверь имя, email, телефон и согласие на напоминания." : "Не удалось сохранить регистрацию. Попробуй ещё раз.");
            // Preserve the existing single conversion event, fired only on the real Telegram transition.
            pixelEvent("TelegramJoinClick", "Переход после регистрации", registration.url);
            setRegistration(null);
            setSending(false);
            window.setTimeout(() => window.location.assign(registration.url), 120);
        } catch (error) { setFormError(error.message); setSending(false); }
    };

    if (!editoria) return <><Seo /><main className="min-h-screen flex items-center justify-center px-6 text-white text-center">Содержимое страницы пока не опубликовано</main></>;

    const joinUrl = [
        editoria.cta_button_url,
        editoria.program_button_url,
        editoria.hero_button_url,
        editoria.for_whom_button_url,
        editoria.why_button_url,
        editoria.quote_button_url,
    ].find(url => typeof url === "string" && url.trim() && url.trim() !== "#")?.trim() || "";

    const telegramJoinUrl = mailingForm?.telegram_url || joinUrl;

    const days = Array.isArray(editoria.program_days) && editoria.program_days.length ? editoria.program_days : fallbackDays;
    const items = Array.isArray(editoria.for_whom_list) && editoria.for_whom_list.length ? editoria.for_whom_list : [
        "Чувствуешь, что живёшь на автомате.",
        "Часто ставишь чужие ожидания выше своих.",
        "Устал искать ответы, но продолжаешь сомневаться.",
        "Хочешь лучше понимать свои чувства и реакции.",
    ];
    const info = Array.isArray(editoria.info_blocks) && editoria.info_blocks.length ? editoria.info_blocks : [
        { title: "3 дня", description: "Три дня исследования себя" },
        { title: "Бесплатно", description: "Без оплаты за участие" },
        { title: "Живые эфиры", description: "Разговоры и практические задания" },
    ];

    return (
        <>
            <Seo />
            {registration && <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Регистрация на практикум">
                <form onSubmit={submitRegistration} className="w-full max-w-md rounded-2xl border border-primary/30 bg-[#1c1914] p-6 text-white shadow-2xl space-y-4">
                    <div className="flex justify-between items-center"><h2 className="text-xl font-bold">{mailingForm?.title || "Напоминание о практикуме"}</h2><button type="button" onClick={() => setRegistration(null)} aria-label="Закрыть" className="text-gray-300 text-2xl">×</button></div>
                    <p className="text-sm text-gray-300">{mailingForm?.description || "Оставь контакты, чтобы получать напоминания перед началом. После регистрации откроется Telegram."}</p>
                    <label className="block text-sm">{mailingForm?.name_label || "Имя"} *<input required maxLength={120} autoComplete="given-name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-lg bg-black/30 border border-white/20 p-3 text-white" /></label>
                    <label className="block text-sm">{mailingForm?.email_label || "Email"} *<input required type="email" maxLength={255} autoComplete="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1 w-full rounded-lg bg-black/30 border border-white/20 p-3 text-white" /></label>
                    <label className="block text-sm">{(mailingForm?.phone_label || "Телефон").replace(/\s*\(необязательно\)/gi, "")} *<input required type="tel" minLength={6} maxLength={40} autoComplete="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full rounded-lg bg-black/30 border border-white/20 p-3 text-white" /></label>
                    <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={form.practice_reminders} onChange={e => setForm({ ...form, practice_reminders: e.target.checked })} required className="mt-1" />{mailingForm?.reminders_label || "Согласен получать письма-напоминания о практикуме."}</label>
                    <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={form.marketing_consent} onChange={e => setForm({ ...form, marketing_consent: e.target.checked })} className="mt-1" />{mailingForm?.marketing_label || "Хочу также получать новости о книгах, эфирах и проектах (необязательно)."}</label>
                    {formError && <p role="alert" className="text-red-400 text-sm">{formError}</p>}
                    <button disabled={sending} type="submit" className="w-full rounded-xl bg-primary text-background-dark font-bold p-3 disabled:opacity-50">{sending ? "Сохраняем..." : (mailingForm?.button_text || "Продолжить в Telegram") + " →"}</button>
                </form>
            </div>}
            <header className="hidden md:block relative z-20 border-b border-white/10 bg-background-dark">
                <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
                    <div className="flex items-center" aria-label={settings?.site_name || "Arutyun"}>
                        {settings?.logo ? <img src={settings.logo} alt={settings?.site_name || "Arutyun"} className="h-10 w-auto max-w-36 object-contain" /> : <span className="text-primary font-display text-2xl italic">Arutyun</span>}
                    </div>
                    <a href="#how-to-join" data-meta-event="HeaderHowToJoinClick" data-meta-label="Как участвовать" className="text-sm font-semibold text-primary border border-primary/40 rounded-lg px-4 py-2 hover:bg-primary/10 transition">Как участвовать</a>
                </div>
            </header>

            <main>
                <section className="max-w-6xl mx-auto px-5 pt-8 pb-10 md:px-6 md:py-20 lg:py-24 grid lg:grid-cols-2 gap-6 lg:gap-16 items-center">
                    <div className="order-1 lg:order-1 relative z-10">
                        <p className="inline-flex rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase px-4 py-2 mb-6">{editoria.hero_badge || "Бесплатный трёхдневный практикум"}</p>
                        <h1 className="text-white text-[2.35rem] sm:text-5xl lg:text-6xl font-bold leading-[1.12] tracking-tight mb-4 md:mb-6">Устал жить <span className="text-primary italic">на автомате?</span></h1>
                        <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl mb-5 md:mb-7">{editoria.hero_description || "Три дня, чтобы остановиться, разобраться в привычных реакциях и начать лучше понимать себя."}</p>
                        <div className="flex flex-wrap gap-2 md:gap-4 text-sm text-gray-300 mb-6 md:mb-7">
                            <span className="rounded-full bg-white/10 px-3 py-1">✦ 3 дня</span><span className="rounded-full bg-white/10 px-3 py-1">✦ Бесплатно</span><span className="rounded-full bg-white/10 px-3 py-1">✦ Онлайн</span>
                        </div>
                        <JoinLink href={telegramJoinUrl} eventName="HeroJoinClick" onRegister={register} className="w-full sm:w-auto">Присоединиться бесплатно</JoinLink>
                        <p className="text-gray-500 text-sm mt-3">Переход в Telegram-канал практикума</p>
                    </div>
                    <div className="hidden md:flex order-2 lg:order-2 relative z-0 items-center justify-center lg:justify-end lg:-mr-10 xl:-mr-16 pointer-events-none">
                        {editoria.hero_image_url && <img src={editoria.hero_image_url} alt="Давид — ведущий трёхдневного практикума" className="block w-full max-w-[580px] lg:max-w-none lg:w-[115%] xl:w-[125%] h-auto object-contain border-0 rounded-none shadow-none" style={{ WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 33%, black 88%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 12%, black 83%, transparent 100%)', maskImage: 'linear-gradient(to right, transparent 0%, black 33%, black 88%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 12%, black 83%, transparent 100%)', WebkitMaskComposite: 'source-in', maskComposite: 'intersect' }} />}
                    </div>
                </section>

                <section className="bg-white/[0.025] border-y border-white/10 py-8 md:py-10">
                    <div className="max-w-6xl mx-auto px-5 md:px-6 grid grid-cols-3 gap-2 md:gap-4">
                        {info.slice(0, 3).map((item, i) => <div key={i} className="flex flex-col md:flex-row items-start gap-2 md:gap-4 rounded-xl md:rounded-2xl bg-white/[0.04] border border-white/10 p-3 md:p-5">
                            <span className="material-symbols-outlined text-primary text-xl md:text-3xl" aria-hidden="true">{["calendar_month", "redeem", "forum"][i]}</span>
                            <div><h2 className="text-white font-bold text-xs md:text-lg break-words">{item.title}</h2><p className="hidden md:block text-gray-400 text-sm leading-relaxed mt-1">{item.description}</p></div>
                        </div>)}
                    </div>
                </section>

                <section id="program" className="scroll-mt-8 max-w-6xl mx-auto px-6 py-16 md:py-20">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <p className="text-primary text-xs uppercase tracking-widest font-bold mb-3">Программа практикума</p>
                        <h2 className="text-white text-3xl md:text-4xl font-bold">Что ждёт тебя за три дня</h2>
                        <p className="text-gray-400 mt-4">Каждый день — новая тема, наблюдения и практические задания.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-3 md:gap-5">
                        {days.map((day, i) => <article key={i} className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 md:p-7 h-full">
                            <button type="button" aria-expanded={openDay === i} data-meta-event={`ProgramDayClick_${i + 1}`} data-meta-label={`Программа: день ${i + 1}`} onClick={() => { setOpenDay(openDay === i ? -1 : i); }} className="w-full flex items-center gap-3 text-left md:pointer-events-none">
                                <span className="text-primary text-2xl md:text-4xl font-bold md:block md:mb-5">{String(i + 1).padStart(2, "0")}</span>
                                <span className="flex-1"><span className="text-primary text-xs font-bold uppercase tracking-widest block md:mb-2">{day.day_label || `День ${i + 1}`}</span><span className="text-white text-base md:text-xl font-bold block">{day.title}</span></span>
                                <span className="md:hidden text-primary text-xl" aria-hidden="true">{openDay === i ? "−" : "+"}</span>
                            </button>
                            <p className={`${openDay === i ? "block" : "hidden"} md:block text-gray-400 leading-relaxed mt-3 md:mt-0`}>{day.description}</p>
                        </article>)}
                    </div>
                    <div className="text-center mt-9"><JoinLink href={telegramJoinUrl} eventName="ProgramJoinClick" onRegister={register}>Присоединиться бесплатно</JoinLink></div>
                </section>

                <section className="bg-white/[0.025] border-y border-white/10 py-16 md:py-20">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="max-w-2xl mb-9">
                            <h2 className="text-white text-3xl md:text-4xl font-bold">{editoria.for_whom_title || "Для кого этот практикум"}</h2>
                            <p className="text-gray-400 mt-4 leading-relaxed">{editoria.for_whom_description}</p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {items.map((item, i) => <div key={i} className="rounded-xl border border-white/10 bg-white/[0.05] p-5 flex gap-4 items-start">
                                <span className="material-symbols-outlined text-primary shrink-0" aria-hidden="true">check_circle</span>
                                <p className="text-gray-200 leading-relaxed">{typeof item === "string" ? item : item?.text}</p>
                            </div>)}
                        </div>
                        {editoria.why_description && <p className="text-gray-400 mt-8 max-w-3xl leading-relaxed">{editoria.why_description}</p>}
                    </div>
                </section>

                <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
                    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1fr)] gap-8 md:gap-12 items-center">
                        {editoria.author_image_url && (
                            <div className="relative mx-auto md:mx-0 size-60 sm:size-72 md:size-96 lg:size-[420px] rounded-full p-1 border border-primary/20 portrait-glow overflow-hidden">
                                <div aria-hidden="true" className="hidden" />
                                <img src={editoria.author_image_url} alt={editoria.author_name || "Автор практикума"} loading="lazy" className="w-full h-full object-cover rounded-full scale-105" />
                            </div>
                        )}
                        <div>
                            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">Кто проводит практикум</p>
                            <h2 className="text-white text-3xl md:text-4xl font-bold">{editoria.author_name || "Давид Арутюнов"}</h2>
                            <p className="text-gray-300 text-sm md:text-base leading-relaxed mt-3 md:mt-5 line-clamp-4 md:line-clamp-none">{editoria.author_quote}</p>
                            <ul className="hidden md:block mt-5 space-y-3">
                                {editoria.author_points?.map((p, i) => <li key={i} className="flex gap-3 text-gray-400"><span className="text-primary">✓</span><span>{typeof p === "string" ? p : p?.text}</span></li>)}
                            </ul>
                        </div>
                    </div>
                </section>

                <section id="how-to-join" className="scroll-mt-8 bg-white/[0.025] border-y border-white/10 py-16 md:py-20">
                    <div className="max-w-5xl mx-auto px-6">
                        <h2 className="text-white text-3xl md:text-4xl font-bold text-center mb-10">Как присоединиться?</h2>
                        <div className="grid md:grid-cols-3 gap-5">
                            {[
                                ["Нажми на кнопку", "Выбери «Присоединиться бесплатно» на этой странице."],
                                ["Открой Telegram", "Перейди в канал практикума и подпишись на анонсы."],
                                ["Подготовься к эфиру", "Следи за информацией о начале и ссылками на эфиры."],
                            ].map(([title, description], i) => <div key={i} className="rounded-2xl bg-white/[0.05] border border-white/10 p-4 md:p-6">
                                <span className="text-primary text-2xl md:text-3xl font-bold">{String(i + 1).padStart(2, "0")}</span>
                                <h3 className="text-white font-bold text-lg mt-2 md:mt-4">{title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed mt-1 md:mt-2">{description}</p>
                            </div>)}
                        </div>
                        <p className="text-gray-400 text-sm text-center mt-6">Telegram нужен для анонсов и доступа к практикуму. Участие бесплатное.</p>
                        <div className="text-center mt-8"><JoinLink href={telegramJoinUrl} eventName="HowToJoinClick" onRegister={register}>Присоединиться бесплатно</JoinLink></div>
                    </div>
                </section>

                <section id="faq" className="max-w-3xl mx-auto px-6 py-16 md:py-20">
                    <h2 className="text-white text-3xl md:text-4xl font-bold text-center mb-9">Частые вопросы</h2>
                    <div className="space-y-3">
                        {defaultQuestions.map((item, i) => <div key={i} className="rounded-xl border border-white/10 bg-white/[0.04] overflow-hidden">
                            <button type="button" aria-expanded={openFaq === i} data-meta-event={`FaqClick_${i + 1}`} data-meta-label={item.question} onClick={() => { setOpenFaq(openFaq === i ? -1 : i); }} className="w-full text-left p-5 flex items-center justify-between gap-4 text-white font-semibold">
                                <span>{item.question}</span><span className="text-primary text-xl shrink-0" aria-hidden="true">{openFaq === i ? "−" : "+"}</span>
                            </button>
                            {openFaq === i && <p className="px-5 pb-5 text-gray-400 leading-relaxed">{item.answer}</p>}
                        </div>)}
                    </div>
                </section>

                <section className="max-w-5xl mx-auto px-6 pb-20 md:pb-24">
                    <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-white/[0.06] to-transparent px-6 py-12 md:p-14 text-center">
                        <h2 className="text-white text-3xl md:text-5xl font-bold">{editoria.cta_title || "Возможно, пора выбрать себя"}</h2>
                        <p className="text-gray-300 max-w-2xl mx-auto mt-5 leading-relaxed">{editoria.cta_description}</p>
                        <p className="text-primary text-sm mt-6 mb-5 font-semibold">3 дня · Бесплатно · Онлайн</p>
                        <JoinLink href={telegramJoinUrl} eventName="FinalJoinClick" onRegister={register}>Присоединиться бесплатно</JoinLink>
                    </div>
                </section>
            </main>

            <footer className="border-t border-white/10 py-8 mb-20 md:mb-0">
                <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
                    <span>© {new Date().getFullYear()} {settings?.site_name || "Arutyun"}</span>
                    <div className="flex flex-wrap gap-4"><a href="/legal" data-meta-event="FooterLegalClick" data-meta-label="Юридическая информация и конфиденциальность" className="hover:text-primary transition">Юридическая информация</a><button type="button" onClick={() => window.dispatchEvent(new Event("site:open-privacy-settings"))} className="hover:text-primary transition">Настройки конфиденциальности</button></div>
                </div>
            </footer>
            <div className="md:hidden fixed inset-x-0 bottom-0 z-50 border-t border-primary/20 bg-background-dark/95 backdrop-blur-md px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
                <JoinLink href={telegramJoinUrl} eventName="MobileJoinClick" onRegister={register} className="w-full py-3">Присоединиться бесплатно</JoinLink>
            </div>
        </>
    );
}
