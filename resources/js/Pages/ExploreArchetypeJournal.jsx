import React, { useEffect, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ArchetypeJournalPanel from '../components/ArchetypeJournalPanel';
import { readJournal } from '../lib/archetypeJournal';

export default function ExploreArchetypeJournal() {
    const { settings = {} } = usePage().props;
    const [entries, setEntries] = useState(readJournal);
    useEffect(() => {
        const refresh = () => setEntries(readJournal());
        window.addEventListener('storage', refresh);
        window.addEventListener('pageshow', refresh);
        return () => { window.removeEventListener('storage', refresh); window.removeEventListener('pageshow', refresh); };
    }, []);
    const exportJournal = () => {
        const data = JSON.stringify({ format: 'arutyun-archetype-journal', version: 1, exportedAt: new Date().toISOString(), entries }, null, 2);
        const url = URL.createObjectURL(new Blob([data], { type: 'application/json;charset=utf-8' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = 'arutyun-archetype-journal-' + new Date().toISOString().slice(0,10) + '.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 500);
    };
    return <div className="min-h-screen bg-[#14120d] text-[#f8f4e9]">
        <Head title="Мой журнал архетипов — Arutyun">
            <meta name="description" content="Личный журнал наблюдений за привычными реакциями и архетипами. Записи доступны только в твоём браузере." />
        </Head>
        <header className="border-b border-[#b99347]/25">
            <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-5">
                <Link href="/" aria-label="На главную">{settings?.logo ? <img src={settings.logo} alt={settings?.site_name || 'Arutyun'} className="h-10 max-w-[160px] object-contain" /> : <span className="font-serif text-2xl italic text-[#f0c453]">Arutyun</span>}</Link>
                <Link href="/explore/archetypes#journal" className="text-sm text-[#e4c88c] hover:text-white">← Язык архетипов</Link>
            </div>
        </header>
        <main className="mx-auto max-w-5xl px-5 pb-20 pt-12 sm:pt-16">
            <p className="text-xs font-semibold uppercase tracking-[.19em] text-[#f0c453]">Моё пространство наблюдения</p>
            <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Журнал <span className="italic text-[#f0c453]">архетипов</span></h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-[#c4b9a6]">Это не досье на личность, а записи о том, что ты заметил в себе. Через несколько дней можно вернуться и увидеть не «какой ты», а какие импульсы стали узнаваемыми.</p>
            <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/explore/archetypes#daily" className="rounded-xl bg-[#f0c453] px-5 py-3 text-sm font-semibold text-[#21180b] hover:bg-[#ffda7b]">Новое наблюдение →</Link>
                <Link href="/explore/archetypes/mirror" className="rounded-xl border border-[#96784a] px-5 py-3 text-sm text-[#f0c453] hover:border-[#f0c453]">Пройти полную карту →</Link>
                <button type="button" onClick={exportJournal} disabled={entries.length === 0} className="rounded-xl border border-[#96784a] px-5 py-3 text-sm text-[#f0c453] hover:border-[#f0c453] disabled:cursor-not-allowed disabled:opacity-40">Скачать мои записи (JSON)</button>
            </div>
            <div className="mt-10"><ArchetypeJournalPanel full entries={entries} onChanged={setEntries} /></div>
            <p className="mt-8 rounded-xl border border-[#806638]/60 p-5 text-sm leading-7 text-[#a99d88]">Записи остаются только в браузере. Если очистить данные сайта или перейти на другое устройство, журнал не перенесётся автоматически. Сохраняй копию через кнопку выше, если записи для тебя важны. Экспорт — только скачивание; загрузка файла обратно пока не предусмотрена.</p>
        </main>
    </div>;
}
