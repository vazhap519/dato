import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

const VISUALS = {
    numbers: { theme: 'numbers', eyebrow: 'Символы и совпадения', icon: 'tag', palette: 'from-[#3c2910] via-[#231b10] to-[#17140e]' },
    emotions: { theme: 'emotions', eyebrow: 'Чувства и состояния', icon: 'favorite', palette: 'from-[#4b2928] via-[#2b1c23] to-[#171419]' },
    dreams: { theme: 'dreams', eyebrow: 'Сны и ассоциации', icon: 'bedtime', palette: 'from-[#283251] via-[#1d2136] to-[#151720]' },
    archetypes: { theme: 'archetypes', eyebrow: 'Роли и внутренние образы', icon: 'theater_comedy', palette: 'from-[#493323] via-[#292019] to-[#1a1714]' },
    patterns: { theme: 'patterns', eyebrow: 'Сценарии и привычки', icon: 'repeat', palette: 'from-[#214039] via-[#172b27] to-[#131c19]' },
    mirror: { theme: 'mirror', eyebrow: 'Путь к себе', icon: 'self_improvement', palette: 'from-[#3b2c4b] via-[#292033] to-[#19161e]' },
};

function visualFor(tool) {
    const slug = (tool.slug || '').toLowerCase();
    const url = (tool.url || '').toLowerCase();
    if (VISUALS[slug]) return VISUALS[slug];
    if (url.includes('/numbers')) return VISUALS.numbers;
    if (url.includes('/emotions')) return VISUALS.emotions;
    if (url.includes('/dreams')) return VISUALS.dreams;
    if (url.includes('/archetypes')) return VISUALS.archetypes;
    if (url.includes('/patterns')) return VISUALS.patterns;
    if (url.includes('/mirror')) return VISUALS.mirror;
    return { theme: 'other', eyebrow: 'Исследование себя', icon: tool.icon || 'auto_awesome', palette: 'from-[#382e1f] via-[#211c14] to-[#16130e]' };
}

function Artwork({ theme, icon }) {
    return <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-8 -top-16 h-48 w-48 rounded-full bg-[#f0c453]/[.09] blur-3xl" />
        <div className="absolute -bottom-16 -right-6 h-44 w-44 rounded-full bg-white/[.07] blur-3xl" />
        {theme === 'numbers' && <>
            <div className="absolute left-[12%] top-[23%] font-serif text-[90px] leading-none text-[#f6d88a]/75 -rotate-12">7</div>
            <div className="absolute right-[14%] top-[12%] font-serif text-[105px] leading-none text-[#f0c453]/80 rotate-6">11</div>
            <div className="absolute bottom-[4%] left-[37%] font-serif text-[76px] text-[#e2b760]/35">22</div>
            <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f1cf79]/20" />
            <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f1cf79]/15" />
        </>}
        {theme === 'emotions' && <>
            <div className="absolute left-[16%] top-[26%] h-32 w-32 rounded-full bg-[#f6b08b]/65 blur-[3px]" />
            <div className="absolute left-[42%] top-[15%] h-36 w-36 rounded-full bg-[#dd7f9e]/50 blur-[5px]" />
            <div className="absolute right-[12%] top-[31%] h-32 w-32 rounded-full bg-[#a99cd4]/55 blur-[5px]" />
            <div className="absolute left-[36%] bottom-[7%] h-24 w-32 rounded-full bg-[#f4ca85]/45 blur-[12px]" />
            <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[86px] text-white/65 drop-shadow-[0_4px_20px_rgba(255,255,255,.3)]">favorite</span>
        </>}
        {theme === 'dreams' && <>
            <div className="absolute right-[20%] top-[13%] h-28 w-28 rounded-full bg-[#f4dfaa] shadow-[0_0_70px_rgba(229,217,175,.28)]" />
            <div className="absolute right-[13%] top-[9%] h-28 w-28 rounded-full bg-[#29314c]" />
            <span className="absolute left-[15%] top-[23%] text-3xl text-[#e4dbbd]">✦</span>
            <span className="absolute left-[38%] bottom-[27%] text-xl text-[#f6dbab]">✧</span>
            <span className="absolute right-[18%] bottom-[18%] text-2xl text-[#dad1e8]">✦</span>
            <div className="absolute -bottom-16 left-[-15%] h-40 w-[130%] rounded-[50%] bg-[#a3a2c0]/15 blur-xl" />
        </>}
        {theme === 'archetypes' && <>
            <span className="material-symbols-outlined absolute left-[12%] top-[20%] text-[115px] text-[#c09a6c]/50 -rotate-12">face</span>
            <span className="material-symbols-outlined absolute left-1/2 top-[13%] -translate-x-1/2 text-[140px] text-[#f5d58e]/80 drop-shadow-[0_0_28px_rgba(222,174,95,.2)]">theater_comedy</span>
            <span className="material-symbols-outlined absolute right-[9%] top-[23%] text-[106px] text-[#9d7e60]/45 rotate-12">face_6</span>
        </>}
        {theme === 'patterns' && <>
            <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2px] border-[#9bd7bb]/25" />
            <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2px] border-[#e6cb83]/40" />
            <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#a5c9b5]/45" />
            <div className="absolute left-[18%] top-[24%] h-3 w-3 rounded-full bg-[#e9d08f] shadow-[0_0_22px_#e9d08f]" />
            <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[66px] text-[#c4e9d3]/75">cycle</span>
        </>}
        {theme === 'mirror' && <>
            <div className="absolute left-1/2 top-[6%] h-[215px] w-[150px] -translate-x-1/2 rounded-t-[75px] rounded-b-[20px] border-[5px] border-[#d9b47c]/60 bg-gradient-to-r from-[#bca5d4]/25 via-[#7e789c]/30 to-[#d5c0d6]/10 shadow-[0_0_55px_rgba(203,165,227,.12)]" />
            <span className="material-symbols-outlined absolute left-1/2 bottom-[7%] -translate-x-1/2 text-[145px] text-[#d6c5dc]/45">person</span>
            <div className="absolute left-1/2 top-[6%] h-[215px] w-[150px] -translate-x-1/2 rounded-t-[75px] rounded-b-[20px] border border-[#ffe1a6]/25" />
        </>}
        {theme === 'other' && <span className="material-symbols-outlined absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[105px] text-[#e7c579]/55">{icon}</span>}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12100d]/35 via-transparent to-transparent" />
    </div>;
}

