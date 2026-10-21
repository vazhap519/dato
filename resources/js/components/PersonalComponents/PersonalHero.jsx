export default function PersonalHero({ personal }) {
    const primary = personal.hero_primary_button_url?.trim() || "#pricing";
    const secondary = personal.hero_secondary_button_url?.trim() || "#about";

    return (
        <section className="relative overflow-hidden px-5 pt-8 pb-12 sm:px-8 md:py-16 lg:px-14 xl:px-20">
            <div className="absolute inset-0 cinematic-glow pointer-events-none" />
            <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] gap-7 lg:gap-4 xl:gap-8 items-center">
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
                    <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                        <a href={primary} className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-background-dark px-7 py-4 rounded-xl font-bold transition-all shadow-lg shadow-primary/15 w-full sm:w-auto">
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
                <div className="order-2 relative w-full max-w-[660px] mx-auto lg:mr-0 lg:-ml-6 xl:-ml-12">
                    <div className="relative isolate w-full h-[300px] min-[390px]:h-[340px] sm:h-[440px] lg:h-[520px] xl:h-[570px]">
                        <div className="absolute inset-[7%] rounded-full bg-primary/20 blur-[65px] pointer-events-none" aria-hidden="true" />
                        <div className="absolute w-[66%] aspect-square right-[7%] top-[12%] rounded-full border border-primary/25 shadow-[0_0_75px_rgba(245,185,42,0.12)] pointer-events-none" aria-hidden="true" />
                        <div className="absolute w-[70%] aspect-square right-[4%] top-[11%] rounded-full bg-[radial-gradient(circle,rgba(245,185,42,0.19),transparent_72%)] pointer-events-none" aria-hidden="true" />
                        {personal.hero_image && (
                            <img loading="eager" fetchPriority="high" decoding="async"
                                src={personal.hero_image}
                                alt={personal.hero_author_name || "Давид Арутюнов"}
                                className="absolute z-10 bottom-[-9%] left-1/2 -translate-x-1/2 w-[122%] max-w-none h-[115%] object-contain object-bottom sm:w-[118%] lg:w-[138%] lg:left-[46%] xl:w-[145%] drop-shadow-[0_18px_32px_rgba(0,0,0,0.25)]"
                            />
                        )}
                        <div className="absolute z-20 inset-x-0 bottom-[-1px] h-[26%] bg-gradient-to-t from-background-dark via-background-dark/65 to-transparent pointer-events-none" aria-hidden="true" />
                    </div>
                    <div className="relative z-30 -mt-12 sm:-mt-14 lg:-mt-20 px-1 sm:px-5 lg:px-14">
                        <p className="text-primary font-bold text-lg sm:text-xl">{personal.hero_author_name}</p>
                        <p className="text-white/80 text-sm italic">{personal.hero_author_role}</p>
                        <div className="mt-4 h-px w-32 bg-gradient-to-r from-primary/70 to-transparent" aria-hidden="true" />
                    </div>
                </div>
                <div className="order-3 lg:hidden flex flex-wrap justify-center items-center gap-x-3 gap-y-2 text-white/65 text-xs sm:text-sm rounded-xl border border-white/10 bg-white/[0.035] px-3 py-3">
                    <span>60 минут</span><span className="text-primary/50" aria-hidden="true">·</span>
                    <span>Онлайн</span><span className="text-primary/50" aria-hidden="true">·</span>
                    <span>Личный разговор</span>
                </div>
            </div>
        </section>
    );
}
