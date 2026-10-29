import React, { useMemo, useState } from 'react';
import data from '../../data/emotion-practices.json';

export default function EmotionPracticeLibrary() {
    const [selected,setSelected] = useState(data.practices[0].id);
    const [query,setQuery] = useState('');
    const practices = useMemo(() => data.practices.filter(item =>
        [item.name,item.when,...item.tags].join(' ').toLocaleLowerCase('ru').includes(query.trim().toLocaleLowerCase('ru'))
    ),[query]);
    const current = practices.find(item => item.id === selected) || practices[0] || null;
    const show = item => setSelected(item.id);
    return <div>
        <div className="flex flex-wrap items-end justify-between gap-4">
            <p className="max-w-2xl text-sm leading-7 text-[#bcb09d]">Короткие упражнения, которые можно повторять в разные дни. Они не обещают «убрать» чувство — помогают сделать паузу и заметить следующий шаг.</p>
            <label className="text-sm text-[#e9d7b9]">Найти практику
                <input type="search" value={query} onChange={e=>setQuery(e.target.value)}
                    placeholder="Например: тревога"
                    className="mt-2 block w-full rounded-xl border border-[#806638] bg-[#211d15] px-4 py-3 text-sm text-white outline-none placeholder:text-[#a99d88] focus:border-[#f0c453]" />
            </label>
        </div>
        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <div className="grid max-h-[520px] grid-cols-1 gap-2 overflow-y-auto sm:grid-cols-2 lg:grid-cols-1">
                {practices.map(item=><button type="button" key={item.id} aria-pressed={selected===item.id} onClick={()=>show(item)}
                    className={'rounded-2xl border p-4 text-left transition hover:border-[#f0c453] '+(selected===item.id?'border-[#f0c453] bg-[#3e2d19]':'border-[#806638]/65 bg-[#211d15]')}>
                    <div className="flex items-center gap-3">
                        <span aria-hidden="true" className="material-symbols-outlined text-2xl text-[#f0c453]">{item.icon}</span>
                        <div><p className="font-serif text-lg">{item.name}</p><p className="mt-1 text-xs text-[#b1a18a]">{item.minutes} мин · {item.when}</p></div>
                    </div>
                </button>)}
                {practices.length===0 && <p className="rounded-xl border border-[#806638]/60 p-4 text-sm text-[#bba98d]">Практики не найдены. Попробуй другое слово.</p>}
            </div>
            {current && <section className="rounded-3xl border border-[#a17f45]/70 bg-[#211d15] p-6 sm:p-8">
                <p className="text-xs uppercase tracking-[.18em] text-[#f0c453]">Практика внимания · {current.minutes} мин</p>
                <h3 className="mt-3 font-serif text-3xl">{current.name}</h3>
                <p className="mt-3 text-sm leading-7 text-[#c6b8a2]">{current.when}</p>
                <ol className="mt-7 grid gap-5">
                    {current.steps.map((step,index)=><li key={index} className="flex gap-4 text-sm leading-7">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#b18a49] font-serif text-xl text-[#f0c453]">{index+1}</span>
                        <span className="pt-1 text-[#e5d8c4]">{step}</span>
                    </li>)}
                </ol>
                <div className="mt-7 rounded-2xl border border-[#8d713f]/70 bg-[#17140f] p-5">
                    <p className="text-xs uppercase tracking-widest text-[#f0c453]">После практики</p>
                    <p className="mt-2 text-sm leading-7 text-[#e5d8c4]">{current.closing}</p>
                </div>
                <p className="mt-5 text-xs leading-6 text-[#b9a88c]">{current.caution}</p>
            </section>}
        </div>
        <p className="mt-5 text-xs leading-6 text-[#a99d88]">Если упражнение вызывает дискомфорт, прекращай его. Эти практики не заменяют помощь специалиста при тяжёлом или длительном состоянии.</p>
    </div>;
}
