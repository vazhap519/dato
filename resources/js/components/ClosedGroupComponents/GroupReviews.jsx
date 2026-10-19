import { useState } from "react";

export default function GroupReviews({ review }) {
    const entries = (review?.content || []).filter(item => item?.description);
    const [page, setPage] = useState(0);
    if (!entries.length) return null;
    const pages = Math.ceil(entries.length / 3);
    const visible = entries.slice(page * 3, page * 3 + 3);
    return (
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10">
                <p className="text-primary text-xs uppercase tracking-widest font-semibold mb-3">{review.review_sm_header || "Отзывы"}</p>
                <h2 className="text-3xl md:text-5xl font-display text-white">{review.review_xl_header || "Истории участников"}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {visible.map((item, index) => (
                    <article key={page * 3 + index} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 flex flex-col gap-5">
                        <span className="material-symbols-outlined text-primary text-3xl" aria-hidden="true">format_quote</span>
                        <p className="text-gray-300 leading-relaxed flex-1">{item.description}</p>
                        <div className="flex items-center gap-3 border-t border-white/10 pt-4">
                            {item.u_image ? <img src={item.u_image.startsWith("http") || item.u_image.startsWith("/") ? item.u_image : `/storage/${item.u_image}`} alt="" className="w-11 h-11 rounded-full object-cover" loading="lazy" /> : <span className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary material-symbols-outlined" aria-hidden="true">person</span>}
                            <div><p className="text-white font-semibold">{[item.name, item.lastname].filter(Boolean).join(" ")}</p><p className="text-gray-500 text-xs">{item.position}</p></div>
                        </div>
                    </article>
                ))}
            </div>
            {pages > 1 && <div className="flex justify-center items-center gap-5 mt-8">
                <button type="button" onClick={() => setPage((page - 1 + pages) % pages)} aria-label="Предыдущие отзывы" className="rounded-full border border-white/20 px-4 py-2 text-white hover:border-primary">←</button>
                <span className="text-gray-400 text-sm">{page + 1} / {pages}</span>
                <button type="button" onClick={() => setPage((page + 1) % pages)} aria-label="Следующие отзывы" className="rounded-full border border-white/20 px-4 py-2 text-white hover:border-primary">→</button>
            </div>}
            <div className="text-center mt-10"><a href="#pricing" className="inline-flex rounded-xl border border-primary/40 px-7 py-3 text-primary font-semibold hover:bg-primary/10 transition">Присоединиться к сообществу →</a></div>
        </div>
    );
}
