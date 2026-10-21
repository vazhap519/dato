import { usePage } from "@inertiajs/react";
import Header from "@/components/Header.jsx";
import Footer from "@/components/footer.jsx";
import Seo from "@/components/Seo.jsx";

const defaults = [
    { label: "Политика конфиденциальности", anchor: "privacy" },
    { label: "Пользовательское соглашение", anchor: "agreement" },
    { label: "Публичная оферта", anchor: "offer" },
    { label: "Реквизиты и контакты", anchor: "details" },
];

function LegalText({ html }) {
    if (!html) return null;
    return (
        <div
            className="legal-document text-muted-text dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

export default function Legal() {
    const { legal } = usePage().props;

    const configured = Array.isArray(legal?.sections_nav) ? legal.sections_nav : [];
    const sections = defaults.map((section, index) => ({
        ...section,
        label: configured[index]?.label || section.label,
        anchor: String(configured[index]?.anchor || section.anchor).replace(/^#/, ""),
    }));

    const contact = legal?.company_details?.find((item) =>
        /email|e-mail|электронн|почт/i.test(item.label || "") &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.value || "")
    );
    const contactHref = contact ? `mailto:${contact.value}` : "/#contacts";

    return (
        <>
            <Seo />
            <Header />
            <main className="relative min-h-screen sacred-pattern pt-32 pb-16 px-6 lg:px-12">
                <div className="max-w-7xl mx-auto">
                    {!legal ? (
                        <div className="py-40 text-center">
                            <h2 className="text-3xl font-bold mb-4">Документы пока не опубликованы</h2>
                        </div>
                    ) : (
                        <>
                            <div className="mb-14 max-w-3xl">
                                <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">{legal.title}</h1>
                                {legal.subtitle && (
                                    <p className="text-lg text-muted-text dark:text-gray-400 leading-relaxed">{legal.subtitle}</p>
                                )}
                                {legal.download_button_text && (
                                    <button type="button" onClick={() => window.print()}
                                        className="mt-6 btn-primary-unified print:hidden">
                                        {legal.download_button_text}
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                                <aside className="w-full lg:w-64 print:hidden">
                                    <nav className="lg:sticky lg:top-32 grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-3" aria-label="Разделы документов">
                                        {sections.map((item) => (
                                            <a key={item.anchor} href={`#${item.anchor}`}
                                                className="px-3 py-3 text-sm rounded-xl hover:bg-primary/10 hover:text-primary transition-all">
                                                {item.label}
                                            </a>
                                        ))}
                                    </nav>
                                </aside>

                                <div className="flex-1 min-w-0 max-w-[820px] space-y-16">
                                    <section id={sections[0].anchor} className="scroll-mt-28">
                                        {legal.privacy_title && <h2 className="text-3xl font-bold mb-6">{legal.privacy_title}</h2>}
                                        <LegalText html={legal.privacy_content} />
                                    </section>
                                    <section id={sections[1].anchor} className="scroll-mt-28">
                                        {legal.agreement_title && <h2 className="text-3xl font-bold mb-6">{legal.agreement_title}</h2>}
                                        <LegalText html={legal.agreement_content} />
                                    </section>
                                    <section id={sections[2].anchor} className="scroll-mt-28">
                                        {legal.offer_title && <h2 className="text-3xl font-bold mb-6">{legal.offer_title}</h2>}
                                        <LegalText html={legal.offer_content} />
                                    </section>
                                    <section id={sections[3].anchor} className="scroll-mt-28">
                                        {legal.details_title && <h2 className="text-3xl font-bold mb-6">{legal.details_title}</h2>}
                                        {legal.company_details?.length > 0 && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {legal.company_details.map((item, index) => (
                                                    <div key={index}>
                                                        <p className="text-xs uppercase tracking-widest mb-1">{item.label}</p>
                                                        <p className="text-lg font-bold break-words">{item.value}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </section>
                                    {(legal.cta_title || legal.cta_description || legal.cta_button_text) && (
                                        <section className="border-t border-white/10 pt-12 print:hidden">
                                            {legal.cta_title && <h2 className="text-3xl font-bold mb-4">{legal.cta_title}</h2>}
                                            {legal.cta_description && <p className="text-muted-text dark:text-gray-400 leading-7 mb-6">{legal.cta_description}</p>}
                                            {legal.cta_button_text && (
                                                <a href={contactHref} className="inline-block btn-primary-unified">{legal.cta_button_text}</a>
                                            )}
                                        </section>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </main>
            <Footer />
            <style>{`
                .legal-document { font-size: 16px; line-height: 1.85; overflow-wrap: anywhere; }
                .legal-document h2 { scroll-margin-top: 7rem; }
                .legal-document h3 { font-size: 1.25rem; font-weight: 700; margin: 1.75rem 0 0.75rem; color: inherit; }
                .legal-document p { margin-bottom: 1rem; }
                .legal-document ul, .legal-document ol { padding-left: 1.5rem; margin: 0.75rem 0 1.25rem; }
                .legal-document ul { list-style-type: disc; }
                .legal-document ol { list-style-type: decimal; }
                .legal-document li { margin-bottom: 0.5rem; }
                .legal-document h3 { border-left: 2px solid #eabf45; padding-left: 0.75rem; }
                .legal-document a { text-decoration: underline; }
                @media print {
                    header, footer { display: none !important; }
                    main { padding: 0 !important; }
                    .legal-document { color: #111 !important; }
                }
            `}</style>
        </>
    );
}
