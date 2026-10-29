import React, { useState } from 'react';
import guidesDefinitionBase from '../../data/archetype-guides.json'
import { liveExploreDocument } from '../lib/exploreCms.js';
import { useExploreJourney, ExplorePracticeInvitation } from './ExploreJourney.jsx';

const guidesDefinition = liveExploreDocument('archetype-guides', guidesDefinitionBase);

const guides = guidesDefinition.guides;
const eyebrow = 'text-xs font-semibold uppercase tracking-[.18em] text-[#e5bc62]';

export default function ArchetypeSituationExperience({ situation, archetypes = [], featured = false }) {
    const [choice, setChoice] = useState(null);
    useExploreJourney('archetypes', choice !== null, choice !== null);
    const option = choice === null ? null : situation.options[choice];
    const role = option && archetypes.find(item => item.slug === option.slug);
    const guide = option && guides[option.slug];

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
                <button type="button" key={index} aria-pressed={choice === index} onClick={() => setChoice(index)}
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
            <div className="mt-6 rounded-xl border border-[#57452d] bg-[#211d15] p-5">
                <p className={eyebrow}>Вопрос к себе</p>
                <p className="mt-2 text-sm leading-7 text-[#e7dbca]">{guide?.questions?.[0] || role?.question || 'Что именно эта реакция помогает мне получить или избежать?'}</p>
                <p className="mt-3 text-xs leading-6 text-[#a99d88]">Можно выбрать другой вариант и сравнить реакции. Ответы здесь не сохраняются.</p>
            </div>
        </div> : <p className="px-5 pb-6 text-sm text-[#a99d88] sm:px-8">После выбора появится небольшое объяснение — не оценка и не диагноз, а вопрос к собственному опыту.</p>}
    </section>;
}

function outlines(selected) {
    return 'min-h-[88px] rounded-2xl border p-4 text-left leading-6 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453] ' +
        (selected
            ? 'border-[#f0c453] bg-[#40301c] text-[#fff9ef]'
            : 'border-[#7c6340]/60 bg-[#17140f] text-[#e0d5c3] hover:border-[#f0c453] hover:bg-[#2d2418]');
}
