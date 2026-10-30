import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import atlasBase from '../../data/emotion-atlas.json'
import { liveExploreDocument } from '../lib/exploreCms.js';

const atlas = liveExploreDocument('emotion-atlas', atlasBase);

const all = atlas.emotions;
const bySlug = new Proxy({}, { get: (_target, slug) => all.find(item => item.slug === slug) });
const kicker = 'text-xs font-semibold uppercase tracking-[.18em] text-[#f0c453]';
const panel = 'rounded-3xl border border-[#84683e]/70 bg-[#211d15] p-6 sm:p-8';

export default function ExploreEmotionDetail() {
    const { emotionSlug, settings = {} } = usePage().props;
    const emotion = bySlug[emotionSlug];
    const [intensity,setIntensity] = useState(5);
    const [copied,setCopied] = useState(false);

    if (!emotion) return <div className="min-h-screen bg-[#14120d] px-6 py-20 text-center text-[#f8f4e9]">
        <h1 className="font-serif text-3xl">Такого состояния в словаре нет</h1>
        <Link href="/explore/emotions#dictionary" className="mt-6 inline-block text-[#f0c453]">Вернуться к словарю →</Link>
    </div>;

    const group = atlas.groups.find(item => item.id === emotion.group);
    const stress = emotion.group !== 'warmth';
    const currentPractice = intensity >= 8 && stress ? emotion.practices.strong
        : intensity <= 3 ? emotion.practices.soft : emotion.practices.steady;
    const copy = async () => {
        try { await navigator.clipboard.writeText(window.location.href); setCopied(true); }
        catch { setCopied(false); }
    };

    return <div data-no-analytics className="min-h-screen bg-[#14120d] text-[#f8f4e9]">
        <Head title={emotion.name+' — Язык эмоций — Arutyun'}>
            <meta name="description" content={emotion.definition} />
        </Head>
        <header className="border-b border-[#b99347]/25">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5">
                <Link href="/" aria-label="На главную">{settings?.logo ? <img src={settings.logo} alt={settings?.site_name||'Arutyun'} className="h-10 max-w-[160px] object-contain"/> : <span className="font-serif text-2xl italic text-[#f0c453]">Arutyun</span>}</Link>
                <div className="flex flex-wrap gap-4 text-sm">
                    <Link href="/explore/emotions#dictionary" className="text-[#f0c453] hover:text-white">← Все эмоции</Link>
                    <Link href="/explore/emotions#compass" className="text-[#d5c5aa] hover:text-white">Эмоциональный компас</Link>
                </div>
            </div>
        </header>
        <main className="mx-auto max-w-6xl px-5 pb-20 pt-12 sm:pt-16">
            <nav aria-label="Хлебные крошки" className="text-xs text-[#b3a48d]">
                <Link href="/explore" className="hover:text-[#f0c453]">Исследуй себя</Link> <span aria-hidden="true">/</span> <Link href="/explore/emotions" className="hover:text-[#f0c453]">Язык эмоций</Link> <span aria-hidden="true">/</span> {emotion.name}
            </nav>
            <section className="mt-9 grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
                <div>
                    <p className={kicker}>{group?.title} · Словарь переживаний</p>
                    <h1 className="mt-4 font-serif text-5xl sm:text-7xl">{emotion.name}</h1>
                    <p className="mt-5 font-serif text-2xl italic text-[#e9bd63]">{emotion.subtitle}</p>
                    <p className="mt-6 max-w-3xl text-lg leading-8 text-[#e1d3bd]">{emotion.definition}</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <button type="button" onClick={copy} className="rounded-xl border border-[#977944] px-5 py-3 text-sm text-[#f0c453] hover:border-[#f0c453]">{copied?'Ссылка скопирована ✓':'Поделиться страницей ↗'}</button>
                        <Link href="/explore/emotions#compass" className="rounded-xl bg-[#f0c453] px-5 py-3 text-sm font-semibold text-[#21180b]">Исследовать своё состояние →</Link>
                    </div>
                </div>
                <div className="rounded-3xl border border-[#a27f46]/70 bg-gradient-to-br from-[#372819] to-[#211d15] p-8 text-center">
                    <span aria-hidden="true" className="material-symbols-outlined text-[92px] leading-none text-[#f0c453]">{emotion.icon}</span>
                    <p className="mt-6 text-xs uppercase tracking-wider text-[#f0c453]">Не ярлык, а повод прислушаться</p>
                    <p className="mt-4 font-serif text-2xl leading-9 text-[#fff2dc]">{emotion.questions[0]}</p>
                </div>
            </section>
            <section className="mt-14 grid gap-4 lg:grid-cols-3">
                <div className={panel}>
                    <p className={kicker}>В теле</p>
                    <h2 className="mt-3 font-serif text-2xl">Что иногда замечают?</h2>
                    <ul className="mt-5 space-y-3">{emotion.body.map((s,i)=><li key={i} className="flex gap-3 text-sm leading-7 text-[#dacbb6]"><span className="text-[#e5bc62]">•</span>{s}</li>)}</ul>
                    <p className="mt-4 text-xs leading-6 text-[#a99d88]">Ощущения индивидуальны и не позволяют однозначно определить эмоцию.</p>
                </div>
                <div className={panel}>
                    <p className={kicker}>В мыслях</p>
                    <h2 className="mt-3 font-serif text-2xl">Как может звучать внутренний голос?</h2>
                    <div className="mt-5 space-y-3">{emotion.thoughts.map((s,i)=><blockquote key={i} className="border-l-2 border-[#a78042] pl-4 font-serif italic leading-7 text-[#e4d2b7]">{s}</blockquote>)}</div>
                    <p className="mt-4 text-xs leading-6 text-[#a99d88]">Это примеры мыслей, не обязательные признаки.</p>
                </div>
                <div className={panel}>
                    <p className={kicker}>В обстоятельствах</p>
                    <h2 className="mt-3 font-serif text-2xl">Где может возникать?</h2>
                    <ul className="mt-5 space-y-3">{emotion.triggers.map((s,i)=><li key={i} className="flex gap-3 text-sm leading-7 text-[#dacbb6]"><span className="text-[#e5bc62]">•</span>{s}</li>)}</ul>
                </div>
            </section>

            <section className="mt-14 grid gap-5 md:grid-cols-2">
                <div className={panel}>
                    <p className={kicker}>Что может помогать понять?</p>
                    <h2 className="mt-2 font-serif text-3xl">Возможные потребности</h2>
                    <div className="mt-5 flex flex-wrap gap-2">{emotion.needs.map(value=><span key={value} className="rounded-full border border-[#a6854c]/70 px-4 py-2 text-sm text-[#e7d4b1]">{value}</span>)}</div>
                    <p className="mt-6 text-sm leading-7 text-[#c4b9a6]">Потребность — гипотеза. Проверь, насколько она относится к твоей собственной ситуации.</p>
                </div>
                <div className={panel}>
                    <p className={kicker}>Полезное различие</p>
                    <h2 className="mt-2 font-serif text-3xl">Что важно не перепутать?</h2>
                    <p className="mt-5 leading-8 text-[#dfcfb7]">{emotion.distinction}</p>
                </div>
            </section>

            <section className="mt-14 grid gap-5 md:grid-cols-2">
                <div className={panel}>
                    <p className={kicker}>Что даёт чувство?</p>
                    <h2 className="mt-2 font-serif text-3xl">В чём может быть польза?</h2>
                    <p className="mt-4 leading-8 text-[#e0d3bd]">{emotion.helpful}</p>
                </div>
                <div className={panel}>
                    <p className={kicker}>Когда мешает?</p>
                    <h2 className="mt-2 font-serif text-3xl">В чём возможная ловушка?</h2>
                    <p className="mt-4 leading-8 text-[#e0d3bd]">{emotion.trap}</p>
                </div>
            </section>

            <section className="mt-14 rounded-3xl border border-[#a58248]/70 bg-gradient-to-br from-[#342819] to-[#211d15] p-6 sm:p-9">
                <p className={kicker}>Из повседневной жизни</p>
                <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Между импульсом и выбором</h2>
                <p className="mt-5 text-lg leading-8 text-[#f0e1ca]">{emotion.example.scene}</p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-[#705a3e] bg-[#17140f]/80 p-5">
                        <p className={kicker}>Автоматическая мысль</p>
                        <p className="mt-3 leading-7 text-[#ddceb7]">{emotion.example.automatic}</p>
                    </div>
                    <div className="rounded-2xl border border-[#a48a54] bg-[#382b19]/70 p-5">
                        <p className={kicker}>Возможность ответить иначе</p>
                        <p className="mt-3 leading-7 text-[#f2e0c4]">{emotion.example.alternative}</p>
                    </div>
                </div>
            </section>

            <section className="mt-14 grid gap-6 lg:grid-cols-[.95fr_1.05fr]">
                <div className={panel}>
                    <p className={kicker}>Вопросы к себе</p>
                    <h2 className="mt-2 font-serif text-3xl">Три точки внимания</h2>
                    <ol className="mt-6 space-y-6">{emotion.questions.map((question,i)=><li key={i} className="flex gap-4 leading-7 text-[#e2d2bc]"><span className="font-serif text-3xl text-[#f0c453]">{String(i+1)}</span><span>{question}</span></li>)}</ol>
                </div>
                <div className={panel}>
                    <p className={kicker}>Небольшая практика</p>
                    <h2 className="mt-2 font-serif text-3xl">Что попробовать сейчас?</h2>
                    <div className="mt-6 flex items-center justify-between gap-3"><label htmlFor="detail-intensity" className="text-sm">Насколько сильно чувство?</label><span className="font-serif text-2xl text-[#f0c453]">{intensity}/10</span></div>
                    <input id="detail-intensity" min="1" max="10" type="range" value={intensity} onChange={event=>setIntensity(Number(event.target.value))} className="mt-4 w-full accent-[#f0c453]" />
                    <div className="mt-5 rounded-2xl border border-[#a58248] bg-[#17140f] p-5">
                        <p className="text-xs uppercase tracking-widest text-[#f0c453]">Рекомендация для этого уровня</p>
                        <p className="mt-3 leading-7 text-[#e2d2bc]">{currentPractice}</p>
                        {intensity >= 8 && stress && <p className="mt-3 text-sm leading-6 text-[#bfae93]">Если переживание очень сильное, сначала позаботься о безопасности и поддержке, а не заставляй себя искать причины.</p>}
                    </div>
                    {emotion.slug==='despair' && <p className="mt-4 text-sm leading-7 text-[#e8c09b]">Если есть риск причинить себе вред, немедленно обратись за помощью к местной экстренной службе или кризисной поддержке и постарайся не оставаться один.</p>}
                    <p className="mt-4 text-xs leading-6 text-[#a99d88]">Ползунок помогает подобрать текст, но не измеряет психическое здоровье и не сохраняет ответы.</p>
                </div>
            </section>

            {emotion.related.length>0 && <section className="mt-16">
                <p className={kicker}>Возможные соседние переживания</p>
                <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Что ещё может быть рядом?</h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-[#c4b9a6]">Ни одна эмоция не обязана скрывать другую. Эти ссылки — лишь повод исследовать, если похожее чувство действительно возникает.</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {emotion.related.map(slug=><Link key={slug} href={'/explore/emotions/'+slug}
                        className="group rounded-2xl border border-[#806638]/70 bg-[#211d15] p-5 transition hover:border-[#f0c453]">
                        <span aria-hidden="true" className="material-symbols-outlined text-3xl text-[#f0c453]">{bySlug[slug]?.icon}</span>
                        <h3 className="mt-3 font-serif text-2xl">{bySlug[slug]?.name}</h3>
                        <p className="mt-2 text-sm leading-6 text-[#bcae98]">{bySlug[slug]?.subtitle}</p>
                        <span className="mt-3 inline-block text-sm text-[#f0c453]">Исследовать →</span>
                    </Link>)}
                </div>
            </section>}
            <div className="mt-16 rounded-2xl border border-[#84683e]/60 p-6 text-center">
                <p className="font-serif text-2xl">Ты можешь чувствовать эмоцию, не становясь ею.</p>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#b6a996]">Материалы предназначены для самонаблюдения и не заменяют профессиональную помощь при выраженном, продолжительном или опасном состоянии.</p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                    <Link href="/explore/emotions#dictionary" className="rounded-xl border border-[#9c7d48] px-5 py-3 text-sm text-[#f0c453]">Другие эмоции →</Link>
                    <Link href="/explore/emotions#practices" className="rounded-xl bg-[#f0c453] px-5 py-3 text-sm font-semibold text-[#21180b]">Практики внимания →</Link>
                </div>
            </div>
        </main>
    </div>;
}
