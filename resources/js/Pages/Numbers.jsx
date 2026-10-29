import React, { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

const digitsOnly = value => value.replace(/[^0-9]/g, '').slice(0, 12);

export default function Numbers() {
    const { special = [], ordinary = [], catalogPage = 1, catalogPages = 10, selected = null, searched = null, settings = null } = usePage().props;
    const [value, setValue] = useState(selected?.number || searched || '');
    const [copied, setCopied] = useState(false);
    const [clockNow, setClockNow] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    useEffect(() => {
        const updateClock = () => setClockNow(new Date());
        updateClock();
        const timer = setInterval(updateClock, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (now, format) => {
        if (!now) return '—:—';
        const hour = format === '12' ? (now.getHours() % 12 || 12) : now.getHours();
        const digits = String(hour).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
        return format === '12' ? digits + (now.getHours() >= 12 ? ' PM' : ' AM') : digits;
    };

    const selectCurrentTime = format => {
        const now = new Date();
        const hour = format === '12' ? (now.getHours() % 12 || 12) : now.getHours();
        setValue(String(hour).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0'));
    };

    const visibleGroups = result?.input === value ? result.groups : [];
    const uniqueGroups = visibleGroups.reduce((acc, group) => {
        const key = group.meaning?.number ?? String(Number(group.digits));
        const existing = acc.find(item => item.key === key);
        if (existing) {
            existing.count += 1;
            existing.variants.push(group.digits);
        } else {
            acc.push({ ...group, key, count: 1, variants: [group.digits] });
        }
        return acc;
    }, []);
    const copyLink = async () => {
        const link = window.location.origin + '/numbers/' + encodeURIComponent(value);
        try { await navigator.clipboard.writeText(link); setCopied(true); } catch (_) { setCopied(false); }
    };
    useEffect(() => { setCopied(false); }, [value]);
    const parts = meaning => [
        ['Символика', meaning?.symbolism],
        ['Светлая сторона', meaning?.light_side],
        ['Теневая сторона', meaning?.shadow_side],
        ['Вопрос к себе', meaning?.reflection_question],
        ['Практика', meaning?.practice],
    ];
    return (
        <div className="numbers-page min-h-screen bg-[#14120d] text-[#f8f4e9] selection:bg-[#e7b945]/30">
            <Head title={selected ? selected.number + ' — ' + selected.title + ' | Язык чисел' : 'Язык чисел — символы для самопознания'}><meta name="description" content="Авторские символические интерпретации чисел, вопросы к себе и практики внимания. Без предсказаний." /></Head>
            <header className="border-b border-[#d9b65c]/15">
                <div className="max-w-6xl mx-auto px-5 py-6 flex items-center justify-between gap-4">
                    <Link href="/" className="flex items-center gap-3" aria-label="На главную"><span className="sr-only">{settings?.site_name || "На главную"}</span>{settings?.logo ? <img src={settings.logo} alt={settings?.site_name || "Логотип сайта"} className="h-10 w-auto max-w-[180px] object-contain" /> : <span className="text-[#f4c74c] italic text-2xl font-serif tracking-wide">Arutyun</span>}</Link>
                    <Link href="/editoria" className="text-sm text-[#e9d5a4] hover:text-[#f4c74c] transition-colors whitespace-nowrap">Бесплатный практикум →</Link>
                </div>
            </header>
            <main>
                <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-8">
                    <div className="mb-7">
                        <p className="text-xs tracking-[0.22em] uppercase text-[#d5ab4a] mb-2">Пространство самопознания</p>
                        <h1 className="text-3xl sm:text-5xl font-serif font-semibold mb-2">Язык <span className="italic text-[#f0c453]">чисел</span></h1>
                        <p className="text-sm sm:text-base text-[#bdb4a3]">Число — повод остановиться и задать себе вопрос, а не предсказание.</p>
                    </div>
                    <div className="grid lg:grid-cols-[minmax(0,1fr)_240px] gap-4 lg:gap-x-5 items-start">
                        <div className="min-w-0 lg:col-start-1 lg:row-start-1">
                            <div className="relative">
                                <label htmlFor="number-search" className="sr-only">Введите число</label>
                                <span aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d5ab4a] text-xl">⌕</span>
                                <input id="number-search" inputMode="numeric" pattern="[0-9]*" value={value}
                                    onChange={e => setValue(digitsOnly(e.target.value))}
                                    placeholder="Введите число, например 1234567"
                                    className="w-full rounded-xl border border-[#b88f37]/35 bg-[#201c14] pl-12 pr-12 py-3.5 text-lg text-white placeholder:text-[#8e877a] focus:outline-none focus:ring-2 focus:ring-[#eac04f]" />
                                {value && <button type="button" aria-label="Очистить поиск" onClick={() => setValue('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a9a293] hover:text-white">×</button>}
                            </div>
                        </div>
                        <aside className="lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:self-start rounded-2xl border border-[#d9b65c]/20 bg-[#1d1a13] p-4 lg:sticky lg:top-6">
                            <p className="text-xs uppercase tracking-[0.14em] text-[#d5ab4a] mb-3">Числа на часах</p>
                            <div className="grid grid-cols-2 gap-2">
                                {['24', '12'].map(format => (
                                    <button key={format} type="button" onClick={() => selectCurrentTime(format)}
                                        aria-label={'Подставить текущее время в ' + format + '-часовом формате'}
                                        className="number-clock-button min-w-0 rounded-xl border border-[#b88f37]/35 bg-[#241f16] px-2 py-3 text-center text-[#f0c453] hover:border-[#f0c453] hover:bg-[#302719] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453] transition-colors">
                                        <span className="block text-[10px] text-[#bdb4a3] mb-1">{format === '24' ? '24 часа' : '12 часов'}</span>
                                        <span className="block text-lg sm:text-xl font-serif tabular-nums whitespace-nowrap">{formatTime(clockNow, format)}</span>
                                    </button>
                                ))}
                            </div>
                            <p className="text-xs text-[#a9a293] mt-2 leading-5">Нажми на нужный формат времени — число сразу появится в поиске.</p>
                        </aside>
                        <div className="min-w-0 lg:col-start-1 lg:row-start-2 space-y-4">
                            {value && (
                                <div className="flex flex-wrap items-center gap-3">
                                    <h2 className="text-3xl sm:text-4xl font-serif font-semibold break-all">{value}</h2>
                                    <button type="button" onClick={copyLink} className="text-sm text-[#d5ab4a] hover:text-[#ffdb70]">{copied ? 'Ссылка скопирована ✓' : 'Поделиться ↗'}</button>
                                </div>
                            )}
                            {!value && <p className="text-sm text-[#a9a293]">Толкование появится сразу при вводе числа.</p>}
                            {loading && <p role="status" className="text-sm text-[#d5ab4a]">Подбираем толкование…</p>}
                            {error && <p role="alert" className="text-sm text-[#f1a7a7]">{error}</p>}
                            {!loading && !error && visibleGroups.length > 0 && (
                                <div className="space-y-8" aria-live="polite">
                                    {uniqueGroups.map((group, index) => (
                                        <article key={index} className="border-b border-[#d9b65c]/15 pb-7 last:border-0">
                                            <div className="flex flex-wrap items-baseline gap-3 mb-1"><h3 className="text-3xl font-serif font-bold text-[#f0c453]">{group.digits}</h3>{group.count > 1 && <span className="text-xs text-[#c8b894]">Повторяется {group.count} раза</span>}</div>
                                            {group.meaning ? (
                                                <>
                                                    <p className="font-semibold text-lg text-[#f8f4e9] mb-4">{group.meaning.title}</p>
                                                    <div className="space-y-4">
                                                        {parts(group.meaning).filter(([, body]) => body).map(([title, body]) => (
                                                            <div key={title}>
                                                                <h4 className="text-xs uppercase tracking-wider text-[#d5ab4a] font-semibold mb-1">{title}</h4>
                                                                <p className="text-[#e0d9cc] leading-7 whitespace-pre-line">{body}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </>
                                            ) : <p className="text-[#bcb2a0]">Для этого фрагмента пока нет опубликованного толкования.</p>}
                                        </article>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
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
                                        className="number-special-card group rounded-2xl border border-[#d3aa4a]/35 bg-gradient-to-br from-[#292216] to-[#1d1a14] px-4 py-6 hover:border-[#f0c453]/80 hover:-translate-y-1 transition-all">
                                        <div className="number-special-card__number text-3xl md:text-4xl text-[#f0c453] font-serif mb-2">{item.number}</div>
                                        <div className="number-special-card__title text-sm text-[#bcb2a0]">{item.title}</div>
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
                                        className={'number-range-link rounded-lg border px-3 py-2 text-sm transition-colors '+(page===catalogPage?'border-[#f0c453] bg-[#f0c453] text-[#17130c]':'border-[#c6a049]/25 text-[#e1d2af] hover:border-[#f0c453]')}>
                                        {(page-1)*100+1}–{Math.min(999,page*100)}
                                    </Link>
                                ))}
                            </nav>
                            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                                {ordinary.map(item=>(
                                    <Link key={item.number} href={'/numbers/'+item.number} data-analytics={'Числа · каталог '+item.number}
                                        className="number-catalog-card group rounded-xl border border-[#c6a049]/15 bg-[#201c14] px-3 py-4 text-center hover:border-[#f0c453]/70 hover:bg-[#2a2317] transition-all">
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
                    <div className="numbers-cta rounded-2xl border border-[#d9b65c]/15 bg-white/[0.025] p-7">
                        <h2 className="text-xl font-semibold mb-3">Не ищи готового ответа. Замечай себя.</h2>
                        <p className="text-[#aaa393] leading-7 mb-6">На бесплатном трёхдневном практикуме «Познай СЕБЯ» мы исследуем внимание, привычные роли и внутренний выбор.</p>
                        <Link href="/editoria" data-analytics="Числа · перейти к практикуму" className="numbers-cta-button inline-flex bg-[#f0c54e] text-[#17130c] font-semibold px-6 py-3 rounded-xl hover:bg-[#ffda73] transition-colors">Узнать о практикуме →</Link>
                    </div>
                    <p className="mt-9 text-xs text-[#8f887a] leading-6">Толкования — авторские символические размышления, а не научные факты, предсказания или сообщения от сверхъестественных сил. Совпадения чисел могут возникать случайно.</p>
                </section>
            </main>
        </div>
    );
}
