export default function PersonalHero({ personal }) {
    const primary = personal.hero_primary_button_url?.trim() || "#pricing";
    const secondary = personal.hero_secondary_button_url?.trim() || "#about";

    return (
        <section className="relative overflow-hidden px-5 pt-10 pb-16 sm:px-8 md:py-20 lg:px-14 xl:px-20">
            <div className="absolute inset-0 cinematic-glow pointer-events-none" />
            <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)] gap-9 lg:gap-12 xl:gap-16 items-center">
                <div className="order-1 flex flex-col gap-5 md:gap-7 min-w-0">
                    {personal.hero_badge && (
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/25 px-4 py-2 rounded-full w-fit">
                            <span className="material-symbols-outlined text-primary text-base" aria-hidden="true">schedule</span>
                            <span className="text-primary text-[11px] sm:text-xs font-semibold uppercase tracking-wider">{personal.hero_badge}</span>
                        </div>
                    )}
                    <h1 className="text-[clamp(2.15rem,8.5vw,3.25rem)] sm:text-5xl xl:text-[3.65rem] font-bold leading-[1.12] tracking-tight text-white max-w-[660px]">
                        {personal.hero_title_line_1}{" "}
                        <span className="text-primary">{personal.hero_title_highlight}</span>{" "}
                        {personal.hero_title_line_2}
                    </h1>
                    <p className="text-[15px] sm:text-base md:text-lg text-white/70 max-w-[590px] leading-[1.8]">
                        {personal.hero_description}
                    </p>
                    <div className="hidden lg:flex flex-wrap gap-3">
                        <a href={primary} className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-background-dark px-7 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/15">
                            {personal.hero_primary_button_text || "Записаться на встречу"}
                        </a>
                        <a href={secondary} className="inline-flex items-center gap-2 justify-center px-4 py-4 text-white/85 hover:text-primary font-semibold transition-colors">
                            {personal.hero_secondary_button_text || "Как проходит встреча"}
                            <span aria-hidden="true">→</span>
                        </a>
                    </div>
                    <div className="hidden lg:flex flex-wrap items-center gap-x-4 gap-y-2 text-white/65 text-sm rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 w-fit">
                        <span className="inline-flex items-center gap-2"><span className="material-symbols-outlined text-primary text-base" aria-hidden="true">schedule</span>60 минут</span>
                        <span className="text-primary/40" aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-2"><span className="material-symbols-outlined text-primary text-base" aria-hidden="true">videocam</span>Онлайн</span>
                        <span className="text-primary/40" aria-hidden="true">·</span>
                        <span className="inline-flex items-center gap-2"><span className="material-symbols-outlined text-primary text-base" aria-hidden="true">forum</span>Личный разговор</span>
                    </div>
                </div>
                <div className="order-2 relative w-full max-w-[440px] mx-auto lg:mr-0">
                    <div className="absolute -inset-5 rounded-[2rem] bg-primary/15 blur-[75px] opacity-50 pointer-events-none" />
                    <div className="relative rounded-[1.4rem] overflow-hidden border border-primary/20 aspect-[5/4] sm:aspect-[4/4] lg:aspect-[4/5] bg-surface-dark shadow-2xl shadow-black/30">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_70%,rgba(234,190,60,0.17),transparent_65%)] pointer-events-none" />
                        {personal.hero_image && (
                            <img loading="eager" fetchPriority="high" decoding="async"
                                src={personal.hero_image}
                                alt={personal.hero_author_name || "Давид Арутюнов"}
                                className="absolute inset-0 w-full h-full object-cover object-[center_70%] scale-[1.12] origin-bottom"
                            />
                        )}
                        <div className="absolute inset-0 hero-gradient pointer-events-none" />
                        <div className="absolute bottom-0 inset-x-0 px-5 sm:px-7 pb-5 sm:pb-7 pt-14 bg-gradient-to-t from-black/55 to-transparent">
                            <p className="text-primary font-bold text-lg sm:text-xl">{personal.hero_author_name}</p>
                            <p className="text-white/80 text-sm italic">{personal.hero_author_role}</p>
                        </div>
                    </div>
                </div>
                <div className="order-3 lg:hidden flex flex-col gap-4">
                    <a href={primary} className="w-full inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-background-dark px-6 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/15 text-center">
                        {personal.hero_primary_button_text || "Записаться на встречу"}
                    </a>
                    <a href={secondary} className="inline-flex items-center justify-center gap-2 text-white/85 hover:text-primary font-semibold transition-colors py-2 text-center">
                        {personal.hero_secondary_button_text || "Как проходит встреча"} <span aria-hidden="true">→</span>
                    </a>
                    <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-2 text-white/65 text-xs sm:text-sm rounded-xl border border-white/10 bg-white/[0.035] px-3 py-3">
                        <span>60 минут</span><span className="text-primary/50" aria-hidden="true">·</span>
                        <span>Онлайн</span><span className="text-primary/50" aria-hidden="true">·</span>
                        <span>Личный разговор</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
