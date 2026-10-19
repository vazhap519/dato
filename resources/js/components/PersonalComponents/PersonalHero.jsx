export default function PersonalHero({ personal }) {
    const primary = personal.hero_primary_button_url?.trim() || "#pricing";
    const secondary = personal.hero_secondary_button_url?.trim() || "#about";
    return (
        <section className="relative overflow-hidden px-6 py-12 md:py-16 lg:py-20 lg:px-20">
            <div className="absolute inset-0 cinematic-glow pointer-events-none" />
            <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                <div className="order-2 lg:order-1 flex flex-col gap-6">
                    {personal.hero_badge && <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full w-fit">
                        <span className="material-symbols-outlined text-primary text-sm" aria-hidden="true">schedule</span>
                        <span className="text-primary text-xs font-semibold uppercase tracking-wider">{personal.hero_badge}</span>
                    </div>}
                    <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.12] tracking-tight text-white max-w-2xl">
                        {personal.hero_title_line_1}{" "}
                        <span className="text-primary">{personal.hero_title_highlight}</span>{" "}
                        {personal.hero_title_line_2}
                    </h1>
                    <p className="text-base md:text-lg text-white/70 max-w-xl leading-relaxed">{personal.hero_description}</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <a href={primary} className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-background-dark px-7 py-4 rounded-xl font-bold transition-all shadow-xl shadow-primary/10">{personal.hero_primary_button_text || "Записаться на встречу"}</a>
                        <a href={secondary} className="inline-flex items-center justify-center border border-white/20 hover:bg-white/5 text-white px-7 py-4 rounded-xl font-bold transition-all">{personal.hero_secondary_button_text || "Как проходит встреча"}</a>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-white/60 text-sm">
                        <span className="inline-flex items-center gap-2"><span className="material-symbols-outlined text-primary text-base" aria-hidden="true">schedule</span>60 минут</span>
                        <span className="inline-flex items-center gap-2"><span className="material-symbols-outlined text-primary text-base" aria-hidden="true">videocam</span>Онлайн</span>
                        <span className="inline-flex items-center gap-2"><span className="material-symbols-outlined text-primary text-base" aria-hidden="true">forum</span>Личный разговор</span>
                    </div>
                </div>
                <div className="order-1 lg:order-2 relative w-full max-w-[430px] mx-auto">
                    <div className="absolute inset-0 bg-primary/20 blur-[90px] opacity-20 pointer-events-none" />
                    <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[4/5] bg-surface-dark">
                        {personal.hero_image && <img loading="eager" fetchPriority="high" decoding="async" src={personal.hero_image} alt={personal.hero_author_name || "Давид Арутюнов"} className="w-full h-full object-cover" />}
                        <div className="absolute inset-0 hero-gradient pointer-events-none" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <p className="text-primary font-bold text-xl">{personal.hero_author_name}</p>
                            <p className="text-white/70 text-sm italic">{personal.hero_author_role}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
