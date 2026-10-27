import { usePage, Head } from "@inertiajs/react";
import Header from "@/components/Header.jsx";
import Footer from "@/components/footer.jsx";

const links = [{slug:"terms",label:"Условия использования"},{slug:"privacy",label:"Политика конфиденциальности"},{slug:"offer",label:"Публичная оферта"}];
export default function LegalDocument() {
    const { document } = usePage().props;
    return <>
        <Head title={document.title + " — arutyun.me"}><meta name="description" content={document.title + " — юридический документ сайта arutyun.me"} /></Head>
        <Header />
        <main className="min-h-screen bg-background-dark text-white px-5 pt-32 pb-16 print:bg-white print:text-black print:pt-0">
            <div className="max-w-5xl mx-auto">
                <a href="/legal" className="text-primary text-sm hover:underline print:hidden">← Все документы</a>
                <h1 className="text-3xl md:text-4xl font-bold mt-6 mb-3">{document.title}</h1>
                <p className="text-sm text-white/55 print:text-gray-600 mb-10">Редакция {document.version}{document.effective_at ? " · Действует с " + document.effective_at : ""}</p>
                <div className="grid lg:grid-cols-[220px_1fr] gap-10">
                    <nav aria-label="Другие документы" className="space-y-3 text-sm print:hidden">
                        {links.map(item => <a key={item.slug} href={"/"+item.slug} className={"block hover:text-primary " + (item.slug === document.slug ? "text-primary" : "text-white/60")}>{item.label}</a>)}
                        <button type="button" onClick={() => window.print()} className="block text-white/60 hover:text-primary mt-5">Распечатать документ</button>
                    </nav>
                    <article className="min-w-0 max-w-[780px] whitespace-pre-wrap break-words text-base leading-8 text-white/85 print:text-black">{document.content}</article>
                </div>
            </div>
        </main>
        <div className="print:hidden"><Footer /></div>
        <style>{`@media print { header { display:none!important } @page { margin:18mm } }`}</style>
    </>;
}
