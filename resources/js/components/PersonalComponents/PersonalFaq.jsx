export default function PersonalFaq({ personal }) {
    if (!personal) return null;
    return (
        <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-9">{personal.faq_title}</h2>
            <div className="flex flex-col gap-3">
                {personal.faq_items?.map((item, index) => <details key={index} open={index === 0 ? true : undefined} className="group border border-white/10 rounded-xl bg-white/[0.05] overflow-hidden open:border-primary/30">
                    <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none">
                        <span className="text-base font-semibold text-white">{item.question}</span>
                        <span className="material-symbols-outlined text-primary group-open:rotate-180 transition-transform shrink-0" aria-hidden="true">expand_more</span>
                    </summary>
                    <div className="px-5 pb-5 text-white/65 leading-relaxed">{item.answer}</div>
                </details>)}
            </div>
        </div>
    );
}
