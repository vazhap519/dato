import React, { useMemo, useState } from 'react';
import data from '../../data/emotion-practices.json';

function PracticeInstructions({ practice, compact = false }) {
    return <div>
        {!compact && <>
            <p className="text-xs uppercase tracking-[.18em] text-[#f0c453]">Практика внимания · {practice.minutes} мин</p>
            <h3 className="mt-3 font-serif text-3xl">{practice.name}</h3>
            <p className="mt-3 text-sm leading-7 text-[#c6b8a2]">{practice.when}</p>
        </>}
        <ol className={compact ? 'grid gap-5' : 'mt-7 grid gap-5'}>
            {practice.steps.map((step, index) => <li key={index} className="flex gap-4 text-sm leading-7">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#b18a49] font-serif text-xl text-[#f0c453]">{index + 1}</span>
                <span className="pt-1 text-[#e5d8c4]">{step}</span>
            </li>)}
        </ol>
        <div className="mt-7 rounded-2xl border border-[#8d713f]/70 bg-[#17140f] p-4 sm:p-5">
            <p className="text-xs uppercase tracking-widest text-[#f0c453]">После практики</p>
            <p className="mt-2 text-sm leading-7 text-[#e5d8c4]">{practice.closing}</p>
        </div>
        <p className="mt-5 text-xs leading-6 text-[#b9a88c]">{practice.caution}</p>
    </div>;
}

function PracticeLabel({ practice, expanded = false, showChevron = false }) {
    return <div className="flex min-w-0 items-center gap-3">
        <span aria-hidden="true" className="material-symbols-outlined shrink-0 text-2xl text-[#f0c453]">{practice.icon}</span>
        <div className="min-w-0 flex-1">
            <p className="font-serif text-lg text-[#f8f4e9]">{practice.name}</p>
            <p className="mt-1 text-xs leading-5 text-[#b1a18a]">{practice.minutes} мин · {practice.when}</p>
        </div>
        {showChevron && <span aria-hidden="true" className={'material-symbols-outlined shrink-0 text-[#f0c453] transition-transform duration-200 ' + (expanded ? 'rotate-180' : '')}>keyboard_arrow_down</span>}
    </div>;
}

export default function EmotionPracticeLibrary() {
    const [selected, setSelected] = useState(data.practices[0]?.id ?? null);
    const [expandedId, setExpandedId] = useState(data.practices[0]?.id ?? null);
    const [query, setQuery] = useState('');
    const practices = useMemo(() => data.practices.filter(item =>
        [item.name, item.when, ...item.tags].join(' ').toLocaleLowerCase('ru').includes(query.trim().toLocaleLowerCase('ru'))
    ), [query]);
    const current = practices.find(item => item.id === selected) || practices[0] || null;
    const activeMobileId = expandedId === null ? null
        : (practices.some(item => item.id === expandedId) ? expandedId : practices[0]?.id ?? null);

    return <div>
        <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="max-w-2xl text-sm leading-7 text-[#bcb09d]">Короткие упражнения, которые можно повторять в разные дни. Они не обещают «убрать» чувство — помогают сделать паузу и заметить следующий шаг.</p>
            <label className="text-sm text-[#e9d7b9]">Найти практику
                <input type="search" value={query} onChange={e => setQuery(e.target.value)}
                    placeholder="Например: тревога"
                    className="mt-2 block w-full rounded-xl border border-[#806638] bg-[#211d15] px-4 py-3 text-sm text-white outline-none placeholder:text-[#a99d88] focus:border-[#f0c453]" />
            </label>
        </div>

        {practices.length === 0 ? <p className="mt-6 rounded-xl border border-[#806638]/60 p-4 text-sm text-[#bba98d]">Практики не найдены. Попробуй другое слово.</p> : <>
            {/* On phones/tablets, each practice expands directly beneath its title. */}
            <div className="mt-6 grid gap-3 lg:hidden" aria-label="Практики внимания">
                {practices.map(item => {
                    const expanded = activeMobileId === item.id;
                    const panelId = 'emotion-practice-panel-' + item.id;
                    const buttonId = 'emotion-practice-toggle-' + item.id;
                    return <article key={item.id} className={'overflow-hidden rounded-2xl border transition-colors ' + (expanded ? 'border-[#c19952] bg-[#262015]' : 'border-[#806638]/65 bg-[#211d15]')}>
                        <h3>
                            <button id={buttonId} type="button" aria-expanded={expanded} aria-controls={panelId}
                                onClick={() => setExpandedId(expanded ? null : item.id)}
                                className="w-full p-4 text-left transition-colors hover:bg-[#332817] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#f0c453]">
                                <PracticeLabel practice={item} expanded={expanded} showChevron />
                            </button>
                        </h3>
                        {expanded && <div id={panelId} role="region" aria-labelledby={buttonId}
                            className="border-t border-[#9a7741]/60 bg-[#1c1812] px-4 pb-6 pt-5 sm:px-6">
                            <p className="mb-5 text-xs font-semibold uppercase tracking-[.16em] text-[#f0c453]">Как выполнить практику</p>
                            <PracticeInstructions practice={item} compact />
                        </div>}
                    </article>;
                })}
            </div>

            {/* Wide screens retain the familiar list + detailed reading panel. */}
            <div className="mt-6 hidden gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
                <div className="grid max-h-[520px] grid-cols-1 content-start gap-2 overflow-y-auto">
                    {practices.map(item => <button type="button" key={item.id} aria-pressed={current?.id === item.id}
                        onClick={() => setSelected(item.id)}
                        className={'rounded-2xl border p-4 text-left transition hover:border-[#f0c453] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453] ' +
                            (current?.id === item.id ? 'border-[#f0c453] bg-[#3e2d19]' : 'border-[#806638]/65 bg-[#211d15]')}>
                        <PracticeLabel practice={item} />
                    </button>)}
                </div>
                {current && <section aria-live="polite" className="rounded-3xl border border-[#a17f45]/70 bg-[#211d15] p-6 sm:p-8">
                    <PracticeInstructions practice={current} />
                </section>}
            </div>
        </>}

        <p className="mt-5 text-xs leading-6 text-[#a99d88]">Если упражнение вызывает дискомфорт, прекращай его. Эти практики не заменяют помощь специалиста при тяжёлом или длительном состоянии.</p>
    </div>;
}
