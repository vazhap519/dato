import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import atlas from '../../data/emotion-atlas.json';
import scenarioData from '../../data/emotion-situations.json';

const bySlug = Object.fromEntries(atlas.emotions.map(item => [item.slug,item]));
const categories = [{ id: 'all', title: 'Все темы' }, ...scenarioData.categories];
export default function EmotionScenarioLibrary() {
    const [category,setCategory] = useState('all');
    const [expanded,setExpanded] = useState(false);
    const [selectedId,setSelectedId] = useState('');
    const [feelingSlug,setFeelingSlug] = useState('');
    const selectedRef = useRef(null);
    useEffect(() => {
        if (selectedId) selectedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, [selectedId]);
    const situations = useMemo(() => scenarioData.situations.filter(s => category === 'all' || s.category === category),[category]);
    const shown = expanded ? situations : situations.slice(0,9);
    const selected = situations.find(s => s.id === selectedId) || null;
    const feeling = selected?.options.includes(feelingSlug) ? bySlug[feelingSlug] : null;
    const pickCategory = value => {setCategory(value);setSelectedId('');setFeelingSlug('');setExpanded(false);};
    const pickScene = id => {setSelectedId(id);setFeelingSlug('');};
    return <div>
        <div className="flex flex-wrap gap-2" aria-label="Темы ситуаций">
            {categories.map(item => <button type="button" key={item.id} onClick={() => pickCategory(item.id)} aria-pressed={category===item.id}
                className={'rounded-full border px-4 py-2 text-sm transition hover:border-[#f0c453] ' + (category===item.id?'border-[#f0c453] bg-[#41301a] text-white':'border-[#806638]/70 text-[#d1c1a7]')}>{item.title}</button>)}
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map(s => <button type="button" key={s.id} onClick={() => pickScene(s.id)} aria-pressed={selectedId===s.id}
                className={'min-h-[135px] rounded-2xl border p-5 text-left transition hover:border-[#f0c453] ' + (selectedId===s.id?'border-[#f0c453] bg-[#3c2c19]':'border-[#806638]/65 bg-[#211d15]')}>
                <p className="text-xs uppercase tracking-widest text-[#e5bc62]">{scenarioData.categories.find(cat=>cat.id===s.category)?.title}</p>
                <h4 className="mt-3 font-serif text-xl">{s.title}</h4>
                <p className="mt-2 text-xs text-[#b6a78d]">Исследовать переживание →</p>
            </button>)}
        </div>
        {situations.length>9 && <div className="mt-5 text-center">
            <button type="button" onClick={() => setExpanded(v=>!v)} className="rounded-xl border border-[#8c7247] px-5 py-3 text-sm text-[#f0c453] hover:border-[#f0c453]">{expanded?'Свернуть':'Показать все ('+situations.length+')'} →</button>
        </div>}
        {selected && <div ref={selectedRef} className="mt-7 scroll-mt-6 rounded-3xl border border-[#b49351]/70 bg-[#211d15] p-5 sm:p-8" aria-live="polite">
            <p className="text-xs uppercase tracking-widest text-[#f0c453]">Жизненная ситуация</p>
            <h4 className="mt-3 font-serif text-3xl">{selected.title}</h4>
            <p className="mt-4 text-lg leading-8 text-[#e2d6c4]">{selected.scene}</p>
            <p className="mt-5 font-semibold">Что ты мог бы почувствовать в такой ситуации?</p>
            <p className="mt-2 text-sm leading-6 text-[#ac9f89]">Все варианты возможны; одно событие может вызывать несколько переживаний. Выбери один для исследования.</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {selected.options.map(slug=><button type="button" key={slug} onClick={()=>setFeelingSlug(slug)} aria-pressed={feelingSlug===slug}
                    className={'rounded-xl border p-4 text-left text-sm transition hover:border-[#f0c453] '+(feelingSlug===slug?'border-[#f0c453] bg-[#42321d]':'border-[#806638]/70 bg-[#17140f]')}>{bySlug[slug]?.name}</button>)}
            </div>
            {feeling && <div className="mt-6 rounded-2xl border border-[#967744]/70 bg-[#16130e] p-5 sm:p-6">
                <p className="text-xs uppercase tracking-widest text-[#f0c453]">Один из возможных смыслов</p>
                <h5 className="mt-2 font-serif text-2xl">{feeling.name}</h5>
                <p className="mt-3 text-sm leading-7 text-[#e0d3be]">{feeling.definition}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-[#806638]/60 p-4"><p className="text-xs text-[#f0c453]">Что проверить</p><p className="mt-2 text-sm leading-6">{selected.question}</p></div>
                    <div className="rounded-xl border border-[#806638]/60 p-4"><p className="text-xs text-[#f0c453]">Бережный шаг</p><p className="mt-2 text-sm leading-6">{feeling.practices.soft}</p></div>
                </div>
                <Link href={'/explore/emotions/'+feeling.slug} className="mt-5 inline-block text-sm text-[#f0c453] underline underline-offset-4 hover:text-white">Открыть подробное описание →</Link>
            </div>}
            <p className="mt-5 text-xs leading-6 text-[#a99d88]">Эта ситуация — пример, а не попытка предсказать твою реакцию. Ответ не сохраняется.</p>
        </div>}
    </div>;
}
