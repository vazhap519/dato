import React, { useMemo, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import data from '../../data/dream-atlas.json';

const S = data.symbols;
const G = data.groups;
const kicker = 'text-xs font-semibold uppercase tracking-[.18em] text-[#f0c453]';
const card = 'rounded-2xl border border-[#84683f]/70 bg-[#211d15] p-5 sm:p-6';
const feelings = ['Интерес','Радость','Спокойствие','Тревога','Страх','Грусть','Растерянность','Что-то смешанное','Не помню'];
const life = ['Давняя память','Недавнее событие','Отношения','Работа и дела','Перемены','Не знаю'];

export default function ExploreDreams() {
    const { settings = {} } = usePage().props;
    const [picked,setPicked] = useState(S[0].slug);
    const [felt,setFelt] = useState('');
    const [connection,setConnection] = useState('');
    const [stage,setStage] = useState(0);
    const [group,setGroup] = useState('all');
    const [query,setQuery] = useState('');
    const [expanded,setExpanded] = useState(false);
    const chosen = S.find(s=>s.slug===picked) || S[0];
    const filtered = useMemo(()=>S.filter(x=>(group==='all'||x.group===group)&&[x.name,x.subtitle,x.description].join(' ').toLowerCase().includes(query.trim().toLowerCase())),[group,query]);
    const symbols = expanded || group!=='all' || query.trim() ? filtered : filtered.slice(0,12);
    const now=new Date();
    const idx=Math.floor(Date.UTC(now.getFullYear(),now.getMonth(),now.getDate())/86400000)%S.length;
    const today=S[idx];
    const reset=()=>{setStage(0);setFelt('');setConnection('');};
    const chooseSymbol=slug=>{setPicked(slug);setStage(1);setFelt('');setConnection('');};
    return <div data-no-analytics className="min-h-screen bg-[#14120d] text-[#f8f4e9]">
        <Head title="Язык снов — исследуй образы и личные ассоциации — Arutyun">
            <meta name="description" content="24 образа сновидений, вопросы о чувствах и памяти, образ дня и индивидуальный инструмент осмысления снов без предсказаний." />
        </Head>
        <header className="border-b border-[#b99347]/25">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5">
                <Link href="/" aria-label="На главную">{settings?.logo?<img src={settings.logo} alt={settings?.site_name||'Arutyun'} className="h-10 max-w-[160px] object-contain" />:<span className="font-serif text-2xl italic text-[#f0c453]">Arutyun</span>}</Link>
                <nav className="flex flex-wrap items-center gap-4 text-sm" aria-label="Навигация по странице">
                    <a href="#explorer" className="text-[#e4c88c] hover:text-white">Исследовать сон</a>
                    <a href="#symbols" className="text-[#e4c88c] hover:text-white">Образы</a>
                    <a href="#today" className="text-[#e4c88c] hover:text-white">Образ дня</a>
                    <a href="#how" className="text-[#e4c88c] hover:text-white">Как работать</a>
                    <Link href="/explore" className="text-[#b9a98e] hover:text-white">Все направления →</Link>
                </nav>
            </div>
        </header>
        <main className="mx-auto max-w-6xl px-5 pb-20 pt-12 sm:pt-16">
            <section className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
                <div>
                    <p className={kicker}>Пространство самопознания</p>
                    <h1 className="mt-4 font-serif text-5xl sm:text-6xl">Язык <span className="italic text-[#f0c453]">снов</span></h1>
                    <p className="mt-6 max-w-3xl text-lg leading-8 text-[#d9cbb6]">Сон не обязан сообщать тайную истину. Но образ, который остался с тобой после пробуждения, может стать поводом услышать собственные ассоциации, чувства и воспоминания.</p>
                    <p className="mt-4 max-w-3xl leading-7 text-[#ad9f88]">Здесь нет предсказаний, «плохих знаков» и универсальных значений. Один и тот же сюжет может переживаться совершенно по-разному.</p>
                    <div className="mt-7 flex flex-wrap gap-3">
                        <a href="#explorer" className="rounded-xl bg-[#f0c453] px-6 py-3 font-semibold text-[#21180b] hover:bg-[#ffda7b]">Исследовать свой сон →</a>
                        <a href="#symbols" className="rounded-xl border border-[#9b7845] px-6 py-3 text-sm text-[#f0c453] hover:border-[#f0c453]">Открыть образы</a>
                    </div>
                </div>
                <div className="relative overflow-hidden rounded-3xl border border-[#876b40]/70 bg-gradient-to-br from-[#322619] to-[#1b1814] p-7 sm:p-9">
                    <span aria-hidden="true" className="material-symbols-outlined text-[80px] leading-none text-[#e5bc62]">nights_stay</span>
                    <p className={kicker+" mt-5"}>Вместо сонника — вопросы</p>
                    <h2 className="mt-3 font-serif text-3xl">Не что означает сон, а что он напоминает тебе</h2>
                    <p className="mt-4 text-sm leading-7 text-[#c4b9a6]">24 образа · 4 группы · короткое исследование без анкеты, регистрации и сохранения ответов.</p>
                </div>
            </section>

            <section id="explorer" className="mt-20 scroll-mt-6">
                <p className={kicker}>Первый шаг — собственное переживание</p>
                <h2 className="mt-3 font-serif text-4xl">Зеркало <span className="italic text-[#f0c453]">сновидения</span></h2>
                <p className="mt-4 max-w-3xl leading-7 text-[#c4b9a6]">Выбери запомнившийся образ. Если его нет в списке, можно выбрать похожий по ощущению или перейти к вопросам ниже. Не нужно записывать сам сон.</p>
                <div className="mt-7 overflow-hidden rounded-3xl border border-[#9b7a45]/70 bg-[#211d15]">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#82653e]/60 bg-[#302416] p-5 sm:p-7">
                        <h3 className="font-serif text-2xl">Исследование сна</h3>
                        <span className="text-xs uppercase tracking-wider text-[#e5bc62]">Шаг {stage+1} из 3</span>
                    </div>
                    <div className="p-5 sm:p-8">
                        {stage===0 && <>
                            <h4 className="font-serif text-xl">Что особенно запомнилось?</h4>
                            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                                {S.map(item=><button key={item.slug} type="button" onClick={()=>chooseSymbol(item.slug)} className="rounded-xl border border-[#78613d] bg-[#17140f] p-3 text-left text-sm transition hover:border-[#f0c453] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453]">
                                    <span aria-hidden="true" className="material-symbols-outlined block text-2xl text-[#f0c453]">{item.icon}</span>
                                    <span className="mt-2 block">{item.name}</span>
                                </button>)}
                            </div>
                        </>}
                        {stage===1 && <>
                            <p className={kicker}>Образ: {chosen.name}</p>
                            <h4 className="mt-3 font-serif text-2xl">Что ты чувствовал во сне?</h4>
                            <p className="mt-3 text-sm leading-7 text-[#bba992]">Даже похожие образы могут означать разный личный опыт. Начни с ощущения, а не с готового толкования.</p>
                            <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {feelings.map(value=><button key={value} type="button" onClick={()=>setFelt(value)} aria-pressed={felt===value}
                                    className={'rounded-xl border p-3 text-left text-sm transition hover:border-[#f0c453] '+(felt===value?'border-[#f0c453] bg-[#40301b]':'border-[#78613d] bg-[#17140f]')}>{value}</button>)}
                            </div>
                            <div className="mt-7 flex flex-wrap justify-between gap-3">
                                <button type="button" onClick={()=>setStage(0)} className="rounded-xl border border-[#9b7845] px-5 py-3 text-sm text-[#e5bc62]">← Назад</button>
                                <button type="button" onClick={()=>setStage(2)} disabled={!felt} className="rounded-xl bg-[#f0c453] px-6 py-3 font-semibold text-[#21180b] disabled:opacity-40">Продолжить →</button>
                            </div>
                        </>}
                        {stage===2 && <>
                            <p className={kicker}>Личная ассоциация</p>
                            <h4 className="mt-3 font-serif text-2xl">Что этот сон напоминает тебе?</h4>
                            <div className="mt-5 flex flex-wrap gap-2">
                                {life.map(value=><button key={value} type="button" aria-pressed={connection===value} onClick={()=>setConnection(value)}
                                    className={'rounded-full border px-4 py-2 text-sm transition hover:border-[#f0c453] '+(connection===value?'border-[#f0c453] bg-[#40301b]':'border-[#806638]/70')}>{value}</button>)}
                            </div>
                            <div className="mt-7 rounded-2xl border border-[#a17e43]/70 bg-[#17140f] p-5 sm:p-7">
                                <p className={kicker}>Твоё маленькое зеркало</p>
                                <h5 className="mt-3 font-serif text-3xl">{chosen.name}</h5>
                                <p className="mt-3 text-sm leading-7 text-[#e2d5c0]">{chosen.description}</p>
                                <p className="mt-4 text-sm leading-7 text-[#e5bc62]">Ты отметил: {felt.toLowerCase()}{connection?' · '+connection.toLowerCase():''}.</p>
                                <div className="mt-5 grid gap-3 md:grid-cols-3">
                                    {chosen.questions.map((q,i)=><div key={i} className="rounded-xl border border-[#68512e] p-4">
                                        <p className="text-xs text-[#e5bc62]">Вопрос {i+1}</p><p className="mt-2 text-sm leading-7">{q}</p>
                                    </div>)}
                                </div>
                                <p className="mt-5 text-sm leading-7 text-[#bcae97]">Не нужно отвечать на всё. Иногда достаточно заметить один момент, который действительно отозвался.</p>
                            </div>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <button type="button" onClick={()=>setStage(1)} className="rounded-xl border border-[#9b7845] px-5 py-3 text-sm text-[#f0c453]">← Вернуться</button>
                                <button type="button" onClick={reset} className="rounded-xl border border-[#9b7845] px-5 py-3 text-sm text-[#f0c453]">Другой сон</button>
                                <Link href={'/explore/dreams/'+chosen.slug} className="rounded-xl bg-[#f0c453] px-5 py-3 text-sm font-semibold text-[#21180b]">Подробнее об образе →</Link>
                            </div>
                        </>}
                    </div>
                </div>
            </section>

            <section id="symbols" className="mt-20 scroll-mt-6">
                <p className={kicker}>Образы, а не предсказания</p>
                <h2 className="mt-3 font-serif text-4xl">Библиотека <span className="italic text-[#f0c453]">сновидений</span></h2>
                <p className="mt-4 max-w-3xl leading-7 text-[#c4b9a6]">Каждый образ открывает страницу с вопросами, примером сна и альтернативным взглядом на привычные «значения».</p>
                <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-wrap gap-2" aria-label="Группы образов">
                        {[{id:'all',name:'Все образы'},...G].map(g=><button key={g.id} type="button" onClick={()=>{setGroup(g.id);setExpanded(false);}} aria-pressed={group===g.id} className={'rounded-full border px-3 py-2 text-xs transition hover:border-[#f0c453] '+(group===g.id?'border-[#f0c453] bg-[#3d2c18]':'border-[#806638]/70')}>{g.name}</button>)}
                    </div>
                    <label className="text-sm text-[#c9b9a2]">Найти образ
                        <input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Дом, дорога, вода…" className="mt-2 block w-full rounded-xl border border-[#806638]/70 bg-[#211d15] px-4 py-3 text-sm text-white outline-none placeholder:text-[#97866f] focus:border-[#f0c453]" />
                    </label>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {symbols.map(item=><Link key={item.slug} href={'/explore/dreams/'+item.slug} className="group rounded-2xl border border-[#806638]/70 bg-[#211d15] p-5 transition hover:border-[#f0c453] hover:bg-[#2a2318]">
                        <span aria-hidden="true" className="material-symbols-outlined text-3xl text-[#f0c453]">{item.icon}</span>
                        <h3 className="mt-3 font-serif text-2xl">{item.name}</h3>
                        <p className="mt-2 text-sm text-[#e5bc62]">{item.subtitle}</p>
                        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#b8aa97]">{item.description}</p>
                        <span className="mt-4 inline-block text-sm text-[#f0c453]">Исследовать →</span>
                    </Link>)}
                </div>
                {filtered.length===0 && <p className="mt-5 text-sm text-[#b7a68e]">По этому запросу ничего не найдено.</p>}
                {!expanded&&group==='all'&&!query.trim()&&filtered.length>12&&<button onClick={()=>setExpanded(true)} className="mt-5 rounded-xl border border-[#957749] px-5 py-3 text-sm text-[#f0c453]">Показать все 24 образа ↓</button>}
            </section>

            <section id="today" className="mt-20 scroll-mt-6">
                <p className={kicker}>Для любопытства, не для предсказаний</p>
                <div className="mt-4 rounded-3xl border border-[#977742]/70 bg-gradient-to-br from-[#332719] to-[#201b14] p-6 sm:p-9">
                    <div className="flex flex-wrap justify-between gap-5">
                        <div className="max-w-2xl">
                            <h2 className="font-serif text-3xl sm:text-4xl">Образ <span className="italic text-[#f0c453]">дня</span>: {today.name}</h2>
                            <p className="mt-4 text-lg leading-8 text-[#decfb9]">{today.description}</p>
                            <p className="mt-5 text-sm leading-7 text-[#e5bc62]">{today.questions[0]}</p>
                        </div>
                        <span aria-hidden="true" className="material-symbols-outlined text-[72px] leading-none text-[#e5bc62]">{today.icon}</span>
                    </div>
                    <Link href={'/explore/dreams/'+today.slug} className="mt-6 inline-block rounded-xl bg-[#f0c453] px-5 py-3 text-sm font-semibold text-[#21180b]">Открыть образ →</Link>
                    <p className="mt-4 text-xs text-[#a99d88]">Предлагается ежедневно для размышления и никак не связан с твоими снами или судьбой.</p>
                </div>
            </section>

            <section id="how" className="mt-20 scroll-mt-6">
                <p className={kicker}>Минута внимания</p>
                <h2 className="mt-3 font-serif text-4xl">Как исследовать сон <span className="italic text-[#f0c453]">бережно</span></h2>
                <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {[['01','Вспомни сюжет','Не требуй точных деталей. Достаточно одного эпизода, который остался в памяти.'],
                       ['02','Назови чувство','Как ты себя чувствовал во сне и что заметил после пробуждения?'],
                       ['03','Найди ассоциацию','Что в этом образе знакомо лично тебе — из опыта, культуры, отношений?'],
                       ['04','Отпусти толкование','Не делай решений из одного сна. Забери вопрос, если он полезен, и продолжай день.']].map(x=><div key={x[0]} className={card}>
                        <p className="font-serif text-3xl text-[#f0c453]">{x[0]}</p><h3 className="mt-4 font-serif text-xl">{x[1]}</h3><p className="mt-3 text-sm leading-7 text-[#c2b29c]">{x[2]}</p>
                    </div>)}
                </div>
                <div className="mt-7 grid gap-4 md:grid-cols-2">
                    <div className={card}>
                        <h3 className="font-serif text-2xl">Если сон пугает</h3>
                        <p className="mt-3 text-sm leading-7 text-[#c4b9a6]">После кошмара можно сначала оглядеться, заметить знакомое пространство, включить свет или поговорить с близким. Не нужно заставлять себя «разгадать» сон. Если кошмары повторяются и нарушают сон, полезно обсудить это со специалистом.</p>
                    </div>
                    <div className={card}>
                        <h3 className="font-serif text-2xl">Откуда берутся образы?</h3>
                        <p className="mt-3 text-sm leading-7 text-[#c4b9a6]">Во сне могут переплетаться воспоминания, ощущения, переживания и случайные элементы. Научные исследования не подтверждают универсального словаря, который предсказывает события по одному символу.</p>
                    </div>
                </div>
            </section>
            <footer className="mt-16 border-t border-[#84683e]/50 pt-10 text-center">
                <p className="font-serif text-2xl">Сон можно вспомнить. Важнее — заметить себя наяву.</p>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#bcae98]">{data.notice}</p>
                <Link href="/editoria" className="mt-6 inline-block rounded-xl bg-[#f0c453] px-6 py-3 text-sm font-semibold text-[#21180b]">Бесплатный практикум →</Link>
            </footer>
        </main>
    </div>;
}
