import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Explore() {
    const { tools = [], settings = {} } = usePage().props;
    return <div className="min-h-screen bg-[#14120d] text-[#f8f4e9]">
        <Head title="Исследуй себя — Arutyun"><meta name="description" content="Инструменты самонаблюдения: язык чисел, эмоций и другие направления самопознания." /></Head>
        <header className="border-b border-[#b99347]/25">
            <div className="mx-auto max-w-6xl px-5 py-5 flex items-center justify-between gap-4">
                <Link href="/" aria-label="Главная">{settings?.logo ? <img src={settings.logo} alt={settings?.site_name || 'Arutyun'} className="h-10 max-w-[160px] object-contain" /> : <span className="font-serif italic text-2xl text-[#f0c453]">Arutyun</span>}</Link>
                <Link href="/editoria" className="text-xs sm:text-sm text-[#e4c88c] hover:text-white">Бесплатный практикум →</Link>
            </div>
        </header>
        <main className="mx-auto max-w-6xl px-5 py-12 sm:py-20">
            <p className="text-xs tracking-[.23em] uppercase text-[#e2b84e]">Пространство самопознания</p>
            <h1 className="mt-3 font-serif text-4xl sm:text-6xl">Исследуй <span className="italic text-[#f0c453]">себя</span></h1>
            <p className="mt-5 max-w-2xl text-[#c4b9a6] leading-7">Числа, эмоции и повседневные события могут стать поводом остановиться и внимательнее посмотреть на себя. Здесь нет предсказаний или готовых диагнозов.</p>
            <section aria-label="Направления самопознания" className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map(tool => <Link key={tool.id} href={tool.url} className="group rounded-2xl border border-[#9b7b3f]/40 bg-[#211d15] p-6 min-h-[210px] flex flex-col hover:border-[#f0c453] hover:bg-[#2b2419] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453]">
                    <span className="material-symbols-outlined text-[#f0c453] text-3xl" aria-hidden="true">{tool.icon || 'auto_awesome'}</span>
                    <h2 className="mt-5 text-xl font-serif font-semibold">{tool.title}</h2>
                    {tool.subtitle && <p className="mt-1 text-sm text-[#e7c578]">{tool.subtitle}</p>}
                    {tool.description && <p className="mt-3 text-sm leading-6 text-[#c4b9a6]">{tool.description}</p>}
                    <span className="mt-auto pt-5 text-xs text-[#f0c453]">Исследовать →</span>
                </Link>)}
            </section>
            <div className="mt-14 border-t border-[#b99347]/25 pt-8 text-sm text-[#a99d88]">Не ищи готового ответа. Замечай себя.</div>
        </main>
    </div>;
}
