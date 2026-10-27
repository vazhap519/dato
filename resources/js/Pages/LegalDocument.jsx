import { Head, usePage } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header.jsx";
import Footer from "@/components/footer.jsx";

const related = [
    { slug: "terms", title: "Условия использования", description: "Правила сайта" },
    { slug: "privacy", title: "Политика конфиденциальности", description: "Персональные данные" },
    { slug: "offer", title: "Публичная оферта", description: "Сообщество «Круг Души»" },
];

function parseDocument(text) {
    const lines = String(text || "").replace(/\r/g, "").split("\n");
    const sections = [];
    let current = { id: "introduction", title: null, paragraphs: [] };
    let paragraph = [];
    const flush = () => {
        if (paragraph.length) {
            current.paragraphs.push(paragraph.join(" ").trim());
            paragraph = [];
        }
    };
    for (const raw of lines) {
        const line = raw.trim();
        if (!line) { flush(); continue; }
        const heading = line.match(/^(\d{1,2})[.)]\s+(.+)$/);
        if (heading) {
            flush();
            if (current.title || current.paragraphs.length) sections.push(current);
            current = { id: "section-" + heading[1], title: line, paragraphs: [] };
        } else {
            paragraph.push(line);
        }
    }
    flush();
    if (current.title || current.paragraphs.length) sections.push(current);
    return sections;
}

function renderLegalLinks(text) {
    const pattern = /\[(Служба Заботы|Службу Заботы)\]\(https:\/\/t\.me\/arutyunsupport\)/g;
    return String(text).split(pattern).flatMap((part, index) =>
        index % 2 === 0
            ? [part]
            : [<a key={index} href="https://t.me/arutyunsupport" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 hover:opacity-80">{part}</a>]
    );
}

export default function LegalDocument() {
    const { document: legalDoc } = usePage().props;
    const sections = useMemo(() => parseDocument(legalDoc?.content), [legalDoc?.content]);
    const introduction = sections.find(s => s.id === "introduction");
    const headings = sections.filter(s => s.title);
    const [active, setActive] = useState(headings[0]?.id || "");
    useEffect(() => {
        if (typeof IntersectionObserver === "undefined") return;
        const observer = new IntersectionObserver(entries => {
            const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top);
            if (visible[0]) setActive(visible[0].target.id);
        }, { rootMargin: "-115px 0px -65% 0px", threshold: 0 });
        headings.forEach(s => {
            const el = globalThis.document.getElementById(s.id);
            if (el) observer.observe(el);
        });
        return () => observer.disconnect();
    }, [legalDoc?.content]);

    return <>
        <Head title={(legalDoc?.title || "Юридический документ") + " — arutyun.me"} />
        <Header />
        <main className="min-h-screen bg-background-dark text-white px-5 sm:px-8 pt-28 md:pt-36 pb-20 print:bg-white print:text-black print:p-0">
            <div className="max-w-6xl mx-auto">
                <nav aria-label="Хлебные крошки" className="text-sm text-white/50 flex flex-wrap items-center gap-2 print:hidden">
                    <a href="/" className="hover:text-primary">Главная</a>
                    <span aria-hidden="true">/</span>
                    <a href="/legal" className="hover:text-primary">Документы</a>
                    <span aria-hidden="true">/</span>
                    <span className="text-white/80">{legalDoc?.title}</span>
                </nav>

                <div className="mt-9 mb-10 md:mb-14 border-b border-white/10 pb-9">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-px bg-primary" />
                        <span className="text-primary text-xs uppercase tracking-[0.2em] font-semibold">Юридический документ</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight tracking-tight max-w-3xl">{legalDoc?.title}</h1>
                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/50">
                        <span>Редакция {legalDoc?.version}</span>
                        {legalDoc?.effective_at && <span>Действует с {legalDoc?.effective_at}</span>}
                        <button onClick={() => window.print()} type="button" className="inline-flex items-center gap-2 hover:text-primary transition print:hidden">
                            <span className="material-symbols-outlined text-lg" aria-hidden="true">print</span>Распечатать
                        </button>
                    </div>
                </div>

                <div className="grid lg:grid-cols-[270px_minmax(0,1fr)] gap-9 lg:gap-14 items-start">
                    <aside className="lg:sticky lg:top-28 print:hidden">
                        <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-5">
                            <h2 className="text-xs uppercase tracking-[0.15em] font-semibold text-white/50 mb-4">Содержание документа</h2>
                            {headings.length ? (
                                <nav aria-label="Содержание документа" className="flex flex-col gap-1 max-h-[45vh] overflow-y-auto">
                                    {headings.map(s => <a key={s.id} href={"#" + s.id}
                                        onClick={() => setActive(s.id)}
                                        className={"block rounded-lg px-3 py-2.5 text-sm leading-snug transition border-l-2 " +
                                            (active === s.id ? "border-primary bg-primary/10 text-primary" : "border-transparent text-white/65 hover:text-white hover:bg-white/5")}>
                                        {s.title}
                                    </a>)}
                                </nav>
                            ) : <p className="text-sm text-white/50">Разделы появятся здесь, если в тексте есть заголовки вида «1. Название».</p>}
                        </div>
                        <div className="mt-5 rounded-2xl border border-white/10 p-4 sm:p-5">
                            <h2 className="text-xs uppercase tracking-[0.15em] font-semibold text-white/50 mb-3">Другие документы</h2>
                            <nav aria-label="Другие юридические документы" className="flex flex-col gap-1">
                                {related.filter(item => item.slug !== legalDoc?.slug).map(item => <a href={"/" + item.slug} key={item.slug}
                                    className="group flex items-center justify-between gap-3 rounded-lg px-3 py-3 hover:bg-white/5 transition">
                                    <span><span className="block text-sm text-white/85 group-hover:text-primary transition">{item.title}</span><span className="block text-xs text-white/40 mt-1">{item.description}</span></span>
                                    <span className="material-symbols-outlined text-white/35 group-hover:text-primary text-lg" aria-hidden="true">arrow_outward</span>
                                </a>)}
                                <a href="/legal" className="text-primary text-sm px-3 pt-4 hover:underline">Все документы</a>
                            </nav>
                        </div>
                    </aside>

                    <article className="min-w-0 max-w-[800px] rounded-2xl border border-white/10 bg-white/[0.018] px-5 py-7 sm:px-8 sm:py-10 md:px-11 md:py-12 print:border-0 print:p-0">
                        {sections.length ? sections.map((section, index) => (
                            <section key={section.id + index} id={section.id} className="scroll-mt-32 mb-11 last:mb-0">
                                {section.title && <h2 className="text-xl sm:text-2xl font-semibold leading-snug text-white print:text-black mb-5 pb-4 border-b border-primary/20">{section.title}</h2>}
                                <div className="space-y-5">
                                    {section.paragraphs.map((paragraph, i) => <p key={i} className="text-[15px] sm:text-base text-white/75 print:text-black leading-[1.95] whitespace-pre-wrap break-words">{renderLegalLinks(paragraph)}</p>)}
                                </div>
                            </section>
                        )) : <p className="text-white/60">Текст документа пока не добавлен.</p>}
                    </article>
                </div>
            </div>
        </main>
        <div className="print:hidden"><Footer /></div>
        <style>{`@media print { header {display:none!important} @page {margin:18mm} main {background:white!important} article {color:black!important} }`}</style>
    </>;
}
