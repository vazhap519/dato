import React, { useEffect, useState } from 'react';
import { Link, router } from '@inertiajs/react';

/**
 * Editorially curated connections between all 15 exploration languages.
 * This is a reading path, not a diagnosis or an automated profile.
 * No test answer, result or browser history is recorded.
 */
const DIRECTIONS = {
    numbers: { name: 'Язык чисел', href: '/numbers', icon: 'tag', question: 'Какие совпадения заставляют тебя остановиться?' },
    emotions: { name: 'Язык эмоций', href: '/explore/emotions', icon: 'favorite', question: 'Что ты чувствуешь в этой ситуации?' },
    dreams: { name: 'Язык снов', href: '/explore/dreams', icon: 'bedtime', question: 'Какой образ продолжает возвращаться в памяти?' },
    archetypes: { name: 'Язык архетипов', href: '/explore/archetypes', icon: 'theater_comedy', question: 'Какую роль ты привычно принимаешь?' },
    patterns: { name: 'Язык повторений', href: '/explore/patterns', icon: 'repeat', question: 'Какой сценарий возникает снова?' },
    mirror: { name: 'Зеркало личности', href: '/explore/mirror', icon: 'self_improvement', question: 'Какие внутренние противоречия ты замечаешь?' },
    relationships: { name: 'Язык отношений', href: '/explore/relationships', icon: 'diversity_3', question: 'Что происходит между тобой и другим человеком?' },
    body: { name: 'Язык тела', href: '/explore/body', icon: 'spa', question: 'Какие ощущения сопровождают этот опыт?' },
    choice: { name: 'Язык выбора', href: '/explore/choice', icon: 'alt_route', question: 'Какие возможности и последствия ты видишь?' },
    beliefs: { name: 'Язык убеждений', href: '/explore/beliefs', icon: 'psychology_alt', question: 'Какую мысль ты принял за правило?' },
    values: { name: 'Язык ценностей', href: '/explore/values', icon: 'explore', question: 'Что здесь по-настоящему важно тебе?' },
    fears: { name: 'Язык страхов', href: '/explore/fears', icon: 'shield', question: 'Где реальная опасность, а где предположение?' },
    time: { name: 'Язык времени', href: '/explore/time', icon: 'schedule', question: 'В каком времени сейчас находится внимание?' },
    conflicts: { name: 'Язык внутренних конфликтов', href: '/explore/conflicts', icon: 'balance', question: 'Какие две потребности просят внимания?' },
    attention: { name: 'Язык внимания', href: '/explore/attention', icon: 'visibility', question: 'Куда уходит внимание и куда хочется его вернуть?' },
};

const CONNECTIONS = {
    numbers: ['attention', 'patterns', 'beliefs'],
    emotions: ['body', 'relationships', 'fears'],
    dreams: ['emotions', 'attention', 'time'],
    archetypes: ['mirror', 'relationships', 'beliefs'],
    patterns: ['beliefs', 'choice', 'conflicts'],
    mirror: ['conflicts', 'values', 'relationships'],
    relationships: ['emotions', 'conflicts', 'values'],
    body: ['emotions', 'attention', 'fears'],
    choice: ['values', 'fears', 'conflicts'],
    beliefs: ['patterns', 'fears', 'attention'],
    values: ['choice', 'time', 'attention'],
    fears: ['beliefs', 'body', 'choice'],
    time: ['attention', 'values', 'patterns'],
    conflicts: ['choice', 'relationships', 'mirror'],
    attention: ['time', 'emotions', 'patterns'],
};

function fromPath(path) {
    if (path === '/numbers' || path.startsWith('/numbers/')) return 'numbers';
    if (!path.startsWith('/explore/')) return null;
    const slug = path.split('/')[2] || '';
    if (slug === 'archetypes' && path.includes('/mirror')) return 'archetypes';
    return DIRECTIONS[slug] ? slug : null;
}

export default function ExploreConnections() {
    const [path, setPath] = useState(() => typeof window !== 'undefined' ? window.location.pathname : '');
    useEffect(() => {
        const unsubscribe = router.on('navigate', () => setPath(window.location.pathname));
        return () => unsubscribe();
    }, []);

    const current = fromPath(path);
    if (!current) return null;

    const related = CONNECTIONS[current] || [];
    return <section data-no-analytics aria-labelledby="explore-related-title" className="bg-[#14120d] px-5 pb-16 pt-10 text-[#f8efdf] sm:pb-20">
        <div className="mx-auto max-w-6xl border-t border-[#9c7943]/40 pt-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#f0c453]">Связанные исследования</p>
                    <h2 id="explore-related-title" className="mt-3 font-serif text-3xl sm:text-4xl">Увидеть опыт <span className="italic text-[#f0c453]">с другой стороны</span></h2>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[#cabba5]">Каждая тема может раскрыться через другую. Выбери следующий вопрос — здесь нет обязательного маршрута.</p>
                </div>
                <Link href="/explore" className="text-sm font-semibold text-[#edc878] hover:underline">Все 15 направлений →</Link>
            </div>
            <div className="mt-7 grid gap-4 md:grid-cols-3">
                {related.map(slug => {
                    const item = DIRECTIONS[slug];
                    return <Link key={slug} href={item.href} className="group flex flex-col rounded-2xl border border-[#80643a]/70 bg-[#231c14] p-5 transition hover:-translate-y-0.5 hover:border-[#e8c27b] hover:bg-[#2d2419] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453]">
                        <span aria-hidden="true" className="material-symbols-outlined text-3xl text-[#f0c453]">{item.icon}</span>
                        <h3 className="mt-4 font-serif text-xl text-[#fff0d8]">{item.name}</h3>
                        <p className="mt-2 flex-1 text-sm leading-6 text-[#cabaa2]">{item.question}</p>
                        <span className="mt-5 text-sm font-semibold text-[#f0c453] transition group-hover:text-[#ffe3a6]">Исследовать →</span>
                    </Link>;
                })}
            </div>
            <p className="mt-6 text-xs leading-6 text-[#aa9b86]">Ссылки подобраны по смысловой близости тем, а не на основании твоих ответов. Данные упражнений не передаются между страницами.</p>
        </div>
    </section>;
}
