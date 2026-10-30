import React, { useEffect, useRef, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ExploreSectionNavigation from '../components/ExploreSectionNavigation.jsx';
import ExploreDeepExperience from '../components/ExploreDeepExperience.jsx';
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

const atlas = {
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
const palettes = {
    relationships: 'from-[#42252b] via-[#282022] to-[#18140f]',
    body: 'from-[#254235] via-[#202c27] to-[#17140f]',
    choice: 'from-[#463523] via-[#302519] to-[#17140f]',
    beliefs: 'from-[#35304e] via-[#292338] to-[#17140f]',
    values: 'from-[#433b26] via-[#2e2619] to-[#17140f]',
    fears: 'from-[#46282b] via-[#302029] to-[#17140f]',
    time: 'from-[#253b50] via-[#202a36] to-[#17140f]',
    conflicts: 'from-[#433729] via-[#2e2723] to-[#17140f]',
    attention: 'from-[#233f33] via-[#1d2b25] to-[#17140f]',
};
const kicker='text-xs font-semibold uppercase tracking-[.18em] text-[#f0c453]';
const article='rounded-2xl border border-[#80673e]/70 bg-[#211c15] p-5 sm:p-7';
const optionStyle=active=>'rounded-xl border p-4 text-left text-sm leading-6 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453] '+(active?'border-[#f0c453] bg-[#45311c] text-[#fff1d8]':'border-[#81673c] bg-[#18150f] text-[#dbceb8] hover:border-[#e7c47a]');

function SituationAnalysis({ active, picked, setPicked, close }) {
    const response=active.options.find(o=>o.id===picked);
    return <article className="overflow-hidden rounded-3xl border border-[#a4834c] bg-[#231d15] p-5 sm:p-8">
        <div className="flex items-start justify-between gap-3">
            <div><p className={kicker}>Три способа отреагировать</p><h3 className="mt-3 font-serif text-3xl">{active.title}</h3></div>
            <button type="button" onClick={close} aria-label="Закрыть разбор" className="shrink-0 rounded-full border border-[#ab894f] bg-[#332718] p-2.5 text-[#f5d793] transition hover:bg-[#574022] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453]"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
        </div>
        <p className="mt-3 text-base leading-8 text-[#d7c7ae]">{active.scene}</p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">{active.options.map(o=><button key={o.id} type="button" aria-pressed={picked===o.id} onClick={()=>setPicked(o.id)} className={optionStyle(picked===o.id)}>{o.label}</button>)}</div>
        {response&&<div aria-live="polite" className="mt-7 grid gap-5 rounded-2xl border border-[#d9b46d]/60 bg-[#35281a] p-5 sm:p-7 lg:grid-cols-[1fr_.8fr]">
            <div><p className={kicker}>Разбор выбранного ответа</p><h4 className="mt-3 font-serif text-2xl text-[#ffe2a3]">{response.focus}</h4><p className="mt-3 leading-8 text-[#e5d4ba]">{response.reflection}</p>
                {response.deep?.consequence&&<div className="mt-5 rounded-xl border border-[#a78655]/55 bg-[#241c13] p-4"><p className={kicker}>Возможные последствия и ограничения</p><p className="mt-3 leading-7 text-[#ecdbc2]">{response.deep.consequence}</p></div>}
            </div>
            <div className="rounded-xl bg-[#1a1611]/65 p-5"><p className={kicker}>Вопрос и следующий шаг</p><p className="mt-3 leading-7 text-[#f0d69c]">{active.question}</p>
                {response.deep?.step?<><p className={kicker+' mt-5'}>Для этого конкретного ответа</p><p className="mt-2 leading-7 text-[#e7d2b2]">{response.deep.step}</p></>:<p className="mt-4 text-sm leading-7 text-[#d9c9b2]">{active.practice}</p>}
            </div>
        </div>}
        <button type="button" onClick={close} className="mt-6 rounded-xl border border-[#a78655] px-5 py-2.5 text-sm font-semibold text-[#f3d393] transition hover:bg-[#40301b]">Закрыть разбор</button>
    </article>;
}

export default function ExploreLifeLanguage() {
    const {languageSlug,settings={},coverImage=null}=usePage().props;
    const data=atlas[languageSlug]||atlas.relationships;
    const [openedChapter,setOpenedChapter]=useState(0);
    const [selected,setSelected]=useState(null);
    const [picked,setPicked]=useState(null);
    const [visibleAll,setVisibleAll]=useState(false);
    const [started,setStarted]=useState(false);
    const dialogRef=useRef(null);
    const triggerRef=useRef(null);
    useExploreJourney(languageSlug,started,picked!==null);
    useEffect(()=>{setOpenedChapter(0);setSelected(null);setPicked(null);setVisibleAll(false);setStarted(false);},[languageSlug]);
    const items=data.situations;
    const shown=visibleAll?items:items.slice(0,6);
    const active=items.find(item=>item.id===selected);
    useEffect(()=>{
        if (!active) return;
        const previous=document.body.style.overflow;
        const media=window.matchMedia('(max-width: 767px)');
        const sync=()=>{document.body.style.overflow=media.matches?'hidden':previous;};
        sync();
        if(media.matches) dialogRef.current?.focus();
        media.addEventListener('change',sync);
        const keydown=e=>{if(e.key==='Escape'){setSelected(null);setPicked(null);}};
        document.addEventListener('keydown',keydown);
        return ()=>{document.body.style.overflow=previous;media.removeEventListener('change',sync);document.removeEventListener('keydown',keydown);if(media.matches) triggerRef.current?.focus();};
    },[active]);
    const editorial=data.editorial;

    return <div data-no-analytics className="min-h-screen bg-[#14120d] text-[#f8f2e7]">
        <Head title={data.title+' — Arutyun'}>
            <meta name="description" content={data.intro} />
        </Head>
        <header className="relative z-40 border-b border-[#b99347]/25">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5">
                <Link href="/" aria-label="На главную">{settings?.logo?<img src={settings.logo} alt="Arutyun" className="h-10 max-w-[110px] object-contain sm:max-w-[160px]"/>:<span className="font-serif text-2xl italic text-[#f0c453]">Arutyun</span>}</Link>
                <ExploreSectionNavigation items={[
                    {label:'Главное исследование',href:'#discovery',icon:'explore'},
                    {label:'Понять глубже',href:'#knowledge',icon:'menu_book'},
                    {label:'Разбор ситуаций',href:'#situations',icon:'forum'},
                    {label:'Все направления',href:'/explore',icon:'apps',catalog:true},
                ]}/>
            </div>
        </header>
        <main className="mx-auto max-w-6xl px-5 pb-20 pt-12 sm:pt-16">
            <section className="grid items-center gap-8 lg:grid-cols-[1.12fr_.88fr]">
                <div>
                    <p className={kicker}>Пространство самопознания · {data.eyebrow}</p>
                    <h1 className="mt-4 font-serif text-5xl leading-tight sm:text-6xl">Язык <span className="italic text-[#f0c453]">{data.name}</span></h1>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-[#e1d1bc]">{data.intro}</p>
                    <p className="mt-4 max-w-2xl leading-7 text-[#b8ab96]">{data.promise}</p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <a href="#discovery" className="rounded-xl bg-[#f0c453] px-6 py-3 font-semibold text-[#20190e] hover:bg-[#ffe09b]">Начать исследование →</a>
                        <a href="#knowledge" className="rounded-xl border border-[#a08352] px-6 py-3 text-sm text-[#f0c453] hover:border-[#f0c453]">Разобраться в теме</a>
                    </div>
                </div>
                <div className={'relative isolate flex min-h-[310px] flex-col justify-end overflow-hidden rounded-3xl border border-[#ad8950]/65 bg-gradient-to-br p-6 sm:min-h-[380px] sm:p-8 '+(palettes[languageSlug]||palettes.relationships)}>
                    {coverImage?<><img src={coverImage} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center" loading="lazy"/><div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#17130e]/95 via-[#17130e]/55 to-[#17130e]/10"/></>:<><div aria-hidden="true" className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[28px] border-[#f0c453]/10"/><div aria-hidden="true" className="absolute right-10 top-14 h-40 w-40 rounded-full border border-[#f0c453]/20"/><span aria-hidden="true" className="material-symbols-outlined absolute left-1/2 top-1/3 -translate-x-1/2 text-[105px] text-[#e5bd75]/60">{data.icon}</span></>}
                    <div className="relative">
                        <p className={kicker}>Тема исследования</p>
                        <h2 className="mt-3 font-serif text-2xl leading-tight sm:text-3xl">{editorial.headline}</h2>
                        <p className="mt-3 text-sm leading-7 text-[#e6d8c3]">{data.subtitle}</p>
                    </div>
                </div>
            </section>

            <section id="discovery" className="mt-20 scroll-mt-8" onClick={()=>setStarted(true)}>
                <div className="mb-8">
                    <p className={kicker}>Не опросник. Настоящий инструмент.</p>
                    <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Исследовать <span className="italic text-[#f0c453]">на практике</span></h2>
                    <p className="mt-4 max-w-3xl leading-7 text-[#c8bba7]">Здесь можно менять условия, пробовать варианты и смотреть, как меняется смысл ситуации. Ответы не сохраняются и не отправляются на сервер.</p>
                </div>
                <ExploreDeepExperience key={languageSlug} slug={languageSlug}/>
            </section>

            <section id="knowledge" className="mt-20 scroll-mt-8">
                <p className={kicker}>Понимание вместо ярлыков</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">{editorial.headline}</h2>
                <p className="mt-5 max-w-4xl text-lg leading-8 text-[#dbcbb5]">{editorial.lead}</p>
                <div className="mt-8 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
                    <nav aria-label="Темы исследования" className="grid content-start gap-3">
                        {editorial.chapters.map((c,i)=><button key={i} type="button" onClick={()=>setOpenedChapter(i)} aria-pressed={openedChapter===i}
                          className={'flex items-center justify-between gap-4 rounded-2xl border p-5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453] '+(openedChapter===i?'border-[#f0c453] bg-[#35281b]':'border-[#755d3b] bg-[#211c15] hover:border-[#c2a36a]')}>
                            <span><span className="mr-3 text-xs text-[#e9c479]">{i+1}</span><span className="font-serif text-xl">{c[0]}</span></span><span aria-hidden="true" className="text-[#f0c453]">→</span>
                        </button>)}
                    </nav>
                    <article className={article+' flex min-h-[320px] flex-col justify-between'} aria-live="polite">
                        <div><p className={kicker}>Исследование · {openedChapter+1} / 4</p><h3 className="mt-4 font-serif text-3xl text-[#f0d592]">{editorial.chapters[openedChapter][0]}</h3><p className="mt-6 text-lg leading-9 text-[#dfd0ba]">{editorial.chapters[openedChapter][1]}</p></div>
                        <div className="mt-8 rounded-xl border-l-2 border-[#f0c453] bg-[#2d2418] p-5"><p className="text-xs font-semibold uppercase tracking-wider text-[#eac777]">Вопрос для размышления</p><p className="mt-2 text-base leading-7 text-[#f7e9d3]">{editorial.chapters[openedChapter][2]}</p></div>
                    </article>
                </div>
            </section>

            <section id="situations" className="mt-20 scroll-mt-8">
                <p className={kicker}>Сцены из повседневности</p>
                <h2 className="mt-3 font-serif text-4xl sm:text-5xl">{data.libraryTitle}</h2>
                <p className="mt-4 max-w-3xl leading-7 text-[#c7b9a3]">Это не ещё один тест. Выбирай жизненный пример, сравнивай три реакции и читай отдельный разбор каждой. Разные реакции могут быть понятными, но приводить к разным последствиям.</p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {shown.map((item)=><button key={item.id} type="button" aria-pressed={selected===item.id} onClick={e=>{triggerRef.current=e.currentTarget;setSelected(item.id);setPicked(null);setStarted(true);}}
                      className={'group rounded-2xl border p-5 text-left transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453] '+(selected===item.id?'border-[#f0c453] bg-[#392b1c]':'border-[#80663f] bg-[#211c15] hover:border-[#e1ba70]')}>
                        <span className="font-serif text-xl text-[#f8e8cc]">{item.title}</span><span className="mt-3 block text-sm leading-7 text-[#baaa93]">{item.scene}</span>
                        <span className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-[#e1b65e] bg-gradient-to-r from-[#ebbf69] to-[#f8d993] px-4 py-2.5 text-sm font-bold text-[#24180d] shadow-[0_4px_18px_rgba(215,157,56,.16)] transition group-hover:shadow-[0_4px_22px_rgba(215,157,56,.35)]">Разобрать ситуацию <span aria-hidden="true">↗</span></span>
                    </button>)}
                </div>
                {items.length>6&&<button type="button" onClick={()=>setVisibleAll(v=>!v)} className="mt-6 rounded-xl border border-[#957747] px-5 py-3 text-sm text-[#f0c453] transition hover:bg-[#30271a]">{visibleAll?'Свернуть примеры':'Показать все '+items.length+' ситуаций'}</button>}
                {active&&<div className="mt-8 hidden md:block"><SituationAnalysis active={active} picked={picked} setPicked={setPicked} close={()=>{setSelected(null);setPicked(null);}}/></div>}
                {active&&<div className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#090806]/90 p-2 backdrop-blur-sm md:hidden" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget){setSelected(null);setPicked(null);}}}>
                    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={'Разбор ситуации: '+active.title} className="max-h-[calc(100dvh-16px)] w-full max-w-lg overflow-y-auto overscroll-contain rounded-3xl shadow-2xl" tabIndex={-1}>
                        <SituationAnalysis active={active} picked={picked} setPicked={setPicked} close={()=>{setSelected(null);setPicked(null);}}/>
                    </div>
                </div>}
            </section>

            <section className="mt-16 rounded-2xl border border-[#80663d]/60 bg-[#211c15] p-6 sm:p-8">
                <p className={kicker}>Границы этого исследования</p>
                <p className="mt-3 max-w-4xl text-sm leading-7 text-[#cabba4]">{data.safety}</p>
                <p className="mt-3 text-xs leading-6 text-[#a99b86]">Эти материалы не ставят диагнозы, не предсказывают будущее и не определяют личность по ответу.</p>
            </section>
            <div className="mt-12"><ExplorePracticeInvitation tool={languageSlug}/></div>
            <footer className="mt-14 border-t border-[#80663d]/50 pt-8 text-center">
                <p className="font-serif text-2xl italic text-[#efd9b4]">{data.promise}</p>
                <Link href="/explore" className="mt-5 inline-block text-sm font-semibold text-[#f0c453] hover:underline">← Все направления самопознания</Link>
            </footer>
        </main>
    </div>;
}
