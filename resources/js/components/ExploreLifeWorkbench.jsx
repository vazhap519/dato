import React, { useEffect, useState } from 'react';

const fieldStyle = 'mt-2 w-full rounded-xl border border-[#84693e] bg-[#17140f] px-4 py-3 text-sm leading-6 text-[#f7ead5] outline-none placeholder:text-[#91836e] focus:border-[#f0c453]';
const cardStyle = 'rounded-2xl border border-[#886c40]/65 bg-[#211c15] p-5 sm:p-7';

export default function ExploreLifeWorkbench({ slug, feature }) {
    const [entries, setEntries] = useState({});
    const [selections, setSelections] = useState([]);
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        setEntries({});
        setSelections([]);
        setExpanded(false);
    }, [slug]);

    if (!feature) return null;

    const update = (index, value) => setEntries(previous => ({ ...previous, [index]: value }));
    const toggle = (index, max = Infinity) => setSelections(previous =>
        previous.includes(index) ? previous.filter(value => value !== index)
            : previous.length >= max ? previous : [...previous, index]);

    const filled = Object.values(entries).some(value => String(value).trim());
    const reset = () => {setEntries({});setSelections([]);setExpanded(false);};

    return <section id="workbench" className="mt-20 scroll-mt-8">
        <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#f0c453]">Практика в своём темпе</p>
        <h2 className="mt-3 font-serif text-4xl sm:text-5xl">{feature.title}</h2>
        <p className="mt-3 text-lg text-[#e9ca83]">{feature.subtitle}</p>
        <p className="mt-4 max-w-3xl leading-7 text-[#c4b6a0]">{feature.intro}</p>

        <div className="mt-7 overflow-hidden rounded-3xl border border-[#9d7a45]/65 bg-[#211d15] p-5 sm:p-9">
            {(feature.type === 'dialogue' || feature.type === 'belief-check') && <>
                <div className="grid gap-5 md:grid-cols-2">
                    {feature.fields.map((label, index) => <label key={index} className="block text-sm leading-6 text-[#e8d6b9]">
                        <span className="font-semibold text-[#f0d18e]">{index + 1}. {label}</span>
                        <textarea rows={3} value={entries[index] || ''} onChange={e => update(index, e.target.value)}
                            maxLength={1200} placeholder="Твои слова…" className={fieldStyle} />
                    </label>)}
                </div>
                {filled && <div className={cardStyle + ' mt-6'}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#f0c453]">Твоя заметка</p>
                    {feature.fields.map((label, index) => entries[index]?.trim() ? <div key={index} className="mt-4">
                        <p className="text-xs text-[#e7c483]">{label}</p>
                        <p className="mt-1 whitespace-pre-wrap break-words leading-7 text-[#e6d9c6]">{entries[index]}</p>
                    </div> : null)}
                </div>}
            </>}

            {feature.type === 'decision' && <>
                <div className="grid gap-4 sm:grid-cols-2">
                    {feature.fields.map((label, index) => <label key={index} className={'block text-sm text-[#e6d3b6] ' + (index === 0 ? 'sm:col-span-2' : '')}>
                        <span className="font-semibold text-[#efcd87]">{label}</span>
                        <textarea rows={index === 0 ? 2 : 3} value={entries[index] || ''} onChange={e => update(index, e.target.value)}
                            maxLength={1200} placeholder="Что я знаю сейчас…" className={fieldStyle} />
                    </label>)}
                </div>
                {filled && <div className="mt-6 rounded-2xl border border-[#816b47] bg-[#17140f] p-5">
                    <p className="font-serif text-2xl">Проверка перед выбором</p>
                    <p className="mt-3 leading-7 text-[#d5c4aa]">Учитывает ли каждый вариант то, что для тебя важно? Какие сведения ещё нужны, прежде чем принимать решение?</p>
                </div>}
            </>}

            {(feature.type === 'body-scan' || feature.type === 'values' || feature.type === 'attention-map') && <>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {feature.fields.map((label, index) => <button key={index} type="button"
                        aria-pressed={selections.includes(index)} onClick={() => toggle(index, feature.type === 'values' || feature.type === 'attention-map' ? 3 : Infinity)}
                        className={'min-h-16 rounded-xl border p-4 text-left text-sm leading-6 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453] ' +
                            (selections.includes(index) ? 'border-[#f0c453] bg-[#46321e] text-[#ffe9bb]' : 'border-[#78613e] bg-[#18150f] text-[#e1d1b7] hover:border-[#d5b368]')}>
                        <span className="mr-3 text-[#f0c453]">{selections.includes(index) ? '✓' : '○'}</span>{label}
                    </button>)}
                </div>
                <p className="mt-4 text-xs leading-6 text-[#bcae98]">{feature.type === 'values' ? 'Выбери не больше трёх ценностей.' : feature.type === 'attention-map' ? 'Отметь до трёх источников отвлечения. Нет правильных ответов.' : 'Можно отметить одно или несколько ощущений, а можно ничего не выбирать.'}</p>
                {selections.length > 0 && <div className={cardStyle + ' mt-5'}>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#f0c453]">Твоя отметка</p>
                    <p className="mt-3 text-lg leading-8 text-[#f4e1c3]">{selections.map(index => feature.fields[index]).join(' · ')}</p>
                    <p className="mt-3 text-sm leading-7 text-[#c4b49a]">{feature.template}</p>
                    <label className="mt-4 block text-sm text-[#e9c983]">{feature.type === 'values' ? 'Один маленький поступок' : feature.type === 'attention-map' ? 'Как я хочу вернуть внимание?' : 'Что я замечаю в контексте?'}
                        <textarea rows={3} value={entries.note || ''} onChange={e => update('note', e.target.value)} maxLength={1200}
                            placeholder="Запиши своё наблюдение…" className={fieldStyle} />
                    </label>
                </div>}
            </>}
            {feature.type !== 'values' && feature.type !== 'body-scan' && feature.type !== 'attention-map' && <p className="mt-6 text-sm leading-7 text-[#e6c88b]">{feature.template}</p>}
            <div className="mt-7 border-t border-[#79613c]/60 pt-5">
                <button type="button" onClick={() => setExpanded(value => !value)} className="inline-flex items-center gap-2 text-sm font-semibold text-[#f0c453] hover:underline" aria-expanded={expanded}>
                    {expanded ? 'Скрыть подсказку' : 'Как бережно использовать эту практику?'} <span aria-hidden="true">{expanded ? '−' : '+'}</span>
                </button>
                {expanded && <p className="mt-3 max-w-3xl text-sm leading-7 text-[#d6c5aa]">{feature.note}</p>}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs leading-6 text-[#a99b86]">Ничего не отправляется на сервер и не сохраняется.</span>
                    <button type="button" onClick={reset} className="rounded-xl border border-[#927349] px-5 py-2.5 text-sm text-[#f0c453] hover:border-[#f0c453]">Очистить записи</button>
                </div>
            </div>
        </div>
    </section>;
}
