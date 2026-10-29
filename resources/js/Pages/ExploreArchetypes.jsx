import React, { useMemo, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import guidesDefinition from '../../data/archetype-guides.json';
import situationsDefinition from '../../data/archetype-situations.json';
import ArchetypeSituationExperience from '../components/ArchetypeSituationExperience';
import ExploreSectionNavigation from '../components/ExploreSectionNavigation';


const guides = guidesDefinition.guides;
const situations = situationsDefinition.situations;
const categories = ['все', ...situationsDefinition.categories];
const frame = 'rounded-3xl border border-[#806638]/70 bg-[#211d15]';
const kicker = 'text-xs font-semibold uppercase tracking-[.19em] text-[#f0c453]';
const dailySituationIndex = total => {
    const date = new Date();
    const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
    return total ? ((day % total) + total) % total : 0;
};

export default function ExploreArchetypes() {
    const { archetypes = [], settings = {} } = usePage().props;
    const [category, setCategory] = useState('все');
    const [expanded, setExpanded] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [search, setSearch] = useState('');
    const daily = situations[dailySituationIndex(situations.length)];
    const others = useMemo(() => situations.filter(s => s.id !== daily.id && (category === 'все' || s.category === category)), [daily.id, category]);
    const selected = others.find(s => s.id === selectedId) || others[0];
    const shown = expanded ? others : others.slice(0, 9);
    const roles = archetypes.filter(item => [item.title, item.subtitle, guides[item.slug]?.lead].join(' ').toLowerCase().includes(search.toLowerCase().trim()));
    const chooseCategory = value => { setCategory(value); setSelectedId(null); setExpanded(false); };
    const chooseSituation = id => {
        setSelectedId(id);
        document.getElementById('chosen-situation')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    return <div className="min-h-screen bg-[#14120d] text-[#f8f4e9]">
        <Head title="Язык архетипов — пространство наблюдения за собой — Arutyun">
            <meta name="description" content="Исследуй восемь архетипов, ситуации дня, реакции в отношениях и на работе. Исследуй привычные реакции и открой свою карту архетипов." />
        </Head>
        <header className="relative z-40 border-b border-[#b99347]/25">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5">
                <Link href="/" aria-label="На главную">{settings?.logo ? <img src={settings.logo} alt={settings?.site_name || 'Arutyun'} className="h-10 max-w-[160px] object-contain" /> : <span className="font-serif text-2xl italic text-[#f0c453]">Arutyun</span>}</Link>
                <ExploreSectionNavigation items={[
                    { label: 'Зеркало дня', href: '#daily', icon: 'wb_sunny' },
                    { label: 'Жизненные ситуации', href: '#situations', icon: 'forum' },
                    { label: 'Архетипы', href: '#roles', icon: 'psychology' },
                    { label: 'Все направления', href: '/explore', icon: 'apps', catalog: true },
                ]} />
            </div>
        </header>
        <main className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:pt-16">
            <section className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
                <div>
                    <p className={kicker}>Пространство самопознания</p>
                    <h1 className="mt-4 font-serif text-5xl leading-tight sm:text-6xl">Язык <span className="italic text-[#f0c453]">архетипов</span></h1>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-[#d6c9b4]">Внутри нас звучат разные голоса: один хочет защитить, другой — исследовать, третий — всё упорядочить. Замечая их, мы получаем возможность выбирать, а не только реагировать.</p>
                    <p className="mt-4 max-w-2xl leading-7 text-[#a99d88]">Это язык для наблюдения, а не ярлык личности. Возвращайся к новым ситуациям, узнавай свои привычные реакции и исследуй, как они меняются в разных обстоятельствах.</p>
                    <div className="mt-7 flex flex-wrap items-center gap-3">
                        <a href="#daily" className="rounded-xl bg-[#f0c453] px-6 py-3 font-semibold text-[#21180b] transition hover:bg-[#ffda7b]">Начать с сегодняшней ситуации →</a>
                        <Link href="/explore/archetypes/mirror" className="rounded-xl border border-[#b08b49]/70 px-6 py-3 font-semibold text-[#f0c453] transition hover:bg-[#302518]">Полная карта · 20 вопросов</Link>
                    </div>
                </div>
                <div className={frame + ' relative overflow-hidden p-6 sm:p-8'}>
                    <div aria-hidden="true" className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#b98b3d]/10 blur-3xl" />
                    <p className={kicker}>Продолжение пути, а не разовый тест</p>
                    <h2 className="mt-4 font-serif text-3xl">Узнавай себя в реальных ситуациях</h2>
                    <div className="mt-6 grid grid-cols-2 gap-3">
                        {[['8','архетипов'],['28','ситуаций'],['1','зеркало каждый день'],['∞','возможностей заметить']].map(([n,label]) =>
                            <div key={label} className="rounded-2xl border border-[#796039]/60 bg-[#17140f] p-4">
                                <p className="font-serif text-3xl text-[#f0c453]">{n}</p>
                                <p className="mt-1 text-xs leading-5 text-[#c4b9a6]">{label}</p>
                            </div>
                        )}
                    </div>
                    <p className="mt-5 text-xs leading-6 text-[#a99d88]">Каждый день — новая ситуация из библиотеки. Выбирай реакцию и смотри, какой привычный образ за ней стоит.</p>
                </div>
            </section>
            <section className="mt-12 grid gap-3 sm:grid-cols-3" aria-label="Способы исследования">
                {[
                    ['Зеркало дня','Новая ситуация для наблюдения','#daily','today'],
                    ['Ситуации жизни','Отношения, конфликты, работа','#situations','view_list'],
                    ['Восемь образов','Сильные стороны, ловушки, примеры','#roles','psychology'],
                ].map(([title,caption,href,icon]) => <a key={title} href={href} className="group rounded-2xl border border-[#876b3b]/60 bg-[#211d15] p-5 transition hover:border-[#f0c453] hover:bg-[#2c2419]">
                    <span aria-hidden="true" className="material-symbols-outlined text-3xl text-[#f0c453]">{icon}</span>
                    <h3 className="mt-4 font-serif text-xl">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#b9ac98]">{caption}</p>
                    <span className="mt-4 inline-block text-sm text-[#f0c453]">Открыть →</span>
                </a>)}
            </section>
            <section id="daily" className="mt-20 scroll-mt-8">
                <p className={kicker}>Каждый день — новый взгляд</p>
                <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="mt-2 font-serif text-4xl sm:text-5xl">Зеркало <span className="italic text-[#f0c453]">дня</span></h2>
                        <p className="mt-4 max-w-2xl leading-7 text-[#c4b9a6]">Не нужно ждать кризиса, чтобы начать замечать себя. Выбери честную реакцию и задай себе один вопрос.</p>
                    </div>
                    <a href="#situations" className="text-sm text-[#f0c453] underline underline-offset-4 hover:text-white">Исследовать другие ситуации →</a>
                </div>
                <ArchetypeSituationExperience key={'daily-' + daily.id} situation={daily} archetypes={archetypes} featured />
            </section>
            <section id="situations" className="mt-20 scroll-mt-8">
                <p className={kicker}>Библиотека реакций</p>
                <h2 className="mt-2 font-serif text-4xl sm:text-5xl">Когда жизнь задаёт вопросы</h2>
                <p className="mt-4 max-w-3xl leading-7 text-[#c4b9a6]">Не обязательно дожидаться завтрашней ситуации. Выбери то, что откликается прямо сейчас. Вопросы не ставят диагноз и не дают готовых ответов — они помогают заметить привычный импульс.</p>
                <div className="mt-6 flex flex-wrap gap-2" aria-label="Темы жизненных ситуаций">
                    {categories.map(value => <button type="button" key={value} onClick={() => chooseCategory(value)} aria-pressed={category === value}
                        className={'rounded-full border px-4 py-2 text-sm capitalize transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453] ' + (category === value ? 'border-[#f0c453] bg-[#3a2c1a] text-[#f8e7c5]' : 'border-[#876b3b]/60 text-[#c4b9a6] hover:border-[#f0c453]')}>{value}</button>)}
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {shown.map(situation => <button key={situation.id} type="button" aria-pressed={selected?.id === situation.id} onClick={() => chooseSituation(situation.id)}
                        className={'min-h-[130px] rounded-2xl border p-5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453] ' + (selected?.id === situation.id ? 'border-[#f0c453] bg-[#372919]' : 'border-[#806638]/60 bg-[#211d15] hover:border-[#f0c453] hover:bg-[#2b2419]')}>
                        <span className="text-xs uppercase tracking-wider text-[#e5bc62]">{situation.category}</span>
                        <span className="mt-3 block font-serif text-xl">{situation.title}</span>
                        <span className="mt-2 block text-xs text-[#b9ac98]">Исследовать реакцию →</span>
                    </button>)}
                </div>
                {others.length > 9 && <div className="mt-5 text-center"><button type="button" onClick={() => setExpanded(value => !value)}
                    className="rounded-xl border border-[#8c7247] px-5 py-3 text-sm text-[#f0c453] hover:border-[#f0c453]">{expanded ? 'Свернуть список ↑' : 'Показать все ситуации (' + others.length + ') ↓'}</button></div>}
                {selected && <div id="chosen-situation" className="mt-6 scroll-mt-6">
                    <ArchetypeSituationExperience key={'library-' + selected.id} situation={selected} archetypes={archetypes} />
                </div>}
            </section>
            <section id="roles" className="mt-20 scroll-mt-8">
                <p className={kicker}>Энциклопедия архетипов</p>
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="mt-2 font-serif text-4xl sm:text-5xl">Восемь способов <span className="italic text-[#f0c453]">реагировать</span></h2>
                        <p className="mt-4 max-w-3xl leading-7 text-[#c4b9a6]">Открой каждый образ: как он проявляется в отношениях, работе и конфликтах, в чём его сила, когда он превращается в ловушку и какие вопросы полезно себе задать.</p>
                    </div>
                    <label className="block text-sm text-[#c4b9a6]">Найти образ
                        <input value={search} onChange={e => setSearch(e.target.value)} type="search" placeholder="Например: Наблюдатель"
                            className="mt-2 block w-full rounded-xl border border-[#8c7247] bg-[#211d15] px-4 py-3 text-[#f8f4e9] outline-none placeholder:text-[#8b7f6c] focus:border-[#f0c453]" />
                    </label>
                </div>
                {archetypes.length === 0 && <p className="mt-6 text-[#e5bc62]">Архетипы пока не опубликованы.</p>}
                {archetypes.length > 0 && roles.length === 0 && <p className="mt-6 text-[#c4b9a6]">По этому запросу ничего не найдено.</p>}
                <div className="mt-7 grid gap-4 md:grid-cols-2">
                    {roles.map(item => <Link key={item.id} href={'/explore/archetypes/' + encodeURIComponent(item.slug)}
                        className="group rounded-3xl border border-[#876b3b]/60 bg-[#211d15] p-6 transition hover:border-[#f0c453] hover:bg-[#2b2419] sm:p-7">
                        <div className="flex items-start justify-between gap-3">
                            <span aria-hidden="true" className="material-symbols-outlined text-4xl text-[#f0c453]">{item.icon || 'psychology'}</span>
                            <span className="text-xs text-[#a99d88]">Открыть образ →</span>
                        </div>
                        <h3 className="mt-5 font-serif text-3xl text-[#fff7e8]">{item.title}</h3>
                        <p className="mt-2 text-sm text-[#e5bc62]">{item.subtitle}</p>
                        <p className="mt-4 text-sm leading-7 text-[#c4b9a6]">{guides[item.slug]?.lead || item.description}</p>
                        <p className="mt-5 text-sm text-[#f0c453]">Исследовать глубже →</p>
                    </Link>)}
                </div>
            </section>
            <div className="mt-20 border-t border-[#9b7b3f]/40 pt-10 text-center">
                <p className="font-serif text-2xl">Ты больше любой роли, которую играешь.</p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#c4b9a6]">Роль можно заметить, поблагодарить за пользу и отпустить, когда она перестала помогать.</p>
                <Link href="/editoria" className="mt-6 inline-block rounded-xl bg-[#f0c453] px-6 py-3 text-sm font-semibold text-[#21180b] hover:bg-[#ffda7b]">Бесплатный практикум →</Link>
            </div>
        </main>
    </div>;
}
