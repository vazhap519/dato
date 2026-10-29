import React, { useMemo, useState } from 'react';
import atlas from '../../data/emotion-atlas.json';

const emotions = atlas.emotions;
const groups = atlas.groups;
const starts = [
    { id: 'any', title: 'Все состояния' },
    ...groups.map(group => ({ id: group.id, title: group.title })),
];
const stress = new Set(['protection', 'vulnerability', 'self']);
const sensations = ['Напряжение', 'Тяжесть или сжатие', 'Тепло или лёгкость', 'Изменение дыхания', 'Оцепенение', 'Не замечаю явно выраженных ощущений'];
const triggers = ['Разговор или отношения', 'Мысли о будущем', 'Воспоминание', 'Работа или обязанности', 'Приятное событие', 'Пока не понимаю'];

const button = (active) => 'rounded-xl border px-4 py-3 text-left text-sm leading-6 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453] ' +
    (active ? 'border-[#f0c453] bg-[#463219] text-[#fff7e6]' : 'border-[#806638]/70 bg-[#18150f] text-[#d4c6b0] hover:border-[#f0c453]');

export default function EmotionCompass({ onExploreEmotion }) {
    const [phase, setPhase] = useState(0);
    const [group, setGroup] = useState('any');
    const [emotionSlug, setEmotionSlug] = useState('');
    const [intensity, setIntensity] = useState(5);
    const [sensationsSelected, setSensationsSelected] = useState([]);
    const [trigger, setTrigger] = useState('');
    const emotion = emotions.find(item => item.slug === emotionSlug) || null;
    const shown = useMemo(() => group === 'any' ? emotions : emotions.filter(item => item.group === group), [group]);
    const highIntensity = intensity >= 8;
    const needsCare = emotion && stress.has(emotion.group);
    const selectedPractice = highIntensity
        ? (needsCare ? emotion?.practices.strong : emotion?.practices.steady)
        : intensity <= 3 ? emotion?.practices.soft : emotion?.practices.steady;
    const toggleSensation = value => setSensationsSelected(previous =>
        previous.includes(value) ? previous.filter(s => s !== value) : [...previous, value].slice(-3)
    );
    const reset = () => {
        setPhase(0); setEmotionSlug(''); setGroup('any'); setIntensity(5);
        setSensationsSelected([]); setTrigger('');
    };
    return <div className="overflow-hidden rounded-3xl border border-[#b59455]/70 bg-[#211c14]">
        <div className="border-b border-[#a17b3d]/50 bg-gradient-to-br from-[#382919] to-[#211c14] p-6 sm:p-9">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[.2em] text-[#f0c453]">Интерактивное исследование</p>
                    <h3 className="mt-3 font-serif text-3xl sm:text-4xl">Что я чувствую <span className="italic text-[#f0c453]">сейчас?</span></h3>
                    <p className="mt-4 max-w-2xl leading-7 text-[#cbbda9]">Выбери слово, оцени силу переживания и посмотри на возможные потребности. Это не тест с правильным ответом и не диагностика.</p>
                </div>
                <span className="rounded-full border border-[#967446]/70 px-4 py-2 text-xs text-[#e9c47d]">Шаг {phase + 1} из 3</span>
            </div>
            <div className="mt-7 grid grid-cols-3 gap-2">
                {[0,1,2].map(n => <div key={n} className={'h-1.5 rounded-full ' + (phase >= n ? 'bg-[#f0c453]' : 'bg-[#6d5536]')} />)}
            </div>
        </div>
        <div className="p-5 sm:p-9">
            {phase === 0 && <>
                <h4 className="font-serif text-2xl">Какое состояние ближе всего?</h4>
                <p className="mt-2 text-sm text-[#a99d88]">Можно выбрать приблизительное название. Чувства могут смешиваться.</p>
                <div className="mt-5 flex flex-wrap gap-2" aria-label="Группы эмоций">
                    {starts.map(item => <button key={item.id} type="button" aria-pressed={group === item.id} onClick={() => setGroup(item.id)}
                        className={'rounded-full border px-3 py-2 text-xs transition ' + (group === item.id ? 'border-[#f0c453] bg-[#3c2c18] text-[#fff4d5]' : 'border-[#806638]/60 text-[#c4b9a6] hover:border-[#f0c453]')}>{item.title}</button>)}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                    {shown.map(item => <button type="button" key={item.slug} aria-pressed={emotionSlug === item.slug} onClick={() => setEmotionSlug(item.slug)}
                        className={button(emotionSlug === item.slug)}>
                        <span aria-hidden="true" className="material-symbols-outlined mr-2 align-middle text-xl text-[#f0c453]">{item.icon}</span>
                        {item.name}
                    </button>)}
                </div>
                <div className="mt-8 flex flex-wrap justify-between gap-3">
                    <a href="#naming" className="self-center text-sm text-[#f0c453] underline underline-offset-4 hover:text-white">Не знаю, как назвать чувство</a>
                    <button disabled={!emotion} onClick={() => setPhase(1)} type="button"
                        className="rounded-xl bg-[#f0c453] px-6 py-3 font-semibold text-[#21180b] transition hover:bg-[#ffda7b] disabled:cursor-not-allowed disabled:opacity-40">Продолжить →</button>
                </div>
            </>}
            {phase === 1 && <>
                <h4 className="font-serif text-2xl">{emotion?.name}: что я замечаю?</h4>
                <div className="mt-6 flex items-center justify-between gap-4">
                    <label htmlFor="compass-intensity" className="font-semibold">Интенсивность сейчас</label>
                    <span className="font-serif text-3xl text-[#f0c453]" aria-live="polite">{intensity}<span className="text-base text-[#b9ab96]"> / 10</span></span>
                </div>
                <input id="compass-intensity" type="range" min="1" max="10" step="1" value={intensity} onChange={e => setIntensity(Number(e.target.value))}
                    className="mt-3 w-full accent-[#f0c453]" />
                <div className="mt-2 flex justify-between text-xs text-[#aa9a80]"><span>Едва заметно</span><span>Очень сильно</span></div>
                <fieldset className="mt-9">
                    <legend className="font-serif text-xl">Как это ощущается в теле?</legend>
                    <p className="mt-2 text-xs text-[#ac9e89]">Можно выбрать до трёх вариантов или ничего не выбирать. Ощущения не определяют эмоцию однозначно.</p>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">{sensations.map(value => <button type="button" key={value} aria-pressed={sensationsSelected.includes(value)} onClick={() => toggleSensation(value)} className={button(sensationsSelected.includes(value))}>{value}</button>)}</div>
                </fieldset>
                <fieldset className="mt-9">
                    <legend className="font-serif text-xl">Что могло повлиять на чувство?</legend>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">{triggers.map(value => <button type="button" key={value} aria-pressed={trigger === value} onClick={() => setTrigger(value)} className={button(trigger === value)}>{value}</button>)}</div>
                </fieldset>
                <div className="mt-9 flex flex-wrap justify-between gap-3">
                    <button type="button" onClick={() => setPhase(0)} className="rounded-xl border border-[#9c7d4b] px-5 py-3 text-sm text-[#f0c453]">← Назад</button>
                    <button type="button" onClick={() => setPhase(2)} className="rounded-xl bg-[#f0c453] px-6 py-3 font-semibold text-[#21180b] hover:bg-[#ffda7b]">Посмотреть разбор →</button>
                </div>
            </>}
            {phase === 2 && emotion && <>
                <p className="text-xs uppercase tracking-widest text-[#f0c453]">Твоё наблюдение</p>
                <div className="mt-3 flex flex-wrap items-end gap-4">
                    <h4 className="font-serif text-4xl">{emotion.name}</h4>
                    <span className="pb-1 font-serif text-2xl text-[#f0c453]">{intensity}/10</span>
                </div>
                <p className="mt-4 max-w-3xl leading-8 text-[#e3d4bf]">{emotion.definition}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-[#806638]/60 bg-[#17140f] p-5">
                        <p className="text-xs uppercase tracking-wider text-[#f0c453]">Возможная потребность</p>
                        <p className="mt-3 leading-7 text-[#e4d8c7]">{emotion.needs.join(' · ')}</p>
                    </div>
                    <div className="rounded-2xl border border-[#806638]/60 bg-[#17140f] p-5">
                        <p className="text-xs uppercase tracking-wider text-[#f0c453]">Вопрос к себе</p>
                        <p className="mt-3 leading-7 text-[#e4d8c7]">{emotion.questions[0]}</p>
                    </div>
                    <div className="rounded-2xl border border-[#806638]/60 bg-[#17140f] p-5 sm:col-span-2">
                        <p className="text-xs uppercase tracking-wider text-[#f0c453]">Следующий бережный шаг</p>
                        <p className="mt-3 leading-7 text-[#e4d8c7]">{selectedPractice}</p>
                        {highIntensity && needsCare && <p className="mt-3 text-sm leading-6 text-[#dbbb8d]">Сейчас чувство очень сильное. Не обязательно немедленно разбираться в его причинах или принимать решения: сначала важнее безопасность, опора и поддержка.</p>}
                        {emotion.slug === 'despair' && <p className="mt-4 text-sm leading-6 text-[#eac29c]">Если есть риск причинить себе вред, не оставайся один и обратись за немедленной помощью к местной экстренной службе или кризисной поддержке.</p>}
                    </div>
                </div>
                {(trigger || sensationsSelected.length > 0) && <div className="mt-5 rounded-xl border border-[#705a38]/60 p-4 text-sm leading-7 text-[#c4b9a6]">
                    <p>Ты отметил: {[trigger, ...sensationsSelected].filter(Boolean).join(' · ')}.</p>
                    <p>Эти наблюдения помогают задать вопросы, но не позволяют установить причину чувства по одному признаку.</p>
                </div>}
                <div className="mt-7 flex flex-wrap gap-3">
                    <button type="button" onClick={() => setPhase(1)} className="rounded-xl border border-[#9c7d4b] px-5 py-3 text-sm text-[#f0c453]">← Вернуться к ощущениям</button>
                    <button type="button" onClick={reset} className="rounded-xl border border-[#9c7d4b] px-5 py-3 text-sm text-[#f0c453]">Исследовать другое чувство</button>
                    <button type="button" onClick={() => onExploreEmotion?.(emotion.slug)} className="rounded-xl bg-[#f0c453] px-5 py-3 text-sm font-semibold text-[#21180b]">Подробнее об эмоции →</button>
                </div>
                <p className="mt-5 text-xs leading-6 text-[#a99d88]">Ответы используются только во время этого взаимодействия, никуда не отправляются и не сохраняются. Это не медицинская или психологическая диагностика.</p>
            </>}
        </div>
    </div>;
}
