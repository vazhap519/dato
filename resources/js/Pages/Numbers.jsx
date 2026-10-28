import React, { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

const digitsOnly = value => value.replace(/[^0-9]/g, '').slice(0, 12);

export default function Numbers() {
    const { special = [], ordinary = [], catalogPage = 1, catalogPages = 10, selected = null, searched = null } = usePage().props;
    const [value, setValue] = useState(selected?.number || searched || '');
    const [timeMode, setTimeMode] = useState(false);
    const [localTime, setLocalTime] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!timeMode) return undefined;
        const update = () => {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            setLocalTime(hours + ':' + minutes);
            setValue(hours + minutes);
        };
        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, [timeMode]);

    useEffect(() => {
        if (!value) {
            setResult(null);
            setLoading(false);
            setError('');
            return undefined;
        }
        const controller = new AbortController();
        setLoading(true);
        setError('');
        const timer = setTimeout(async () => {
            try {
                const response = await fetch('/numbers/lookup/' + encodeURIComponent(value), {
                    headers: { Accept: 'application/json' },
                    signal: controller.signal,
                });
                if (!response.ok) throw new Error('Не удалось получить толкование');
                setResult(await response.json());
            } catch (err) {
                if (err.name !== 'AbortError') setError('Не удалось загрузить толкование. Попробуй ещё раз.');
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }, 250);
        return () => { clearTimeout(timer); controller.abort(); };
    }, [value]);

    const visibleGroups = result?.input === value ? result.groups : [];
    const parts = meaning => [
        ['Символика', meaning?.symbolism],
        ['Светлая сторона', meaning?.light_side],
        ['Теневая сторона', meaning?.shadow_side],
        ['Вопрос к себе', meaning?.reflection_question],
        ['Практика', meaning?.practice],
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
                        <div className="max-w-lg mx-auto mt-10 space-y-4">
                            <div className="flex flex-wrap justify-center gap-3">
                                <button type="button" onClick={() => { setTimeMode(false); setValue(''); }} aria-pressed={!timeMode}
                                    className={'rounded-xl border px-5 py-3 text-sm transition-colors ' + (!timeMode ? 'bg-[#f0c54e] text-[#19140b] border-[#f0c54e]' : 'border-[#b88f37]/40 text-[#e9d5a4]')}>Ввести число</button>
                                <button type="button" onClick={() => setTimeMode(true)} aria-pressed={timeMode}
                                    className={'rounded-xl border px-5 py-3 text-sm transition-colors ' + (timeMode ? 'bg-[#f0c54e] text-[#19140b] border-[#f0c54e]' : 'border-[#b88f37]/40 text-[#e9d5a4]')}>По моему времени</button>
                            </div>
                            {timeMode ? (
                                <div className="rounded-xl border border-[#b88f37]/40 bg-white/5 px-5 py-4">
                                    <div className="text-4xl font-serif text-[#f0c453] tabular-nums">{localTime || '—:—'}</div>
                                    <p className="mt-2 text-xs text-[#a9a293]">Локальное время твоего устройства · обновляется автоматически</p>
                                </div>
                            ) : (
                                <>
                                    <label htmlFor="number-search" className="sr-only">Введите число</label>
                                    <input id="number-search" inputMode="numeric" pattern="[0-9]*" value={value}
                                        onChange={e => setValue(digitsOnly(e.target.value))}
                                        placeholder="Например, 111, 1212, 123456"
                                        className="w-full min-w-0 rounded-xl border border-[#b88f37]/40 bg-white/5 px-5 py-4 text-lg text-white placeholder:text-[#8e877a] focus:outline-none focus:ring-2 focus:ring-[#eac04f]" />
                                </>
                            )}
                            <p className="text-xs text-[#a9a293]">Толкование появляется автоматически. Длинные числа делятся на группы по 2–3 цифры.</p>
                        </div>
                    </div>
                </section>
                {value && (
                    <section className="max-w-5xl mx-auto px-5 pb-16" aria-live="polite">
                        {loading && <p className="text-center text-[#d5ab4a] mb-4">Подбираем толкование…</p>}
                        {error && <p role="alert" className="text-center text-[#f1a7a7] mb-4">{error}</p>}
                        {!loading && !error && visibleGroups.length > 0 && (
                            <div className="space-y-6">
                                {visibleGroups.length > 1 && <div className="text-center text-[#d5ab4a] text-lg">
                                    {visibleGroups.map(group => group.digits).join(' · ')}
                                </div>}
                                {visibleGroups.map((group, index) => (
                                    <div key={index} className="rounded-3xl border border-[#c6a049]/25 bg-[#1d1a13] p-7 md:p-12">
                                        <p className="text-center text-[#d5ab4a] text-xs uppercase tracking-[0.2em] mb-3">
                                            {visibleGroups.length > 1 ? 'Часть ' + (index + 1) + ' из ' + visibleGroups.length : 'Символическое толкование'}
                                        </p>
                                        <div className="text-center text-6xl md:text-8xl font-serif text-[#f0c453] mb-3 break-all">{group.digits}</div>
                                        {group.meaning ? (
                                            <>
                                                <h2 className="text-center text-2xl md:text-3xl font-semibold mb-10">{group.meaning.title}</h2>
                                                <div className="grid md:grid-cols-2 gap-5">
                                                    {parts(group.meaning).filter(([, body]) => body).map(([title, body], i) => (
                                                        <article key={title} className={(i === 0 ? 'md:col-span-2 ' : '') + 'rounded-2xl border border-white/10 bg-white/[0.035] p-6'}>
                                                            <h3 className="text-[#f0c453] text-sm uppercase tracking-wider font-semibold mb-3">{title}</h3>
                                                            <p className="text-[#e0d9cc] leading-7 whitespace-pre-line">{body}</p>
                                                        </article>
                                                    ))}
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-center text-[#bcb2a0]">Для этого фрагмента пока нет опубликованного толкования.</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}
                {!value && (
                    <div className="max-w-5xl mx-auto px-5 pb-14 space-y-14">
                        <section className="border-t border-[#d9b65c]/15 pt-10">
                            <div className="text-center mb-8">
                                <p className="text-[#d5ab4a] text-xs tracking-[0.2em] uppercase mb-3">Особые сочетания</p>
                                <h2 className="text-2xl md:text-3xl font-semibold mb-3">Повторяющиеся и зеркальные числа</h2>
                                <p className="text-[#a9a293]">Популярные комбинации с отдельными авторскими толкованиями</p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {special.map(item => (
                                    <Link key={item.number} href={'/numbers/' + item.number} data-analytics={'Числа · особое ' + item.number}
                                        className="group rounded-2xl border border-[#d3aa4a]/35 bg-gradient-to-br from-[#292216] to-[#1d1a14] px-4 py-6 hover:border-[#f0c453]/80 hover:-translate-y-1 transition-all">
                                        <div className="text-3xl md:text-4xl text-[#f0c453] font-serif mb-2">{item.number}</div>
                                        <div className="text-sm text-[#bcb2a0]">{item.title}</div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                        <section id="catalog" className="border-t border-[#d9b65c]/15 pt-10">
                            <div className="text-center mb-8">
                                <p className="text-[#d5ab4a] text-xs tracking-[0.2em] uppercase mb-3">Полный справочник</p>
                                <h2 className="text-2xl md:text-3xl font-semibold mb-3">Все остальные числа от 1 до 999</h2>
                                <p className="text-[#a9a293]">Символические размышления на основе сочетания цифр. Уже представленные выше числа не повторяются.</p>
                            </div>
                            <nav aria-label="Диапазоны чисел" className="flex flex-wrap justify-center gap-2 mb-7">
                                {Array.from({length:catalogPages},(_,i)=>i+1).map(page=>(
                                    <Link key={page} href={'/numbers?page='+page+'#catalog'} preserveScroll={false}
                                        className={'rounded-lg border px-3 py-2 text-sm transition-colors '+(page===catalogPage?'border-[#f0c453] bg-[#f0c453] text-[#17130c]':'border-[#c6a049]/25 text-[#e1d2af] hover:border-[#f0c453]')}>
                                        {(page-1)*100+1}–{Math.min(999,page*100)}
                                    </Link>
                                ))}
                            </nav>
                            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                                {ordinary.map(item=>(
                                    <Link key={item.number} href={'/numbers/'+item.number} data-analytics={'Числа · каталог '+item.number}
                                        className="group rounded-xl border border-[#c6a049]/15 bg-[#201c14] px-3 py-4 text-center hover:border-[#f0c453]/70 hover:bg-[#2a2317] transition-all">
                                        <div className="text-2xl md:text-3xl text-[#e9bd51] font-serif group-hover:text-[#ffdf86]">{item.number}</div>
                                    </Link>
                                ))}
                            </div>
                            <div className="mt-7 flex items-center justify-center gap-4 text-sm">
                                {catalogPage>1 && <Link href={'/numbers?page='+(catalogPage-1)+'#catalog'} className="text-[#f0c453] hover:underline">← Предыдущие</Link>}
                                <span className="text-[#a9a293]">{catalogPage} из {catalogPages}</span>
                                {catalogPage<catalogPages && <Link href={'/numbers?page='+(catalogPage+1)+'#catalog'} className="text-[#f0c453] hover:underline">Следующие →</Link>}
                            </div>
                        </section>
                    </div>
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
