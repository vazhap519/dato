import React, { useState } from 'react';
import guidesDefinition from '../../data/archetype-guides.json';
import { localDay, readJournal, saveJournalEntry } from '../lib/archetypeJournal';

const guides = guidesDefinition.guides;
const eyebrow = 'text-xs font-semibold uppercase tracking-[.18em] text-[#e5bc62]';
const outlined = 'rounded-xl border border-[#8c7247]/60 px-4 py-3 text-sm text-[#f2e6d2] transition hover:border-[#f0c453] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453]';

export default function ArchetypeSituationExperience({ situation, archetypes = [], onSaved, featured = false }) {
    const id = 'situation:' + localDay() + ':' + situation.id;
    const previous = readJournal().find(entry => entry.id === id);
    const [choice, setChoice] = useState(
        previous && Number.isInteger(previous.optionIndex) ? previous.optionIndex : null
    );
    const [note, setNote] = useState(previous?.note || '');
    const [saveState, setSaveState] = useState(previous ? 'saved' : 'idle');
    const option = choice === null ? null : situation.options[choice];
    const role = option && archetypes.find(item => item.slug === option.slug);
    const guide = option && guides[option.slug];

    const save = () => {
        if (!option) return;
        const result = saveJournalEntry({
            id,
            kind: 'situation',
            day: localDay(),
            situationId: situation.id,
            situationTitle: situation.title,
            category: situation.category,
            question: situation.prompt,
            optionIndex: choice,
            answer: option.label,
            slug: option.slug,
            roleTitle: role?.title || option.slug,
            note: note.trim().slice(0, 1000),
        });
        setSaveState(result.ok ? 'saved' : 'error');
        if (result.ok) onSaved?.(result.entries);
    };

    return <section className="overflow-hidden rounded-3xl border border-[#876b3b]/70 bg-[#211d15]">
        <div className="border-b border-[#806436]/50 bg-gradient-to-r from-[#362818] via-[#292116] to-[#211d15] p-5 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-[#f0c453]">
                <span>{featured ? 'Ситуация сегодня' : 'Библиотека ситуаций'}</span>
                <span aria-hidden="true">·</span>
                <span>{situation.category}</span>
            </div>
            <h3 className="mt-3 font-serif text-2xl text-[#fff7e8] sm:text-3xl">{situation.title}</h3>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#e7dbca]">{situation.prompt}</p>
            <p className="mt-3 text-sm text-[#baaa91]">Выбери реакцию, которая ближе всего к твоему первому импульсу. Здесь нет правильных ответов.</p>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 sm:p-8">
            {situation.options.map((item, index) =>
                <button type="button" key={index} aria-pressed={choice === index} onClick={() => { setChoice(index); setSaveState('idle'); }}
                    className={outlines(choice === index)}>
                    <span className="mr-2 font-semibold text-[#f0c453]">{String.fromCharCode(65 + index)}.</span>{item.label}
                </button>
            )}
        </div>
        {option ? <div className="mx-5 mb-5 rounded-2xl border border-[#b38c45]/60 bg-[#16130e] p-5 sm:mx-8 sm:mb-8 sm:p-7" aria-live="polite">
            <p className={eyebrow}>Что можно заметить в этой реакции</p>
            <h4 className="mt-2 font-serif text-2xl text-[#fff5e3]">{role?.title || option.slug}</h4>
            <p className="mt-3 leading-7 text-[#decfb8]">{guide?.lead || role?.description}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[#57452d] p-4">
                    <p className={eyebrow}>Что помогает</p>
                    <p className="mt-2 text-sm leading-6 text-[#e7dbca]">{guide?.gift || role?.strength}</p>
                </div>
                <div className="rounded-xl border border-[#57452d] p-4">
                    <p className={eyebrow}>За чем наблюдать</p>
                    <p className="mt-2 text-sm leading-6 text-[#e7dbca]">{guide?.trap || role?.shadow}</p>
                </div>
            </div>
            <label htmlFor={'reflection-' + situation.id} className="mt-6 block text-sm font-semibold text-[#fff5e3]">Что отозвалось в тебе? <span className="font-normal text-[#a99d88]">(необязательно)</span></label>
            <textarea id={'reflection-' + situation.id} maxLength={1000} rows={3} value={note} onChange={event => {setNote(event.target.value); setSaveState('idle');}}
                placeholder="Например: «Я часто реагирую так, когда боюсь разочаровать близкого…»"
                className="mt-2 block w-full resize-y rounded-xl border border-[#8c7247]/60 bg-[#211d15] p-3 text-sm leading-6 text-[#f8f4e9] outline-none placeholder:text-[#97876e] focus:border-[#f0c453]" />
            <div className="mt-4 flex flex-wrap items-center gap-3">
                <button type="button" onClick={save} className="rounded-xl bg-[#f0c453] px-5 py-3 text-sm font-semibold text-[#21180b] transition hover:bg-[#ffda7b]">
                    {saveState === 'saved' ? 'Обновить запись в журнале' : 'Сохранить наблюдение'}
                </button>
                {saveState === 'saved' && <span role="status" className="text-sm text-[#c1e0b1]">Сохранено в этом браузере</span>}
                {saveState === 'error' && <span role="alert" className="text-sm text-[#f4a99b]">Не удалось сохранить: проверь настройки браузера</span>}
            </div>
            <p className="mt-4 text-xs leading-5 text-[#a99d88]">Наблюдение сохраняется только в браузере этого устройства и не отправляется на сайт. Выбор реакции не определяет твою личность.</p>
        </div> : <p className="px-5 pb-6 text-sm text-[#a99d88] sm:px-8">После выбора появится небольшое объяснение — не оценка и не диагноз, а вопрос к собственному опыту.</p>}
    </section>;
}

function outlines(selected) {
    return 'min-h-[88px] rounded-2xl border p-4 text-left leading-6 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453] ' +
        (selected
            ? 'border-[#f0c453] bg-[#40301c] text-[#fff9ef]'
            : 'border-[#7c6340]/60 bg-[#17140f] text-[#e0d5c3] hover:border-[#f0c453] hover:bg-[#2d2418]');
}
