import { useState } from "react";
export default function GroupFaq({ group }) {
    const [open, setOpen] = useState(0);
    if (!group?.faq?.length) return null;
    return (
        <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-display text-white mb-10 text-center">{group.faq_title}</h2>
            <div className="space-y-3">
                {group.faq.map((item, index) => (
                    <div key={index} className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
                        <button type="button" aria-expanded={open === index} onClick={() => setOpen(open === index ? -1 : index)} className="w-full flex justify-between items-center gap-4 p-5 text-left text-white font-medium hover:bg-white/5 transition">
                            <span>{item.question}</span><span className="text-primary text-2xl shrink-0" aria-hidden="true">{open === index ? "−" : "+"}</span>
                        </button>
                        {open === index && <p className="px-5 pb-5 text-gray-400 leading-relaxed">{item.answer}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}
