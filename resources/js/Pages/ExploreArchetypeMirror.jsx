import React, { useEffect, useMemo, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import mirrorDefinition from '../../data/archetype-mirror-questions.json';
import { saveJournalEntry } from '../lib/archetypeJournal';

const QUESTIONS = mirrorDefinition.questions;
const MIRROR_VERSION = mirrorDefinition.version;
const RECEIPT_KEY = 'arutyun-archetype-mirror-receipt-' + MIRROR_VERSION;
const STORAGE_KEY = 'arutyun-archetype-mirror-v1';
const readSaved = () => {
    try {
        const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}');
        return Array.isArray(saved.answers) && saved.answers.length === QUESTIONS.length
            ? saved.answers.map((n, i) => Number.isInteger(n) && n >= 0 && n < QUESTIONS[i].options.length ? n : null)
            : Array(QUESTIONS.length).fill(null);
    } catch { return Array(QUESTIONS.length).fill(null); }
};

export default function ExploreArchetypeMirror() {
    const { archetypes = [], settings = {} } = usePage().props;
    const [answers, setAnswers] = useState(readSaved);
    const [step, setStep] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [shareStatus, setShareStatus] = useState('idle');
    const [journalStatus, setJournalStatus] = useState('idle');
    const [submissionId, setSubmissionId] = useState(() => {
        try {
            const existing = sessionStorage.getItem(RECEIPT_KEY);
            if (existing && /^[0-9a-f-]{36}$/i.test(existing)) return existing;
            const id = crypto.randomUUID();
            sessionStorage.setItem(RECEIPT_KEY, id);
            return id;
        } catch { return crypto.randomUUID(); }
    });
    useEffect(() => {
        try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ answers })); } catch {}
    }, [answers]);
    const answered = answers.filter(v => v !== null).length;
    const complete = answered === QUESTIONS.length;
    const scores = useMemo(() => {
        const totals = Object.fromEntries(archetypes.map(a => [a.slug, 0]));
        answers.forEach((answer, i) => {
            if (answer !== null) {
                const slug = QUESTIONS[i].options[answer].slug;
                if (slug in totals) totals[slug] += 1;
            }
        });
        return archetypes.map(a => ({ ...a, score: totals[a.slug] || 0 }))
            .sort((a,b) => b.score - a.score || a.id - b.id);
    }, [answers, archetypes]);
    const choose = index => setAnswers(prev => prev.map((v,i) => i === step ? index : v));
    const restart = () => {
        setAnswers(Array(QUESTIONS.length).fill(null));
        setStep(0);
        setShowResults(false);
        setShareStatus('idle');
        setJournalStatus('idle');
        const id = crypto.randomUUID();
        setSubmissionId(id);
        try { sessionStorage.setItem(RECEIPT_KEY, id); } catch {}
    };
    const submitAnonymousStats = async () => {
        if (!complete || shareStatus === 'sending' || shareStatus === 'sent') return;
        setShareStatus('sending');
        try {
            const response = await fetch('/explore/archetypes/mirror/statistics', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                },
                body: JSON.stringify({
                    version: MIRROR_VERSION,
                    submission_id: submissionId,
                    answers,
                }),
            });
            if (!response.ok) throw new Error('Не удалось сохранить статистику');
            setShareStatus('sent');
        } catch {
            setShareStatus('error');
        }
    };
    const finish = () => {
        if (!complete) return;
        setShowResults(true);
        const saved = saveJournalEntry({
            id: 'mirror:' + submissionId,
            kind: 'mirror',
            surveyVersion: MIRROR_VERSION,
            topRoles: scores.slice(0, 3).map(item => ({ slug: item.slug, title: item.title, score: item.score })),
        });
        setJournalStatus(saved.ok ? 'saved' : 'error');
        void submitAnonymousStats();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const button = 'rounded-xl border border-[#a78a51]/50 px-5 py-3 text-sm transition hover:border-[#f0c453] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453]';
    return <div data-no-analytics className="min-h-screen bg-[#14120d] text-[#f8f4e9]">
        <Head title="Зеркало архетипов — Arutyun">
            <meta name="description" content="20 жизненных ситуаций, чтобы исследовать свои привычные реакции и увидеть персональную карту архетипов." />
        </Head>
        <header className="border-b border-[#b99347]/25">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-5">
                <Link href="/" aria-label="На главную">{settings?.logo ? <img src={settings.logo} alt={settings?.site_name || 'Arutyun'} className="h-10 max-w-[160px] object-contain" /> : <span className="font-serif text-2xl italic text-[#f0c453]">Arutyun</span>}</Link>
                <Link href="/explore/archetypes" className="text-sm text-[#e4c88c] hover:text-white">Все архетипы →</Link>
            </div>
        </header>
        <main className="mx-auto max-w-5xl px-5 py-10 sm:py-16">
            <p className="text-xs uppercase tracking-[.2em] text-[#f0c453]">Интерактивное исследование</p>
            <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Зеркало <span className="italic text-[#f0c453]">архетипов</span></h1>
            <p className="mt-5 max-w-3xl leading-7 text-[#c4b9a6]">20 жизненных ситуаций. Выбирай не самый правильный или красивый ответ, а тот, который ближе к твоей обычной первой реакции. Здесь нет плохих ответов.</p>
            <p className="mt-3 max-w-3xl text-xs leading-6 text-[#a99d88]">После завершения ответы автоматически учитываются в общей статистике без сохранения отдельных анкет. <a href="/privacy" className="underline text-[#e4c88c] hover:text-white">Как используются данные</a>.</p>
            {archetypes.length === 0 ? <p className="mt-10 text-[#f0c453]">Исследование временно недоступно: архетипы не опубликованы.</p> : !showResults ? <section className="mt-10 rounded-3xl border border-[#a78a51]/50 bg-[#211d15] p-5 sm:p-9">
                <div className="flex items-center justify-between gap-4 text-xs text-[#e5bc62]">
                    <span>Ситуация {step + 1} из {QUESTIONS.length}</span><span>{answered} ответов из {QUESTIONS.length}</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#14120d]" role="progressbar" aria-valuenow={answered} aria-valuemin={0} aria-valuemax={QUESTIONS.length} aria-label="Прогресс исследования">
                    <div className="h-full rounded-full bg-[#f0c453] transition-all" style={{ width: (answered / QUESTIONS.length * 100) + '%' }} />
                </div>
                <h2 className="mt-9 font-serif text-2xl leading-snug sm:text-3xl">{QUESTIONS[step].text}</h2>
                <fieldset className="mt-7 grid gap-3">
                    <legend className="sr-only">Выбери наиболее близкую реакцию</legend>
                    {QUESTIONS[step].options.map((option,index) => <button type="button" key={index} aria-pressed={answers[step] === index} onClick={() => choose(index)}
                        className={`w-full rounded-xl border p-4 text-left leading-6 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453] ${answers[step] === index ? 'border-[#f0c453] bg-[#3b2d19] text-white' : 'border-[#816a43]/50 bg-[#17140f] text-[#e0d5c3] hover:border-[#f0c453]'}`}>
                        <span className="mr-3 text-[#f0c453]">{String.fromCharCode(65 + index)}.</span>{option.label}
                    </button>)}
                </fieldset>
                <div className="mt-9 flex flex-wrap items-center justify-between gap-3">
                    <button type="button" disabled={step === 0} onClick={() => setStep(v => v-1)} className={button + ' disabled:cursor-not-allowed disabled:opacity-30'}>← Назад</button>
                    {step < QUESTIONS.length-1 ? <button type="button" disabled={answers[step] === null} onClick={() => setStep(v => v+1)} className="rounded-xl bg-[#f0c453] px-6 py-3 text-sm font-semibold text-[#21180b] disabled:cursor-not-allowed disabled:opacity-40">Далее →</button>
                    : <button type="button" disabled={!complete} onClick={finish} className="rounded-xl bg-[#f0c453] px-6 py-3 text-sm font-semibold text-[#21180b] disabled:cursor-not-allowed disabled:opacity-40">Увидеть мою карту →</button>}
                </div>

                {step === QUESTIONS.length-1 && !complete && <p className="mt-4 text-sm text-[#c4b9a6]">Чтобы увидеть карту, ответь на все вопросы. Ты можешь вернуться к предыдущим ситуациям.</p>}
            </section> : <section className="mt-10">
                <div className="rounded-3xl border border-[#a78a51]/50 bg-[#211d15] p-5 sm:p-9">
                    <p className="text-xs uppercase tracking-[.2em] text-[#f0c453]">Твоя карта реакций</p>
                    <h2 className="mt-3 font-serif text-3xl">Какие роли проявились чаще?</h2>
                    <p className="mt-4 leading-7 text-[#c4b9a6]">Каждый ответ добавляет один балл соответствующему образу. Это распределение 20 выбранных реакций, а не измерение личности или психологический диагноз.</p>
                    <div className="mt-8 grid gap-5">
                        {scores.map(item => <div key={item.slug}>
                            <div className="mb-2 flex items-center justify-between gap-3"><span className="font-serif text-lg">{item.title}</span><span className="text-sm text-[#e5bc62]">{item.score} из 20</span></div>
                            <div className="h-3 overflow-hidden rounded-full bg-[#14120d]"><div className="h-full rounded-full bg-gradient-to-r from-[#8c6828] to-[#f0c453]" style={{width: (item.score / QUESTIONS.length * 100) + '%'}} /></div>
                        </div>)}
                    </div>
                    <p className="mt-6 text-xs leading-6 text-[#a99d88]">Низкое число не означает отсутствие роли. В этом наборе ситуаций одни реакции могли встречаться чаще других. Карта служит поводом для размышления, а не сравнением с другими людьми.</p>
                </div>
                {shareStatus !== 'idle' && <p className="mt-4 text-sm text-[#c4b9a6]" role="status">
                    {shareStatus === 'sending' ? 'Добавляем выбранные варианты в общую статистику…' :
                     shareStatus === 'sent' ? 'Ответы учтены в общей статистике без сохранения отдельной анкеты.' :
                     shareStatus === 'error' ? <>Не удалось отправить статистику. Твоя карта при этом сохранена в браузере. <button type="button" onClick={() => void submitAnonymousStats()} className="underline text-[#f0c453]">Повторить отправку</button></> : ''}
                </p>}
                {journalStatus === 'saved' && <p className="mt-4 text-sm text-[#c1e0b1]">Краткая карта также сохранена в журнале этого браузера. <Link href="/explore/archetypes/journal" className="underline text-[#f0c453]">Посмотреть журнал →</Link></p>}
                {journalStatus === 'error' && <p className="mt-4 text-sm text-[#f4a99b]">Не удалось сохранить карту в журнале браузера. Серверная статистика работает отдельно.</p>}
                <div className="mt-7 grid gap-4 md:grid-cols-3">
                    {scores.slice(0,3).map((item,index) => <article key={item.slug} className="rounded-2xl border border-[#876b3b]/60 bg-[#211d15] p-5">
                        <p className="text-xs uppercase tracking-widest text-[#f0c453]">{index === 0 ? 'Чаще всего' : 'Также проявляется'}</p>
                        <h3 className="mt-3 font-serif text-2xl">{item.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-[#c4b9a6]">{item.description}</p>
                        <h4 className="mt-5 text-xs uppercase tracking-wider text-[#f0c453]">Сила</h4><p className="mt-2 text-sm leading-6">{item.strength}</p>
                        <h4 className="mt-5 text-xs uppercase tracking-wider text-[#f0c453]">Ловушка</h4><p className="mt-2 text-sm leading-6">{item.shadow}</p>
                        <h4 className="mt-5 text-xs uppercase tracking-wider text-[#f0c453]">Вопрос к себе</h4><p className="mt-2 text-sm leading-6">{item.question}</p>
                    </article>)}
                </div>
                <div className="mt-7 rounded-2xl border border-[#876b3b]/60 p-6">
                    <h3 className="font-serif text-2xl">Что делать с результатом?</h3>
                    <p className="mt-3 leading-7 text-[#c4b9a6]">Выбери одну из трёх часто проявляющихся ролей. В ближайшие сутки замечай, когда она включается, что ты чувствуешь перед действием и есть ли у тебя другой выбор.</p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <button type="button" onClick={() => window.print()} className={button}>Сохранить как PDF / печать</button>
                        <button type="button" onClick={restart} className={button}>Пройти заново</button>
                        <Link href="/explore/archetypes" className={button}>Исследовать ситуации →</Link>
                        <Link href="/explore/archetypes/journal" className={button}>Мой журнал →</Link>
                    </div>
                </div>
            </section>}
            <p className="mt-10 text-center text-xs leading-6 text-[#a99d88]">При завершении исследования ответы автоматически учитываются в общей статистике. Сервер хранит только суммарные показатели, а не отдельные анкеты или Telegram ID. Подробнее — в <a href="/privacy" className="underline text-[#e4c88c] hover:text-white">политике конфиденциальности</a>.</p>
        </main>
    </div>;
}
