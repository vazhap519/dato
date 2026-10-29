import React, { useMemo, useState } from 'react';
import { Link } from '@inertiajs/react';
import { deleteJournalEntry, formatJournalDate } from '../lib/archetypeJournal';

const button = 'rounded-xl border border-[#8c7247]/60 px-3 py-2 text-sm transition hover:border-[#f0c453] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#f0c453]';

export default function ArchetypeJournalPanel({ entries = [], onChanged, full = false }) {
    const [filter, setFilter] = useState('all');
    const [error, setError] = useState('');
    const situations = entries.filter(item => item.kind === 'situation');
    const counts = useMemo(() => {
        const bySlug = {};
        for (const entry of situations) {
            if (entry.slug) {
                bySlug[entry.slug] ??= { title: entry.roleTitle || entry.slug, count: 0 };
                bySlug[entry.slug].count += 1;
            }
        }
        return Object.values(bySlug).sort((a, b) => b.count - a.count);
    }, [entries]);
    const visible = (filter === 'all' ? entries : entries.filter(item => item.kind === filter))
        .slice(0, full ? 120 : 4);

    const remove = id => {
        if (!window.confirm('Удалить эту запись только из журнала этого браузера?')) return;
        const result = deleteJournalEntry(id);
        if (result.ok) {
            setError('');
            onChanged?.(result.entries);
        } else setError('Не удалось удалить запись в этом браузере.');
    };

    return <div className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#7e643d]/60 bg-[#211d15] p-5">
                <p className="text-xs uppercase tracking-wider text-[#e5bc62]">Всего записей</p>
                <p className="mt-3 font-serif text-4xl text-[#fff7e8]">{entries.length}</p>
            </div>
            <div className="rounded-2xl border border-[#7e643d]/60 bg-[#211d15] p-5">
                <p className="text-xs uppercase tracking-wider text-[#e5bc62]">Ситуаций исследовано</p>
                <p className="mt-3 font-serif text-4xl text-[#fff7e8]">{situations.length}</p>
            </div>
            <div className="rounded-2xl border border-[#7e643d]/60 bg-[#211d15] p-5">
                <p className="text-xs uppercase tracking-wider text-[#e5bc62]">Полных карт</p>
                <p className="mt-3 font-serif text-4xl text-[#fff7e8]">{entries.filter(item => item.kind === 'mirror').length}</p>
            </div>
        </div>

        {counts.length > 0 && <div className="rounded-2xl border border-[#7e643d]/60 bg-[#211d15] p-5 sm:p-7">
            <h3 className="font-serif text-2xl text-[#fff7e8]">Какие роли ты чаще замечал?</h3>
            <p className="mt-2 text-sm leading-6 text-[#b9ac98]">Количество сохранённых наблюдений по отдельным ситуациям. Это не рейтинг личности: выборка зависит от того, какие ситуации ты исследовал.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {counts.slice(0, 8).map((item, index) => <div key={item.title}>
                    <div className="flex justify-between gap-3 text-sm"><span>{item.title}</span><span className="text-[#e5bc62]">{item.count}</span></div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#14120d]"><div className="h-full rounded-full bg-[#e5bc62]" style={{ width: ((item.count / situations.length) * 100) + '%' }} /></div>
                </div>)}
            </div>
        </div>}

        <div>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-serif text-2xl text-[#fff7e8]">Мои наблюдения</h3>
                {!full && <Link href="/explore/archetypes/journal" className="text-sm text-[#f0c453] underline underline-offset-4 hover:text-white">Открыть весь журнал →</Link>}
            </div>
            {full && <div className="mt-4 flex flex-wrap gap-2" aria-label="Фильтр записей">
                {[['all','Все'],['situation','Ситуации'],['mirror','Полные карты']].map(([value,label]) => <button type="button" key={value} onClick={() => setFilter(value)} aria-pressed={filter === value} className={button + (filter === value ? ' border-[#f0c453] bg-[#42311b]' : '')}>{label}</button>)}
            </div>}
            {error && <p role="alert" className="mt-4 text-sm text-[#f4a99b]">{error}</p>}
            {entries.length === 0 ? <div className="mt-5 rounded-2xl border border-dashed border-[#7e643d] p-7 text-center">
                <p className="font-serif text-xl">Здесь ещё нет записей</p>
                <p className="mt-2 text-sm leading-6 text-[#b9ac98]">Выбери реакцию в «Зеркале дня» и сохрани наблюдение. Записи останутся в этом браузере.</p>
                <Link href="/explore/archetypes#daily" className="mt-5 inline-block rounded-xl bg-[#f0c453] px-5 py-3 text-sm font-semibold text-[#21180b]">Начать наблюдение →</Link>
            </div> : visible.length === 0 ? <p className="mt-5 text-sm text-[#b9ac98]">Записей этого вида пока нет.</p> :
            <div className="mt-5 grid gap-3">
                {visible.map(entry => <article key={entry.id} className="rounded-2xl border border-[#7e643d]/60 bg-[#211d15] p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p className="text-xs uppercase tracking-wider text-[#e5bc62]">{entry.kind === 'mirror' ? 'Зеркало архетипов · полная карта' : (entry.category || 'Ситуация')}</p>
                            <h4 className="mt-2 font-serif text-xl text-[#fff7e8]">{entry.kind === 'mirror' ? 'Моя карта реакций' : entry.situationTitle}</h4>
                            <p className="mt-1 text-xs text-[#aa9b85]">{formatJournalDate(entry.createdAt)}</p>
                        </div>
                        <button type="button" className="text-xs text-[#d6aa9e] underline underline-offset-4 hover:text-white" onClick={() => remove(entry.id)} aria-label="Удалить запись">Удалить</button>
                    </div>
                    {entry.kind === 'situation' ? <>
                        <p className="mt-3 text-sm leading-6 text-[#b9ac98]">{entry.question}</p>
                        <p className="mt-3 text-sm leading-6"><span className="text-[#e5bc62]">{entry.roleTitle}:</span> {entry.answer}</p>
                        {entry.note && <blockquote className="mt-4 border-l-2 border-[#e5bc62] pl-4 text-sm italic leading-6 text-[#e1d5c3]">{entry.note}</blockquote>}
                    </> : <>
                        <p className="mt-3 text-sm leading-6 text-[#b9ac98]">По 20 выбранным реакциям чаще проявились:</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                            {(entry.topRoles || []).map(role => <span key={role.slug} className="rounded-full border border-[#8c7247]/60 px-3 py-1 text-xs text-[#e9d7b3]">{role.title}: {role.score} из 20</span>)}
                        </div>
                    </>}
                </article>)}
            </div>}
        </div>
        <p className="text-xs leading-6 text-[#a99d88]">Все записи этого журнала хранятся только в локальном хранилище текущего браузера. В другом браузере или после очистки данных сайта их не будет. Максимум — 120 последних записей.</p>
    </div>;
}
