import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ExploreSectionNavigation from '../components/ExploreSectionNavigation.jsx';
import ExploreLifeWorkbench from '../components/ExploreLifeWorkbench.jsx';
import { ExplorePracticeInvitation, useExploreJourney } from '../components/ExploreJourney.jsx';
import { liveExploreDocument } from '../lib/exploreCms.js';
import relationshipsBase from '../../data/relationships-atlas.json';
import bodyBase from '../../data/body-atlas.json';
import choiceBase from '../../data/choice-atlas.json';
import beliefsBase from '../../data/beliefs-atlas.json';
import valuesBase from '../../data/values-atlas.json';
import fearsBase from '../../data/fears-atlas.json';
import timeBase from '../../data/time-atlas.json';
import conflictsBase from '../../data/conflicts-atlas.json';
import attentionBase from '../../data/attention-atlas.json';

const libraries = {
    relationships: liveExploreDocument('relationships-atlas', relationshipsBase),
    body: liveExploreDocument('body-atlas', bodyBase),
    choice: liveExploreDocument('choice-atlas', choiceBase),
    beliefs: liveExploreDocument('beliefs-atlas', beliefsBase),
    values: liveExploreDocument('values-atlas', valuesBase),
    fears: liveExploreDocument('fears-atlas', fearsBase),
    time: liveExploreDocument('time-atlas', timeBase),
    conflicts: liveExploreDocument('conflicts-atlas', conflictsBase),
    attention: liveExploreDocument('attention-atlas', attentionBase),
};
const themes = {
    relationships: { icon: 'diversity_3', light: '#f0c453', gradient: 'from-[#482c34] via-[#2d2229] to-[#17140f]', symbol: 'favorite' },
    body: { icon: 'self_improvement', light: '#a6d7c0', gradient: 'from-[#234338] via-[#1d2c27] to-[#17140f]', symbol: 'spa' },
    choice: { icon: 'alt_route', light: '#f0c453', gradient: 'from-[#493a28] via-[#25231e] to-[#17140f]', symbol: 'alt_route' },
    beliefs: { icon: 'psychology_alt', light: '#c5b7f0', gradient: 'from-[#39314e] via-[#292338] to-[#17140f]', symbol: 'psychology' },
    values: { icon: 'explore', light: '#eac87e', gradient: 'from-[#423922] via-[#26261e] to-[#17140f]', symbol: 'explore' },
    fears: { icon: 'shield', light: '#dcb0a9', gradient: 'from-[#442527] via-[#291d24] to-[#17140f]', symbol: 'shield' },
    time: { icon: 'schedule', light: '#abc6e1', gradient: 'from-[#24394a] via-[#1d2834] to-[#17140f]', symbol: 'hourglass_top' },
    conflicts: { icon: 'balance', light: '#e4c087', gradient: 'from-[#483828] via-[#282526] to-[#17140f]', symbol: 'balance' },
    attention: { icon: 'visibility', light: '#b9d4ac', gradient: 'from-[#273f34] via-[#1d2a24] to-[#17140f]', symbol: 'visibility' },
};
const kicker = 'text-xs font-semibold uppercase tracking-[.19em] text-[#f0c453]';
const optionClass = selected => 'min-h-16 w-full rounded-xl border p-4 text-left text-sm leading-6 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453] ' +
    (selected ? 'border-[#f0c453] bg-[#42301c] text-[#fff1d7]' : 'border-[#806638]/70 bg-[#191610] text-[#e0d0ba] hover:border-[#dcb868] hover:bg-[#292219]');

