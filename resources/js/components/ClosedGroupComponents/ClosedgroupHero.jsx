export default function ClosedGroupHero({ group }) {
    return (
        <div className="relative w-full">
            <div className="absolute inset-0 glow-overlay pointer-events-none" />
            <div className="max-w-7xl mx-auto px-6 py-14 md:py-20 grid md:grid-cols-2 gap-10 lg:gap-16 items-center relative z-10">
                <div className="space-y-6">
                    {group.hero_badge && <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-widest">{group.hero_badge}</div>}
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-medium leading-[1.04] tracking-tight text-white">
                        {group.hero_title}<br/><span className="italic text-primary/90">{group.hero_title_highlight}</span>
                    </h1>
                    <p className="text-base md:text-lg text-gray-300 max-w-xl leading-relaxed whitespace-pre-line">{group.hero_description}</p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <a href="#pricing" className="inline-flex items-center justify-center bg-primary text-background-dark px-7 py-4 rounded-xl font-bold hover:brightness-110 transition">{group.hero_button_primary || "Присоединиться"}</a>
                        <a href="#program" className="inline-flex items-center justify-center px-7 py-4 rounded-xl font-bold border border-white/20 text-white hover:bg-white/10 transition">{group.hero_button_secondary || "Что внутри"}</a>
                    </div>
                    <p className="text-sm text-gray-400">Материалы · Практики · Общение</p>
                </div>
                <div className="relative flex justify-center items-center">
                    {group.hero_image_url && <img src={group.hero_image_url} alt={group.hero_title || "Круг души"} className="w-full max-w-[480px] aspect-square object-cover rounded-3xl" />}
                </div>
            </div>
        </div>
    );
}
