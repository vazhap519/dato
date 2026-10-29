import React, { useMemo, useState } from 'react';
import atlas from '../../data/emotion-atlas.json';

const profiles = [
    { id: 'low-hard', energy: 'low', tone: 'hard', slugs: ['sadness', 'loneliness', 'helplessness', 'disappointment', 'longing', 'despair'] },
    { id: 'high-hard', energy: 'high', tone: 'hard', slugs: ['anxiety', 'fear', 'anger', 'irritation', 'jealousy', 'shame'] },
    { id: 'neutral-hard', energy: 'neutral', tone: 'hard', slugs: ['confusion', 'insecurity', 'guilt', 'hurt', 'envy', 'sadness'] },
    { id: 'low-soft', energy: 'low', tone: 'soft', slugs: ['calm', 'tenderness', 'gratitude', 'joy', 'interest', 'pride'] },
    { id: 'high-soft', energy: 'high', tone: 'soft', slugs: ['inspiration', 'joy', 'interest', 'pride', 'gratitude', 'tenderness'] },
    { id: 'neutral-soft', energy: 'neutral', tone: 'soft', slugs: ['interest', 'calm', 'gratitude', 'tenderness', 'pride', 'joy'] },
];
const tile = active => 'rounded-xl border px-4 py-4 text-left text-sm leading-6 transition hover:border-[#f0c453] ' +
    (active ? 'border-[#f0c453] bg-[#3d2c19] text-[#fff2d5]' : 'border-[#846943]/60 bg-[#17140f] text-[#d2c6b7]');

export default function EmotionNamingHelper({ onExploreEmotion }) {
    const [energy, setEnergy] = useState('');
    const [tone, setTone] = useState('');
    const [selected, setSelected] = useState('');
    const list = useMemo(() => {
        if (!energy || !tone) return [];
        const group = profiles.find(p => p.energy === energy && p.tone === (tone === 'mixed' ? 'hard' : tone));
        const ids = tone === 'mixed'
            ? [...new Set([...(profiles.find(p => p.energy === energy && p.tone === 'hard')?.slugs || []),
                ...(profiles.find(p => p.energy === energy && p.tone === 'soft')?.slugs || [])])].slice(0, 8)
            : group?.slugs || [];
        return ids.map(slug => atlas.emotions.find(item => item.slug === slug)).filter(Boolean);
    }, [energy,tone]);
    const feeling = atlas.emotions.find(item => item.slug === selected);
    return <section className="rounded-3xl border border-[#85693e]/70 bg-[#211d15] p-5 sm:p-9">
        <p className="text-xs uppercase tracking-[.19em] text-[#f0c453]">Когда сложно найти слова</p>
        <h3 className="mt-3 font-serif text-3xl sm:text-4xl">«Я не знаю, что чувствую» — тоже начало</h3>
        <p className="mt-4 max-w-3xl leading-7 text-[#c8b9a1]">Иногда состояние сложно назвать. Попробуй начать не с эмоции, а с двух общих наблюдений. Этот способ предлагает слова для проверки, а не определяет твоё состояние автоматически.</p>
        <div className="mt-7 grid gap-7 lg:grid-cols-2">
            <div>
                <h4 className="font-serif text-xl">Какая сейчас энергия?</h4>
                <div className="mt-3 grid gap-2">
                    {[['low','Мало сил, хочется замедлиться'],['high','Много напряжения или движения'],['neutral','Трудно определить / смешанно']].map(([value,label]) =>
                        <button type="button" key={value} onClick={() => {setEnergy(value);setSelected('');}} aria-pressed={energy===value} className={tile(energy===value)}>{label}</button>)}
                </div>
            </div>
            <div>
                <h4 className="font-serif text-xl">Каким кажется переживание?</h4>
                <div className="mt-3 grid gap-2">
                    {[['hard','Скорее неприятным или тяжёлым'],['soft','Скорее приятным или мягким'],['mixed','И приятным, и неприятным / не знаю']].map(([value,label]) =>
                        <button type="button" key={value} onClick={() => {setTone(value);setSelected('');}} aria-pressed={tone===value} className={tile(tone===value)}>{label}</button>)}
                </div>
            </div>
        </div>
        {list.length > 0 && <div className="mt-8 border-t border-[#806638]/60 pt-7">
            <p className="font-serif text-xl">Какие слова могли бы подойти?</p>
            <p className="mt-2 text-xs leading-6 text-[#a99d88]">Это примеры, не выводы. Ты можешь не выбрать ни одно.</p>
            <div className="mt-4 flex flex-wrap gap-2">
                {list.map(item => <button type="button" key={item.slug} aria-pressed={selected===item.slug} onClick={() => setSelected(item.slug)}
                    className={'rounded-full border px-4 py-2 text-sm transition ' + (selected===item.slug ? 'border-[#f0c453] bg-[#46331d] text-white' : 'border-[#876b3b]/60 text-[#e5d8c2] hover:border-[#f0c453]')}>{item.name}</button>)}
            </div>
            {feeling && <div className="mt-5 rounded-2xl border border-[#a47e44]/70 bg-[#17140f] p-5">
                <h4 className="font-serif text-2xl">{feeling.name}</h4>
                <p className="mt-3 text-sm leading-7 text-[#d3c3ac]">{feeling.definition}</p>
                <p className="mt-3 text-sm leading-7 text-[#e5bc62]">{feeling.questions[0]}</p>
                <button type="button" onClick={() => onExploreEmotion?.(feeling.slug)}
                    className="mt-4 rounded-xl bg-[#f0c453] px-5 py-3 text-sm font-semibold text-[#21180b]">Узнать об этом переживании →</button>
            </div>}
            <p className="mt-5 text-sm leading-7 text-[#c4b9a6]">Если ни одно слово не подходит, можно просто отметить: «Мне сейчас непросто» или «Во мне что-то меняется». Для самонаблюдения не обязательно сразу находить точный термин.</p>
        </div>}
    </section>;
}
