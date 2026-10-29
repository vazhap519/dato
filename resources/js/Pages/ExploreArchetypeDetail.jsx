import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import guidesDefinition from '../../data/archetype-guides.json';

const eyebrow = 'text-xs font-semibold uppercase tracking-[.18em] text-[#f0c453]';
const panel = 'rounded-3xl border border-[#806638]/60 bg-[#211d15] p-6 sm:p-8';

export default function ExploreArchetypeDetail() {
    const { archetype, settings = {} } = usePage().props;
    const guide = guidesDefinition.guides[archetype.slug];
    const details = [
        ['В отношениях', guide?.situations?.relationships],
        ['В работе и делах', guide?.situations?.work],
        ['В конфликте', guide?.situations?.conflict],
    ].filter(([, value]) => value);
    return <div className="min-h-screen bg-[#14120d] text-[#f8f4e9]">
        <Head title={archetype.title + ' — Язык архетипов — Arutyun'}>
            <meta name="description" content={guide?.lead || archetype.description} />
        </Head>
        <header className="border-b border-[#b99347]/25">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-5">
                <Link href="/" aria-label="На главную">{settings?.logo ? <img src={settings.logo} alt={settings?.site_name || 'Arutyun'} className="h-10 max-w-[160px] object-contain" /> : <span className="font-serif text-2xl italic text-[#f0c453]">Arutyun</span>}</Link>
                <Link href="/explore/archetypes#roles" className="text-sm text-[#e4c88c] hover:text-white">← Все архетипы</Link>
            </div>
        </header>
        <main className="mx-auto max-w-5xl px-5 pb-20 pt-12 sm:pt-16">
            <div className="flex flex-wrap items-start gap-6">
                <div className="rounded-3xl border border-[#b18b49]/70 bg-[#2b2215] p-5">
                    <span aria-hidden="true" className="material-symbols-outlined text-6xl text-[#f0c453]">{archetype.icon || 'psychology'}</span>
                </div>
                <div className="max-w-3xl flex-1">
                    <p className={eyebrow}>{guide?.eyebrow || 'Образ для наблюдения'}</p>
                    <h1 className="mt-2 font-serif text-5xl sm:text-6xl">{archetype.title}</h1>
                    <p className="mt-3 text-lg text-[#e5bc62]">{archetype.subtitle}</p>
                    <p className="mt-6 text-lg leading-8 text-[#e0d5c3]">{guide?.lead || archetype.description}</p>
                </div>
            </div>
            {guide?.innerVoice && <blockquote className="mt-9 rounded-2xl border-l-4 border-[#e5bc62] bg-[#211d15] px-6 py-5 font-serif text-xl italic leading-8 text-[#fff4dd]">{guide.innerVoice}</blockquote>}
            <p className="mt-5 text-sm leading-7 text-[#a99d88]">Это не тип личности и не диагноз. Одна и та же роль может быть полезной в одной ситуации и ограничивать в другой.</p>

            <section className="mt-14">
                <p className={eyebrow}>Повседневная жизнь</p>
                <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Где проявляется этот образ?</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    {details.map(([title, value]) => <article key={title} className={panel}>
                        <h3 className="font-serif text-2xl text-[#fff6e8]">{title}</h3>
                        <p className="mt-4 text-sm leading-7 text-[#cbbda7]">{value}</p>
                    </article>)}
                </div>
            </section>

            <section className="mt-14 grid gap-5 md:grid-cols-2">
                <div className={panel}>
                    <p className={eyebrow}>Светлая сторона</p>
                    <h2 className="mt-3 font-serif text-3xl">В чём сила?</h2>
                    <p className="mt-4 leading-8 text-[#e0d5c3]">{guide?.gift || archetype.strength}</p>
                    <p className="mt-4 text-sm leading-7 text-[#baa98e]">{archetype.strength}</p>
                </div>
                <div className={panel}>
                    <p className={eyebrow}>Теневая сторона</p>
                    <h2 className="mt-3 font-serif text-3xl">Когда роль становится ловушкой?</h2>
                    <p className="mt-4 leading-8 text-[#e0d5c3]">{guide?.trap || archetype.shadow}</p>
                    <p className="mt-4 text-sm leading-7 text-[#baa98e]">{archetype.shadow}</p>
                </div>
            </section>

            {guide?.signals?.length > 0 && <section className="mt-14">
                <p className={eyebrow}>Сигналы в себе</p>
                <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Как заметить эту роль?</h2>
                <div className="mt-6 grid gap-3 md:grid-cols-3">
                    {guide.signals.map((signal,index) => <div key={index} className={panel}>
                        <p className="font-serif text-3xl text-[#f0c453]">0{index+1}</p>
                        <p className="mt-4 leading-7 text-[#e0d5c3]">{signal}</p>
                    </div>)}
                </div>
            </section>}

            {guide?.scene && <section className="mt-14 rounded-3xl border border-[#a37e3f]/70 bg-gradient-to-br from-[#302419] to-[#1e1a14] p-6 sm:p-9">
                <p className={eyebrow}>Ситуация из жизни</p>
                <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Привычный импульс и другой выбор</h2>
                <p className="mt-5 text-lg leading-8 text-[#f1e6d2]">{guide.scene.situation}</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[#725839] bg-[#18140f]/60 p-5">
                        <p className={eyebrow}>Автоматическая реакция</p>
                        <p className="mt-3 leading-7 text-[#ddceba]">{guide.scene.habit}</p>
                    </div>
                    <div className="rounded-2xl border border-[#bf9954]/60 bg-[#342719] p-5">
                        <p className={eyebrow}>Возможная альтернатива</p>
                        <p className="mt-3 leading-7 text-[#fff1d7]">{guide.scene.choice}</p>
                    </div>
                </div>
            </section>}

            <section className="mt-14 grid gap-6 md:grid-cols-2">
                {guide?.steps?.length > 0 && <div className={panel}>
                    <p className={eyebrow}>Практика внимания</p>
                    <h2 className="mt-2 font-serif text-3xl">Попробуй сегодня</h2>
                    <ol className="mt-6 space-y-5">
                        {guide.steps.map((text,index) => <li key={index} className="flex gap-4 leading-7 text-[#e0d5c3]"><span className="font-serif text-2xl text-[#f0c453]">{index+1}.</span><span>{text}</span></li>)}
                    </ol>
                    {archetype.practice && <p className="mt-6 border-t border-[#806638]/50 pt-5 text-sm leading-7 text-[#c0b09a]">{archetype.practice}</p>}
                </div>}
                <div className={panel}>
                    <p className={eyebrow}>Вопросы без готовых ответов</p>
                    <h2 className="mt-2 font-serif text-3xl">Куда посмотреть?</h2>
                    <div className="mt-6 space-y-5">
                        {(guide?.questions || [archetype.question]).map((question,index) => <p key={index} className="border-b border-[#806638]/40 pb-4 leading-7 text-[#e0d5c3]">{question}</p>)}
                    </div>
                </div>
            </section>
            <section className="mt-14 rounded-3xl border border-[#a37e3f]/70 bg-[#211d15] p-7 text-center sm:p-10">
                <p className={eyebrow}>От описания — к собственному опыту</p>
                <h2 className="mt-3 font-serif text-3xl">Где эта роль проявится у тебя?</h2>
                <p className="mx-auto mt-4 max-w-xl leading-7 text-[#c4b9a6]">Заметить роль в тексте — начало. Гораздо интереснее увидеть её в конкретном разговоре или решении.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Link href="/explore/archetypes#daily" className="rounded-xl bg-[#f0c453] px-6 py-3 text-sm font-semibold text-[#21180b]">Исследовать ситуацию →</Link>
                    <Link href="/explore/archetypes/mirror" className="rounded-xl border border-[#b08b49] px-6 py-3 text-sm text-[#f0c453]">Полная карта реакций →</Link>
                    <Link href="/explore/archetypes/journal" className="rounded-xl border border-[#b08b49] px-6 py-3 text-sm text-[#f0c453]">Мой журнал →</Link>
                </div>
            </section>
        </main>
    </div>;
}
