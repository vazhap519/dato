export default function GroupDescription({ group }) {
    return (
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-[0.85fr_1.15fr] gap-8 md:gap-16 items-center">
            <div>
                <span className="text-primary text-xs uppercase tracking-widest font-semibold">О сообществе</span>
                <h2 className="text-3xl md:text-5xl font-display text-white mt-4 leading-tight">{group.description_title}</h2>
                <div className="mt-6 h-1 w-16 rounded-full bg-primary" />
            </div>
            <div className="p-7 md:p-10 rounded-3xl bg-white/[0.04] border border-primary/10">
                <p className="text-base md:text-lg leading-relaxed text-gray-300 whitespace-pre-line">{group.description_content}</p>
                <a href="#program" className="inline-flex mt-6 text-primary font-semibold hover:underline">Посмотреть, что внутри <span className="ml-2" aria-hidden="true">→</span></a>
            </div>
        </div>
    );
}
