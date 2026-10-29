// Personal reflections stay on the visitor's device. The daily journal never POSTs to the server.
export const JOURNAL_KEY = 'arutyun-archetype-journal-v1';
export const JOURNAL_LIMIT = 120;

export function localDay(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return [y, m, d].join('-');
}

export function dailySituationIndex(total, date = new Date()) {
    if (!total) return 0;
    const dayNumber = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
    return ((dayNumber % total) + total) % total;
}

export function readJournal() {
    try {
        const entries = JSON.parse(localStorage.getItem(JOURNAL_KEY) || '[]');
        if (!Array.isArray(entries)) return [];
        return entries.filter(entry =>
            entry && typeof entry === 'object' &&
            typeof entry.id === 'string' &&
            typeof entry.createdAt === 'string' &&
            (entry.kind === 'situation' || entry.kind === 'mirror')
        ).slice(0, JOURNAL_LIMIT);
    } catch {
        return [];
    }
}

export function saveJournalEntry(entry) {
    try {
        const entries = readJournal().filter(item => item.id !== entry.id);
        const updated = [{ ...entry, createdAt: new Date().toISOString() }, ...entries]
            .slice(0, JOURNAL_LIMIT);
        localStorage.setItem(JOURNAL_KEY, JSON.stringify(updated));
        return { ok: true, entries: updated };
    } catch {
        return { ok: false, entries: readJournal() };
    }
}

export function deleteJournalEntry(id) {
    try {
        const entries = readJournal().filter(item => item.id !== id);
        localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
        return { ok: true, entries };
    } catch {
        return { ok: false, entries: readJournal() };
    }
}

export function formatJournalDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
        ? ''
        : new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}
