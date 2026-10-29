import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function ExploreArchetypes() {
    const { archetypes = [], settings = {} } = usePage().props;
    const [selected, setSelected] = useState(null);
    const current = archetypes.find(item => item.id === selected);
    return <div className="min-h-screen bg-[#14120d] text-[#f8f4e9]">
        <Head title="Язык архетипов — Arutyun">
            <meta name="description" content="Исследуй привычные внутренние роли, их сильные и теневые стороны через вопросы и практики внимания." />
        </Head>
        <header className="border-b border-[#b99347]/25">
            <div className="mx-auto max-w-6xl px-5 py-5 flex justify-between items-center gap-4">
                <Link href="/" aria-label="На главную">
                    {settings?.logo ? <img src={settings.logo} alt={settings?.site_name || 'Arutyun'} className="h-10 max-w-[160px] object-contain" /> : <span className="text-[#f0c453] font-serif italic text-2xl">Arutyun</span>}
                </Link>
                <Link href="/explore" className="text-sm text-[#e4c88c] hover:text-white">Все направления →</Link>
            </div>
        </header>
        <main className="mx-auto max-w-6xl px-5 py-10 sm:py-16">
            <p className="text-xs tracking-[.2em] uppercase text-[#f0c453]">Пространство самопознания</p>
            <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Язык <span className="italic text-[#f0c453]">архетипов</span></h1>
            <p className="mt-5 max-w-3xl leading-7 text-[#c4b9a6]">В разных ситуациях мы становимся защитниками, искателями, спасателями или наблюдателями. Это не неизменные типы личности, а образы привычных способов действовать. Выбери роль, которую замечаешь в себе сейчас.</p>
            <section className="mt-10 rounded-3xl border border-[#c9a04b]/70 bg-gradient-to-br from-[#30251a] to-[#1d1913] p-6 sm:p-9">
                <p className="text-xs uppercase tracking-[.2em] text-[#f0c453]">Начни с себя</p>
                <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Зеркало архетипов</h2>
                <p className="mt-4 max-w-2xl leading-7 text-[#e0d5c3]">20 жизненных ситуаций, в которых проявляются наши привычные роли. Выбери реакции, которые действительно тебе близки, и увидь свою персональную карту восьми архетипов.</p>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                    <Link href="/explore/archetypes/mirror" className="inline-block rounded-xl bg-[#f0c453] px-6 py-3 font-semibold text-[#21180b] transition hover:bg-[#ffda7b]">Пройти исследование →</Link>
                    <span className="text-sm text-[#c4b9a6]">20 ситуаций · около 7 минут · бесплатно</span>
                </div>
            </section>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" role="group" aria-label="Выбери внутреннюю роль">
                {archetypes.map(item => <button key={item.id} type="button" aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}
                    className={`min-h-[160px] rounded-2xl border p-5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453] ${selected === item.id ? 'bg-[#392b17] border-[#f0c453]' : 'bg-[#211d15] border-[#876b3b]/60 hover:border-[#f0c453] hover:bg-[#2b2419]'}`}>
                    <span aria-hidden="true" className="material-symbols-outlined text-3xl text-[#f0c453]">{item.icon || 'psychology'}</span>
                    <span className="mt-4 block font-serif text-xl">{item.title}</span>
                    <span className="mt-2 block text-sm text-[#c4b9a6]">{item.subtitle}</span>
                </button>)}
            </div>
            {current && <section key={current.id} aria-live="polite" className="mt-8 rounded-3xl border border-[#a78a51]/60 bg-[#211d15] p-5 sm:p-9">
                <p className="text-xs tracking-[.2em] uppercase text-[#e5bc62]">Образ для исследования</p>
                <h2 className="mt-2 font-serif text-3xl sm:text-4xl">{current.title}</h2>
                <p className="mt-4 max-w-3xl leading-7 text-[#e0d5c3]">{current.description}</p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {[
                        ['Сильная сторона', current.strength],
                        ['Теневая сторона', current.shadow],
                        ['Вопрос к себе', current.question],
                        ['Практика внимания', current.practice],
                    ].map(([title, value]) => <div key={title} className="rounded-xl border border-[#9b7b3f]/40 bg-[#17140f] p-5">
                        <h3 className="text-xs uppercase tracking-widest text-[#f0c453]">{title}</h3>
                        <p className="mt-3 leading-7 text-[#e0d5c3] whitespace-pre-line">{value}</p>
                    </div>)}
                </div>
                <p className="mt-7 text-xs text-[#a99d88]">Роль не определяет тебя целиком. Замечай, когда она помогает, а когда ограничивает.</p>
            </section>}
            {!current && <p className="mt-8 text-sm text-[#a99d88]">Нажми на карточку, чтобы увидеть описание, вопрос и практику.</p>}
            {archetypes.length === 0 && <p className="mt-8 text-[#c4b9a6]">Архетипы пока не опубликованы.</p>}
            <div className="mt-14 border-t border-[#9b7b3f]/40 pt-8 text-center">
                <p className="font-serif text-xl">Ты больше любой роли, которую играешь.</p>
                <Link href="/editoria" className="mt-5 inline-block rounded-lg bg-[#f0c453] px-6 py-3 text-sm font-semibold text-[#21180b]">Бесплатный практикум →</Link>
            </div>
        </main>
    </div>;
}
