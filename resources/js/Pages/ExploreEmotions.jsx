import React, { useMemo, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import atlas from '../../data/emotion-atlas.json';
import sceneData from '../../data/emotion-situations.json';
import practiceData from '../../data/emotion-practices.json';
import EmotionCompass from '../components/EmotionCompass';
import EmotionNamingHelper from '../components/EmotionNamingHelper';
import EmotionLayersExplorer from '../components/EmotionLayersExplorer';
import EmotionScenarioLibrary from '../components/EmotionScenarioLibrary';
import EmotionPracticeLibrary from '../components/EmotionPracticeLibrary';

const groups = atlas.groups;
const emotions = atlas.emotions;
const featuredSlugs = ['anxiety','anger','joy','sadness','fear','calm','hurt','shame','gratitude','envy','interest','inspiration'];
const kicker = 'text-xs font-semibold uppercase tracking-[.2em] text-[#f0c453]';
const blocks = [
    { title: 'Эмоциональный компас', subtitle: 'Что я чувствую прямо сейчас?', icon: 'explore', href: '#compass' },
    { title: 'Словарь 24 эмоций', subtitle: 'Найди слова для переживаний', icon: 'menu_book', href: '#dictionary' },
    { title: 'Жизненные ситуации', subtitle: 'Что откликается в событиях?', icon: 'forum', href: '#situations' },
    { title: 'Практики внимания', subtitle: 'Короткие шаги без спешки', icon: 'spa', href: '#practices' },
];

export default function ExploreEmotions() {
    const { settings = {} } = usePage().props;
    const [query,setQuery] = useState('');
    const [group,setGroup] = useState('all');
    const [showAll,setShowAll] = useState(false);
    const visible = useMemo(() => emotions.filter(item =>
        (group === 'all' || item.group === group) &&
        [item.name,item.subtitle,item.definition].join(' ').toLocaleLowerCase('ru').includes(query.trim().toLocaleLowerCase('ru'))
    ),[query,group]);
    const cards = showAll || group !== 'all' || query.trim()
        ? visible
        : featuredSlugs.map(slug => visible.find(item => item.slug === slug)).filter(Boolean);
    const pickGroup = value => {setGroup(value);setShowAll(false);};
    const goToEmotion = slug => router.visit('/explore/emotions/' + encodeURIComponent(slug));

    return <div data-no-analytics className="min-h-screen bg-[#14120d] text-[#f8f4e9]">
        <Head title="Язык эмоций — исследуй чувства, ситуации и внимание — Arutyun">
            <meta name="description" content="24 эмоции, эмоциональный компас, 30 жизненных ситуаций и 12 коротких практик. Исследуй своё состояние без регистрации и сохранения ответов." />
        </Head>
        <header className="border-b border-[#b99347]/25">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5">
                <Link href="/" aria-label="На главную">{settings?.logo ? <img src={settings.logo} alt={settings?.site_name || 'Arutyun'} className="h-10 max-w-[160px] object-contain" /> : <span className="font-serif text-2xl italic text-[#f0c453]">Arutyun</span>}</Link>
                <nav aria-label="Навигация по странице" className="flex flex-wrap gap-4 text-sm">
                    <a className="text-[#e4c88c] hover:text-white" href="#compass">Компас</a>
                    <a className="text-[#e4c88c] hover:text-white" href="#dictionary">Словарь</a>
                    <a className="text-[#e4c88c] hover:text-white" href="#situations">Ситуации</a>
                    <a className="text-[#e4c88c] hover:text-white" href="#practices">Практики</a>
                    <Link className="text-[#b2a38b] hover:text-white" href="/explore">Все направления →</Link>
                </nav>
            </div>
        </header>
        <main className="mx-auto max-w-6xl px-5 pb-20 pt-12 sm:pt-16">
            <section className="grid gap-9 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
                <div>
                    <p className={kicker}>Пространство самопознания</p>
                    <h1 className="mt-4 font-serif text-5xl sm:text-6xl">Язык <span className="italic text-[#f0c453]">эмоций</span></h1>
                    <p className="mt-6 max-w-3xl text-lg leading-8 text-[#dfd0ba]">Эмоции — не враги, которых нужно победить, и не приказы, которым необходимо подчиняться. Это часть нашего опыта, которую можно заметить, назвать и исследовать.</p>
                    <p className="mt-4 max-w-2xl leading-7 text-[#b7a992]">Сегодня ты можешь чувствовать тревогу, завтра — радость, а иногда сразу несколько переживаний. Здесь можно возвращаться к своему состоянию снова и снова — без тестов на «правильную личность».</p>
                    <div className="mt-7 flex flex-wrap gap-3">
                        <a href="#compass" className="rounded-xl bg-[#f0c453] px-6 py-3 font-semibold text-[#21180b] transition hover:bg-[#ffda7b]">Что я чувствую сейчас? →</a>
                        <a href="#naming" className="rounded-xl border border-[#a38652] px-6 py-3 text-sm text-[#f0c453] transition hover:border-[#f0c453]">Не понимаю, что чувствую</a>
                    </div>
                </div>
                <div className="relative overflow-hidden rounded-3xl border border-[#947649]/70 bg-gradient-to-br from-[#342719] via-[#241e16] to-[#17140f] p-7 sm:p-9">
                    <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border-[38px] border-[#b48b42]/10" />
                    <p className={kicker}>Не одно чувство. Не одно объяснение.</p>
                    <h2 className="relative mt-4 font-serif text-3xl">Замечать — не значит судить</h2>
                    <div className="relative mt-7 grid grid-cols-2 gap-3">
                        {[['24','чувства и состояния'],['30','жизненных ситуаций'],['12','коротких практик'],['0','обязательных регистраций']].map(([number,label]) => <div key={label} className="rounded-xl border border-[#81663d]/70 bg-[#17140f]/70 p-4">
                            <p className="font-serif text-4xl text-[#f0c453]">{number}</p>
                            <p className="mt-1 text-xs leading-5 text-[#c8b99e]">{label}</p>
                        </div>)}
                    </div>
                    <p className="relative mt-6 text-xs leading-6 text-[#b7a990]">Вопросы компаса, выборы в ситуациях и интенсивность переживания не отправляются на сервер и не сохраняются.</p>
                </div>
            </section>

            <nav className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Инструменты языка эмоций">
                {blocks.map(item=><a href={item.href} key={item.title} className="group rounded-2xl border border-[#806638]/65 bg-[#211d15] p-5 transition hover:border-[#f0c453] hover:bg-[#2b2419]">
                    <span aria-hidden="true" className="material-symbols-outlined text-3xl text-[#f0c453]">{item.icon}</span>
                    <h2 className="mt-4 font-serif text-xl">{item.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-[#bcae9a]">{item.subtitle}</p>
                    <span className="mt-4 inline-block text-sm text-[#f0c453]">Исследовать →</span>
                </a>)}
            </nav>

            <section id="compass" className="mt-20 scroll-mt-6">
                <p className={kicker}>Начни с того, что есть</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Эмоциональный <span className="italic text-[#f0c453]">компас</span></h2>
                <p className="mb-7 mt-4 max-w-3xl leading-7 text-[#c4b9a6]">Не нужно знать причину своего состояния заранее. Исследуй его мягко: выбери слово, обрати внимание на интенсивность, тело и контекст — затем посмотри возможные следующие шаги.</p>
                <EmotionCompass onExploreEmotion={goToEmotion} />
            </section>

            <section id="dictionary" className="mt-20 scroll-mt-6">
                <p className={kicker}>Энциклопедия переживаний</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Словарь <span className="italic text-[#f0c453]">эмоций</span></h2>
                <p className="mt-4 max-w-3xl leading-7 text-[#c4b9a6]">Не только злость, грусть и радость. Здесь собраны 24 эмоциональных переживания и состояния: с примерами, возможными причинами, потребностями, вопросами и практиками. Группы помогают ориентироваться, но не являются строгой научной классификацией.</p>
                <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-wrap gap-2" aria-label="Группы эмоций">
                        {[{ id:'all',title:'Все состояния' },...groups].map(item=><button type="button" key={item.id} onClick={()=>pickGroup(item.id)} aria-pressed={group===item.id}
                            className={'rounded-full border px-4 py-2 text-sm transition hover:border-[#f0c453] '+(group===item.id?'border-[#f0c453] bg-[#3c2d1b] text-white':'border-[#8b6d42]/65 text-[#d1c3ae]')}>{item.title}</button>)}
                    </div>
                    <label className="block text-sm text-[#d8cbb7]">Найти чувство
                        <input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Например: вина"
                            className="mt-2 block w-full rounded-xl border border-[#8b6d42] bg-[#211d15] px-4 py-3 text-sm text-white outline-none placeholder:text-[#938571] focus:border-[#f0c453]" />
                    </label>
                </div>
                <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {cards.map(item=><Link key={item.slug} href={'/explore/emotions/'+item.slug}
                        className="group min-h-[210px] rounded-2xl border border-[#84693f]/65 bg-[#211d15] p-5 transition hover:border-[#f0c453] hover:bg-[#2b2419]">
                        <div className="flex items-start justify-between gap-2">
                            <span aria-hidden="true" className="material-symbols-outlined text-3xl text-[#f0c453]">{item.icon}</span>
                            <span className="text-xs text-[#a99d88]">Подробнее →</span>
                        </div>
                        <h3 className="mt-4 font-serif text-2xl">{item.name}</h3>
                        <p className="mt-2 text-sm text-[#e5bc62]">{item.subtitle}</p>
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#b9ab96]">{item.definition}</p>
                    </Link>)}
                </div>
                {visible.length===0 && <p className="mt-6 rounded-xl border border-[#84693f]/70 p-6 text-sm text-[#b9aa96]">Ничего не найдено. Попробуй другое слово или открой все состояния.</p>}
                {visible.length>cards.length && <div className="mt-6 text-center">
                    <button type="button" onClick={()=>setShowAll(true)} className="rounded-xl border border-[#9c7d49] px-6 py-3 text-sm text-[#f0c453] hover:border-[#f0c453]">Открыть все 24 состояния ↓</button>
                </div>}
            </section>

            <section id="naming" className="mt-20 scroll-mt-6">
                <p className={kicker}>Если слов не хватает</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Когда чувство <span className="italic text-[#f0c453]">непонятно</span></h2>
                <p className="mb-7 mt-4 max-w-3xl leading-7 text-[#c4b9a6]">Иногда мы замечаем только напряжение, усталость или странное смешение ощущений. Не нужно угадывать «правильный» термин — можно начать с простых наблюдений.</p>
                <EmotionNamingHelper onExploreEmotion={goToEmotion} />
            </section>

            <section id="layers" className="mt-20 scroll-mt-6">
                <p className={kicker}>Несколько чувств одновременно</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Что может стоять <span className="italic text-[#f0c453]">рядом?</span></h2>
                <p className="mb-7 mt-4 max-w-3xl leading-7 text-[#c4b9a6]">Злость иногда возникает вместе с болью, а радость — с благодарностью. Посмотри, какие ещё переживания могут сопровождать знакомое чувство, не принимая гипотезу за факт.</p>
                <EmotionLayersExplorer onExploreEmotion={goToEmotion} />
            </section>

            <section id="situations" className="mt-20 scroll-mt-6">
                <p className={kicker}>Проверить на жизненных примерах</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Эмоции в <span className="italic text-[#f0c453]">ситуациях</span></h2>
                <p className="mb-7 mt-4 max-w-3xl leading-7 text-[#c4b9a6]">{sceneData.situations.length} историй из отношений, семьи, работы, перемен и внутренней жизни. Одна и та же ситуация может вызывать разные чувства у разных людей и даже у тебя в разные дни.</p>
                <EmotionScenarioLibrary />
            </section>

            <section id="practices" className="mt-20 scroll-mt-6">
                <p className={kicker}>От понимания — к вниманию</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Минута <span className="italic text-[#f0c453]">внимания</span></h2>
                <p className="mb-7 mt-4 max-w-3xl leading-7 text-[#c4b9a6]">Не всегда нужны глубокие выводы. Иногда достаточно заметить опору под ногами, взять паузу или подобрать слова для честной просьбы. Выбери одну из {practiceData.practices.length} практик.</p>
                <EmotionPracticeLibrary />
            </section>

            <section className="mt-20 grid gap-5 lg:grid-cols-2">
                <div className="rounded-3xl border border-[#85693e]/70 bg-[#211d15] p-6 sm:p-8">
                    <p className={kicker}>Наблюдать, а не подавлять</p>
                    <h2 className="mt-3 font-serif text-3xl">Эмоция — не поступок</h2>
                    <p className="mt-4 leading-8 text-[#d7c9b5]">Чувствовать злость не означает причинять вред. Чувствовать страх не означает быть слабым. Переживание может возникать автоматически; с нашей стороны остаётся вопрос, как с ним обходиться и что делать дальше.</p>
                </div>
                <div className="rounded-3xl border border-[#85693e]/70 bg-[#211d15] p-6 sm:p-8">
                    <p className={kicker}>Место для сложных состояний</p>
                    <h2 className="mt-3 font-serif text-3xl">Когда одного самонаблюдения мало</h2>
                    <p className="mt-4 leading-8 text-[#d7c9b5]">Если сильные переживания мешают повседневной жизни, повторяются или кажутся невыносимыми, полезно обратиться к специалисту и близким за поддержкой. При непосредственной угрозе безопасности — в местные экстренные службы.</p>
                </div>
            </section>
            <section className="mt-16 border-t border-[#876b3b]/45 pt-10 text-center">
                <p className="font-serif text-2xl">Ты больше любой эмоции, которую переживаешь.</p>
                <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#b9ab96]">Эти материалы — инструменты самонаблюдения, а не диагностика, лечение или универсальные толкования. Эмоции сложны, индивидуальны и не обязаны укладываться в готовую схему.</p>
                <Link href="/editoria" className="mt-6 inline-block rounded-xl bg-[#f0c453] px-6 py-3 text-sm font-semibold text-[#21180b] hover:bg-[#ffda7b]">Бесплатный практикум →</Link>
            </section>
        </main>
    </div>;
}
