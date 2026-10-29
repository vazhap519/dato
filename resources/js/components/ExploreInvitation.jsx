import React from 'react';
import { Link } from '@inertiajs/react';

const topics = [
    { icon: 'psychology', title: 'Эмоции' },
    { icon: 'bedtime', title: 'Сны' },
    { icon: 'theater_comedy', title: 'Архетипы' },
    { icon: 'repeat', title: 'Сценарии' },
];

export default function ExploreInvitation() {
    return <section aria-labelledby="explore-invitation-title" className="relative overflow-hidden px-5 py-12 md:py-20">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(240,196,83,.08),transparent_65%)]" />
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[30px] border border-[#ac874a]/35 bg-gradient-to-br from-[#302417] via-[#211c17] to-[#17140f] p-6 text-center shadow-[0_24px_90px_rgba(0,0,0,.18)] sm:p-12 md:p-16">
            <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-[#f0c453]/10" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full border border-[#f0c453]/10" />
            <p className="relative text-xs font-semibold uppercase tracking-[.22em] text-[#e8bf67]">Бесплатные интерактивные инструменты</p>
            <h2 id="explore-invitation-title" className="relative mx-auto mt-5 max-w-3xl font-serif text-4xl leading-tight text-[#fff5e6] sm:text-5xl">Иногда один вопрос помогает <span className="italic text-[#f0c453]">увидеть больше</span></h2>
            <p className="relative mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#d1c4b0] sm:text-base">Исследуй привычные реакции, эмоции, сны и жизненные сценарии. Без оценок и правильных ответов — в своём темпе.</p>
            <div className="relative mx-auto mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
                {topics.map(item => <div key={item.title} className="flex items-center justify-center gap-2 rounded-2xl border border-[#e6c47c]/20 bg-white/[.045] px-3 py-4 text-sm text-[#f1dfba]">
                    <span aria-hidden="true" className="material-symbols-outlined text-[22px] text-[#f0c453]">{item.icon}</span>{item.title}
                </div>)}
            </div>
            <Link href="/explore" data-analytics="Главная · Исследуй себя" className="relative mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#f0c453] px-8 py-3 font-bold text-[#22190e] transition hover:bg-[#ffda81] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f0c453]">
                Исследовать себя <span aria-hidden="true" className="material-symbols-outlined text-xl">arrow_forward</span>
            </Link>
            <p className="relative mt-4 text-xs text-[#ae9e87]">6 направлений · Без регистрации</p>
        </div>
    </section>;
}
