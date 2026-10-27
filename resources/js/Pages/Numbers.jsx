import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';

const digitsOnly = value => value.replace(/[^0-9]/g, '').slice(0, 12);

export default function Numbers() {
    const { featured = [], selected = null, searched = null } = usePage().props;
    const [value, setValue] = useState(selected?.number || searched || '');
    const submit = e => {
        e.preventDefault();
        if (!value) return;
        router.visit('/numbers/' + encodeURIComponent(value));
    };
    const parts = [
        ['Символика', selected?.symbolism],
        ['Светлая сторона', selected?.light_side],
        ['Теневая сторона', selected?.shadow_side],
        ['Вопрос к себе', selected?.reflection_question],
        ['Практика', selected?.practice],
    ];
    return (
        <div className="min-h-screen bg-[#14120d] text-[#f8f4e9] selection:bg-[#e7b945]/30">
            <Head title={selected ? selected.number + ' — ' + selected.title + ' | Язык чисел' : 'Язык чисел — символы для самопознания'}><meta name="description" content="Авторские символические интерпретации чисел, вопросы к себе и практики внимания. Без предсказаний." /></Head>
            <header className="border-b border-[#d9b65c]/15">
                <div className="max-w-6xl mx-auto px-5 py-6 flex items-center justify-between gap-4">
                    <Link href="/" className="text-[#f4c74c] italic text-2xl font-serif tracking-wide">Arutyun</Link>
                    <Link href="/editoria" className="text-sm text-[#e9d5a4] hover:text-[#f4c74c] transition-colors">Бесплатный практикум →</Link>
                </div>
            </header>
            <main>
                <section className="relative overflow-hidden px-5 pt-20 pb-14 text-center">
                    <div aria-hidden="true" className="absolute w-[420px] h-[420px] rounded-full bg-[#b68b28]/10 blur-[110px] left-1/2 -translate-x-1/2 -top-36 pointer-events-none" />
                    <div className="relative max-w-3xl mx-auto">
                        <p className="text-xs uppercase tracking-[0.28em] text-[#d5ab4a] mb-6">Пространство самопознания</p>
                        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight mb-6">Язык <span className="text-[#f0c453] italic font-serif">чисел</span></h1>
                        <p className="text-xl md:text-2xl text-[#e4dccb] leading-relaxed mb-4">Иногда число — не ответ, а повод задать себе вопрос.</p>
                        <p className="text-[#a9a293] max-w-xl mx-auto leading-relaxed">Числа не предсказывают твоё будущее. Но их символика может помочь остановиться, заметить свои мысли и посмотреть на привычное по-новому.</p>
                        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mt-10">
                            <label htmlFor="number-search" className="sr-only">Введите число</label>
                            <input id="number-search" inputMode="numeric" pattern="[0-9]*" value={value} onChange={e=>setValue(digitsOnly(e.target.value))}
                                placeholder="Например, 111, 777, 1212" className="w-full min-w-0 rounded-xl border border-[#b88f37]/40 bg-white/5 px-5 py-4 text-lg text-white placeholder:text-[#8e877a] focus:outline-none focus:ring-2 focus:ring-[#eac04f]" />
                            <button type="submit" disabled={!value} data-analytics="Числа · исследовать число"
                                className="shrink-0 rounded-xl bg-[#f0c54e] px-7 py-4 font-semibold text-[#19140b] hover:bg-[#ffdb70] disabled:opacity-40 transition-colors">Исследовать число</button>
                        </form>
                        <p className="mt-4 text-xs text-[#8e877a]">Можно ввести любое число до 12 цифр. Для опубликованных чисел доступно полное толкование.</p>
                    </div>
                </section>
                {selected && (
                    <section className="max-w-5xl mx-auto px-5 pb-16">
                        <div className="rounded-3xl border border-[#c6a049]/25 bg-[#1d1a13] p-7 md:p-12">
                            <p className="text-center text-[#d5ab4a] text-xs uppercase tracking-[0.2em] mb-3">Символическое толкование</p>
                            <div className="text-center text-7xl md:text-8xl font-serif text-[#f0c453] mb-3 break-all">{selected.number}</div>
                            <h2 className="text-center text-2xl md:text-3xl font-semibold mb-12">{selected.title}</h2>
                            <div className="grid md:grid-cols-2 gap-5">
                                {parts.filter(([,body])=>body).map(([title,body],i)=>(
                                    <article key={title} className={i===0 ? 'md:col-span-2 rounded-2xl border border-white/10 bg-white/[0.035] p-6' : 'rounded-2xl border border-white/10 bg-white/[0.035] p-6'}>
                                        <h3 className="text-[#f0c453] text-sm uppercase tracking-wider font-semibold mb-3">{title}</h3>
                                        <p className="text-[#e0d9cc] leading-7 whitespace-pre-line">{body}</p>
                                    </article>
                                ))}
                            </div>
                            <div className="mt-8 flex flex-wrap justify-center gap-3">
                                <button type="button" onClick={()=>navigator.clipboard?.writeText(window.location.href)} className="border border-[#c6a049]/50 rounded-lg px-5 py-3 text-sm text-[#f0c453] hover:bg-white/5">Скопировать ссылку</button>
                                <Link href="/numbers" className="border border-white/20 rounded-lg px-5 py-3 text-sm hover:bg-white/5">Другое число</Link>
                            </div>
                        </div>
                    </section>
                )}
                {searched && !selected && <div className="max-w-3xl mx-auto px-5 pb-12 text-center"><div className="rounded-2xl border border-[#c6a049]/30 bg-[#201c14] p-7"><h2 className="text-2xl text-[#f0c453] mb-3">Число {searched} пока не описано</h2><p className="text-[#bcb2a0]">Для него ещё нет авторского толкования. Выбери одно из опубликованных чисел ниже или попробуй другое сочетание.</p></div></div>}
                {!selected && (
                    <section className="max-w-5xl mx-auto px-5 pb-14">
                        <div className="border-t border-[#d9b65c]/15 pt-10 text-center">
                            <h2 className="text-2xl md:text-3xl font-semibold mb-3">Начни с числа, которое заметил</h2>
                            <p className="text-[#a9a293] mb-8">Популярные сочетания и их символические темы</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {featured.map(item=>(
                                    <Link key={item.number} href={'/numbers/'+item.number} data-analytics={'Числа · '+item.number}
                                        className="group rounded-2xl border border-[#c6a049]/20 bg-[#201c14] px-4 py-6 hover:border-[#f0c453]/70 hover:-translate-y-1 transition-all">
                                        <div className="text-3xl md:text-4xl text-[#f0c453] font-serif mb-2 group-hover:text-[#ffdf86]">{item.number}</div>
                                        <div className="text-sm text-[#bcb2a0]">{item.title}</div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
                <section className="max-w-3xl mx-auto px-5 pb-20 text-center">
                    <div className="rounded-2xl border border-[#d9b65c]/15 bg-white/[0.025] p-7">
                        <h2 className="text-xl font-semibold mb-3">Не ищи готового ответа. Замечай себя.</h2>
                        <p className="text-[#aaa393] leading-7 mb-6">На бесплатном трёхдневном практикуме «Познай СЕБЯ» мы исследуем внимание, привычные роли и внутренний выбор.</p>
                        <Link href="/editoria" data-analytics="Числа · перейти к практикуму" className="inline-flex bg-[#f0c54e] text-[#17130c] font-semibold px-6 py-3 rounded-xl hover:bg-[#ffda73] transition-colors">Узнать о практикуме →</Link>
                    </div>
                    <p className="mt-9 text-xs text-[#8f887a] leading-6">Толкования — авторские символические размышления, а не научные факты, предсказания или сообщения от сверхъестественных сил. Совпадения чисел могут возникать случайно.</p>
                </section>
            </main>
        </div>
    );
}
