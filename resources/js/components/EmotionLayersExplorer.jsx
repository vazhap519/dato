import React, { useState } from 'react';
import atlas from '../../data/emotion-atlas.json';

const bySlug = Object.fromEntries(atlas.emotions.map(e => [e.slug, e]));
const examples = [
    { start: 'anger', nearby: ['hurt','fear','helplessness'], scene: 'Иногда злость возникает там, где мы почувствовали боль или потеряли влияние.' },
    { start: 'anxiety', nearby: ['fear','insecurity','confusion'], scene: 'Иногда тревога соседствует с неясностью, неуверенностью или конкретным страхом.' },
    { start: 'jealousy', nearby: ['fear','hurt','envy'], scene: 'В ревности могут одновременно звучать тревога о связи и сравнение.' },
    { start: 'shame', nearby: ['guilt','fear','sadness'], scene: 'Стыд иногда смешивается с переживанием о поступке или страхом чужой оценки.' },
    { start: 'joy', nearby: ['gratitude','pride','tenderness'], scene: 'Приятные переживания тоже могут звучать одновременно и окрашивать друг друга.' },
    { start: 'sadness', nearby: ['longing','loneliness','disappointment'], scene: 'Грусть бывает рядом с тоской, одиночеством или несбывшимся ожиданием.' },
];
export default function EmotionLayersExplorer({ onExploreEmotion }) {
    const [current,setCurrent] = useState('anger');
    const [second,setSecond] = useState(null);
    const example = examples.find(x => x.start === current);
    const primary = bySlug[current];
    const options = example ? example.nearby : primary.related;
    const secondary = second && options.includes(second) ? bySlug[second] : null;
    const select = value => {setCurrent(value);setSecond(null);};
    return <section className="rounded-3xl border border-[#85693e]/70 bg-[#211d15] p-6 sm:p-9">
        <p className="text-xs uppercase tracking-[.18em] text-[#f0c453]">Что может соседствовать с эмоцией?</p>
        <h3 className="mt-3 font-serif text-3xl sm:text-4xl">Одно чувство — <span className="italic text-[#f0c453]">не всегда одно</span> переживание</h3>
        <p className="mt-4 max-w-3xl leading-7 text-[#c8b9a1]">Внутри могут сосуществовать несколько чувств. Попробуй проверить одну гипотезу — без утверждения, что мы «вычислили скрытую причину».</p>
        <div className="mt-7 flex flex-wrap gap-2">
            {examples.map(item => <button type="button" key={item.start} aria-pressed={current===item.start} onClick={() => select(item.start)}
                className={'rounded-full border px-4 py-2 text-sm transition ' + (current===item.start ? 'border-[#f0c453] bg-[#42311d] text-white' : 'border-[#806638]/70 text-[#dac9aa] hover:border-[#f0c453]')}>{bySlug[item.start].name}</button>)}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#9a7641]/70 bg-[#17140f] p-6">
                <p className="text-xs uppercase tracking-widest text-[#f0c453]">То, что заметно сейчас</p>
                <h4 className="mt-3 font-serif text-3xl">{primary.name}</h4>
                <p className="mt-3 text-sm leading-7 text-[#d7c9b5]">{primary.definition}</p>
                <p className="mt-5 text-sm leading-7 text-[#e5bc62]">{example?.scene || 'Рядом может быть и другое переживание.'}</p>
            </div>
            <div className="rounded-2xl border border-[#9a7641]/70 bg-[#17140f] p-6">
                <p className="text-xs uppercase tracking-widest text-[#f0c453]">Что ещё можно проверить?</p>
                <div className="mt-4 grid gap-2">
                    {options.map(slug => <button key={slug} type="button" aria-pressed={second===slug} onClick={() => setSecond(second===slug?null:slug)}
                        className={'rounded-xl border p-3 text-left text-sm transition ' + (second===slug?'border-[#f0c453] bg-[#41311d]':'border-[#806638]/70 hover:border-[#f0c453]')}>{bySlug[slug]?.name}</button>)}
                </div>
                {secondary ? <>
                    <p className="mt-5 text-sm leading-7 text-[#e1d1b9]">{secondary.definition}</p>
                    <p className="mt-3 text-sm leading-7 text-[#e5bc62]">{secondary.questions[0]}</p>
                    <button type="button" onClick={() => onExploreEmotion?.(secondary.slug)} className="mt-4 text-sm text-[#f0c453] underline underline-offset-4 hover:text-white">Открыть подробное описание →</button>
                </> : <p className="mt-5 text-sm leading-6 text-[#ab9d87]">Выбери второе чувство, если оно действительно кажется близким. Если нет — ничего не выбирай.</p>}
            </div>
        </div>
        <p className="mt-5 text-xs leading-6 text-[#a99d88]">Эмоции не всегда имеют скрытый «настоящий» слой. Иногда злость — просто злость, а радость — радость. Не нужно искать тайную причину любой ценой.</p>
    </section>;
}