export default function ExploreLifeLanguage() {
    const { languageSlug, settings = {} } = usePage().props;
    const data = libraries[languageSlug] || libraries.relationships;
    const theme = themes[languageSlug] || themes.relationships;
    const [selectedId, setSelectedId] = useState('');
    const [optionId, setOptionId] = useState('');
    const [stage, setStage] = useState(0);
    const [filter, setFilter] = useState('');
    const [search, setSearch] = useState('');
    const [showAll, setShowAll] = useState(false);
    const [savedPrompts, setSavedPrompts] = useState([]);
    const exerciseRef = useRef(null);
    const started = stage > 0;
    const completed = stage === 2;
    useExploreJourney(languageSlug, started, completed);
    const items = data.situations;
    const selected = items.find(item => item.id === selectedId);
    const chosen = selected?.options.find(option => option.id === optionId);
    const today = new Date();
    const dateSeed = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 86400000);
    const daily = items[dateSeed % items.length];
    const filtered = useMemo(() => items.filter(item => {
        const matches = !search || [item.title, item.scene, item.reflection].join(' ').toLowerCase().includes(search.trim().toLowerCase());
        return matches;
    }), [items, search]);
    const visible = showAll || search.trim() ? filtered : filtered.slice(0, 6);
    const jump = () => {
        requestAnimationFrame(() => exerciseRef.current?.scrollIntoView({
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
            block: 'start',
        }));
    };
    const choose = id => { setSelectedId(id); setOptionId(''); setStage(1); jump(); };
    const reset = () => { setSelectedId(''); setOptionId(''); setStage(0); jump(); };
    useEffect(() => { setSelectedId(''); setOptionId(''); setStage(0); setSearch(''); setShowAll(false); setSavedPrompts([]); }, [languageSlug]);

    return <div data-no-analytics className="min-h-screen bg-[#14120d] text-[#f8f4e9]">
        <Head title={data.title + ' — пространство самопознания — Arutyun'}>
            <meta name="description" content={data.intro} />
        </Head>
        <header className="relative z-40 border-b border-[#b99347]/25">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5">
                <Link href="/" aria-label="На главную">{settings?.logo
                    ? <img src={settings.logo} alt="Arutyun" className="h-10 max-w-[110px] object-contain sm:max-w-[160px]" />
                    : <span className="font-serif text-2xl italic text-[#f0c453]">Arutyun</span>}
                </Link>
                <ExploreSectionNavigation items={[
                    { label: data.exerciseTitle, href: '#experience', icon: theme.icon },
                    { label: 'Личная практика', href: '#workbench', icon: 'edit_note' },
                    { label: 'Библиотека ситуаций', href: '#library', icon: 'menu_book' },
                    { label: 'Эксперимент дня', href: '#daily', icon: 'lightbulb' },
                    { label: 'Все направления', href: '/explore', icon: 'apps', catalog: true },
                ]} />
            </div>
        </header>
        <main className="mx-auto max-w-6xl px-5 pb-20 pt-12 sm:pt-16">
            <section className="grid items-center gap-9 lg:grid-cols-[1.16fr_.84fr]">
                <div>
                    <p className={kicker}>Пространство самопознания</p>
                    <h1 className="mt-4 font-serif text-5xl leading-tight sm:text-6xl">Язык <span className="italic text-[#f0c453]">{data.name}</span></h1>
                    <p className="mt-6 max-w-3xl text-lg leading-8 text-[#decfba]">{data.intro}</p>
                    <p className="mt-4 max-w-3xl leading-7 text-[#b8aa96]">{data.promise}</p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <a href="#experience" className="rounded-xl bg-[#f0c453] px-6 py-3 font-semibold text-[#21180b] transition hover:bg-[#ffda7b]">{data.exerciseTitle} →</a>
                        <a href="#library" className="rounded-xl border border-[#98784b] px-6 py-3 text-sm text-[#f0c453] transition hover:border-[#f0c453]">Посмотреть ситуации</a>
                    </div>
                </div>
                <div className={'relative overflow-hidden rounded-3xl border border-[#9f7b45]/70 bg-gradient-to-br p-7 sm:p-9 ' + theme.gradient}>
                    <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-12 h-64 w-64 rounded-full border-[26px] border-[#f0c453]/10" />
                    <div aria-hidden="true" className="pointer-events-none absolute bottom-6 right-5 h-40 w-40 rounded-full border border-[#f0c453]/20" />
                    <span aria-hidden="true" className="material-symbols-outlined relative text-[78px] leading-none text-[#f0c453]">{theme.symbol}</span>
                    <p className={kicker + ' relative mt-6'}>Не оценка личности, а наблюдение</p>
                    <h2 className="relative mt-3 font-serif text-3xl leading-tight">{data.exerciseTitle}</h2>
                    <p className="relative mt-4 text-sm leading-7 text-[#e0d1bb]">{data.exerciseIntro}</p>
                    <div className="relative mt-7 grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-[#c19b59]/30 bg-black/25 p-4"><div className="font-serif text-4xl text-[#f0c453]">{items.length}</div><div className="mt-1 text-xs text-[#dbccae]">жизненных ситуаций</div></div>
                        <div className="rounded-xl border border-[#c19b59]/30 bg-black/25 p-4"><div className="font-serif text-4xl text-[#f0c453]">3</div><div className="mt-1 text-xs text-[#dbccae]">шага исследования</div></div>
                    </div>
                    <p className="relative mt-5 text-xs leading-6 text-[#c1b29b]">Ответы остаются в этой вкладке. Мы не сохраняем и не отправляем выбранные варианты.</p>
                </div>
            </section>

            <section id="experience" ref={exerciseRef} className="mt-20 scroll-mt-8">
                <p className={kicker}>Начни с живого опыта</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">{data.exerciseTitle}</h2>
                <p className="mt-4 max-w-3xl leading-7 text-[#c7bba9]">{data.exerciseIntro}</p>
                <div className="mt-7 overflow-hidden rounded-3xl border border-[#a18150]/70 bg-[#211d15]">
                    <div className="flex items-center justify-between gap-4 border-b border-[#806538]/65 bg-[#332718] p-5 sm:p-7">
                        <h3 className="font-serif text-xl sm:text-2xl">Ситуация · Реакция · Новый шаг</h3>
                        <span className="shrink-0 rounded-full border border-[#9c7849]/70 px-3 py-2 text-xs text-[#f0c453]">Шаг {stage + 1} из 3</span>
                    </div>
                    <div className="p-5 sm:p-8">
                        {stage === 0 && <>
                            <h4 className="font-serif text-2xl">Что сейчас ближе тебе?</h4>
                            <p className="mt-3 text-sm leading-7 text-[#baab94]">Выбери ситуацию, которую хотелось бы рассмотреть. Это не тест, здесь нет правильных вариантов.</p>
                            <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                {items.map(item => <button key={item.id} type="button" onClick={() => choose(item.id)} className={optionClass(false)}>
                                    <span className="block font-serif text-xl text-[#f3d287]">{item.title}</span>
                                    <span className="mt-2 block text-sm text-[#c5b79f]">{item.scene}</span>
                                </button>)}
                            </div>
                        </>}
                        {stage === 1 && selected && <>
                            <p className={kicker}>Остановись на своём первом импульсе</p>
                            <h4 className="mt-3 font-serif text-3xl">{selected.title}</h4>
                            <p className="mt-4 text-lg leading-8 text-[#e0d2bd]">{selected.scene}</p>
                            <p className="mt-5 text-sm text-[#bba98f]">Что из перечисленного ближе к твоей привычной реакции? Можно выбрать приблизительно.</p>
                            <div className="mt-5 grid gap-3 md:grid-cols-3">
                                {selected.options.map(option => <button key={option.id} type="button" aria-pressed={option.id === optionId} onClick={() => setOptionId(option.id)} className={optionClass(optionId === option.id)}>{option.label}</button>)}
                            </div>
                            <div className="mt-7 flex flex-wrap gap-3">
                                <button type="button" onClick={reset} className="rounded-xl border border-[#907143] px-5 py-3 text-sm text-[#e3c47a]">← Другая ситуация</button>
                                <button type="button" disabled={!optionId} onClick={() => {setStage(2);jump();}} className="rounded-xl bg-[#f0c453] px-6 py-3 text-sm font-semibold text-[#21180b] disabled:cursor-not-allowed disabled:opacity-40">Посмотреть отражение →</button>
                            </div>
                        </>}
                        {stage === 2 && selected && <>
                            <p className={kicker}>Не ярлык, а возможность посмотреть иначе</p>
                            <h4 className="mt-3 font-serif text-3xl">{selected.title}</h4>
                            <div className="mt-5 rounded-2xl border border-[#816a45]/65 bg-[#17140f] p-5">
                                <p className="text-xs uppercase tracking-wider text-[#e0be74]">Твоя первая реакция</p>
                                <p className="mt-2 text-base leading-7 text-[#f7e8cf]">{chosen?.label}</p>
                            </div>
                            <div className="mt-5 grid gap-4 md:grid-cols-2">
                                <div className="rounded-2xl border border-[#786039]/70 p-5">
                                    <p className={kicker}>Что здесь можно заметить</p>
                                    <p className="mt-3 leading-7 text-[#d8c8af]">{selected.reflection}</p>
                                </div>
                                <div className="rounded-2xl border border-[#786039]/70 p-5">
                                    <p className={kicker}>Вопрос к себе</p>
                                    <p className="mt-3 leading-7 text-[#d8c8af]">{selected.question}</p>
                                </div>
                            </div>
                            <div className="mt-5 rounded-2xl border border-[#a3844e]/65 bg-[#352719] p-5 sm:p-7">
                                <p className={kicker}>Маленький эксперимент</p>
                                <h5 className="mt-3 font-serif text-2xl">Попробуй иначе — без давления на себя</h5>
                                <p className="mt-3 leading-7 text-[#ebdcc4]">{selected.practice}</p>
                                <p className="mt-3 text-xs text-[#c2b199]">Это возможное направление, а не обязательное решение.</p>
                            </div>
                            <div className="mt-7"><ExplorePracticeInvitation tool={languageSlug} compact /></div>
                            <div className="mt-7 flex flex-wrap gap-3">
                                <button type="button" onClick={() => {setStage(1);jump();}} className="rounded-xl border border-[#927449] px-5 py-3 text-sm text-[#e0c17a]">← Изменить ответ</button>
                                <button type="button" onClick={reset} className="rounded-xl bg-[#f0c453] px-6 py-3 text-sm font-semibold text-[#21180b]">Исследовать ещё →</button>
                            </div>
                        </>}
                    </div>
                </div>
            </section>

            <ExploreLifeWorkbench slug={languageSlug} feature={data.feature} />

            <section id="library" className="mt-20 scroll-mt-8">
                <p className={kicker}>Исследовать в своём темпе</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">{data.libraryTitle}</h2>
                <p className="mt-4 max-w-3xl leading-7 text-[#c7bba9]">Выбери тему, которая отзывается, и посмотри вопрос и практику. Можно возвращаться к материалам без регистрации.</p>
                <div className="mt-7 flex flex-wrap gap-3">
                    <label className="sr-only" htmlFor="life-library-search">Найти ситуацию</label>
                    <input id="life-library-search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Найти ситуацию…" className="min-h-11 min-w-0 flex-1 rounded-xl border border-[#80663e] bg-[#201b15] px-4 py-3 text-[#f8ecda] outline-none placeholder:text-[#a4957e] focus:border-[#f0c453]" />
                    <button type="button" onClick={() => {setSearch('');setShowAll(false);}} className="rounded-xl border border-[#80663e] px-5 text-sm text-[#f0c453]">Сбросить</button>
                </div>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {visible.map(item => {
                        const isOpen = filter === item.id;
                        return <article key={item.id} className="overflow-hidden rounded-2xl border border-[#80663e]/70 bg-[#211d15]">
                            <button type="button" aria-expanded={isOpen} onClick={() => setFilter(isOpen ? '' : item.id)} className="flex w-full items-start justify-between gap-4 p-5 text-left sm:p-6">
                                <div><h3 className="font-serif text-2xl text-[#f9edda]">{item.title}</h3><p className="mt-3 text-sm leading-7 text-[#c6b69d]">{item.scene}</p></div>
                                <span aria-hidden="true" className="material-symbols-outlined text-[#f0c453]">{isOpen ? 'expand_less' : 'expand_more'}</span>
                            </button>
                            {isOpen && <div className="border-t border-[#79613d]/60 px-5 pb-6 pt-5 sm:px-6">
                                <p className="text-sm leading-7 text-[#d9c9b2]">{item.reflection}</p>
                                <p className="mt-4 text-sm leading-7 text-[#f0d28e]">{item.question}</p>
                                <p className="mt-3 text-sm leading-7 text-[#d2c1a8]">{item.practice}</p>
                                <button type="button" className="mt-5 text-sm font-semibold text-[#f0c453] hover:underline" onClick={() => {choose(item.id);}}>Исследовать свою реакцию →</button>
                            </div>}
                        </article>;
                    })}
                </div>
                {filtered.length === 0 && <p className="mt-6 text-[#c3b29b]">По запросу ничего не нашлось. Попробуй другие слова.</p>}
                {!search.trim() && filtered.length > 6 && <button type="button" onClick={() => setShowAll(value => !value)} className="mt-6 rounded-xl border border-[#997848] px-6 py-3 text-sm text-[#f0c453] hover:border-[#f0c453]">{showAll ? 'Свернуть список' : 'Показать все ситуации'}</button>}
            </section>

            <section id="daily" className="mt-20 scroll-mt-8">
                <p className={kicker}>Небольшая практика каждый день</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">{data.dailyTitle}</h2>
                <div className="mt-7 grid gap-5 rounded-3xl border border-[#a0804a]/65 bg-gradient-to-br from-[#332719] to-[#201b15] p-6 sm:p-9 lg:grid-cols-[1fr_.82fr]">
                    <div>
                        <span className="rounded-full border border-[#b18f57]/45 px-3 py-1 text-xs uppercase tracking-wider text-[#ebc875]">Вопрос дня</span>
                        <h3 className="mt-5 font-serif text-3xl">{daily.title}</h3>
                        <p className="mt-4 leading-7 text-[#dbcbb5]">{daily.question}</p>
                        <p className="mt-5 leading-7 text-[#e5c988]">{daily.practice}</p>
                    </div>
                    <div className="rounded-2xl border border-[#86673d]/70 bg-[#17140f] p-5 sm:p-6">
                        <p className={kicker}>Личная отметка</p>
                        <p className="mt-3 text-sm leading-7 text-[#c6b69c]">Запиши для себя, что заметил сегодня. Текст не отправляется на сервер и исчезнет при закрытии страницы.</p>
                        <label className="sr-only" htmlFor="daily-observation">Моё наблюдение</label>
                        <textarea id="daily-observation" rows={4} value={savedPrompts[0] || ''} onChange={e => setSavedPrompts([e.target.value])} placeholder="Сегодня я заметил…" className="mt-4 w-full rounded-xl border border-[#78603b] bg-[#221c15] p-4 text-sm text-[#f6e8d1] outline-none placeholder:text-[#a79981] focus:border-[#f0c453]" />
                        <p className="mt-3 text-xs text-[#aa9c87]">Только в этой вкладке. Не сохраняется.</p>
                    </div>
                </div>
            </section>
            <section className="mt-14 rounded-2xl border border-[#80663d]/55 bg-[#1e1a14] p-6 sm:p-8">
                <p className={kicker}>Важные границы</p>
                <p className="mt-3 max-w-4xl text-sm leading-7 text-[#c5b7a1]">{data.safety}</p>
                <p className="mt-3 text-xs leading-6 text-[#a99c86]">Эти вопросы помогают исследовать опыт и не ставят диагнозы, не дают предсказаний и не определяют тип личности.</p>
            </section>
            <footer className="mt-14 border-t border-[#80663d]/50 pt-9 text-center">
                <p className="font-serif text-2xl italic text-[#ecd6af]">{data.promise}</p>
                <Link href="/explore" className="mt-5 inline-block text-sm font-semibold text-[#f0c453] hover:underline">← Вернуться ко всем направлениям</Link>
            </footer>
        </main>
    </div>;
}