export default function Explore() {
    const { tools = [], settings = {}, cardImages = {} } = usePage().props;

    return <div className="min-h-screen bg-[#14120d] text-[#f8f4e9]">
        <Head title="Исследуй себя — Arutyun">
            <meta name="description" content="Шесть направлений самопознания: числа, эмоции, сны, архетипы, повторения и зеркало личности." />
        </Head>

        <header className="border-b border-[#b99347]/25">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5">
                <Link href="/" aria-label="Главная">{settings?.logo
                    ? <img src={settings.logo} alt={settings?.site_name || 'Arutyun'} className="h-10 max-w-[160px] object-contain" />
                    : <span className="font-serif italic text-2xl text-[#f0c453]">Arutyun</span>}
                </Link>
                <Link href="/editoria" className="text-xs text-[#e4c88c] transition hover:text-white sm:text-sm">Бесплатный практикум →</Link>
            </div>
        </header>

        <main className="mx-auto max-w-[1400px] px-5 pb-16 pt-14 sm:px-7 sm:pb-24 sm:pt-20">
            <section className="mx-auto max-w-3xl text-center">
                <p className="text-xs font-semibold uppercase tracking-[.24em] text-[#e2b84e]">Пространство самопознания</p>
                <h1 className="mt-5 font-serif text-5xl leading-tight sm:text-6xl lg:text-7xl">Исследуй <span className="italic text-[#f0c453]">себя</span></h1>
                <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-[#cfc2ad] sm:text-lg">
                    Числа, эмоции, сны и привычные события могут стать поводом остановиться и внимательнее посмотреть на себя. Здесь нет предсказаний или готовых диагнозов.
                </p>
                <p className="mt-6 text-xs uppercase tracking-[.18em] text-[#e8ca84]">Шесть направлений · Один путь к себе</p>
            </section>

            <section aria-label="Направления самопознания" className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3 xl:gap-7">
                {tools.map(tool => {
                    const visual = visualFor(tool);
                    return <Link key={tool.id} href={tool.url} className="group flex min-w-0 flex-col overflow-hidden rounded-[26px] border border-[#8e713f]/50 bg-[#211c16] transition-all duration-300 hover:-translate-y-1 hover:border-[#e9c575]/80 hover:shadow-[0_22px_55px_rgba(0,0,0,.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453]">
                        <div className={`relative h-48 overflow-hidden border-b border-[#b99347]/20 bg-gradient-to-br ${visual.palette} sm:h-52`}>
                            {cardImages[visual.theme] ? <>
                                <img src={cardImages[visual.theme]} alt="" aria-hidden="true" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-xl" />
                                <div className="absolute inset-0 flex items-center justify-center transition-transform duration-700 group-hover:scale-[1.035]">
                                    <img src={cardImages[visual.theme]} alt="" loading="lazy" decoding="async" className="h-full w-full object-contain" />
                                </div>
                                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#14100e]/55 via-[#14100e]/10 to-black/10" />
                            </> : <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"><Artwork theme={visual.theme} icon={visual.icon} /></div>}
                            <span className="absolute bottom-4 left-5 rounded-full border border-[#e8cb88]/35 bg-[#17130e]/75 px-3 py-1.5 text-[10px] uppercase tracking-[.15em] text-[#f4d998] backdrop-blur-md">{visual.eyebrow}</span>
                            <span aria-hidden="true" className="material-symbols-outlined absolute right-5 bottom-4 text-[25px] text-[#f4d998]">{tool.icon || visual.icon}</span>
                        </div>
                        <div className="flex flex-1 flex-col items-center px-6 pb-7 pt-7 text-center sm:px-8">
                            <h2 className="font-serif text-2xl leading-tight text-[#fff4dd] sm:text-[28px]">{tool.title}</h2>
                            {tool.subtitle && <p className="mt-3 text-sm font-medium text-[#efc867]">{tool.subtitle}</p>}
                            {tool.description && <p className="mt-4 max-w-xs text-sm leading-7 text-[#cabdaa]">{tool.description}</p>}
                            <span className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#b28b46]/65 bg-[#2b2317] px-6 py-2.5 text-sm font-semibold text-[#f0c453] shadow-[inset_0_1px_0_rgba(255,224,150,.06)] transition-all duration-300 group-hover:gap-3 group-hover:border-[#f0c453] group-hover:bg-[#3b2b16] group-hover:text-[#ffe2a0] group-hover:shadow-[0_0_22px_rgba(240,196,83,.15)]">Исследовать <span aria-hidden="true">→</span></span>
                        </div>
                    </Link>;
                })}
            </section>

            <div className="mx-auto mt-16 max-w-3xl border-t border-[#b99347]/25 pt-9 text-center">
                <p className="font-serif text-xl italic text-[#e6d4b4] sm:text-2xl">Не ищи готового ответа. Замечай себя.</p>
                <p className="mt-3 text-sm leading-7 text-[#aa9b86]">Выбери то направление, которое откликается тебе сейчас.</p>
            </div>
        </main>
    </div>;
}
