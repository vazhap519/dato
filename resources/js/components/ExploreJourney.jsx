import React, { useEffect, useRef } from 'react';
import { Link } from '@inertiajs/react';

/** Sends only a tool identifier and a milestone, never answers or results. */
export function exploreMilestone(event, tool) {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('explore:milestone', { detail: { event, tool } }));
}

export function useExploreJourney(tool, started, completed) {
    const last = useRef({ start: false, complete: false });
    useEffect(() => {
        if (started && !last.current.start) {
            last.current.start = true;
            exploreMilestone('explore_start', tool);
        }
        if (completed && !last.current.complete) {
            last.current.complete = true;
            exploreMilestone('explore_complete', tool);
        }
        if (!started && !completed) {
            last.current = { start: false, complete: false };
        }
    }, [tool, started, completed]);
}

export function ExplorePracticeInvitation({ tool, compact = false }) {
    return <aside className={'rounded-2xl border border-[#977342]/45 bg-gradient-to-br from-[#302518] to-[#1c1914] text-center ' + (compact ? 'p-5 sm:p-7' : 'p-6 sm:p-9')}>
        <p className="text-xs font-semibold uppercase tracking-[.17em] text-[#eac776]">Продолжение исследования</p>
        <h3 className="mt-3 font-serif text-2xl text-[#fff1d9] sm:text-3xl">Хочешь исследовать себя глубже?</h3>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#c9b9a2]">В бесплатном трёхдневном практикуме «Познай СЕБЯ» мы работаем с вниманием, привычными ролями и осознанным выбором. Без обязательств — решать тебе.</p>
        <Link href="/editoria" data-analytics={'Исследование · Практикум · ' + tool} onClick={() => exploreMilestone('explore_practice', tool)} className="mt-5 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#f0c453] px-6 py-3 text-sm font-semibold text-[#21180b] transition hover:bg-[#ffda81] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f0c453]">
            Узнать о практикуме <span aria-hidden="true">→</span>
        </Link>
    </aside>;
}
