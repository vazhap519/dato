const icons = ["auto_stories", "self_improvement", "menu_book", "smart_display", "groups", "forum", "favorite", "lightbulb"];
export default function GroupProgram({ group }) {
    return (
        <div>
            <h2 className="text-3xl md:text-5xl font-display text-white mb-12 text-center">{group.program_title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {group.program?.map((item, index) => (
                    <article key={index} className="h-full p-7 rounded-2xl border border-white/10 bg-white/[0.04] hover:border-primary/30 hover:bg-white/[0.06] transition-colors">
                        <span className="material-symbols-outlined text-primary text-4xl mb-6 block" aria-hidden="true">{icons[index % icons.length]}</span>
                        <h3 className="text-xl md:text-2xl font-display text-white mb-3">{item.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{item.content}</p>
                    </article>
                ))}
            </div>
            <div className="text-center mt-12">
                <a href="#pricing" className="inline-flex items-center justify-center bg-primary text-background-dark px-8 py-4 rounded-xl font-bold hover:brightness-110 transition">Хочу присоединиться <span className="ml-2" aria-hidden="true">→</span></a>
            </div>
        </div>
    );
}
