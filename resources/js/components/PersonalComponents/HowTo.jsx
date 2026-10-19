const icons = ["chat_bubble", "psychology", "explore"];
export default function HowTo({ personal }) {
    if (!personal) return null;
    return (
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
            <div className="grid lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-14">
                <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                        {personal.how_title_line_1}<br/><span className="text-primary italic">{personal.how_title_highlight}</span>
                    </h2>
                    <div className="w-16 h-1 bg-primary mt-5 rounded-full" />
                </div>
                <div>
                    <p className="text-lg md:text-xl text-white/75 leading-relaxed mb-8">{personal.how_description}</p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {personal.how_items?.map((item, index) => (
                            <article key={index} className="h-full p-5 rounded-2xl border border-white/10 bg-white/[0.05] hover:border-primary/25 transition-colors">
                                <span className="material-symbols-outlined text-primary text-3xl mb-4 block" aria-hidden="true">{icons[index % icons.length]}</span>
                                <h3 className="text-base font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
